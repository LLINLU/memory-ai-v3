
import { Button } from "@/components/ui/button";
import { PaperCard } from "./PaperCard";

export const PaperList = () => {
  return (
    <div className="bg-[#f3f2e8] p-4 rounded-lg">
      <div className="mb-4">
        <h4 className="font-semibold">Advanced Optical Coherence Tomography</h4>
        <p className="text-sm text-gray-600">45 papers • 12 implementations</p>
      </div>
      <ul className="space-y-4">
        <PaperCard
          title={{
            japanese: "光干渉断層計を用いた網膜下構造の3次元イメージング技術",
            english: "(3D Imaging of Sub-Retinal Structures Using OCT)"
          }}
          authors="山本 浩二, 鈴木 友子, 佐藤 直人"
          journal="医用画像学会誌"
          tags={["OCT", "3Dイメージング"]}
          abstract="This study presents a novel approach to 3D imaging of sub-retinal structures using advanced optical coherence tomography. The method achieves unprecedented resolution in visualizing retinal layers and microvasculature."
          date="2024-04-19"
        />
        
        <PaperCard
          title={{
            english: "Enhanced Resolution OCT Integration with Artificial Intelligence for Early Disease Detection"
          }}
          authors="M. Anderson, K. Lee, R. Martinez"
          journal="Journal of Biomedical Optics"
          tags={["AI-OCT", "Disease Detection"]}
          abstract="This paper introduces an integrated system combining high-resolution OCT with artificial intelligence algorithms for early detection of retinal diseases. The system demonstrates improved accuracy in identifying subtle pathological changes."
          date="2024-04-19"
        />
      </ul>
      <Button variant="outline" className="w-full mt-4">
        View all 45 papers
      </Button>
    </div>
  );
};
