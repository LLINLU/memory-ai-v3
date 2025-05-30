
import React from 'react';
import { Button } from "@/components/ui/button";

interface WelcomeMessageProps {
  inputValue: string;
  onButtonClick: (action: string) => void;
}

export const WelcomeMessage = ({ inputValue, onButtonClick }: WelcomeMessageProps) => {
  return (
    <div className="text-center py-8">
      <h3 className="text-lg font-medium text-gray-800 mb-4">チャットボット</h3>
      <p className="text-gray-600 mb-6">メッセージを入力して開始してください</p>
    </div>
  );
};
