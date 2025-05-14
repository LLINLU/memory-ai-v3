
import React from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, MapPin, User } from "lucide-react";

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
  iconType?: "user" | "map-pin";
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
    
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M18 21a8 8 0 0 0-16 0"></path>
        <circle cx="10" cy="8" r="5"></circle>
        <path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3"></path>
      </svg>
    );
  };

  const handleOptionClick = (option: Option) => {
    // Explicitly call onSelect with the option value and label
    onSelect(option.value, option.label);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3">
        {options.map((option) => (
          <Button
            key={option.value}
            variant="outline"
            className={`justify-start px-4 py-3 h-auto text-left ${
              selectedValue === option.value
                ? "bg-blue-50 border-blue-300 text-blue-700"
                : "bg-blue-50 hover:bg-blue-100 text-blue-600"
            }`}
            onClick={() => handleOptionClick(option)}
            type="button"
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
            onClick={onCustomOption}
            className="flex items-center w-full justify-start px-4 py-3 h-auto text-left space-x-2 bg-purple-50 border-purple-100 text-purple-800 hover:bg-purple-100 hover:text-purple-900 mt-3"
            type="button"
          >
            <Sparkles className="h-4 w-4" />
            <span>{customOptionLabel}</span>
          </Button>
          <p className="text-sm text-gray-600 mt-2">自分の答えで書いていただいても、もちろんOKです👍！</p>
        </>
      )}
    </div>
  );
};
