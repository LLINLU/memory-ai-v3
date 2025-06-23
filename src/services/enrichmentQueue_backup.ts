// Queue system for managing paper and use case enrichment API calls
// Prevents overloading the backend with concurrent requests

export interface QueuedEnrichmentRequest {
  nodeId: string;
  type: 'papers' | 'useCases';
  params: any;
  callback: (response: any) => void;
  timestamp: number;
  startTime?: number;
  apiCallStarted?: boolean; // Track if API call was started successfully
}

export type EnrichmentStatus = 'waiting' | 'fetching' | 'done' | 'error' | 'timeout';

export interface QueueState {
  // Queue for pending requests
  queue: QueuedEnrichmentRequest[];
  
  // Currently processing requests
  processing: Map<string, QueuedEnrichmentRequest>;
  
  // Status tracking per node and type
  status: Map<string, EnrichmentStatus>; // key: `${nodeId}:${type}`
  
  // Health check status
  apiHealthy: boolean;
  lastHealthCheck: number;
}

class EnrichmentQueueManager {
  private state: QueueState = {
    queue: [],
    processing: new Map(),
    status: new Map(),
    apiHealthy: true,
    lastHealthCheck: 0
  };
  // Track API call failures to determine health
  private consecutiveFailures = 0;
  private readonly MAX_CONSECUTIVE_FAILURES = 5; // Increased threshold  // Configuration
  private readonly MAX_CONCURRENT_PAPERS = 7;
  private readonly MAX_CONCURRENT_USECASES = 3;
  private readonly POLLING_TIMEOUT = 4 * 60 * 1000; // 4 minutes for database polling
  private readonly POLLING_INTERVAL = 3000; // Poll database every 3 seconds
  private readonly HEALTH_CHECK_INTERVAL = 10 * 1000; // 10 seconds
  private readonly API_BASE_URL = 'https://search-api.memoryai.jp';

  // Event listeners for status updates
  private listeners = new Set<(nodeId: string, type: 'papers' | 'useCases', status: EnrichmentStatus, elapsedTime?: number) => void>();
  constructor() {
    console.log('[ENRICHMENT_QUEUE] Initializing EnrichmentQueueManager...');
    // Start health check polling
    this.startHealthCheckPolling();
    console.log('[ENRICHMENT_QUEUE] EnrichmentQueueManager initialized');
  }

  /**
   * Add a subscription for status updates
   */
  subscribe(listener: (nodeId: string, type: 'papers' | 'useCases', status: EnrichmentStatus, elapsedTime?: number) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Get current status for a specific node and type
   */
  getStatus(nodeId: string, type: 'papers' | 'useCases'): EnrichmentStatus {
    const key = `${nodeId}:${type}`;
    return this.state.status.get(key) || 'done';
  }

  /**
   * Get elapsed time for a currently processing request
   */
  getElapsedTime(nodeId: string, type: 'papers' | 'useCases'): number | null {
    const key = `${nodeId}:${type}`;
    const request = this.state.processing.get(key);
    if (request && request.startTime) {
      return Date.now() - request.startTime;
    }
    return null;
  }

  /**
   * Add a request to the queue
   */
  enqueue(request: Omit<QueuedEnrichmentRequest, 'timestamp'>): void {
    const key = `${request.nodeId}:${request.type}`;
    
    // Check if already processing or done
    const currentStatus = this.state.status.get(key);
    if (currentStatus === 'fetching' || currentStatus === 'done') {
      console.log(`[ENRICHMENT_QUEUE] Skipping ${key} - already ${currentStatus}`);
      return;
    }

    // Remove any existing request for the same node+type
    this.state.queue = this.state.queue.filter(q => `${q.nodeId}:${q.type}` !== key);    const queuedRequest: QueuedEnrichmentRequest = {
      ...request,
      timestamp: Date.now(),
      apiCallStarted: false
    };

    this.state.queue.push(queuedRequest);
    this.updateStatus(request.nodeId, request.type, 'waiting');

    console.log(`[ENRICHMENT_QUEUE] Added ${key} to queue. Queue length: ${this.state.queue.length}`);

    // Try to process immediately
    this.processNext();
  }

  /**
   * Cancel a specific request
   */
  cancel(nodeId: string, type: 'papers' | 'useCases'): void {
    const key = `${nodeId}:${type}`;
    
    // Remove from queue
    this.state.queue = this.state.queue.filter(q => `${q.nodeId}:${q.type}` !== key);
    
    // Remove from processing (won't cancel the actual HTTP request, but will ignore response)
    this.state.processing.delete(key);
    
    // Update status
    this.updateStatus(nodeId, type, 'done');
    
    console.log(`[ENRICHMENT_QUEUE] Cancelled ${key}`);
  }
  /**
   * Get queue status for debugging
   */
  getQueueStatus() {
    const paperRequests = Array.from(this.state.processing.values()).filter(r => r.type === 'papers');
    const useCaseRequests = Array.from(this.state.processing.values()).filter(r => r.type === 'useCases');
    const queuedRetries = this.state.queue.filter(r => (r.retryCount || 0) > 0).length;
    
    return {
      queueLength: this.state.queue.length,
      processing: {
        papers: paperRequests.length,
        useCases: useCaseRequests.length
      },
      maxConcurrent: {
        papers: this.MAX_CONCURRENT_PAPERS,
        useCases: this.MAX_CONCURRENT_USECASES
      },
      apiHealthy: this.state.apiHealthy,
      lastHealthCheck: this.state.lastHealthCheck,
      retries: queuedRetries, // Show number of requests waiting for retry
      consecutiveFailures: this.consecutiveFailures
    };
  }
  /**
   * Process the next request in the queue if capacity allows
   */
  private processNext(): void {
    if (this.state.queue.length === 0) {
      return;
    }
    
    // Check API health
    if (!this.state.apiHealthy) {
      console.log('[ENRICHMENT_QUEUE] API unhealthy, not processing new requests');
      return;
    }

    // Count current processing requests by type
    const processingRequests = Array.from(this.state.processing.values());
    const paperRequests = processingRequests.filter(r => r.type === 'papers');
    const useCaseRequests = processingRequests.filter(r => r.type === 'useCases');

    console.log(`[ENRICHMENT_QUEUE] Processing status: Papers ${paperRequests.length}/${this.MAX_CONCURRENT_PAPERS}, UseCases ${useCaseRequests.length}/${this.MAX_CONCURRENT_USECASES}, Queue: ${this.state.queue.length}`);

    // Find next processable request
    for (let i = 0; i < this.state.queue.length; i++) {
      const request = this.state.queue[i];
      const canProcess = 
        (request.type === 'papers' && paperRequests.length < this.MAX_CONCURRENT_PAPERS) ||
        (request.type === 'useCases' && useCaseRequests.length < this.MAX_CONCURRENT_USECASES);

      if (canProcess) {
        // Remove from queue and start processing
        const [removedRequest] = this.state.queue.splice(i, 1);
        console.log(`[ENRICHMENT_QUEUE] Starting ${removedRequest.nodeId}:${removedRequest.type} (queue now: ${this.state.queue.length})`);
        
        this.startProcessing(removedRequest);
        
        // Try to process more requests (recursion with different state)
        this.processNext();
        break;
      }
    }
  }  /**
   * Start processing a request with database polling approach
   */
  private async startProcessing(request: QueuedEnrichmentRequest): Promise<void> {
    const key = `${request.nodeId}:${request.type}`;
    
    // Add to processing map
    request.startTime = Date.now();
    this.state.processing.set(key, request);
    this.updateStatus(request.nodeId, request.type, 'fetching');

    console.log(`[ENRICHMENT_QUEUE] Starting processing ${key}`);

    try {
      // Call the API once
      console.log(`[ENRICHMENT_QUEUE] Calling ${request.type} API for node ${request.nodeId}`);
      await this.callEnrichmentAPI(request);
      
      // Mark API call as started successfully
      request.apiCallStarted = true;
      console.log(`[ENRICHMENT_QUEUE] API call started for ${key}, now polling database...`);
      
      // Start polling database for results
      this.startDatabasePolling(request);
      
    } catch (error) {
      console.error(`[ENRICHMENT_QUEUE] Failed to start API call for ${key}:`, {
        error: error instanceof Error ? error.message : String(error),
        errorType: error instanceof Error ? error.constructor.name : typeof error
      });
      
      // Call callback with error for this specific node only
      request.callback({
        type: 'error',
        error: error instanceof Error ? error.message : 'Failed to start enrichment API call',
        nodeId: request.nodeId,
        timestamp: new Date().toISOString()
      });
      
      // Mark as error and continue processing other requests
      this.completeProcessing(key, 'error');
    }  }

  /**
   * Poll database for enrichment results
   */
  private async startDatabasePolling(request: QueuedEnrichmentRequest): Promise<void> {
    const key = `${request.nodeId}:${request.type}`;
    const startTime = Date.now();
    
    const pollDatabase = async (): Promise<void> => {
      // Check if request was cancelled or completed
      if (!this.state.processing.has(key)) {
        console.log(`[ENRICHMENT_QUEUE] Polling stopped for ${key} - request no longer active`);
        return;
      }
      
      // Check timeout
      const elapsed = Date.now() - startTime;
      if (elapsed > this.POLLING_TIMEOUT) {
        console.warn(`[ENRICHMENT_QUEUE] Database polling timed out for ${key} after ${elapsed}ms`);
        
        request.callback({
          type: 'error',
          error: `Enrichment timeout after ${this.POLLING_TIMEOUT / 1000} seconds`,
          nodeId: request.nodeId,
          timestamp: new Date().toISOString()
        });
        
        this.completeProcessing(key, 'timeout');
        return;
      }
      
      try {
        // Check if data exists in database
        const hasData = await this.checkDatabaseForResults(request.nodeId, request.type);
        
        if (hasData) {
          console.log(`[ENRICHMENT_QUEUE] Found results in database for ${key} after ${elapsed}ms`);
          
          // Success! Call callback
          request.callback({
            type: request.type,
            data: { 
              count: hasData.count || 0,
              saved: true,
              message: 'Enrichment completed successfully'
            },
            nodeId: request.nodeId,
            timestamp: new Date().toISOString()
          });
          
          this.completeProcessing(key, 'done');
          return;
        }
        
        // No data yet, continue polling
        console.log(`[ENRICHMENT_QUEUE] No results yet for ${key}, continuing polling (${elapsed}ms elapsed)`);
        setTimeout(pollDatabase, this.POLLING_INTERVAL);
        
      } catch (error) {
        console.error(`[ENRICHMENT_QUEUE] Error during database polling for ${key}:`, error);
        
        // Continue polling unless it's a critical error
        setTimeout(pollDatabase, this.POLLING_INTERVAL);
      }
    };
    
    // Start first poll immediately
    pollDatabase();
  }

  /**
   * Check database for enrichment results
   */
  private async checkDatabaseForResults(nodeId: string, type: 'papers' | 'useCases'): Promise<{count: number} | null> {
    const { supabase } = await import('@/integrations/supabase/client');
    
    try {
      const tableName = type === 'papers' ? 'node_papers' : 'node_use_cases';
      
      const { count, error } = await supabase
        .from(tableName)
        .select('id', { count: 'exact', head: true })
        .eq('node_id', nodeId);
      
      if (error) {
        console.warn(`[ENRICHMENT_QUEUE] Database check error for ${nodeId}:${type}:`, error);
        return null;
      }
      
      if ((count ?? 0) > 0) {
        return { count: count ?? 0 };
      }
      
      return null;
    } catch (error) {
      console.error(`[ENRICHMENT_QUEUE] Database polling error:`, error);
      return null;
    }
  }
      // Call the appropriate API based on type
      const result = await this.callEnrichmentAPI(request);
      
      // Clear timeout if we got here successfully
      clearTimeout(timeoutId);
      
      console.log(`[ENRICHMENT_QUEUE] API call successful for ${key}:`, {
        hasData: !!result.data,
        dataKeys: result.data ? Object.keys(result.data) : [],
        savedField: result.data?.saved,
        countField: result.data?.count
      });
      
      // Call the callback with the result
      request.callback(result);
      
      // Mark as complete
      this.completeProcessing(key, 'done');
        } catch (error) {
      console.error(`[ENRICHMENT_QUEUE] Error processing ${key}:`, {
        error: error instanceof Error ? error.message : String(error),
        errorType: error instanceof Error ? error.constructor.name : typeof error,
        retryCount: request.retryCount || 0
      });
      
      // Clear timeout
      clearTimeout(timeoutId);
      
      // Check if this error is likely due to Edge Function shutdown and can be retried
      const errorMessage = error instanceof Error ? error.message : String(error);
      const isRetryableError = this.isRetryableError(errorMessage);
      const canRetry = (request.retryCount || 0) < (request.maxRetries || this.MAX_RETRIES);
      
      if (isRetryableError && canRetry) {
        console.log(`[ENRICHMENT_QUEUE] Retrying ${key} (attempt ${(request.retryCount || 0) + 1}/${request.maxRetries || this.MAX_RETRIES})`);
        
        // Increment retry count and re-queue with exponential backoff
        request.retryCount = (request.retryCount || 0) + 1;
          // Remove from processing and update status to waiting for retry
        this.state.processing.delete(key);
        this.updateStatus(request.nodeId, request.type, 'waiting');
        
        // Re-queue with delay (exponential backoff)
        const delay = Math.min(1000 * Math.pow(2, request.retryCount - 1), 10000); // Cap at 10 seconds
        setTimeout(() => {
          console.log(`[ENRICHMENT_QUEUE] Re-queueing ${key} after ${delay}ms delay`);
          this.state.queue.unshift(request); // Add to front of queue for priority
          this.processNext();
        }, delay);
        
        return;
      }
      
      // Call callback with error for this specific node only
      request.callback({
        type: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        nodeId: request.nodeId,
        timestamp: new Date().toISOString()
      });
      
      // Mark as error - this should not affect other requests
      this.completeProcessing(key, 'error');
    }
  }
  /**
   * Complete processing a request (isolated per node+type)
   */
  private completeProcessing(key: string, status: EnrichmentStatus): void {
    const request = this.state.processing.get(key);
    if (request) {
      // Remove only this specific request from processing
      this.state.processing.delete(key);
      this.updateStatus(request.nodeId, request.type, status);
      
      const elapsedTime = request.startTime ? Date.now() - request.startTime : 0;
      console.log(`[ENRICHMENT_QUEUE] Completed processing ${key} with status: ${status} (${elapsedTime}ms)`);
      
      // Log current queue state for debugging
      const remainingProcessing = Array.from(this.state.processing.keys());
      console.log(`[ENRICHMENT_QUEUE] Remaining in-flight requests: [${remainingProcessing.join(', ')}]`);
      
      // Process next request (this should not affect existing in-flight requests)
      this.processNext();
    } else {
      console.warn(`[ENRICHMENT_QUEUE] Attempted to complete non-existent request: ${key}`);
    }
  }

  /**
   * Update status and notify listeners
   */
  private updateStatus(nodeId: string, type: 'papers' | 'useCases', status: EnrichmentStatus): void {
    const key = `${nodeId}:${type}`;
    this.state.status.set(key, status);
    
    // Calculate elapsed time if currently processing
    const elapsedTime = this.getElapsedTime(nodeId, type);
    
    // Notify listeners
    this.listeners.forEach(listener => {
      try {
        listener(nodeId, type, status, elapsedTime || undefined);
      } catch (error) {
        console.error('[ENRICHMENT_QUEUE] Error in status listener:', error);
      }
    });
  }  /**
   * Call the actual enrichment API
   */
  private async callEnrichmentAPI(request: QueuedEnrichmentRequest): Promise<any> {
    const { supabase } = await import('@/integrations/supabase/client');
    
    try {
      let result;
      
      console.log(`[ENRICHMENT_QUEUE] Calling ${request.type} API for node ${request.nodeId}`);
      
      if (request.type === 'papers') {
        const { data, error } = await supabase.functions.invoke('node-enrichment-papers', {
          body: request.params
        });

        console.log(`[ENRICHMENT_QUEUE] Papers API response:`, { 
          hasData: !!data, 
          hasError: !!error, 
          errorMessage: error?.message,
          dataKeys: data ? Object.keys(data) : []
        });

        if (error) {
          throw new Error(`Papers enrichment failed: ${error.message}`);
        }

        result = {
          type: 'papers',
          data: data?.results?.papers || data || {},
          nodeId: request.nodeId,
          timestamp: new Date().toISOString()
        };
        
      } else if (request.type === 'useCases') {
        const { data, error } = await supabase.functions.invoke('node-enrichment-usecases', {
          body: request.params
        });

        console.log(`[ENRICHMENT_QUEUE] Use cases API response:`, { 
          hasData: !!data, 
          hasError: !!error, 
          errorMessage: error?.message,
          dataKeys: data ? Object.keys(data) : []
        });

        if (error) {
          throw new Error(`Use cases enrichment failed: ${error.message}`);
        }

        result = {
          type: 'useCases',
          data: data?.results?.useCases || data || {},
          nodeId: request.nodeId,
          timestamp: new Date().toISOString()
        };
      } else {
        throw new Error(`Unknown enrichment type: ${request.type}`);
      }      // Success! Reset failure counter and mark API as healthy
      this.consecutiveFailures = 0;
      if (!this.state.apiHealthy) {
        console.log('[ENRICHMENT_QUEUE] API recovered - marking as healthy');
        this.state.apiHealthy = true;
      }
      
      console.log(`[ENRICHMENT_QUEUE] API call successful for ${request.nodeId}:${request.type}`, {
        hasData: !!result.data,
        dataKeys: Object.keys(result.data || {}),
        savedField: result.data?.saved,
        countField: result.data?.count
      });
      
      return result;
        } catch (error) {      
      // Track the failure for this specific request only
      console.warn(`[ENRICHMENT_QUEUE] API call failed for ${request.nodeId}:${request.type}:`, {
        error: error instanceof Error ? error.message : String(error),
        errorType: error instanceof Error ? error.constructor.name : typeof error,
        stack: error instanceof Error ? error.stack : undefined
      });
        // Only track system-level failures that indicate API infrastructure issues
      // Be more conservative about what constitutes a "system failure"
      // Don't count retryable errors (like function shutdowns) as system failures
      const errorMessage = error instanceof Error ? error.message : String(error);
      const isRetryableError = this.isRetryableError(errorMessage);
      const isSystemFailure = !isRetryableError && (
        errorMessage.includes('Failed to invoke') ||
        errorMessage.includes('ECONNREFUSED') ||
        errorMessage.includes('ENOTFOUND') ||
        errorMessage.includes('ERR_NETWORK')
      );
      
      if (isSystemFailure) {
        this.consecutiveFailures++;
        console.warn(`[ENRICHMENT_QUEUE] System-level failure detected (${this.consecutiveFailures}/${this.MAX_CONSECUTIVE_FAILURES}):`, errorMessage);
        
        // Only mark API as unhealthy if we have MANY consecutive system failures
        // This prevents individual node processing errors from affecting other requests
        if (this.consecutiveFailures >= this.MAX_CONSECUTIVE_FAILURES && this.state.apiHealthy) {
          console.error('[ENRICHMENT_QUEUE] Too many consecutive system failures - marking API as unhealthy');
          this.state.apiHealthy = false;
        }
      } else if (isRetryableError) {
        // Retryable errors (like function shutdowns) don't count against API health
        console.warn(`[ENRICHMENT_QUEUE] Retryable error for ${request.nodeId}:${request.type} (not affecting API health):`, errorMessage);
        
        // Reset consecutive failures on retryable errors since they don't indicate API issues
        if (this.consecutiveFailures > 0) {
          console.log('[ENRICHMENT_QUEUE] Resetting consecutive failures counter due to retryable error');
          this.consecutiveFailures = 0;
        }
      } else {
        // This is likely a node-specific processing error, don't count against API health
        console.warn(`[ENRICHMENT_QUEUE] Node-specific processing error for ${request.nodeId}:${request.type} (not affecting API health):`, errorMessage);
        
        // Reset consecutive failures on node-specific errors since the API itself is working
        if (this.consecutiveFailures > 0) {
          console.log('[ENRICHMENT_QUEUE] Resetting consecutive failures counter due to node-specific error (API is responding)');
          this.consecutiveFailures = 0;
        }
      }
      
      throw error;
    }
  }
  /**
   * Check if the API is healthy using Supabase Edge Function proxy
   */
  private async checkAPIHealth(): Promise<boolean> {
    console.log('[ENRICHMENT_QUEUE] Health check running...');
    
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      const { data, error } = await supabase.functions.invoke('api-health-check', {
        body: {}
      });
      
      if (error) {
        console.error('[ENRICHMENT_QUEUE] Health check proxy failed:', error.message);
        return false;
      }
      
      const isHealthy = data?.healthy === true;
      
      console.log('[ENRICHMENT_QUEUE] Health check result:', {
        healthy: isHealthy,
        status: data?.status,
        timestamp: data?.timestamp
      });
      
      return isHealthy;
    } catch (error) {
      console.error('[ENRICHMENT_QUEUE] Health check failed:', error);
      return false;
    }
  }
  /**
   * Start periodic health check polling
   */
  private startHealthCheckPolling(): void {
    console.log('[ENRICHMENT_QUEUE] Starting health check polling...');
    
    const checkHealth = async () => {
      const healthy = await this.checkAPIHealth();
      const previousHealth = this.state.apiHealthy;
      this.state.apiHealthy = healthy;
      this.state.lastHealthCheck = Date.now();
        if (previousHealth !== healthy) {
        console.log(`[ENRICHMENT_QUEUE] Health status changed: ${previousHealth ? 'HEALTHY' : 'UNHEALTHY'} -> ${healthy ? 'HEALTHY' : 'UNHEALTHY'}`);
        
        // If API became healthy, reset failure counter
        if (healthy && !previousHealth) {
          this.consecutiveFailures = 0;
          console.log('[ENRICHMENT_QUEUE] API recovered - resetting failure counter');
        }
      }
        if (!healthy) {
        console.warn('[ENRICHMENT_QUEUE] API is unhealthy - new requests will be rejected, but existing requests continue');
        // Don't fail existing requests, just prevent new ones
      } else {
        // API is healthy, try to process any queued requests
        if (this.state.queue.length > 0) {
          console.log(`[ENRICHMENT_QUEUE] API is healthy, processing ${this.state.queue.length} queued requests`);
          this.processNext();
        }
      }
    };

    // Initial check
    checkHealth();
    
    // Periodic checks
    setInterval(checkHealth, this.HEALTH_CHECK_INTERVAL);
    console.log(`[ENRICHMENT_QUEUE] Health check polling started (interval: ${this.HEALTH_CHECK_INTERVAL}ms)`);
  }
  /**
   * Mark all waiting requests as failed (only called when API is confirmed unhealthy)
   */
  private failWaitingRequests(): void {
    console.log(`[ENRICHMENT_QUEUE] Failing ${this.state.queue.length} waiting requests due to API health`);
    
    // Fail all queued requests only
    this.state.queue.forEach(request => {
      this.updateStatus(request.nodeId, request.type, 'error');
      request.callback({
        type: 'error',
        error: 'API is currently unavailable',
        nodeId: request.nodeId,
        timestamp: new Date().toISOString()
      });
    });
    this.state.queue = [];

    // Do NOT fail processing requests - let them complete naturally
    console.log('[ENRICHMENT_QUEUE] Allowing existing processing requests to complete');
  }

  /**
   * Check if an error is retryable (likely due to Edge Function shutdown)
   */
  private isRetryableError(errorMessage: string): boolean {
    const retryablePatterns = [
      'Failed to send a request to the Edge Function',
      'FunctionsError',
      'ERR_FAILED',
      'fetch',
      'network',
      'Connection reset',
      'Connection refused',
      'timeout',
      'AbortError',
      'NetworkError',
      'ERR_NETWORK'
    ];
    
    return retryablePatterns.some(pattern => 
      errorMessage.toLowerCase().includes(pattern.toLowerCase())
    );
  }
}

// Singleton instance
export const enrichmentQueue = new EnrichmentQueueManager();

// Export utility functions for React components
export const getEnrichmentStatus = (nodeId: string, type: 'papers' | 'useCases'): EnrichmentStatus => {
  return enrichmentQueue.getStatus(nodeId, type);
};

export const getEnrichmentElapsedTime = (nodeId: string, type: 'papers' | 'useCases'): number | null => {
  return enrichmentQueue.getElapsedTime(nodeId, type);
};

export const subscribeToEnrichmentStatus = (
  listener: (nodeId: string, type: 'papers' | 'useCases', status: EnrichmentStatus, elapsedTime?: number) => void
) => {
  return enrichmentQueue.subscribe(listener);
};

export const getQueueStatus = () => {
  return enrichmentQueue.getQueueStatus();
};

export const cancelEnrichment = (nodeId: string, type: 'papers' | 'useCases') => {
  enrichmentQueue.cancel(nodeId, type);
};

export const enqueueEnrichment = (
  nodeId: string,
  type: 'papers' | 'useCases',
  params: any,
  callback: (response: any) => void
) => {
  enrichmentQueue.enqueue({
    nodeId,
    type,
    params,
    callback
  });
};
