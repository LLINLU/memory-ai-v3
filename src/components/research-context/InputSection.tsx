
import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight } from "lucide-react";

interface InputSectionProps {
  inputValue: string;
  placeholder: string;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  onSkip?: () => void;
  showSkip?: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({
  inputValue,
  placeholder,
  onInputChange,
  onSubmit,
  onSkip,
  showSkip = false,
}) => {
  return (
    <div className="sticky bottom-0 bg-white p-6 border-t border-gray-100 shadow-md">
      {showSkip && (
        <div className="mb-4">
          <Button 
            variant="outline"
            onClick={onSkip}
          >
            Skip
          </Button>
        </div>
      )}
      <div className="relative">
        <Textarea
          placeholder={placeholder}
          value={inputValue}
          onChange={onInputChange}
          className="w-full resize-none p-4 pr-16 border rounded-2xl text-base"
          rows={3}
        />
        <Button 
          onClick={onSubmit}
          className="absolute right-3 bottom-3 bg-blue-600 hover:bg-blue-700 rounded-xl"
        >
          <span>Next</span>
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
