import React, { useState, useEffect } from 'react';
import { getQueueStatus } from '@/services/enrichmentQueue';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const QueueStatusDisplay: React.FC = () => {
  const [status, setStatus] = useState(getQueueStatus());
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(getQueueStatus());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Only show when there's activity or when explicitly toggled
  const hasActivity = status.queueLength > 0 || 
                     status.processing.papers > 0 || 
                     status.processing.useCases > 0 ||
                     !status.apiHealthy;

  if (!hasActivity && !isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsVisible(true)}
          className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
        >
          Queue Status
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-64">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Enrichment Queue</CardTitle>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-500 hover:text-gray-700 text-xs"
            >
              ×
            </button>
          </div>
        </CardHeader>
        <CardContent className="text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span>Queue:</span>
            <Badge variant={status.queueLength > 0 ? "default" : "secondary"}>
              {status.queueLength}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span>Papers:</span>
            <Badge variant={status.processing.papers > 0 ? "default" : "secondary"}>
              {status.processing.papers}/{status.maxConcurrent.papers}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span>Use Cases:</span>
            <Badge variant={status.processing.useCases > 0 ? "default" : "secondary"}>
              {status.processing.useCases}/{status.maxConcurrent.useCases}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span>API Health:</span>
            <Badge variant={status.apiHealthy ? "default" : "destructive"}>
              {status.apiHealthy ? "Healthy" : "Failed"}
            </Badge>
          </div>
          
          {status.lastHealthCheck > 0 && (
            <div className="text-gray-500 text-xs">
              Last check: {new Date(status.lastHealthCheck).toLocaleTimeString()}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
