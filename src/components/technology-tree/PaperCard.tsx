
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { TagBadge } from "../TagBadge";

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
    <li className="w-full bg-white p-6 rounded-lg border border-gray-200 mb-4">
      {title.japanese && (
        <h3 className="text-lg font-bold mb-1">{title.japanese}</h3>
      )}
      <h4 className="text-base text-gray-700 mb-2">
        {title.english && `(${title.english})`}
      </h4>
      
      <div className="text-gray-600 mb-3">
        {authors} • {journal} • {date}
      </div>
      
      <div className="flex flex-wrap gap-2 mb-3">
        {tags.map((tag, index) => (
          <span key={index} className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
            {tag}
          </span>
        ))}
      </div>
      
      <p className="text-sm text-gray-600 mb-4">
        {abstract}
      </p>
      
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="text-sm flex items-center gap-2 border-gray-300"
        >
          DOI <ExternalLink size={16} />
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-sm border-gray-300"
        >
          Save
        </Button>
      </div>
    </li>
  );
};
