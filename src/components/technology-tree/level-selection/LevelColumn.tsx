
import React from 'react';
import { Plus } from 'lucide-react';

interface LevelItem {
  id: string;
  name: string;
  info?: string;
  isCustom?: boolean;
}

interface LevelColumnProps {
  title: string;
  subtitle: string;
  items: LevelItem[];
  selectedId: string;
  onNodeClick: (nodeId: string) => void;
}

export const LevelColumn: React.FC<LevelColumnProps> = ({
  title,
  subtitle,
  items,
  selectedId,
  onNodeClick
}) => {
  const handleCustomNodeClick = () => {
    // Extract the level number from the title (e.g., "Level 1" -> "1")
    const levelNumber = title.slice(-1);
    
    // Update sidebar tab to chat with level-specific message
    const customEvent = new CustomEvent('switch-to-chat', {
      detail: {
        message: `👋 Hi there!\nReady to add a new node under Level ${levelNumber}? Here's how you can start:\n🔹 Option 1: Enter a clear Title and Description yourself.\n🔹 Option 2: Just describe your idea in natural language — I'll help turn it into a well-structured node!`
      }
    });
    document.dispatchEvent(customEvent);
  };

  return (
    <div className="w-1/3 bg-blue-50 p-4 rounded-lg relative">
      <h2 className="text-lg font-semibold text-blue-700 mb-3">{title}</h2>
      <h3 className="text-sm text-blue-600 mb-4">{subtitle}</h3>
      
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className={`
              py-4 px-3 rounded-lg text-center cursor-pointer transition-all relative
              ${selectedId === item.id 
                ? item.isCustom
                  ? 'bg-[#FFE194] border-2 border-[#FBCA17] text-[#483B3B]'
                  : 'bg-blue-500 text-white ring-2 ring-blue-600'
                : item.isCustom
                  ? 'bg-[#FFF4CB] border-2 border-[#FEE27E] text-[#554444]'
                  : 'bg-blue-400 text-white hover:bg-blue-500'
              }
            `}
            onClick={() => onNodeClick(item.id)}
            id={`level${title.slice(-1)}-${item.id}`}
          >
            <div className="flex items-center justify-center gap-2">
              <h4 className="text-lg font-bold">{item.name}</h4>
            </div>
            {item.info && <p className="text-xs mt-1">{item.info}</p>}
          </div>
        ))}

        <button
          onClick={handleCustomNodeClick}
          className="w-full py-3 px-3 rounded-lg border-2 border-dashed border-gray-300 text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="h-5 w-5" />
        </button>

        {items.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {title === "Level 2" ? "Select a domain from Level 1" : "Select a sub-domain from Level 2"}
          </div>
        )}
      </div>
    </div>
  );
};
