
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface SelectedNodeInfoProps {
  title?: string;
  description?: string;
}

export const SelectedNodeInfo: React.FC<SelectedNodeInfoProps> = ({ title, description }) => {
  if (!title) {
    return (
      <Card className="mt-2 mb-4 bg-blue-50 border-none">
        <CardContent className="p-6">
          <p className="text-sm text-gray-500">Select a node to view its details</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="mt-2 mb-4 bg-blue-50 border-none">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
        {description && (
          <p className="text-gray-600 leading-relaxed">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};
