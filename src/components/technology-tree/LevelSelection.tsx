
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface LevelItem {
  id: string;
  name: string;
  info?: string;
}

interface LevelSelectionProps {
  selectedPath: {
    level1: string;
    level2: string;
    level3: string;
  };
  level1Items: LevelItem[];
  level2Items: Record<string, LevelItem[]>;
  level3Items: Record<string, LevelItem[]>;
  onNodeClick: (level: string, nodeId: string) => void;
  levelNames: {
    level1: string;
    level2: string;
    level3: string;
  };
}

export const LevelSelection = ({
  selectedPath,
  level1Items,
  level2Items,
  level3Items,
  onNodeClick,
  levelNames
}: LevelSelectionProps) => {
  const visibleLevel2Items = selectedPath.level1 ? level2Items[selectedPath.level1] || [] : [];
  const visibleLevel3Items = selectedPath.level2 ? level3Items[selectedPath.level2] || [] : [];
  const [level2to3Line, setLevel2to3Line] = useState<{x1: number, y1: number, x2: number, y2: number} | null>(null);
  const [level1to2Line, setLevel1to2Line] = useState<{x1: number, y1: number, x2: number, y2: number} | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);

  // Function to update connection lines based on current DOM positions
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
          
          setLevel1to2Line({
            x1: level1Rect.right - containerRect.left,
            y1: level1Rect.top + level1Rect.height/2 - containerRect.top,
            x2: level2Rect.left - containerRect.left,
            y2: level2Rect.top + level2Rect.height/2 - containerRect.top
          });
        }
      } else {
        setLevel1to2Line(null);
      }

      // Update level 2 to level 3 connection
      if (selectedPath.level2 && selectedPath.level3) {
        const level2Node = document.getElementById(`level2-${selectedPath.level2}`);
        const level3Node = document.getElementById(`level3-${selectedPath.level3}`);
        
        if (level2Node && level3Node) {
          const level2Rect = level2Node.getBoundingClientRect();
          const level3Rect = level3Node.getBoundingClientRect();
          
          setLevel2to3Line({
            x1: level2Rect.right - containerRect.left,
            y1: level2Rect.top + level2Rect.height/2 - containerRect.top,
            x2: level3Rect.left - containerRect.left,
            y2: level3Rect.top + level3Rect.height/2 - containerRect.top
          });
        }
      } else {
        setLevel2to3Line(null);
      }
    }
  };

  // Update connection lines when selected paths change or on resize
  useEffect(() => {
    updateConnectionLines();
    
    // Add resize event listener to handle panel resizing
    const handleResize = () => {
      requestAnimationFrame(updateConnectionLines);
    };

    window.addEventListener('resize', handleResize);
    
    // Listen for panel resize events
    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(updateConnectionLines);
    });
    
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    // Handle specific resize events from resizable panels
    document.addEventListener('panel-resize', handleResize);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('panel-resize', handleResize);
      resizeObserver.disconnect();
    };
  }, [selectedPath.level1, selectedPath.level2, selectedPath.level3]);

  // Also update lines when the component mounts and after a short delay
  // to ensure proper positioning after DOM layout stabilizes
  useEffect(() => {
    updateConnectionLines();
    
    // Update again after layout stabilizes
    const timeoutId = setTimeout(() => {
      updateConnectionLines();
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="flex flex-row gap-6 mb-8 relative" ref={containerRef}>
      <div className="w-1/3 bg-blue-50 p-4 rounded-lg relative">
        <h2 className="text-lg font-semibold text-blue-700 mb-3">Level 1</h2>
        <h3 className="text-sm text-blue-600 mb-4">{levelNames.level1}</h3>
        
        <div className="space-y-4">
          {level1Items.map((item) => (
            <div
              key={item.id}
              className={`
                py-4 px-3 rounded-lg text-center cursor-pointer transition-all relative
                ${selectedPath.level1 === item.id 
                  ? 'bg-blue-500 text-white ring-2 ring-blue-600' 
                  : 'bg-blue-400 text-white hover:bg-blue-500'
                }
              `}
              onClick={() => onNodeClick('level1', item.id)}
              id={`level1-${item.id}`}
            >
              <h4 className="text-lg font-bold">{item.name}</h4>
              <p className="text-xs mt-1">{item.info}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="w-1/3 bg-blue-50 p-4 rounded-lg relative">
        <h2 className="text-lg font-semibold text-blue-700 mb-3">Level 2</h2>
        <h3 className="text-sm text-blue-600 mb-4">{levelNames.level2}</h3>
        
        <div className="space-y-4">
          {visibleLevel2Items.map((item) => (
            <div
              key={item.id}
              className={`
                py-4 px-3 rounded-lg text-center cursor-pointer transition-all relative
                ${selectedPath.level2 === item.id 
                  ? 'bg-blue-500 text-white ring-2 ring-blue-600' 
                  : 'bg-blue-400 text-white hover:bg-blue-500'
                }
              `}
              onClick={() => onNodeClick('level2', item.id)}
              id={`level2-${item.id}`}
            >
              <h4 className="text-lg font-bold">{item.name}</h4>
              <p className="text-xs mt-1">{item.info}</p>
            </div>
          ))}
          {visibleLevel2Items.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Select a domain from Level 1
            </div>
          )}
        </div>
      </div>

      <div className="w-1/3 bg-blue-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold text-blue-700 mb-3">Level 3</h2>
        <h3 className="text-sm text-blue-600 mb-4">{levelNames.level3}</h3>
        
        <div className="space-y-4">
          {visibleLevel3Items.map((item) => (
            <div
              key={item.id}
              className={`
                py-4 px-3 rounded-lg text-center cursor-pointer transition-all relative
                ${selectedPath.level3 === item.id 
                  ? 'bg-blue-500 text-white ring-2 ring-blue-600' 
                  : 'bg-blue-400 text-white hover:bg-blue-500'
                }
              `}
              onClick={() => onNodeClick('level3', item.id)}
              id={`level3-${item.id}`}
            >
              <h4 className="text-lg font-bold">{item.name}</h4>
              <p className="text-xs mt-1">{item.info}</p>
            </div>
          ))}
          {visibleLevel3Items.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Select a sub-domain from Level 2
            </div>
          )}
        </div>
      </div>

      {/* SVG connection lines */}
      <svg 
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
        style={{ overflow: 'visible' }}
      >
        {level1to2Line && (
          <line
            x1={level1to2Line.x1}
            y1={level1to2Line.y1}
            x2={level1to2Line.x2}
            y2={level1to2Line.y2}
            stroke="#2563eb"
            strokeWidth="2"
            strokeLinecap="round"
          />
        )}
        {level2to3Line && (
          <line
            x1={level2to3Line.x1}
            y1={level2to3Line.y1}
            x2={level2to3Line.x2}
            y2={level2to3Line.y2}
            stroke="#2563eb"
            strokeWidth="2"
            strokeLinecap="round"
          />
        )}
      </svg>
    </div>
  );
};
