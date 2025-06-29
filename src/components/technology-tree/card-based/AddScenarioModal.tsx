import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Plus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface AddScenarioModalProps {
  searchTheme: string;
  treeMode: "TED" | "FAST";
  onAddScenario: (context: string) => Promise<void>;
}

export const AddScenarioModal: React.FC<AddScenarioModalProps> = ({
  searchTheme,
  treeMode,
  onAddScenario,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [context, setContext] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!context.trim()) {
      toast({
        title: "エラー",
        description: "追加の情報を入力してください。",
      });
      return;
    }

    setIsLoading(true);
    try {
      await onAddScenario(context.trim());
      setContext("");
      setIsOpen(false);
      toast({
        title: "成功",
        description: "新しいシナリオの生成を開始しました。",
      });
    } catch (error) {
      console.error("[ADD_SCENARIO] Error:", error);
      toast({
        title: "エラー",
        description: "シナリオの追加に失敗しました。もう一度お試しください。",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setContext("");
    setIsOpen(false);
  };

  const modalTitle = treeMode === "FAST" ? "新しい実装方式を追加" : "新しいシナリオを追加";
  const modalDescription = treeMode === "FAST" 
    ? "技術シーズに対する新しい実装方式を生成するための追加情報を入力してください。"
    : "検索テーマに対する新しいシナリオを生成するための追加情報を入力してください。";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="h-full min-h-[200px] border-2 border-dashed border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100 flex flex-col items-center justify-center gap-2 text-gray-600 hover:text-gray-700 transition-colors"
        >
          <Plus className="h-8 w-8" />
          <span className="text-sm font-medium">
            {treeMode === "FAST" ? "実装方式を追加" : "シナリオを追加"}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{modalTitle}</DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            {modalDescription}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="search-theme" className="text-sm font-medium">
              現在の{treeMode === "FAST" ? "技術シーズ" : "検索テーマ"}
            </Label>
            <div className="p-3 bg-gray-50 rounded-md border">
              <p className="text-sm text-gray-700">{searchTheme}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="context" className="text-sm font-medium">
              追加の情報を入力してください
            </Label>
            <Textarea
              id="context"
              placeholder={
                treeMode === "FAST" 
                  ? "新しい実装方式に関する具体的な要求や制約条件を入力してください..."
                  : "新しいシナリオに関する具体的な用途や要求を入力してください..."
              }
              value={context}
              onChange={(e) => setContext(e.target.value)}
              className="min-h-[120px] resize-none"
              disabled={isLoading}
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            onClick={handleCancel}
            disabled={isLoading}
          >
            キャンセル
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isLoading || !context.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                生成中...
              </>
            ) : (
              "生成開始"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};