
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardContent } from "@/components/ui/card";
import { TagBadge } from "@/components/TagBadge";

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
  citations?: number;
  doi: string;
  score: number;
}

// Map tag names to appropriate variants
const getTagVariant = (tag: string) => {
  const tagLower = tag.toLowerCase();

  if (
    tagLower.includes("material") ||
    tagLower.includes("nano") ||
    tagLower.includes("polymer")
  )
    return "materials";
  if (
    tagLower.includes("engineer") ||
    tagLower.includes("design") ||
    tagLower.includes("system")
  )
    return "engineering";
  if (
    tagLower.includes("ai") ||
    tagLower.includes("machine") ||
    tagLower.includes("learning") ||
    tagLower.includes("data")
  )
    return "aiml";
  if (
    tagLower.includes("health") ||
    tagLower.includes("medical") ||
    tagLower.includes("bio")
  )
    return "healthcare";
  if (
    tagLower.includes("energy") ||
    tagLower.includes("power") ||
    tagLower.includes("battery")
  )
    return "energy";
  if (
    tagLower.includes("sustain") ||
    tagLower.includes("environment") ||
    tagLower.includes("eco")
  )
    return "sustainability";
  if (
    tagLower.includes("algorithm") ||
    tagLower.includes("compute") ||
    tagLower.includes("process")
  )
    return "algorithms";
  if (
    tagLower.includes("real-time") ||
    tagLower.includes("realtime") ||
    tagLower.includes("control")
  )
    return "realtime";
  if (
    tagLower.includes("predict") ||
    tagLower.includes("forecast") ||
    tagLower.includes("model")
  )
    return "predictive";
  if (
    tagLower.includes("robot") ||
    tagLower.includes("automation") ||
    tagLower.includes("mechatronic")
  )
    return "robotics";

  // Alternate between blue and yellow for default tags
  return Math.random() > 0.5 ? "blue" : "yellow";
};

export const PaperCard = ({
  title,
  authors,
  journal,
  tags,
  abstract,
  date,
  citations,
  doi,
  score,
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
        <div className="flex gap-2 flex-wrap">
          {tags.map((tag, index) => (
            <TagBadge key={index} label={tag} variant={getTagVariant(tag)} />
          ))}
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">{abstract}</p>
        
        {/* Information Cards - Horizontal Layout */}
        <div className="flex gap-2 flex-wrap">
          {citations !== undefined && (
            <Card className="bg-gray-50 border-gray-200">
              <CardContent className="p-2">
                <div className="text-xs text-gray-500 mb-1">Citations</div>
                <div className="text-sm font-semibold text-gray-800">{citations}</div>
              </CardContent>
            </Card>
          )}
          
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="p-2">
              <div className="text-xs text-gray-500 mb-1">Published</div>
              <div className="text-sm font-semibold text-gray-800">{date}</div>
            </CardContent>
          </Card>
          
          {score !== 0 && (
            <Card className="bg-gray-50 border-gray-200">
              <CardContent className="p-2">
                <div className="text-xs text-gray-500 mb-1">Relevance</div>
                <div className="text-sm font-semibold text-gray-800">{score.toFixed(4)}</div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex gap-2 justify-end">
          <a
            href={`https://doi.org/${doi}`}
            target="_blank"
            rel="noopener noreferrer"
            className="notranslate"
          >
            <Button
              variant="outline"
              className="text-sm flex items-center gap-2"
            >
              DOI <ExternalLink size={16} />
            </Button>
          </a>
          <Button variant="outline" className="text-sm">
            保存
          </Button>
        </div>
      </div>
    </li>
  );
};
