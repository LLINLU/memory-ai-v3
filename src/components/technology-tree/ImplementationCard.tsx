
import React from "react";
import { Badge } from "@/components/ui/badge";

interface ImplementationCardProps {
  title: string;
  description: string;
  releases: number;
  badgeColor: string;
  badgeTextColor: string;
}

export const ImplementationCard = ({ 
  title, 
  description, 
  releases, 
  badgeColor, 
  badgeTextColor 
}: ImplementationCardProps) => {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold">{title}</h4>
        <Badge 
          className={`ml-2 ${badgeColor} ${badgeTextColor} border-0 hover:${badgeColor}`}
        >
          {releases} releases
        </Badge>
      </div>
      <p className="text-gray-600 text-sm font-normal">
        {description}
      </p>
    </div>
  );
};
