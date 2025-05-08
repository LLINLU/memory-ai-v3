
import React from "react";
import { ChartContainer } from "@/components/ui/chart";
import { Treemap, Tooltip } from "recharts";

interface ResearchArea {
  name: string;
  size: number;
  fill: string;
  papers: number;
}

interface TreemapVisualizationProps {
  researchAreasData: ResearchArea[];
}

const CustomTreemapContent = (props: any) => {
  const { x, y, width, height, name, fill, size } = props;
  
  // Don't render if dimensions are too small
  if (width < 30 || height < 30) return null;
  
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        className="stroke-white stroke-opacity-50"
        strokeWidth={2}
      />
      <text
        x={x + width / 2}
        y={y + height / 2 - 10}
        textAnchor="middle"
        fill="white"
        fontSize={width < 100 ? 12 : 16}
        fontWeight="medium"
      >
        {name}
      </text>
      <text
        x={x + width / 2}
        y={y + height / 2 + 10}
        textAnchor="middle"
        fill="white"
        fontSize={width < 100 ? 14 : 18}
        fontWeight="bold"
      >
        {size}%
      </text>
    </g>
  );
};

// Custom tooltip for the treemap
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-2 border border-gray-200 shadow-md rounded-md">
        <p className="font-medium">{data.name}</p>
        <p className="text-gray-600">{data.papers} 論文</p>
      </div>
    );
  }
  return null;
};

export const TreemapVisualization: React.FC<TreemapVisualizationProps> = ({ 
  researchAreasData 
}) => {
  return (
    <div className="aspect-video mb-4">
      <ChartContainer 
        className="w-full h-[270px]"
        config={{
          "retinal": { color: "#4D82F3" },
          "wavefront": { color: "#4ADE80" },
          "clinical": { color: "#A855F7" },
          "other": { color: "#F59E0B" }
        }}
      >
        <Treemap
          data={researchAreasData}
          dataKey="size"
          nameKey="name"
          fill="#8884d8"
          content={<CustomTreemapContent />}
        >
          <Tooltip content={<CustomTooltip />} />
        </Treemap>
      </ChartContainer>
    </div>
  );
};
