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
}

export const LevelSelection = ({
  selectedPath,
  level1Items,
  level2Items,
  level3Items,
  onNodeClick
}: LevelSelectionProps) => {
  const visibleLevel2Items = selectedPath.level1 ? level2Items[selectedPath.level1] || [] : [];
  const visibleLevel3Items = selectedPath.level2 ? level3Items[selectedPath.level2] || [] : [];

  return (
    <div className="flex flex-row gap-6 mb-8 relative">
      <div className="w-1/3 bg-blue-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold text-blue-700 mb-3">Level 1</h2>
        <h3 className="text-sm text-blue-600 mb-4">Main Domains</h3>
        
        <div className="space-y-4">
          {level1Items.map((item) => (
            <div
              key={item.id}
              className={`
                py-4 px-3 rounded-lg text-center cursor-pointer transition-all relative
                ${selectedPath.level1 === item.id 
                  ? 'bg-blue-500 text-white ring-2 ring-yellow-400' 
                  : 'bg-blue-400 text-white hover:bg-blue-500'
                }
              `}
              onClick={() => onNodeClick('level1', item.id)}
              id={`level1-${item.id}`}
            >
              <h4 className="text-lg font-bold">{item.name}</h4>
              <p className="text-xs mt-1">{item.info}</p>
              
              {selectedPath.level1 === item.id && selectedPath.level2 && (
                <div className="absolute top-1/2 right-0 w-6 h-0.5 bg-blue-600 -mr-6"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="w-1/3 bg-blue-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold text-blue-700 mb-3">Level 2</h2>
        <h3 className="text-sm text-blue-600 mb-4">Sub-domains</h3>
        
        <div className="space-y-4">
          {visibleLevel2Items.map((item) => (
            <div
              key={item.id}
              className={`
                py-4 px-3 rounded-lg text-center cursor-pointer transition-all relative
                ${selectedPath.level2 === item.id 
                  ? 'bg-blue-500 text-white ring-2 ring-yellow-400' 
                  : 'bg-blue-400 text-white hover:bg-blue-500'
                }
              `}
              onClick={() => onNodeClick('level2', item.id)}
              id={`level2-${item.id}`}
            >
              <h4 className="text-lg font-bold">{item.name}</h4>
              <p className="text-xs mt-1">{item.info}</p>
              
              {selectedPath.level2 === item.id && selectedPath.level3 && (
                <div className="absolute top-1/2 right-0 w-6 h-0.5 bg-blue-600 -mr-6"></div>
              )}
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
        <h3 className="text-sm text-blue-600 mb-4">Specific Topics/Techniques</h3>
        
        <div className="space-y-4">
          {visibleLevel3Items.map((item) => (
            <div
              key={item.id}
              className={`
                py-4 px-3 rounded-lg text-center cursor-pointer transition-all
                ${selectedPath.level3 === item.id 
                  ? 'bg-blue-500 text-white ring-2 ring-yellow-400' 
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
    </div>
  );
};
