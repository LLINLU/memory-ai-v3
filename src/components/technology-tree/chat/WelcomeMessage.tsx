
import React from 'react';
import { Button } from "@/components/ui/button";

interface WelcomeMessageProps {
  inputValue: string;
  onButtonClick: (action: string) => void;
}

export const WelcomeMessage = ({ inputValue, onButtonClick }: WelcomeMessageProps) => {
  const userInput = inputValue || 'query';
  
  const handleCustomButtonClick = (action: string) => {
    if (onButtonClick) {
      onButtonClick(action);
    }
  };
  
  return (
    <div className="mb-4 bg-blue-50 rounded-xl p-4">
      <p className="text-[0.875rem] mb-3">「{userInput}」を検索しました。何かお手伝いできることはありますか？</p>
      <div className="flex flex-col gap-2">
        <Button
          onClick={() => handleCustomButtonClick('generate-scenario')}
          className="bg-blue-100 hover:bg-blue-200 text-blue-800 group"
          size="sm"
        >
          <span className="group-hover:text-[#1867cc]">詳細な研究シナリオを生成</span>
        </Button>
        <Button
          onClick={() => handleCustomButtonClick('summarize-trends')}
          className="bg-blue-100 hover:bg-blue-200 text-blue-800 group"
          size="sm"
        >
          <span className="group-hover:text-[#1867cc]">最新の研究動向を要約してください</span>
        </Button>
        <Button
          onClick={() => handleCustomButtonClick('generate-node')}
          className="bg-blue-100 hover:bg-blue-200 text-blue-800 group"
          size="sm"
        >
          <span className="group-hover:text-[#1867cc]">Treemap を調整する</span>
        </Button>
      </div>
    </div>
  );
};
