
import React, { useState } from "react";
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
  // The default selected item is "Retinal Imaging"
  const [selectedAreaName, setSelectedAreaName] = useState<string>("Retinal Imaging");

  // Reorder data to ensure selected area appears first
  const reorderedData = React.useMemo(() => {
    // Clone the array to avoid mutating props
    const sortedData = [...researchAreasData];
    
    // Find selected area index
    const selectedIndex = sortedData.findIndex(
      area => area.name === selectedAreaName
    );

    // If found, move it to the front
    if (selectedIndex > 0) {
      const selectedItem = sortedData.splice(selectedIndex, 1)[0];
      sortedData.unshift(selectedItem);
    }

    return sortedData;
  }, [researchAreasData, selectedAreaName]);

  // Handle click on treemap area
  const handleTreemapClick = (data: any) => {
    if (data && data.name) {
      setSelectedAreaName(data.name);
    }
  };

  return (
    <div className="mb-4">
      <ChartContainer 
        className="w-full h-[270px]"
        config={{
          "retinal": { color: "#4C7CFC" },
          "wavefront": { color: "#8D84C6" },
          "clinical": { color: "#A94CF7" },
          "other": { color: "#4A3D78" }
        }}
      >
        <Treemap
          data={reorderedData}
          dataKey="size"
          nameKey="name"
          fill="#8884d8"
          content={<CustomTreemapContent />}
          onClick={handleTreemapClick}
        >
          <Tooltip content={<CustomTooltip />} />
        </Treemap>
      </ChartContainer>
    </div>
  );
};
