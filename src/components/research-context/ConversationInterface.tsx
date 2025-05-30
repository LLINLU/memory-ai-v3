
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RefinementChat } from "./RefinementChat";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface ConversationInterfaceProps {
  query: string;
  searchMode: string;
}

export const ConversationInterface = ({ query, searchMode }: ConversationInterfaceProps) => {
  const navigate = useNavigate();
  const [isRefinementComplete, setIsRefinementComplete] = useState(false);
  const [refinedContext, setRefinedContext] = useState<any>(null);

  const handleRefinementComplete = (context: any) => {
    setRefinedContext(context);
    setIsRefinementComplete(true);
  };

  const handleProceedToTechnologyTree = () => {
    navigate('/technology-tree', {
      state: {
        query,
        searchMode,
        refinedContext,
        researchAnswers: refinedContext?.researchAnswers
      }
    });
  };

  return (
    <div className="h-screen bg-white flex flex-col">
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">研究コンテキストの詳細化</h1>
        <p className="text-gray-600 mt-1">
          あなたの研究に最適な情報を提供するため、いくつかの質問にお答えください
        </p>
      </div>

      <div className="flex-1 overflow-hidden">
        <RefinementChat 
          initialQuery={query}
          onRefinementComplete={handleRefinementComplete}
        />
      </div>

      {isRefinementComplete && (
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
          <div className="flex justify-end">
            <Button 
              onClick={handleProceedToTechnologyTree}
              className="bg-blue-600 hover:bg-blue-700"
            >
              技術ツリーを表示
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
