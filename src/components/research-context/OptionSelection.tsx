
import React, { useState } from "react";
import { Sparkles, MapPin, User, Clock } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface OptionSelectionProps {
  options: Option[];
  selectedValue?: string;
  customOptionLabel?: string;
  iconType?: "user" | "map-pin" | "clock";
}

export const OptionSelection = ({
  options,
  selectedValue: initialSelectedValue,
  customOptionLabel = "他の提案",
  iconType = "user"
}: OptionSelectionProps) => {
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);
  const [selectedValue, setSelectedValue] = useState<string | undefined>(initialSelectedValue);

  const renderIcon = () => {
    if (iconType === "map-pin") {
      return <MapPin className="w-5 h-5 text-blue-600" />;
    }
    
    if (iconType === "clock") {
      return <Clock className="w-5 h-5 text-blue-600" />;
    }
    
    return <User className="w-5 h-5 text-blue-600" />;
  };

  const handleOptionClick = (value: string) => {
    // Only visual feedback, no actual action
    setSelectedValue(value);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3">
        {options.map((option) => (
          <div
            key={option.value}
            className={`flex items-center justify-start px-4 py-3 h-auto text-left rounded-md cursor-pointer transition-colors ${
              selectedValue === option.value
                ? "bg-blue-50 border-blue-300 border text-blue-700"
                : hoveredOption === option.value
                ? "bg-blue-50/70 text-blue-600"
                : "bg-blue-50 text-blue-600"
            }`}
            onMouseEnter={() => setHoveredOption(option.value)}
            onMouseLeave={() => setHoveredOption(null)}
            onClick={() => handleOptionClick(option.value)}
          >
            <div className="text-blue-600 mr-2">{renderIcon()}</div>
            {option.label}
          </div>
        ))}
      </div>
      
      <div
        className="flex items-center w-full justify-start px-4 py-3 h-auto text-left space-x-2 bg-purple-50 border-purple-100 text-purple-800 rounded-md mt-3 cursor-pointer hover:bg-purple-100 transition-colors"
        onClick={() => console.log("Custom option clicked (no action)")}
      >
        <Sparkles className="h-4 w-4" />
        <span>{customOptionLabel}</span>
      </div>
      <p className="text-sm text-gray-600 mt-2">合っていると思う選択肢を選んでも、自分の言葉で書いていただいても大丈夫です👍！</p>
    </div>
  );
};
