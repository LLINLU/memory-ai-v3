
import React from 'react';
import { ChevronRight } from 'lucide-react';

interface PathDisplayProps {
  selectedPath: {
    level1: string;
    level2: string;
    level3: string;
    level4?: string;
  };
  level1Items: any[];
  level2Items: Record<string, any[]>;
  level3Items: Record<string, any[]>;
  onAddLevel4?: () => void;
}

export const PathDisplay = ({ 
  selectedPath, 
  level1Items, 
  level2Items, 
  level3Items,
  onAddLevel4 
}: PathDisplayProps) => {
  // Extract only the Japanese part of the title (before the English part in parentheses)
  const getJapaneseTitle = (name: string) => {
    // Check if the name contains both Japanese and English parts
    const match = name.match(/^(.+?)\s*\(\([^)]+\)\)$/);
    if (match) {
      return match[1].trim();
    }
    // If no English part found, return the original name
    return name;
  };

  const getNodeName = (level: string, nodeId: string) => {
    let items: any[] = [];
    
    if (level === 'level1') {
      items = level1Items;
    } else if (level === 'level2') {
      items = level2Items[selectedPath.level1] || [];
    } else if (level === 'level3') {
      items = level3Items[selectedPath.level2] || [];
    }
    
    const node = items.find(item => item.id === nodeId);
    return node ? getJapaneseTitle(node.name) : nodeId;
  };

  const pathItems = [];
  
  if (selectedPath.level1) {
    pathItems.push({
      name: getNodeName('level1', selectedPath.level1),
      level: 'level1'
    });
  }
  
  if (selectedPath.level2) {
    pathItems.push({
      name: getNodeName('level2', selectedPath.level2),
      level: 'level2'
    });
  }
  
  if (selectedPath.level3) {
    pathItems.push({
      name: getNodeName('level3', selectedPath.level3),
      level: 'level3'
    });
  }

  if (pathItems.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-2 text-sm">
        <span className="text-gray-500 font-medium">選択されたパス:</span>
        {pathItems.map((item, index) => (
          <React.Fragment key={`${item.level}-${index}`}>
            {index > 0 && <ChevronRight className="h-4 w-4 text-gray-400" />}
            <span className="text-blue-600 font-medium">{item.name}</span>
          </React.Fragment>
        ))}
        {onAddLevel4 && selectedPath.level3 && (
          <>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <button
              onClick={onAddLevel4}
              className="text-blue-600 hover:text-blue-700 underline text-sm"
            >
              レベル4を追加
            </button>
          </>
        )}
      </div>
    </div>
  );
};
