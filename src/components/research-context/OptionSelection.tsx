import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, MapPin, User, Clock } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface OptionSelectionProps {
  options: Option[];
  onSelect: (value: string, label: string) => void;
  selectedValue?: string;
  onCustomOption?: () => void;
  customOptionLabel?: string;
  iconType?: "user" | "map-pin" | "clock";
}

export const OptionSelection = ({
  options,
  onSelect,
  selectedValue,
  onCustomOption,
  customOptionLabel = "他の提案",
  iconType = "user"
}: OptionSelectionProps) => {
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);
  const [activeOption, setActiveOption] = useState<string | null>(null);

  const renderIcon = () => {
    if (iconType === "map-pin") {
      return (
        <MapPin className="w-5 h-5 text-blue-600" />
      );
    }
    
    if (iconType === "clock") {
      return (
        <Clock className="w-5 h-5 text-blue-600" />
      );
    }
    
    return (
      <User className="w-5 h-5 text-blue-600" />
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`flex items-center justify-start px-4 py-3 h-auto text-left rounded-md transition-colors duration-200
              ${selectedValue === option.value
                ? "bg-blue-50 border border-blue-300 text-blue-700"
                : hoveredOption === option.value
                  ? "bg-blue-100 text-blue-600"
                  : "bg-blue-50 text-blue-600"
              }
              ${activeOption === option.value ? "ring-2 ring-blue-300" : ""}
            `}
            onMouseEnter={() => setHoveredOption(option.value)}
            onMouseLeave={() => setHoveredOption(null)}
            onMouseDown={() => setActiveOption(option.value)}
            onMouseUp={() => setActiveOption(null)}
            onBlur={() => {
              setHoveredOption(null);
              setActiveOption(null);
            }}
            onClick={() => onSelect(option.value, option.label)}
          >
            <div className="text-blue-600 mr-2">
              {renderIcon()}
            </div>
            {option.label}
          </button>
        ))}
      </div>
      
      {onCustomOption && (
        <>
          <Button
            variant="outline"
            onClick={onCustomOption}
            className="flex items-center w-full justify-start px-4 py-3 h-auto text-left space-x-2 bg-purple-50 border-purple-100 text-purple-800 hover:bg-purple-100 hover:text-purple-900 mt-3"
          >
            <Sparkles className="h-4 w-4" />
            <span>{customOptionLabel}</span>
          </Button>
          <p className="text-sm text-gray-600 mt-2">合っていると思う選択肢を選んでも、自分の言葉で書いていただいても大丈夫です👍！</p>
        </>
      )}
    </div>
  );
};
