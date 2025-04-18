
import { TagBadge } from "./TagBadge";

interface Tag {
  label: string;
  variant: "materials" | "engineering" | "aiml" | "healthcare" | "energy" | "sustainability" | "default";
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
    <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <div className="text-gray-600 mb-4">
        {paperCount} papers • {implementationCount} implementations
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
