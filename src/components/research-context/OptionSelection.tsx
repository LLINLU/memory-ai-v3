
import React from "react";
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
          <div
            key={option.value}
            className={`flex items-center justify-start px-4 py-3 h-auto text-left rounded-md ${
              selectedValue === option.value
                ? "bg-blue-50 border-blue-300 text-blue-700"
                : "bg-blue-50 text-blue-600"
            }`}
            aria-selected={selectedValue === option.value}
          >
            <div className="text-blue-600 mr-2">
              {renderIcon()}
            </div>
            {option.label}
          </div>
        ))}
      </div>
      
      {onCustomOption && (
        <>
          <div
            className="flex items-center w-full justify-start px-4 py-3 h-auto text-left space-x-2 bg-purple-50 border-purple-100 text-purple-800 rounded-md mt-3"
          >
            <Sparkles className="h-4 w-4" />
            <span>{customOptionLabel}</span>
          </div>
          <p className="text-sm text-gray-600 mt-2">合っていると思う選択肢を選んでも、自分の言葉で書いていただいても大丈夫です👍！</p>
        </>
      )}
    </div>
  );
};
