// Queue system for managing paper and use case enrichment API calls
// Prevents overloading the backend with concurrent requests

export interface QueuedEnrichmentRequest {
  nodeId: string;
  type: 'papers' | 'useCases';
  params: any;
  callback: (response: any) => void;
  timestamp: number;
  startTime?: number;
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

  // Configuration
  private readonly MAX_CONCURRENT_PAPERS = 7;
  private readonly MAX_CONCURRENT_USECASES = 3;
  private readonly REQUEST_TIMEOUT = 3 * 60 * 1000; // 3 minutes
  private readonly HEALTH_CHECK_INTERVAL = 30 * 1000; // 30 seconds
  private readonly API_BASE_URL = 'https://search-api.memoryai.jp';

  // Event listeners for status updates
  private listeners = new Set<(nodeId: string, type: 'papers' | 'useCases', status: EnrichmentStatus, elapsedTime?: number) => void>();

  constructor() {
    // Start health check polling
    this.startHealthCheckPolling();
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
      timestamp: Date.now()
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
      lastHealthCheck: this.state.lastHealthCheck
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
      console.log('[ENRICHMENT_QUEUE] API unhealthy, not processing requests');
      // Mark all waiting/fetching requests as failed
      this.failAllRequests();
      return;
    }

    // Count current processing requests by type
    const processingRequests = Array.from(this.state.processing.values());
    const paperRequests = processingRequests.filter(r => r.type === 'papers');
    const useCaseRequests = processingRequests.filter(r => r.type === 'useCases');

    // Find next processable request
    for (let i = 0; i < this.state.queue.length; i++) {
      const request = this.state.queue[i];
      const canProcess = 
        (request.type === 'papers' && paperRequests.length < this.MAX_CONCURRENT_PAPERS) ||
        (request.type === 'useCases' && useCaseRequests.length < this.MAX_CONCURRENT_USECASES);

      if (canProcess) {
        // Remove from queue and start processing
        this.state.queue.splice(i, 1);
        this.startProcessing(request);
        
        // Try to process more requests
        this.processNext();
        break;
      }
    }
  }

  /**
   * Start processing a request
   */
  private async startProcessing(request: QueuedEnrichmentRequest): Promise<void> {
    const key = `${request.nodeId}:${request.type}`;
    
    // Add to processing map
    request.startTime = Date.now();
    this.state.processing.set(key, request);
    this.updateStatus(request.nodeId, request.type, 'fetching');

    console.log(`[ENRICHMENT_QUEUE] Starting processing ${key}`);

    // Set timeout
    const timeoutId = setTimeout(() => {
      console.log(`[ENRICHMENT_QUEUE] Request ${key} timed out`);
      this.completeProcessing(key, 'timeout');
    }, this.REQUEST_TIMEOUT);

    try {
      // Call the appropriate API based on type
      const result = await this.callEnrichmentAPI(request);
      
      // Clear timeout
      clearTimeout(timeoutId);
      
      // Call the callback with the result
      request.callback(result);
      
      // Mark as complete
      this.completeProcessing(key, 'done');
      
    } catch (error) {
      console.error(`[ENRICHMENT_QUEUE] Error processing ${key}:`, error);
      
      // Clear timeout
      clearTimeout(timeoutId);
      
      // Call callback with error
      request.callback({
        type: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        nodeId: request.nodeId,
        timestamp: new Date().toISOString()
      });
      
      // Mark as error
      this.completeProcessing(key, 'error');
    }
  }

  /**
   * Complete processing a request
   */
  private completeProcessing(key: string, status: EnrichmentStatus): void {
    const request = this.state.processing.get(key);
    if (request) {
      this.state.processing.delete(key);
      this.updateStatus(request.nodeId, request.type, status);
      
      console.log(`[ENRICHMENT_QUEUE] Completed processing ${key} with status: ${status}`);
      
      // Process next request
      this.processNext();
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
   * Call the actual enrichment API
   */
  private async callEnrichmentAPI(request: QueuedEnrichmentRequest): Promise<any> {
    const { supabase } = await import('@/integrations/supabase/client');
    
    if (request.type === 'papers') {
      const { data, error } = await supabase.functions.invoke('node-enrichment-papers', {
        body: request.params
      });

      if (error) {
        throw new Error(`Papers enrichment failed: ${error.message}`);
      }

      return {
        type: 'papers',
        data: data?.results?.papers || {},
        nodeId: request.nodeId,
        timestamp: new Date().toISOString()
      };
      
    } else if (request.type === 'useCases') {
      const { data, error } = await supabase.functions.invoke('node-enrichment-usecases', {
        body: request.params
      });

      if (error) {
        throw new Error(`Use cases enrichment failed: ${error.message}`);
      }

      return {
        type: 'useCases',
        data: data?.results?.useCases || {},
        nodeId: request.nodeId,
        timestamp: new Date().toISOString()
      };
    }

    throw new Error(`Unknown enrichment type: ${request.type}`);
  }

  /**
   * Check API health
   */
  private async checkAPIHealth(): Promise<boolean> {
    try {
      // Create a timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Health check timeout')), 5000);
      });

      // Try a simple fetch to the root API URL (no /health endpoint mentioned in requirements)
      // If there's no specific health endpoint, we can try the base URL
      const fetchPromise = fetch(`${this.API_BASE_URL}/`, {
        method: 'GET'
      });
      
      const response = await Promise.race([fetchPromise, timeoutPromise]);
      return response.status === 200;
    } catch (error) {
      console.warn('[ENRICHMENT_QUEUE] API health check failed:', error);
      return false;
    }
  }

  /**
   * Start periodic health check polling
   */
  private startHealthCheckPolling(): void {
    const checkHealth = async () => {
      const healthy = await this.checkAPIHealth();
      this.state.apiHealthy = healthy;
      this.state.lastHealthCheck = Date.now();
      
      if (!healthy) {
        console.warn('[ENRICHMENT_QUEUE] API is unhealthy');
        this.failAllRequests();
      }
    };

    // Initial check
    checkHealth();
    
    // Periodic checks
    setInterval(checkHealth, this.HEALTH_CHECK_INTERVAL);
  }

  /**
   * Mark all waiting/fetching requests as failed
   */
  private failAllRequests(): void {
    // Fail all queued requests
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

    // Fail all processing requests
    Array.from(this.state.processing.values()).forEach(request => {
      const key = `${request.nodeId}:${request.type}`;
      this.completeProcessing(key, 'error');
      request.callback({
        type: 'error',
        error: 'API is currently unavailable',
        nodeId: request.nodeId,
        timestamp: new Date().toISOString()
      });
    });
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
