
import React from "react";
import { ResearchObjectiveCard } from "./sidebar/ResearchObjectiveCard";
import { ContextDetailsCard } from "./sidebar/ContextDetailsCard";
import { QuestionProgressCard } from "./sidebar/QuestionProgressCard";
import { TreemapGranularityCard } from "./sidebar/TreemapGranularityCard";
import { TreemapImpactCard } from "./sidebar/TreemapImpactCard";
import { ConversationTopicsCard } from "./sidebar/ConversationTopicsCard";

interface ResearchContextSidebarProps {
  query: string;
  conversationMessages: Array<{
    content: string;
    isUser: boolean;
  }>;
  researchAnswers: Record<string, string>;
  refinementProgress: number;
  confidenceLevels?: Record<string, number>;
  questionStatus?: Record<string, boolean>;
}

export const ResearchContextSidebar = ({ 
  query, 
  conversationMessages, 
  researchAnswers, 
  refinementProgress,
  confidenceLevels = {},
  questionStatus = {}
}: ResearchContextSidebarProps) => {
  
  return (
    <div className="h-screen bg-gray-50 p-4 overflow-y-auto">
      <div className="space-y-4">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">研究コンテキスト</h2>
          <p className="text-sm text-gray-600">リアルタイム会話分析による研究詳細化</p>
        </div>

        {/* Research Objective Summary */}
        <ResearchObjectiveCard 
          query={query}
          researchAnswers={researchAnswers}
        />

        {/* Context Details */}
        <ContextDetailsCard 
          researchAnswers={researchAnswers}
          confidenceLevels={confidenceLevels}
        />

        {/* Question Progress */}
        <QuestionProgressCard 
          refinementProgress={refinementProgress}
          questionStatus={questionStatus}
        />

        {/* Treemap Granularity Preview */}
        <TreemapGranularityCard 
          researchAnswers={researchAnswers}
        />

        {/* Treemap Impact */}
        <TreemapImpactCard 
          researchAnswers={researchAnswers}
        />

        {/* Recent Conversation Topics */}
        <ConversationTopicsCard 
          conversationMessages={conversationMessages}
        />
      </div>
    </div>
  );
};
