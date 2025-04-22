
import { ArrowRight } from "lucide-react";

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

  // Get the selected DOM elements to calculate connecting line position
  const getNodePositions = () => {
    const level2NodeId = `level2-${selectedPath.level2}`;
    const level3NodeId = `level3-${selectedPath.level3}`;
    
    const level2Node = document.getElementById(level2NodeId);
    const level3Node = document.getElementById(level3NodeId);
    
    return { level2Node, level3Node };
  };

  return (
    <div className="flex flex-row gap-6 mb-8 relative">
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
                  ? 'bg-blue-500 text-white ring-2 ring-bright-orange' 
                  : 'bg-blue-400 text-white hover:bg-blue-500'
                }
              `}
              onClick={() => onNodeClick('level1', item.id)}
              id={`level1-${item.id}`}
            >
              <h4 className="text-lg font-bold">{item.name}</h4>
              <p className="text-xs mt-1">{item.info}</p>
              
              {selectedPath.level1 === item.id && selectedPath.level2 && (
                <div 
                  className="absolute top-1/2 -right-[24px] bg-blue-600" 
                  style={{ 
                    width: '48px',
                    height: '2px',
                    transform: 'translateY(-50%) translateX(50%)',
                    transformOrigin: 'right'
                  }}
                />
              )}
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
                  ? 'bg-blue-500 text-white ring-2 ring-bright-orange' 
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
                  ? 'bg-blue-500 text-white ring-2 ring-bright-orange' 
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

      {/* Dynamic connecting line between level2 and level3 */}
      {selectedPath.level2 && selectedPath.level3 && (
        <div 
          className="absolute pointer-events-none z-10"
          style={{
            position: 'absolute',
            left: '62.5%', // Position between level 2 and level 3 columns
            right: '32.5%',
            top: 0,
            bottom: 0,
            overflow: 'visible'
          }}
        >
          <svg 
            style={{ 
              position: 'absolute',
              width: '100%',
              height: '100%',
              overflow: 'visible'
            }}
          >
            <line
              x1="0"
              y1="0"  
              x2="100%"
              y2="0"
              className="connecting-line"
              style={{
                stroke: '#2563eb', // blue-600
                strokeWidth: '2px',
                strokeLinecap: 'round',
                transformOrigin: 'left',
                transform: `translateY(${
                  // Get position of selected level 2 node
                  document.getElementById(`level2-${selectedPath.level2}`)?.offsetTop +
                  document.getElementById(`level2-${selectedPath.level2}`)?.clientHeight / 2 -
                  // Adjust for level 3 node position
                  (document.getElementById(`level3-${selectedPath.level3}`)?.offsetTop || 0) -
                  (document.getElementById(`level3-${selectedPath.level3}`)?.clientHeight / 2 || 0)
                }px)`,
              }}
            />
          </svg>
        </div>
      )}
    </div>
  );
};
