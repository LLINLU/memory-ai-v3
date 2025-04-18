
import { Navigation } from "@/components/Navigation";
import { SearchSection } from "@/components/SearchSection";
import { RecentSearches } from "@/components/RecentSearches";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <SearchSection />
          <RecentSearches />
        </div>
      </div>
    </div>
  );
};

export default Index;

