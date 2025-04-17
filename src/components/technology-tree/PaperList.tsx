
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PaperCard } from "./PaperCard";
import { paperCollections } from "@/data/paperData";

interface PaperListProps {
  onRefresh?: () => void;
}

export const PaperList = ({ onRefresh }: PaperListProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [forceUpdate, setForceUpdate] = useState(0); // Added state to force re-rendering
  
  // Ensure we get a different collection on mount and refresh
  useEffect(() => {
    // Get a random index that's different from the current one
    const getRandomIndex = () => {
      // Force a different index than the current one
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * paperCollections.length);
      } while (newIndex === currentIndex && paperCollections.length > 1);
      
      return newIndex;
    };
    
    console.log("PaperList useEffect triggered, setting new index");
    setCurrentIndex(getRandomIndex());
  }, [forceUpdate, currentIndex]); // This will trigger when forceUpdate changes
  
  const currentCollection = paperCollections[currentIndex];

  const handleViewAll = () => {
    // Get a different collection when clicking view all
    console.log("View All clicked, triggering refresh");
    setForceUpdate(prev => prev + 1); // Force component to update
    onRefresh?.();
  };

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
            key={`${currentIndex}-${index}-${forceUpdate}`} // Ensure key changes when collection or forceUpdate changes
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
        onClick={handleViewAll}
      >
        View all {currentCollection.count.papers} papers
      </Button>
    </div>
  );
};

