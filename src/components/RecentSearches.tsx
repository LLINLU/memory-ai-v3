
import { SearchCard } from "./SearchCard";

export const RecentSearches = () => {
  // Mock data for recent searches
  const recentSearches = [
    {
      title: "ナノ材料複合体",
      paperCount: 15,
      implementationCount: 4,
      tags: [
        { label: "材料", variant: "materials" as const },
        { label: "工学", variant: "engineering" as const },
      ],
      timeAgo: "2日前",
    },
    {
      title: "バイオインフォマティクスAI",
      paperCount: 28,
      implementationCount: 7,
      tags: [
        { label: "人工知能・機械学習", variant: "aiml" as const },
        { label: "医療", variant: "healthcare" as const },
      ],
      timeAgo: "1週間前",
    },
    {
      title: "グリーン水素貯蔵",
      paperCount: 21,
      implementationCount: 2,
      tags: [
        { label: "エネルギー", variant: "energy" as const },
        { label: "持続可能性", variant: "sustainability" as const },
      ],
      timeAgo: "2週間前",
    },
  ];

  return (
    <section className="mt-12">
      <h2 className="text-[1.2rem] font-bold mb-6">最近の検索</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recentSearches.map((search, index) => (
          <SearchCard key={index} {...search} />
        ))}
      </div>
    </section>
  );
};
