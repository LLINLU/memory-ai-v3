
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send, ArrowRight } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { OptionSelection } from "./OptionSelection";

interface InputSectionProps {
  inputValue: string;
  placeholder?: string;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  onSkip?: () => void;
  showSkip?: boolean;
  options?: string[];
  currentStepIndex?: number;
}

export const InputSection = ({
  inputValue,
  placeholder,
  onInputChange,
  onSubmit,
  onSkip,
  showSkip = false,
  options,
  currentStepIndex
}: InputSectionProps) => {
  const [selectedOption, setSelectedOption] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };
  
  // For handling radio option selection
  const handleOptionChange = (value: string) => {
    setSelectedOption(value);
    
    // Set the selected option as the input value
    const event = {
      target: { value } 
    } as React.ChangeEvent<HTMLTextAreaElement>;
    
    onInputChange(event);
  };
  
  const showOptions = options && options.length > 0 && currentStepIndex === 1;
  
  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      {showOptions ? (
        <OptionSelection 
          options={options}
          selectedOption={selectedOption}
          onOptionChange={handleOptionChange}
        />
      ) : (
        <Textarea
          value={inputValue}
          onChange={onInputChange}
          placeholder={placeholder}
          className="min-h-[80px] resize-none text-base"
        />
      )}

      <div className="flex justify-between mt-3">
        {showSkip && (
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={onSkip}
            className="text-gray-600"
          >
            スキップ
          </Button>
        )}
        <div className="ml-auto flex space-x-2">
          <Button 
            type="submit" 
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            disabled={showOptions && !selectedOption}
          >
            {showOptions ? (
              <>
                次へ <ArrowRight className="h-4 w-4 ml-1" />
              </>
            ) : (
              <>
                送信 <Send className="h-4 w-4 ml-1" />
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};
