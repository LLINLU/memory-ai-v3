
import { Clock } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";

interface SearchSectionProps {
  title: string;
  searches: string[];
}

function SearchSection({ title, searches }: SearchSectionProps) {
  return (
    <>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
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
