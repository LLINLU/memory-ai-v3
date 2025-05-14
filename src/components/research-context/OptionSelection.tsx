
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface OptionSelectionProps {
  options: Option[];
  onSelect: (value: string) => void;
  selectedValue?: string;
  onCustomOption?: () => void;
  customOptionLabel?: string;
}

export const OptionSelection = ({
  options,
  onSelect,
  selectedValue,
  onCustomOption,
  customOptionLabel = "他の提案"
}: OptionSelectionProps) => {
  return (
    <div className="space-y-3">
      <RadioGroup
        value={selectedValue}
        onValueChange={onSelect}
        className="flex flex-col gap-3"
      >
        {options.map((option) => (
          <div
            key={option.value}
            className="flex items-center space-x-2 rounded-md bg-blue-50 px-4 py-3 cursor-pointer"
            onClick={() => onSelect(option.value)}
          >
            <RadioGroupItem value={option.value} id={option.value} />
            <Label
              htmlFor={option.value}
              className="cursor-pointer flex items-center w-full text-blue-700 font-medium"
            >
              <div className="text-blue-600 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M18 21a8 8 0 0 0-16 0"></path>
                  <circle cx="10" cy="8" r="5"></circle>
                  <path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3"></path>
                </svg>
              </div>
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
      
      {onCustomOption && (
        <Button
          variant="outline"
          onClick={onCustomOption}
          className="flex items-center space-x-2 bg-purple-50 border-purple-100 text-purple-800 hover:bg-purple-100 hover:text-purple-900 mt-3 w-60"
        >
          <Sparkles className="h-4 w-4" />
          <span>{customOptionLabel}</span>
        </Button>
      )}
    </div>
  );
};
