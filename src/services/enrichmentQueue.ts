// Queue system for managing paper and use case enrichment API calls
// Uses database polling approach instead of retries

export interface QueuedEnrichmentRequest {
  nodeId: string;
  type: 'papers' | 'useCases';
  params: any;
  callback: (response: any) => void;
  timestamp: number;
  startTime?: number;
  apiCallStarted?: boolean;
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
  private readonly MAX_CONSECUTIVE_FAILURES = 5;

  // Configuration
  private readonly MAX_CONCURRENT_PAPERS = 20;
  private readonly MAX_CONCURRENT_USECASES = 15;
  private readonly POLLING_TIMEOUT = 4 * 60 * 1000; // 4 minutes for database polling
  private readonly POLLING_INTERVAL = 5000; // Poll database every 5 seconds

  // Event listeners for status updates
  private listeners = new Set<(nodeId: string, type: 'papers' | 'useCases', status: EnrichmentStatus, elapsedTime?: number) => void>();

  constructor() {
    console.log('[ENRICHMENT_QUEUE] Initializing EnrichmentQueueManager...');
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
    this.state.queue = this.state.queue.filter(q => `${q.nodeId}:${q.type}` !== key);

    const queuedRequest: QueuedEnrichmentRequest = {
      ...request,
      timestamp: Date.now(),
      apiCallStarted: false
    };

    this.state.queue.push(queuedRequest);
    this.updateStatus(request.nodeId, request.type, 'waiting');

    console.log(`[ENRICHMENT_QUEUE] Added ${key} to queue. Queue length: ${this.state.queue.length}`);

    // Try to process immediately (don't await to avoid blocking)
    this.processNext();
  }

  /**
   * Cancel a specific request
   */
  cancel(nodeId: string, type: 'papers' | 'useCases'): void {
    const key = `${nodeId}:${type}`;

    // Remove from queue
    this.state.queue = this.state.queue.filter(q => `${q.nodeId}:${q.type}` !== key);

    // Remove from processing
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
    const pollingRequests = Array.from(this.state.processing.values()).filter(r => r.apiCallStarted).length;

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
      polling: pollingRequests, // Show number of requests currently polling database
      consecutiveFailures: this.consecutiveFailures
    };
  }

  /**
   * Process the next request in the queue if capacity allows
   */
  private async processNext(): Promise<void> {
    if (this.state.queue.length === 0) {
      return;
    }

    // Check API health only when we're about to process new requests
    if (!this.state.apiHealthy) {
      console.log('[ENRICHMENT_QUEUE] API marked as unhealthy, checking health before processing...');
      const healthy = await this.checkAPIHealth();
      this.state.apiHealthy = healthy;
      this.state.lastHealthCheck = Date.now();

      if (!healthy) {
        console.log('[ENRICHMENT_QUEUE] API still unhealthy, not processing new requests');
        return;
      } else {
        console.log('[ENRICHMENT_QUEUE] API recovered, proceeding with processing');
        this.consecutiveFailures = 0;
      }
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

        // Try to process more requests (don't await to avoid blocking)
        this.processNext();
        break;
      }
    }
  }

  /**
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
    }
  }

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
  }

  /**
   * Call the actual enrichment API (fire and forget approach)
   */
  private async callEnrichmentAPI(request: QueuedEnrichmentRequest): Promise<void> {
    const { supabase } = await import('@/integrations/supabase/client');

    try {
      console.log(`[ENRICHMENT_QUEUE] Calling ${request.type} API for node ${request.nodeId}`);

      let functionName: string;
      if (request.type === 'papers') {
        functionName = 'node-enrichment-papers';
      } else if (request.type === 'useCases') {
        functionName = 'node-enrichment-usecases';
      } else {
        throw new Error(`Unknown enrichment type: ${request.type}`);
      }

      // Fire and forget - we don't wait for the response
      supabase.functions.invoke(functionName, {
        body: request.params
      }).then(({ data, error }) => {
        if (error) {
          console.warn(`[ENRICHMENT_QUEUE] ${request.type} API returned error (but may still be processing):`, error.message);
        } else {
          console.log(`[ENRICHMENT_QUEUE] ${request.type} API call completed for ${request.nodeId}`);
        }
      }).catch((error) => {
        console.warn(`[ENRICHMENT_QUEUE] ${request.type} API call had error (but may still be processing):`, error);
      });

      // Success! API call was initiated
      this.consecutiveFailures = 0;
      if (!this.state.apiHealthy) {
        console.log('[ENRICHMENT_QUEUE] API recovered - marking as healthy');
        this.state.apiHealthy = true;
      }

      console.log(`[ENRICHMENT_QUEUE] API call initiated for ${request.nodeId}:${request.type}`);

    } catch (error) {
      // Track the failure for this specific request only
      console.warn(`[ENRICHMENT_QUEUE] API call failed for ${request.nodeId}:${request.type}:`, {
        error: error instanceof Error ? error.message : String(error),
        errorType: error instanceof Error ? error.constructor.name : typeof error
      });

      // Only track true system-level failures
      const errorMessage = error instanceof Error ? error.message : String(error);
      const isSystemFailure = (
        errorMessage.includes('Failed to invoke') ||
        errorMessage.includes('ECONNREFUSED') ||
        errorMessage.includes('ENOTFOUND') ||
        errorMessage.includes('ERR_NETWORK')
      );

      if (isSystemFailure) {
        this.consecutiveFailures++;
        console.warn(`[ENRICHMENT_QUEUE] System-level failure detected (${this.consecutiveFailures}/${this.MAX_CONSECUTIVE_FAILURES}):`, errorMessage);

        if (this.consecutiveFailures >= this.MAX_CONSECUTIVE_FAILURES && this.state.apiHealthy) {
          console.error('[ENRICHMENT_QUEUE] Too many consecutive system failures - marking API as unhealthy');
          this.state.apiHealthy = false;
        }
      } else {
        console.warn(`[ENRICHMENT_QUEUE] Node-specific processing error for ${request.nodeId}:${request.type} (not affecting API health):`, errorMessage);

        if (this.consecutiveFailures > 0) {
          console.log('[ENRICHMENT_QUEUE] Resetting consecutive failures counter due to node-specific error');
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
