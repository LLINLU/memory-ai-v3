
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
    <div className="mt-2">
      {showSkip && (
        <div className="mb-2">
          <Button 
            variant="outline"
            size="sm"
            onClick={onSkip}
          >
            スキップ
          </Button>
        </div>
      )}
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
          size="sm"
          className="absolute right-2 bottom-2 bg-black hover:bg-gray-800 rounded-lg"
        >
          <span>次へ</span>
          <ArrowRight className="ml-1 h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};
