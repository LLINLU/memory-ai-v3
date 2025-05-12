
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Search } from "lucide-react";
import { ExplorationIcon } from "../icons/ExplorationIcon";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ChatInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSend?: () => void;
}

export const ChatInput = ({ value, onChange, onSend }: ChatInputProps) => {
  const [searchMode, setSearchMode] = useState("quick"); // Default to "quick"
  
  const handleSearchModeChange = (mode: string) => {
    setSearchMode(mode);
  };
  
  const handleSend = () => {
    if (onSend && value.trim()) {
      onSend();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && value.trim()) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4">
      <div className="bg-white">
        <div className="mb-2">
          <div className="flex space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    type="button"
                    onClick={() => handleSearchModeChange("quick")}
                    className={`inline-flex items-center rounded-full py-1 px-4 h-[28px] text-sm transition-colors ${
                      searchMode === "quick" ? "bg-blue-50 text-blue-600" : "bg-transparent hover:bg-gray-100 text-[#9f9f9f]"
                    }`}
                  >
                    <ExplorationIcon className={`mr-1 ${searchMode === "quick" ? "stroke-[2.5px]" : ""}`} />
                    Quick Exploration
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">早期探索フェーズ向け：特定の研究文脈がなくても、キーワードから関連技術や新興トレンドを発見できます。女性ホルモンのような一般的なキーワードから始めて、幅広い可能性を探索できます。</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    type="button"
                    onClick={() => handleSearchModeChange("deep")}
                    className={`inline-flex items-center rounded-full py-1 px-4 h-[28px] text-sm transition-colors ${
                      searchMode === "deep" ? "bg-blue-50 text-blue-600" : "bg-transparent hover:bg-gray-100 text-[#9f9f9f]"
                    }`}
                  >
                    <Search className={`h-3 w-3 mr-1 ${searchMode === "deep" ? "stroke-[2.5px]" : ""}`} /> Deep Refiner
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">具体的な研究文脈や仮説がある場合に最適：研究者、対象、環境、手法、目的などの詳細を入力することで、的確な研究内容に絞り込めます。その後、システムの質問に答えることでさらに研究コンテキストを洗練させ、無関係な情報を排除した効率的な探索ができます。</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        <Textarea 
          placeholder={searchMode === "deep" ? 
            "例：肝細胞がん患者のAI支援画像診断を用いた早期診断精度向上を目指し、診断から3ヶ月以内の症例を対象とした研究を行いたい" : 
            "メッセージを入力してください..."}
          className="w-full resize-none border bg-gray-50 focus-visible:ring-0 text-sm px-4 py-3 rounded-xl truncate"
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          rows={1}
        />
        
        <div className="flex items-center justify-between px-1 pt-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-500 hover:text-gray-700 hover:bg-transparent px-2"
            onClick={handleSend}
            disabled={!value.trim()}
          >
            送信 <Send className="h-4 w-4 ml-1.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
