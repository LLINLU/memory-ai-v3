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
  const fromDatabase = location.state?.fromDatabase;
  // Initialize the mode based on tree data or location state
  useEffect(() => {
    console.log("[QueryDisplay] treeMode prop received:", treeMode);
    if (treeMode === "FAST") {
      console.log("[QueryDisplay] Setting mode to FAST");
      setSelectedMode("FAST");
    } else if (treeMode === "TED") {
      console.log("[QueryDisplay] Setting mode to TED");
      setSelectedMode("TED");
    } else {
      console.log("[QueryDisplay] Using default TED mode");
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

  // Show the search bar if:
  // 1. Query exists and is not empty, OR
  // 2. This is a database-loaded tree (from sidebar or direct navigation)
  const shouldShowSearchBar = (query && query.trim() !== "") || fromDatabase;

  if (!shouldShowSearchBar) {
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
      console.log(
        `Generating tree with query: "${inputQuery}" in ${selectedMode} mode`
      );

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
            isGenerating: (result as any).status === "generating", // Indicate if still generating
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

  // Dynamic styling based on selected mode to match homepage
  const getModeStyles = () => {
    if (selectedMode === "TED") {
      return "bg-blue-50 text-blue-700";
    } else {
      return "bg-purple-50 text-purple-700";
    }
  };

  return (
    <div className="mb-4">
      <form onSubmit={handleSubmit}>
        <div className="relative flex items-center border border-input rounded-md bg-background">
          {/* Search Input */}
          <Input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="検索クエリを入力してください"
            disabled={isGenerating}
            className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 pr-32"
          />

          {/* Mode Selection Pill */}
          <div className="absolute right-12 flex items-center">
            <Select
              value={selectedMode}
              onValueChange={(value: "TED" | "FAST") => setSelectedMode(value)}
              disabled={isGenerating}
            >
              <SelectTrigger
                className={`h-7 w-auto border-0 rounded-full px-3 text-xs focus:ring-0 focus:ring-offset-0 ${getModeStyles()}`}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TED">ニーズから</SelectItem>
                <SelectItem value="FAST">技術から</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            size="sm"
            disabled={isGenerating || !inputQuery.trim()}
            className="absolute right-2 h-8 w-8 p-0 bg-transparent hover:bg-muted border-0 text-foreground"
          >
            {isGenerating ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-foreground"></div>
            ) : (
              <ArrowUp className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
