
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Send, ExternalLink } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const ChatInput = ({ value, onChange }: ChatInputProps) => {
  return (
    <div className="p-4 border-t border-gray-200">
      <div className="text-gray-500 mb-2 flex items-center gap-1 justify-between">

      </div>
      
      <div className="bg-white rounded-lg border border-gray-200">
        <Textarea 
          placeholder="Add abstract as an enrichment"
          className="w-full resize-none border-0 focus-visible:ring-0 p-3"
          value={value}
          onChange={onChange}
          rows={2}
        />
        
        <div className="flex items-center justify-between p-2 border-t">
          <Button variant="outline" size="sm" className="flex items-center gap-1 text-gray-500">
            <Edit className="h-4 w-4" /> Edit search criteria
          </Button>
          
          <Button variant="ghost" size="sm" className="text-gray-500">
            Send <Send className="h-4 w-4 ml-1" />
          </Button>
        </div>
        
        <div className="px-3 py-1 text-xs text-gray-400 flex items-center justify-end">
          <kbd className="px-2 py-0.5 border border-gray-300 rounded bg-gray-50">Tab</kbd>
        </div>
      </div>
    </div>
  );
};
