
import React from 'react';

interface PathDisplayProps {
  selectedPath: {
    level1: string;
    level2: string;
    level3: string;
  };
  level1Items: any[];
  level2Items: Record<string, any[]>;
  level3Items: Record<string, any[]>;
}

export const PathDisplay = ({
  selectedPath,
  level1Items,
  level2Items,
  level3Items
}: PathDisplayProps) => {
  // Find the selected items by ID to display their names
  const findItemName = (itemId: string, items: any[]) => {
    const item = items.find(item => item.id === itemId);
    return item ? item.name : '';
  };

  const level1Name = findItemName(selectedPath.level1, level1Items);
  
  const level2Name = selectedPath.level2 && selectedPath.level1
    ? findItemName(selectedPath.level2, level2Items[selectedPath.level1] || [])
    : '';
  
  const level3Name = selectedPath.level3 && selectedPath.level2
    ? findItemName(selectedPath.level3, level3Items[selectedPath.level2] || [])
    : '';

  return (
    <div className="mb-6" style={{ paddingTop: '0rem' }}>
      <h3 className="text-gray-800 font-medium mb-1" style={{ fontSize: "16px", fontWeight: 600 }}>
        研究分野の階層表示
      </h3>
      <p className="text-gray-600" style={{ fontSize: '14px' }}>
        {level1Name && level1Name}
        {level2Name && ` → ${level2Name}`}
        {level3Name && ` → ${level3Name}`}
      </p>
    </div>
  );
};
