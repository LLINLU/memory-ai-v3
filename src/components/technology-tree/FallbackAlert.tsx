
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface FallbackAlertProps {
  isVisible: boolean;
  onDismiss: () => void;
}

export const FallbackAlert = ({ isVisible, onDismiss }: FallbackAlertProps) => {
  if (!isVisible) return null;

  return (
    <Alert className="mb-4 border-yellow-200 bg-yellow-50">
      <AlertTriangle className="h-4 w-4 text-yellow-600" />
      <AlertTitle className="text-yellow-800">Using Template Data</AlertTitle>
      <AlertDescription className="text-yellow-700">
        Due to OpenAI API rate limits, some nodes are using template data. 
        You can edit and customize these nodes manually by clicking on them.
        <button 
          onClick={onDismiss}
          className="ml-2 text-yellow-800 underline hover:no-underline"
        >
          Dismiss
        </button>
      </AlertDescription>
    </Alert>
  );
};
