
import { Navigation } from "@/components/Navigation";
import { SearchSection } from "@/components/SearchSection";
import { Divider } from "@/components/Divider";
import { BrowseButton } from "@/components/BrowseButton";
import { RecentSearches } from "@/components/RecentSearches";
import { SavedSearches } from "@/components/SavedSearches";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <SearchSection />
          <Divider />
          <BrowseButton />
          <RecentSearches />
          <SavedSearches />
        </div>
      </div>
    </div>
  );
};

export default Index;
