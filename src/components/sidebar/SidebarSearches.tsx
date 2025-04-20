
import { Clock } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useSidebar } from "@/hooks/use-sidebar";

interface SearchSectionProps {
  title: string;
  searches: string[];
}

function SearchSection({ title, searches }: SearchSectionProps) {
  const { state } = useSidebar();
  
  // Only show in expanded state
  if (state === "collapsed") return null;
  
  return (
    <>
      <div className="px-3 pt-3 text-xs font-medium text-muted-foreground">{title}</div>
      <SidebarMenu>
        {searches.map((search) => (
          <SidebarMenuItem key={search}>
            <SidebarMenuButton>
              <Clock className="text-gray-500" />
              <span className="truncate">{search}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </>
  );
}

const recentSearches = [
  "Quantum computing applications",
  "Machine learning in healthcare",
  "Climate change mitigation",
  "Neural network architectures",
  "Sustainable energy solutions"
];

const previousSearches = [
  "Blockchain technology applications",
  "Genetic algorithms optimization",
  "Virtual reality in education"
];

export function SidebarSearches() {
  return (
    <>
      <SearchSection title="Recent Searches" searches={recentSearches} />
      <SearchSection title="Previous searches" searches={previousSearches} />
    </>
  );
}
