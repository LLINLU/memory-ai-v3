
import { TagBadge } from "./TagBadge";

interface Tag {
  label: string;
  variant: "materials" | "engineering" | "aiml" | "healthcare" | "energy" | "sustainability" | "default" | "algorithms" | "realtime" | "predictive" | "robotics" | "blue" | "yellow";
}

interface SearchCardProps {
  title: string;
  paperCount: number;
  implementationCount: number;
  tags: Tag[];
  timeAgo: string;
}

export const SearchCard = ({
  title,
  paperCount,
  implementationCount,
  tags,
  timeAgo,
}: SearchCardProps) => {
  return (
    <div className="bg-white px-5 py-4 rounded-lg border border-gray-200">
      <h3 className="text-[18px] font-semibold mb-2">{title}</h3>
      <div className="text-[14px] text-gray-600 mb-2">
        {paperCount}件の論文 • {implementationCount}件の事例
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag, index) => (
          <TagBadge key={index} label={tag.label} variant={tag.variant} />
        ))}
      </div>
      
      <div className="text-sm text-gray-500 text-right">{timeAgo}</div>
    </div>
  );
};
