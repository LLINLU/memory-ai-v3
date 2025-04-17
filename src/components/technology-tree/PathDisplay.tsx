
import React from 'react';
import { ArrowRight } from "lucide-react";

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
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <div className="flex items-center flex-wrap gap-2">
        <span className="text-gray-700 font-medium">Selected path:</span>
        {selectedPath.level1 && (
          <>
            <span className="text-blue-500 font-medium">
              {level1Items.find(item => item.id === selectedPath.level1)?.name || selectedPath.level1}
            </span>
            {selectedPath.level2 && (
              <>
                <ArrowRight className="h-4 w-4 text-gray-500" />
                <span className="text-blue-500 font-medium">
                  {level2Items[selectedPath.level1]?.find(item => item.id === selectedPath.level2)?.name || selectedPath.level2}
                </span>
                {selectedPath.level3 && (
                  <>
                    <ArrowRight className="h-4 w-4 text-gray-500" />
                    <span className="text-blue-500 font-medium">
                      {level3Items[selectedPath.level2]?.find(item => item.id === selectedPath.level3)?.name || selectedPath.level3}
                    </span>
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};
