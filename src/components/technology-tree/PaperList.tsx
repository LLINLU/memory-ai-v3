
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PaperCard } from "./PaperCard";
import { paperCollections } from "@/data/paperData";

export const PaperList = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentCollection = paperCollections[currentIndex];

  return (
    <div className="bg-[#f3f2e8] p-4 rounded-lg">
      <div className="mb-4">
        <h4 className="font-semibold">{currentCollection.title}</h4>
        <p className="text-sm text-gray-600">
          {currentCollection.count.papers} papers • {currentCollection.count.implementations} implementations
        </p>
      </div>
      <ul className="space-y-4">
        {currentCollection.papers.map((paper, index) => (
          <PaperCard
            key={index}
            title={paper.title}
            authors={paper.authors}
            journal={paper.journal}
            tags={paper.tags}
            abstract={paper.abstract}
            date={paper.date}
          />
        ))}
      </ul>
      <Button 
        variant="outline" 
        className="w-full mt-4"
        onClick={() => setCurrentIndex((prev) => (prev + 1) % paperCollections.length)}
      >
        View all {currentCollection.count.papers} papers
      </Button>
    </div>
  );
};
