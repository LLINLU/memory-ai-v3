
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface TreeCardProps {
  title: string;
  timeAgo: string;
  treeId: string;
}

export const TreeCard: React.FC<TreeCardProps> = ({ title, timeAgo, treeId }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/technology-tree?treeId=${treeId}`);
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow duration-200 border border-gray-200"
      onClick={handleCardClick}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-900 line-clamp-2">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-xs text-gray-500">{timeAgo}</p>
      </CardContent>
    </Card>
  );
};
