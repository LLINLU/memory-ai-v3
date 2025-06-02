
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";
import { getGranularityPreview, getTreemapImpact } from "./utils/researchUtils";

interface TreemapGranularityCardProps {
  researchAnswers: Record<string, string>;
}

export const TreemapGranularityCard = ({ researchAnswers }: TreemapGranularityCardProps) => {
  const granularityPreview = getGranularityPreview(researchAnswers);
  const treemapImpact = getTreemapImpact(researchAnswers);

  if (Object.keys(researchAnswers).length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center">
          <Search className="h-4 w-4 mr-2 text-purple-600" />
          ツリーマップ粒度予測
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-center p-2 bg-purple-50 rounded">
              <div className="text-xs text-gray-600">粒度</div>
              <div className="text-sm font-medium">{granularityPreview.granularity}</div>
            </div>
            <div className="text-center p-2 bg-purple-50 rounded">
              <div className="text-xs text-gray-600">深度</div>
              <div className="text-sm font-medium">{granularityPreview.depth}</div>
            </div>
          </div>
          
          {treemapImpact.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs text-gray-600 mb-2">予想される影響:</p>
              {treemapImpact.slice(0, 3).map((impact, index) => (
                <div key={index} className="text-xs text-gray-700 flex items-center">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></div>
                  {impact}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
