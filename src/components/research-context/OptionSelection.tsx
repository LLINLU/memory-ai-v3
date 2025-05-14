
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface OptionSelectionProps {
  options: string[];
  selectedOption: string;
  onOptionChange: (value: string) => void;
  className?: string;
}

export const OptionSelection = ({
  options,
  selectedOption,
  onOptionChange,
  className
}: OptionSelectionProps) => {
  return (
    <RadioGroup
      value={selectedOption}
      onValueChange={onOptionChange}
      className={cn("flex flex-col space-y-2 mt-3", className)}
    >
      {options.map((option, index) => (
        <div key={index} className="flex items-center space-x-2">
          <RadioGroupItem value={option} id={`option-${index}`} />
          <Label htmlFor={`option-${index}`} className="text-base font-normal cursor-pointer">
            {option}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
};
