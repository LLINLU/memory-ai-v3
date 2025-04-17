
import React from 'react';
import { ArrowRight } from "lucide-react";

interface PathDisplayProps {
  selectedPath: {
    level1: string[];
    level2: string[];
    level3: string[];
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
      <div className="flex flex-wrap gap-4">
        {selectedPath.level1.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-gray-700 font-medium">Level 1:</span>
            {selectedPath.level1.map((id, index) => (
              <React.Fragment key={id}>
                <span className="text-blue-500 font-medium">
                  {level1Items.find(item => item.id === id)?.name || id}
                </span>
                {index < selectedPath.level1.length - 1 && (
                  <span className="text-gray-400">,</span>
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {selectedPath.level2.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <ArrowRight className="h-4 w-4 text-gray-500" />
            <span className="text-gray-700 font-medium">Level 2:</span>
            {selectedPath.level2.map((id, index) => (
              <React.Fragment key={id}>
                <span className="text-blue-500 font-medium">
                  {Object.values(level2Items)
                    .flat()
                    .find(item => item.id === id)?.name || id}
                </span>
                {index < selectedPath.level2.length - 1 && (
                  <span className="text-gray-400">,</span>
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {selectedPath.level3.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <ArrowRight className="h-4 w-4 text-gray-500" />
            <span className="text-gray-700 font-medium">Level 3:</span>
            {selectedPath.level3.map((id, index) => (
              <React.Fragment key={id}>
                <span className="text-blue-500 font-medium">
                  {Object.values(level3Items)
                    .flat()
                    .find(item => item.id === id)?.name || id}
                </span>
                {index < selectedPath.level3.length - 1 && (
                  <span className="text-gray-400">,</span>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
