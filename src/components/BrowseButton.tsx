
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";

export const BrowseButton = () => {
  return (
    <Button 
      variant="outline" 
      className="flex items-center gap-2 border-2 border-gray-200 hover:border-blue-500 hover:bg-white text-blue-500 py-6 px-8 text-lg font-medium mx-auto"
    >
      <Share2 className="h-5 w-5" />
      Browse Technology Tree
    </Button>
  );
};
