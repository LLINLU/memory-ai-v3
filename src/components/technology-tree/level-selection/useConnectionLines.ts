
import { useEffect } from 'react';

export const useConnectionLines = (
  containerRef: React.RefObject<HTMLDivElement>,
  selectedPath: {
    level1: string;
    level2: string;
    level3: string;
    level4?: string;
  },
  setLevel1to2Line?: (line: {x1: number, y1: number, x2: number, y2: number} | null) => void,
  setLevel2to3Line?: (line: {x1: number, y1: number, x2: number, y2: number} | null) => void,
  setLevel3to4Line?: (line: {x1: number, y1: number, x2: number, y2: number} | null) => void
) => {
  useEffect(() => {
    if (!containerRef.current) return;

    const updateLines = () => {
      const container = containerRef.current;
      if (!container) return;

      const columns = container.querySelectorAll('.w-1\\/3, .w-1\\/4');
      
      // Level 1 to Level 2 connection
      if (selectedPath.level1 && selectedPath.level2 && columns[0] && columns[1]) {
        const level1Node = columns[0].querySelector(`[data-node-id="${selectedPath.level1}"]`);
        const level2Node = columns[1].querySelector(`[data-node-id="${selectedPath.level2}"]`);
        
        if (level1Node && level2Node && setLevel1to2Line) {
          const level1Rect = level1Node.getBoundingClientRect();
          const level2Rect = level2Node.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          
          setLevel1to2Line({
            x1: level1Rect.right - containerRect.left,
            y1: level1Rect.top + level1Rect.height / 2 - containerRect.top,
            x2: level2Rect.left - containerRect.left,
            y2: level2Rect.top + level2Rect.height / 2 - containerRect.top
          });
        }
      } else if (setLevel1to2Line) {
        setLevel1to2Line(null);
      }

      // Level 2 to Level 3 connection
      if (selectedPath.level2 && selectedPath.level3 && columns[1] && columns[2]) {
        const level2Node = columns[1].querySelector(`[data-node-id="${selectedPath.level2}"]`);
        const level3Node = columns[2].querySelector(`[data-node-id="${selectedPath.level3}"]`);
        
        if (level2Node && level3Node && setLevel2to3Line) {
          const level2Rect = level2Node.getBoundingClientRect();
          const level3Rect = level3Node.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          
          setLevel2to3Line({
            x1: level2Rect.right - containerRect.left,
            y1: level2Rect.top + level2Rect.height / 2 - containerRect.top,
            x2: level3Rect.left - containerRect.left,
            y2: level3Rect.top + level3Rect.height / 2 - containerRect.top
          });
        }
      } else if (setLevel2to3Line) {
        setLevel2to3Line(null);
      }

      // Level 3 to Level 4 connection
      if (selectedPath.level3 && selectedPath.level4 && columns[2] && columns[3]) {
        const level3Node = columns[2].querySelector(`[data-node-id="${selectedPath.level3}"]`);
        const level4Node = columns[3].querySelector(`[data-node-id="${selectedPath.level4}"]`);
        
        if (level3Node && level4Node && setLevel3to4Line) {
          const level3Rect = level3Node.getBoundingClientRect();
          const level4Rect = level4Node.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          
          setLevel3to4Line({
            x1: level3Rect.right - containerRect.left,
            y1: level3Rect.top + level3Rect.height / 2 - containerRect.top,
            x2: level4Rect.left - containerRect.left,
            y2: level4Rect.top + level4Rect.height / 2 - containerRect.top
          });
        }
      } else if (setLevel3to4Line) {
        setLevel3to4Line(null);
      }
    };

    // Initial update
    updateLines();

    // Set up resize observer for responsive updates
    const resizeObserver = new ResizeObserver(updateLines);
    resizeObserver.observe(containerRef.current);

    // Set up mutation observer for DOM changes
    const mutationObserver = new MutationObserver(updateLines);
    mutationObserver.observe(containerRef.current, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    });

    // Cleanup
    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [selectedPath, setLevel1to2Line, setLevel2to3Line, setLevel3to4Line]);

  return {
    level1to2Line: null,
    level2to3Line: null,
    level3to4Line: null
  };
};
