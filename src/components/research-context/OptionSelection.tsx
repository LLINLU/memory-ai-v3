
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, MapPin, User, Clock } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface OptionSelectionProps {
  options: Option[];
  selectedValue?: string;
  onSelect?: (value: string, label: string) => void;
  onCustomOption?: () => void;
  customOptionLabel?: string;
  iconType?: "user" | "map-pin" | "clock";
}

export const OptionSelection = ({
  options,
  selectedValue,
  onSelect,
  onCustomOption,
  customOptionLabel = "他の提案",
  iconType = "user"
}: OptionSelectionProps) => {
  const [activeButton, setActiveButton] = useState<string | undefined>(selectedValue);

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

  // Handle option click for visual feedback only without triggering any events
  const handleOptionClick = (event: React.MouseEvent) => {
    // Prevent default behavior
    event.preventDefault();
    
    // Stop event propagation
    event.stopPropagation();
    
    // Do nothing else - don't change active button state
    // and don't call onSelect
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3">
        {options.map((option) => (
          <Button
            key={option.value}
            variant="outline"
            className={`justify-start px-4 py-3 h-auto text-left ${
              activeButton === option.value
                ? "bg-blue-50 border-blue-300 text-blue-700"
                : "bg-blue-50 hover:bg-blue-100 text-blue-600"
            }`}
            onClick={handleOptionClick}
          >
            <div className="text-blue-600 mr-2">
              {renderIcon()}
            </div>
            {option.label}
          </Button>
        ))}
      </div>
      
      {onCustomOption && (
        <>
          <Button
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Do nothing - prevent the onCustomOption from being called
            }}
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
