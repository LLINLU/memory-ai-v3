
import React from 'react';
import { Button } from "@/components/ui/button";
import { Check, Edit, MessageSquare } from "lucide-react";
import { NodeSuggestion } from "@/types/chat";

interface SuggestionActionsProps {
  suggestion: NodeSuggestion;
  onUseNode?: (suggestion: NodeSuggestion) => void;
  onEditNode?: (suggestion: NodeSuggestion) => void;
  onRefine?: (suggestion: NodeSuggestion) => void;
}

export const SuggestionActions = ({
  suggestion,
  onUseNode,
  onEditNode,
  onRefine
}: SuggestionActionsProps) => {
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => onUseNode?.(suggestion)}
        className="flex items-center gap-2"
      >
        <Check className="h-4 w-4" />
        Use this
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => onEditNode?.(suggestion)}
        className="flex items-center gap-2"
      >
        <Edit className="h-4 w-4" />
        Edit
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => onRefine?.(suggestion)}
        className="flex items-center gap-2"
      >
        <MessageSquare className="h-4 w-4" />
        Refine further
      </Button>
    </div>
  );
};
