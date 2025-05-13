
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

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
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-gray-800" style={{ fontSize: "16px", fontWeight: 600 }}>
          研究分野の階層表示
        </h3>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1 text-blue-600 border-blue-200 hover:bg-blue-50"
        >
          <FileText className="h-4 w-4" />
          ガイダンス
        </Button>
      </div>
      <p className="text-gray-600" style={{ fontSize: '14px' }}>
        {level1Name && level1Name}
        {level2Name && ` → ${level2Name}`}
        {level3Name && ` → ${level3Name}`}
      </p>
    </div>
  );
};
