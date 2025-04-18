
import { SearchCard } from "./SearchCard";

export const RecentSearches = () => {
  // Mock data for recent searches
  const recentSearches = [
    {
      title: "Nanomaterial Composites",
      paperCount: 15,
      implementationCount: 4,
      tags: [
        { label: "Materials", variant: "materials" as const },
        { label: "Engineering", variant: "engineering" as const },
      ],
      timeAgo: "2 days ago",
    },
    {
      title: "Bioinformatics AI",
      paperCount: 28,
      implementationCount: 7,
      tags: [
        { label: "AI/ML", variant: "aiml" as const },
        { label: "Healthcare", variant: "healthcare" as const },
      ],
      timeAgo: "1 week ago",
    },
    {
      title: "Green Hydrogen Storage",
      paperCount: 21,
      implementationCount: 2,
      tags: [
        { label: "Energy", variant: "energy" as const },
        { label: "Sustainability", variant: "sustainability" as const },
      ],
      timeAgo: "2 weeks ago",
    },
  ];

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Recent Searches</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recentSearches.map((search, index) => (
          <SearchCard key={index} {...search} />
        ))}
      </div>
    </section>
  );
};
