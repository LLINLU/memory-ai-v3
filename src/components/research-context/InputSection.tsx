
import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp } from "lucide-react";

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
  showSkip = false, // We'll keep this prop for backward compatibility
}) => {
  return (
    <div className="mt-2">
      <div className="mb-2">
        <Button 
          variant="outline"
          size="sm"
          onClick={onSkip}
        >
          スキップ
        </Button>
      </div>
      <div className="relative">
        <Textarea
          placeholder={placeholder}
          value={inputValue}
          onChange={onInputChange}
          className="w-full resize-none p-3 pr-16 border border-[#ebf0f7] rounded-xl text-base"
          rows={3}
          autoResize
        />
        <Button 
          onClick={onSubmit}
          size="icon"
          className="absolute right-2 bottom-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-0 w-10 h-10 flex items-center justify-center"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
