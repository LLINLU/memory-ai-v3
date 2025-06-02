
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { getRecentConversationTopics } from "./utils/researchUtils";

interface ConversationTopicsCardProps {
  conversationMessages: Array<{ content: string; isUser: boolean }>;
}

export const ConversationTopicsCard = ({ conversationMessages }: ConversationTopicsCardProps) => {
  const recentTopics = getRecentConversationTopics(conversationMessages);

  if (recentTopics.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center">
          <TrendingUp className="h-4 w-4 mr-2 text-gray-600" />
          収集済み回答
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-xs text-gray-600 mb-2">
            最近のトピック:
          </p>
          {recentTopics.map((topic, index) => (
            <div key={index} className="text-xs text-gray-700 bg-gray-100 rounded p-2">
              {topic}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
