
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp, Sparkles } from "lucide-react";
import { ExplorationIcon } from "../icons/ExplorationIcon";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSend?: () => void;
  isLoading?: boolean;
}

export const ChatInput = ({ value, onChange, onSend, isLoading = false }: ChatInputProps) => {
  const [searchMode, setSearchMode] = useState("quick");
  
  const handleSearchModeChange = (mode: string) => {
    setSearchMode(mode);
  };
  
  const handleSend = () => {
    if (onSend && value.trim() && !isLoading) {
      onSend();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && value.trim() && !isLoading) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4">
      <div className="bg-white">
        <Textarea 
          placeholder={searchMode === "deep" ? 
            "例：肝細胞がん患者のAI支援画像診断を用いた早期診断精度向上を目指し、診断から3ヶ月以内の症例を対象とした研究を行いたい" : 
            "メッセージを入力してください..."}
          className="w-full resize-none border bg-gray-50 focus-visible:ring-0 text-sm px-4 py-3 rounded-xl"
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          rows={1}
          autoResize
          disabled={isLoading}
        />
        
        <div className="flex items-center justify-between pt-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  type="button"
                  variant="outline"
                  className={cn(
                    "inline-flex items-center gap-2 text-blue-500 border-blue-100 bg-blue-50 hover:bg-blue-100",
                    "text-sm"
                  )}
                  size="sm"
                >
                  <Sparkles className="h-4 w-4" />
                  Quick Feature
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">早期探索フェーズ向け：特定の研究文脈がなくても、キーワードから関連技術や新興トレンドを発見できます。</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Button 
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-0 w-10 h-10 flex items-center justify-center disabled:opacity-50"
            onClick={handleSend}
            disabled={!value.trim() || isLoading}
            size="icon"
          >
            {isLoading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <ArrowUp className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
