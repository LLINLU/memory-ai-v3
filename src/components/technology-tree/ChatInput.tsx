
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const ChatInput = ({ value, onChange }: ChatInputProps) => {
  return (
    <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4">
      <div className="bg-white">
        <Textarea 
          placeholder="Input anything to refine the search area"
          className="w-full resize-none border bg-gray-50 focus-visible:ring-0 text-sm px-4 py-3 rounded-xl"
          value={value}
          onChange={onChange}
          rows={1}
        />
        
        <div className="flex items-center justify-between px-1 pt-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-500 hover:text-gray-700 hover:bg-transparent px-2"
          >
            Send <Send className="h-4 w-4 ml-1.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
