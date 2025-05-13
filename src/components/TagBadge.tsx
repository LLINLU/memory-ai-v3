
import { cn } from "@/lib/utils";

interface TagBadgeProps {
  label: string;
  variant?: "materials" | "engineering" | "aiml" | "healthcare" | "energy" | "sustainability" | "default" | "algorithms" | "realtime" | "predictive" | "robotics" | "blue" | "yellow";
  className?: string;
}

const variantStyles = {
  // Original variants
  materials: "bg-blue-50 text-blue-700",
  engineering: "bg-purple-50 text-purple-700",
  aiml: "bg-yellow-50 text-yellow-700",
  healthcare: "bg-green-50 text-green-700",
  energy: "bg-orange-50 text-orange-700",
  sustainability: "bg-teal-50 text-teal-700",
  
  // New variants matching the image examples
  algorithms: "bg-[#F5F0FF] text-purple-600", // Purple theme
  realtime: "bg-[#EEFBEF] text-green-600",    // Green theme
  predictive: "bg-[#FFF5E8] text-orange-600", // Orange theme
  robotics: "bg-[#FFE8F5] text-pink-600",     // Pink theme for additional variety
  
  // Updated default to blue and added yellow option
  default: "bg-[#D3E4FD] text-[#0EA5E9]", // Soft blue background with ocean blue text
  blue: "bg-[#E8F1FF] text-blue-600",     // Light blue background with blue text
  yellow: "bg-[#FEF7CD] text-amber-600",  // Soft yellow background with amber text
};

export const TagBadge = ({ label, variant = "default", className }: TagBadgeProps) => {
  return (
    <span
      className={cn(
        "px-3 py-1 rounded-full text-[0.75rem] font-normal", // Updated font size and weight
        variantStyles[variant],
        className
      )}
    >
      {label}
    </span>
  );
};
