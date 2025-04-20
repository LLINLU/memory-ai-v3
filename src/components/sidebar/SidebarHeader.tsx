
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";

export function SidebarHeader() {
  const { toggleSidebar } = useSidebar();

  return (
    <div className="border-b p-4">
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold">
          <span className="text-blue-600">M</span>
          <span>Memory AI</span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-8 w-8"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
