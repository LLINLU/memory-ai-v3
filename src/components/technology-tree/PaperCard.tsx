import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PaperCardProps {
  title: {
    japanese?: string;
    english: string;
  };
  authors: string;
  journal: string;
  tags: string[];
  abstract: string;
  date: string;
}

export const PaperCard = ({
  title,
  authors,
  journal,
  tags,
  abstract,
  date,
}: PaperCardProps) => {
  return (
    <li className="w-full bg-white p-6 rounded-lg border border-gray-200">
      <div className="space-y-3">
        <div>
          {title.japanese && (
            <h5 className="text-xl font-bold mb-2">{title.japanese}</h5>
          )}
          <h6 className="text-lg text-gray-700">{title.english}</h6>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600 truncate">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="truncate">{authors}</span>
              </TooltipTrigger>
              <TooltipContent>
                <p>{authors}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <span className="shrink-0">•</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="truncate">{journal}</span>
              </TooltipTrigger>
              <TooltipContent>
                <p>{journal}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex gap-2">
          {tags.map((tag, index) => (
            <span key={index} className="text-xs bg-[#E8F1FF] text-blue-600 px-3 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        <p className="text-sm text-gray-700 leading-relaxed">
          {abstract}
        </p>

        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-500">{date}</div>
          <div className="flex gap-2">
            <Button variant="outline" className="text-sm flex items-center gap-2">
              DOI <ExternalLink size={16} />
            </Button>
            <Button variant="outline" className="text-sm">Save</Button>
          </div>
        </div>
      </div>
    </li>
  );
};
