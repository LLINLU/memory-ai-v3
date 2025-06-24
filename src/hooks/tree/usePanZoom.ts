import { useState, useCallback, useRef } from 'react';

interface PanZoomState {
  zoom: number;
  panX: number;
  panY: number;
}

interface UsePanZoomReturn {
  zoom: number;
  panX: number;
  panY: number;
  isDragging: boolean;
  handleWheel: (event: React.WheelEvent) => void;
  handleMouseDown: (event: React.MouseEvent) => void;
  handleMouseMove: (event: React.MouseEvent) => void;
  handleMouseUp: () => void;
  handleMouseLeave: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetView: () => void;
  centerOnNode: (nodeX: number, nodeY: number, nodeWidth: number, nodeHeight: number, viewportWidth: number, viewportHeight: number) => void;
  getTransform: () => string;
}

export const usePanZoom = (
  containerWidth: number,
  containerHeight: number
): UsePanZoomReturn => {
  const [state, setState] = useState<PanZoomState>({
    zoom: 0.6, // Set default zoom to 60%
    panX: 0, // Changed from 200 to 0 to show root node on LEFT side of canvas
    panY: 50, // Keep initial downward offset for better root node positioning
  });
  
  const [isDragging, setIsDragging] = useState(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  const MIN_ZOOM = 0.1;
  const MAX_ZOOM = 3;
  const ZOOM_STEP = 0.2;

  const handleWheel = useCallback((event: React.WheelEvent) => {
    console.log('🟢 usePanZoom handleWheel called');
    console.log('Event target:', (event.target as HTMLElement)?.className);
    console.log('DeltaY:', event.deltaY);
    console.log('Event timestamp:', Date.now());
    
    event.preventDefault();
    event.stopPropagation(); // Prevent event from bubbling up to page level
    
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Much gentler zoom factors - 3% base change instead of 10%
    const baseFactor = 0.03;
    
    // Adjust zoom factor based on deltaY magnitude for better trackpad/mouse wheel handling
    const deltaY = Math.abs(event.deltaY);
    let adjustedFactor = baseFactor;
    
    // For larger deltas (mouse wheel), allow slightly more zoom
    if (deltaY > 100) {
      adjustedFactor = baseFactor * 1.5; // 4.5%
    } else if (deltaY > 50) {
      adjustedFactor = baseFactor * 1.2; // 3.6%
    }
    // For small deltas (trackpad), keep the gentle 3%
    
    const zoomFactor = event.deltaY > 0 ? (1 - adjustedFactor) : (1 + adjustedFactor);
    
    setState(prev => {
      const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, prev.zoom * zoomFactor));
      
      // Zoom towards center of container
      const zoomChange = newZoom / prev.zoom;
      const newPanX = centerX - (centerX - prev.panX) * zoomChange;
      const newPanY = centerY - (centerY - prev.panY) * zoomChange;
      
      console.log('🟢 Zoom updated:', { newZoom, newPanX, newPanY });
      
      return {
        zoom: newZoom,
        panX: newPanX,
        panY: newPanY,
      };
    });
  }, []);

  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    if (event.button === 0) { // Left mouse button
      setIsDragging(true);
      lastMousePos.current = { x: event.clientX, y: event.clientY };
      event.preventDefault();
    }
  }, []);

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (!isDragging) return;

    const deltaX = event.clientX - lastMousePos.current.x;
    const deltaY = event.clientY - lastMousePos.current.y;

    setState(prev => ({
      ...prev,
      panX: prev.panX + deltaX,
      panY: prev.panY + deltaY,
    }));

    lastMousePos.current = { x: event.clientX, y: event.clientY };
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const zoomIn = useCallback(() => {
    setState(prev => ({
      ...prev,
      zoom: Math.min(MAX_ZOOM, prev.zoom + ZOOM_STEP),
    }));
  }, []);

  const zoomOut = useCallback(() => {
    setState(prev => ({
      ...prev,
      zoom: Math.max(MIN_ZOOM, prev.zoom - ZOOM_STEP),
    }));
  }, []);

  const resetView = useCallback(() => {
    setState({
      zoom: 0.6, // Reset to 60% zoom instead of 100%
      panX: 0, // Reset to 0 to show root node on LEFT side when resetting
      panY: 50, // Keep the improved initial Y offset when resetting
    });
  }, []);

  const centerOnNode = useCallback((
    nodeX: number, 
    nodeY: number, 
    nodeWidth: number, 
    nodeHeight: number,
    viewportWidth: number,
    viewportHeight: number
  ) => {
    setState(prev => {
      // Calculate the center of the node
      const nodeCenterX = nodeX + nodeWidth / 2;
      const nodeCenterY = nodeY + nodeHeight / 2;
      
      // Calculate pan values to center the node in the viewport
      const newPanX = (viewportWidth / 2) - (nodeCenterX * prev.zoom);
      const newPanY = (viewportHeight / 2) - (nodeCenterY * prev.zoom);
      
      return {
        ...prev,
        panX: newPanX,
        panY: newPanY,
      };
    });
  }, []);

  const getTransform = useCallback(() => {
    return `translate(${state.panX}px, ${state.panY}px) scale(${state.zoom})`;
  }, [state]);

  return {
    zoom: state.zoom,
    panX: state.panX,
    panY: state.panY,
    isDragging,
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    zoomIn,
    zoomOut,
    resetView,
    centerOnNode,
    getTransform,
  };
};
