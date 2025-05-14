import React from "react";
import { Users, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OptionSelectionProps {
  options: Array<{ value: string; label: string }>;
  onSelect: (value: string, label: string) => void;
  selectedValue: string;
  onCustomOption: () => void;
  customOptionLabel: string;
  iconType?: "user" | "map-pin" | "clock";
}

export const OptionSelection: React.FC<OptionSelectionProps> = ({
  options,
  onSelect,
  selectedValue,
  onCustomOption,
  customOptionLabel,
  iconType
}) => {
  // Get the appropriate icon component based on iconType
  const getIcon = () => {
    switch (iconType) {
      case "user":
        return <Users size={16} className="mr-1.5" />;
      case "map-pin":
        return <MapPin size={16} className="mr-1.5" />;
      case "clock":
        return <Clock size={16} className="mr-1.5" />;
      default:
        return null;
    }
  };

  return (
    <div>
      {options.map(option => (
        <Button
          key={option.value}
          variant={selectedValue === option.value ? "default" : "outline"}
          onClick={() => onSelect(option.value, option.label)}
          className="w-full justify-start rounded-md text-sm font-medium data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
        >
          {getIcon()}
          {option.label}
        </Button>
      ))}
      <Button
        variant="secondary"
        onClick={onCustomOption}
        className="w-full justify-start rounded-md text-sm font-medium"
      >
        {customOptionLabel}
      </Button>
    </div>
  );
};
