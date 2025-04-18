
import { Paper } from "@/data/paperData";
import { PaperCard } from "../PaperCard";

interface PaperItemsProps {
  papers: Paper[];
}

export const PaperItems = ({ papers }: PaperItemsProps) => {
  return (
    <ul className="w-full space-y-4">
      {papers.map((paper, index) => (
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
  );
};
