
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface PressRelease {
  title: string;
  url: string;
}

interface ImplementationCardProps {
  title: string;
  description: string;
  releases: number;
  badgeColor: string;
  badgeTextColor: string;
  pressReleases?: PressRelease[];
}

export const ImplementationCard = ({ 
  title, 
  description, 
  releases, 
  badgeColor, 
  badgeTextColor,
  pressReleases = []
}: ImplementationCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasMoreReleases = pressReleases.length > 3;
  const displayedReleases = isExpanded ? pressReleases : pressReleases.slice(0, 3);
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Implementation Saved",
      description: `${title} has been saved to your library`
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold">{title}</h4>
        <Badge 
          className={cn(`ml-2 ${badgeColor} ${badgeTextColor} border-0 font-normal`)}
        >
          {releases} releases
        </Badge>
      </div>
      <p className="text-gray-600 text-sm font-normal mb-3">
        {description}
      </p>
      {pressReleases.length > 0 && (
        <div className="space-y-2 mb-4">
          <div className="text-sm font-medium text-gray-700">Press Releases:</div>
          <div className="pl-4 space-y-1.5">
            {displayedReleases.map((release, index) => (
              <a
                key={index}
                href={release.url}
                className="block text-sm text-blue-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {release.title}
              </a>
            ))}
          </div>
          {hasMoreReleases && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 mt-1"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Show less
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Show {pressReleases.length - 3} more
                </>
              )}
            </button>
          )}
        </div>
      )}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleSave}
        className="w-full mt-2 text-gray-500 hover:text-gray-700"
      >
        Save
      </Button>
    </div>
  );
};

