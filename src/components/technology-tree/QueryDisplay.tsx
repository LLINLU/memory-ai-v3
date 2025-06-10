
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUp } from "lucide-react";
import { useTreeGeneration } from "@/hooks/useTreeGeneration";
import { toast } from "@/components/ui/use-toast";

interface QueryDisplayProps {
  query?: string;
  treeMode?: string;
}

export const QueryDisplay = ({ query, treeMode }: QueryDisplayProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { generateTree, isGenerating } = useTreeGeneration();
  
  // State for the search interface
  const [inputQuery, setInputQuery] = useState(query || "");
  const [selectedMode, setSelectedMode] = useState<"TED" | "FAST">("TED");
  
  // Get searchMode from location state - if it's "quick", hide the component
  const searchMode = location.state?.searchMode;
  
  // Initialize the mode based on tree data or location state
  useEffect(() => {
    if (treeMode === "FAST") {
      setSelectedMode("FAST");
    } else if (treeMode === "TED") {
      setSelectedMode("TED");
    } else {
      // Default to TED mode
      setSelectedMode("TED");
    }
  }, [treeMode]);

  // Update input when query prop changes
  useEffect(() => {
    setInputQuery(query || "");
  }, [query]);

  // If searchMode is "quick", don't render the component
  if (searchMode === "quick") {
    return null;
  }

  // Only render if query exists and is not empty
  if (!query || query.trim() === "") {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputQuery.trim()) {
      toast({
        title: "エラー",
        description: "検索クエリを入力してください",
      });
      return;
    }

    try {
      console.log(`Generating tree with query: "${inputQuery}" in ${selectedMode} mode`);
      
      const result = await generateTree(inputQuery.trim(), selectedMode);
      
      if (result) {
        // Navigate to new tree with the generated data
        navigate("/technology-tree", {
          state: {
            query: inputQuery.trim(),
            scenario: result.treeStructure?.scenario_inputs?.scenario,
            searchMode: "deep",
            treeData: result.treeStructure,
            treeId: result.treeId,
            fromDatabase: true,
          },
          replace: true,
        });
      }
    } catch (error) {
      console.error("Error regenerating tree:", error);
      toast({
        title: "生成エラー",
        description: "ツリーの再生成に失敗しました。再試行してください。",
      });
    }
  };

  return (
    <div className="bg-green-50 rounded-lg p-6 mb-4">
      <form onSubmit={handleSubmit} className="flex items-center gap-4">
        {/* Left side: Search input */}
        <div className="flex-1">
          <label htmlFor="search-query" className="block text-sm font-medium text-green-600 mb-2">
            検索クエリ：
          </label>
          <Input
            id="search-query"
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="検索クエリを入力してください"
            className="w-full"
            disabled={isGenerating}
          />
        </div>

        {/* Right side: Mode selection and submit button */}
        <div className="flex items-end gap-2">
          <div className="min-w-[120px]">
            <label htmlFor="search-mode" className="block text-sm font-medium text-green-600 mb-2">
              モード：
            </label>
            <Select
              value={selectedMode}
              onValueChange={(value: "TED" | "FAST") => setSelectedMode(value)}
              disabled={isGenerating}
            >
              <SelectTrigger id="search-mode">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TED">ニーズから</SelectItem>
                <SelectItem value="FAST">技術から</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button
            type="submit"
            size="sm"
            disabled={isGenerating || !inputQuery.trim()}
            className="h-10 w-10 p-0"
          >
            {isGenerating ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <ArrowUp className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
