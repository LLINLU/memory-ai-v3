
import React from 'react';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Home } from 'lucide-react';
import { LayoutDirection } from './MindMapContainer';

interface MindMapControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  layoutDirection: LayoutDirection;
  onToggleLayout: () => void;
}

export const MindMapControls: React.FC<MindMapControlsProps> = ({
  zoom,
  onZoomIn,
  onZoomOut,
  onResetView,
  layoutDirection,
  onToggleLayout,
}) => {
  return (
    <div className="absolute top-4 right-4 flex flex-col gap-2 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg border z-10">
      <Button
        variant="outline"
        size="sm"
        onClick={onZoomIn}
        disabled={zoom >= 3}
        className="w-10 h-10 p-0"
        title="Zoom In"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onZoomOut}
        disabled={zoom <= 0.1}
        className="w-10 h-10 p-0"
        title="Zoom Out"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onResetView}
        className="w-10 h-10 p-0"
        title="Reset View"
      >
        <Home className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={onToggleLayout}
        className="w-10 h-10 p-0"
        title={`Switch to ${layoutDirection === 'horizontal' ? 'Vertical' : 'Horizontal'} Layout`}
      >
        <div className="text-xs font-bold">
          {layoutDirection === 'horizontal' ? '↕' : '↔'}
        </div>
      </Button>
      
      <div className="text-xs text-center text-muted-foreground px-1">
        {Math.round(zoom * 100)}%
      </div>
    </div>
  );
};
