
import { useEffect, RefObject, useState } from 'react';

interface ConnectionLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export const useConnectionLines = (
  containerRef: RefObject<HTMLDivElement>,
  selectedPath: { level1: string; level2: string; level3: string; level4?: string },
  setLevel1to2Line?: (line: ConnectionLine | null) => void,
  setLevel2to3Line?: (line: ConnectionLine | null) => void,
  setLevel3to4Line?: (line: ConnectionLine | null) => void
) => {
  const [level1to2Line, setInternalLevel1to2Line] = useState<ConnectionLine | null>(null);
  const [level2to3Line, setInternalLevel2to3Line] = useState<ConnectionLine | null>(null);
  const [level3to4Line, setInternalLevel3to4Line] = useState<ConnectionLine | null>(null);
  
  // Use the provided setters if available, otherwise use internal state
  const updateLevel1to2Line = setLevel1to2Line || setInternalLevel1to2Line;
  const updateLevel2to3Line = setLevel2to3Line || setInternalLevel2to3Line;
  const updateLevel3to4Line = setLevel3to4Line || setInternalLevel3to4Line;

  const updateConnectionLines = () => {
    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();

      // Update level 1 to level 2 connection
      if (selectedPath.level1 && selectedPath.level2) {
        const level1Node = document.getElementById(`level1-${selectedPath.level1}`);
        const level2Node = document.getElementById(`level2-${selectedPath.level2}`);
        
        if (level1Node && level2Node) {
          const level1Rect = level1Node.getBoundingClientRect();
          const level2Rect = level2Node.getBoundingClientRect();
          
          updateLevel1to2Line({
            x1: level1Rect.right - containerRect.left,
            y1: level1Rect.top + level1Rect.height/2 - containerRect.top,
            x2: level2Rect.left - containerRect.left,
            y2: level2Rect.top + level2Rect.height/2 - containerRect.top
          });
        }
      } else {
        updateLevel1to2Line(null);
      }

      // Update level 2 to level 3 connection
      if (selectedPath.level2 && selectedPath.level3) {
        const level2Node = document.getElementById(`level2-${selectedPath.level2}`);
        const level3Node = document.getElementById(`level3-${selectedPath.level3}`);
        
        if (level2Node && level3Node) {
          const level2Rect = level2Node.getBoundingClientRect();
          const level3Rect = level3Node.getBoundingClientRect();
          
          updateLevel2to3Line({
            x1: level2Rect.right - containerRect.left,
            y1: level2Rect.top + level2Rect.height/2 - containerRect.top,
            x2: level3Rect.left - containerRect.left,
            y2: level3Rect.top + level3Rect.height/2 - containerRect.top
          });
        }      } else {
        updateLevel2to3Line(null);
      }

      // Update level 3 to level 4 connection
      if (selectedPath.level3 && selectedPath.level4) {
        const level3Node = document.getElementById(`level3-${selectedPath.level3}`);
        const level4Node = document.getElementById(`level4-${selectedPath.level4}`);
        
        if (level3Node && level4Node) {
          const level3Rect = level3Node.getBoundingClientRect();
          const level4Rect = level4Node.getBoundingClientRect();
          
          updateLevel3to4Line({
            x1: level3Rect.right - containerRect.left,
            y1: level3Rect.top + level3Rect.height/2 - containerRect.top,
            x2: level4Rect.left - containerRect.left,
            y2: level4Rect.top + level4Rect.height/2 - containerRect.top
          });
        }
      } else {
        updateLevel3to4Line(null);
      }
    }
  };

  useEffect(() => {
    updateConnectionLines();
    
    const handleResize = () => {
      requestAnimationFrame(updateConnectionLines);
    };

    window.addEventListener('resize', handleResize);
    
    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(updateConnectionLines);
    });
    
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    document.addEventListener('panel-resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('panel-resize', handleResize);
      resizeObserver.disconnect();
    };
  }, [selectedPath.level1, selectedPath.level2, selectedPath.level3, selectedPath.level4]);

  useEffect(() => {
    updateConnectionLines();
    const timeoutId = setTimeout(updateConnectionLines, 100);
    return () => clearTimeout(timeoutId);
  }, []);
  return { level1to2Line: setLevel1to2Line ? null : level1to2Line, 
           level2to3Line: setLevel2to3Line ? null : level2to3Line,
           level3to4Line: setLevel3to4Line ? null : level3to4Line,
           updateConnectionLines };
};
