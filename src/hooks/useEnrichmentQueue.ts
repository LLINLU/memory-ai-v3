import { useState, useEffect, useRef } from 'react';
import { 
  subscribeToEnrichmentStatus, 
  getEnrichmentStatus, 
  getEnrichmentElapsedTime,
  type EnrichmentStatus 
} from '@/services/enrichmentQueue';

export interface EnrichmentQueueState {
  papersStatus: EnrichmentStatus;
  useCasesStatus: EnrichmentStatus;
  papersElapsedTime: number | null;
  useCasesElapsedTime: number | null;
}

/**
 * Hook to track enrichment queue status for a specific node
 */
export const useEnrichmentQueue = (nodeId: string | null) => {
  const [state, setState] = useState<EnrichmentQueueState>({
    papersStatus: 'done',
    useCasesStatus: 'done',
    papersElapsedTime: null,
    useCasesElapsedTime: null,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!nodeId) {
      setState({
        papersStatus: 'done',
        useCasesStatus: 'done',
        papersElapsedTime: null,
        useCasesElapsedTime: null,
      });
      return;
    }

    // Initialize state
    const updateState = () => {
      setState({
        papersStatus: getEnrichmentStatus(nodeId, 'papers'),
        useCasesStatus: getEnrichmentStatus(nodeId, 'useCases'),
        papersElapsedTime: getEnrichmentElapsedTime(nodeId, 'papers'),
        useCasesElapsedTime: getEnrichmentElapsedTime(nodeId, 'useCases'),
      });
    };

    updateState();

    // Subscribe to status changes
    const unsubscribe = subscribeToEnrichmentStatus((statusNodeId, type, status, elapsedTime) => {
      if (statusNodeId === nodeId) {
        setState(prev => ({
          ...prev,
          [`${type}Status`]: status,
          [`${type}ElapsedTime`]: elapsedTime || null,
        }));
      }
    });

    // Update elapsed time every second for active requests
    intervalRef.current = setInterval(() => {
      const papersStatus = getEnrichmentStatus(nodeId, 'papers');
      const useCasesStatus = getEnrichmentStatus(nodeId, 'useCases');
      
      if (papersStatus === 'fetching' || useCasesStatus === 'fetching') {
        setState(prev => ({
          ...prev,
          papersElapsedTime: getEnrichmentElapsedTime(nodeId, 'papers'),
          useCasesElapsedTime: getEnrichmentElapsedTime(nodeId, 'useCases'),
        }));
      }
    }, 1000);

    return () => {
      unsubscribe();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [nodeId]);

  // Helper functions
  const isLoading = state.papersStatus === 'fetching' || state.useCasesStatus === 'fetching';
  const isWaiting = state.papersStatus === 'waiting' || state.useCasesStatus === 'waiting';
  const hasError = state.papersStatus === 'error' || state.useCasesStatus === 'error' || 
                   state.papersStatus === 'timeout' || state.useCasesStatus === 'timeout';

  const formatElapsedTime = (elapsedTime: number | null): string => {
    if (!elapsedTime) return '';
    
    const seconds = Math.floor(elapsedTime / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${seconds}s`;
  };

  return {
    ...state,
    isLoading,
    isWaiting,
    hasError,
    formatElapsedTime,
    isPapersLoading: state.papersStatus === 'fetching',
    isUseCasesLoading: state.useCasesStatus === 'fetching',
    isPapersWaiting: state.papersStatus === 'waiting',
    isUseCasesWaiting: state.useCasesStatus === 'waiting',
    hasPapersError: state.papersStatus === 'error' || state.papersStatus === 'timeout',
    hasUseCasesError: state.useCasesStatus === 'error' || state.useCasesStatus === 'timeout',
  };
};
