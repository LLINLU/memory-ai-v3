
import { cn } from "@/lib/utils";

interface TagBadgeProps {
  label: string;
  variant?: "materials" | "engineering" | "aiml" | "healthcare" | "energy" | "sustainability" | "default";
  className?: string;
}

const variantStyles = {
  materials: "bg-blue-50 text-blue-700",
  engineering: "bg-purple-50 text-purple-700",
  aiml: "bg-yellow-50 text-yellow-700",
  healthcare: "bg-green-50 text-green-700",
  energy: "bg-orange-50 text-orange-700",
  sustainability: "bg-teal-50 text-teal-700",
  default: "bg-gray-100 text-gray-700",
};

export const TagBadge = ({ label, variant = "default", className }: TagBadgeProps) => {
  return (
    <span
      className={cn(
        "px-3 py-1 rounded-full text-sm font-medium",
        variantStyles[variant],
        className
      )}
    >
      {label}
    </span>
  );
};
