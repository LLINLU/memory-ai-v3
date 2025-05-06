
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
  "量子コンピューティングの応用",
  "医療分野における機械学習",
  "気候変動の緩和",
  "ニューラルネットワークの構造",
  "持続可能なエネルギーソリューション"
];

const previousSearches = [
  "ブロックチェーン技術の応用",
  "遺伝的アルゴリズムによる最適化",
  "教育における仮想現実"
];

export function SidebarSearches() {
  return (
    <>
      <SearchSection title="最近の検索" searches={recentSearches} />
      <SearchSection title="過去の検索" searches={previousSearches} />
    </>
  );
}
