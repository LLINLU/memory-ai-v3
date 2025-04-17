
import { Button } from "@/components/ui/button";
import { PaperCard } from "./PaperCard";

export const PaperList = () => {
  return (
    <div className="bg-[#f3f2e8] p-4 rounded-lg">
      <div className="mb-4">
        <h4 className="font-semibold">Adaptive Optics: Medical Applications</h4>
        <p className="text-sm text-gray-600">32 papers • 9 implementations</p>
      </div>
      <ul className="space-y-4">
        <PaperCard
          title={{
            japanese: "高解像度適応光学走査レーザー検眼鏡による糖尿病網膜症の細胞レベル評価",
            english: "(Cellular-level Assessment of Diabetic Retinopathy Using High-resolution AO-SLO)"
          }}
          authors="田中 健太, 佐藤 明子, 山田 雄一"
          journal="日本眼科学会誌"
          tags={["AO-SLO", "糖尿病網膜症"]}
          abstract="This study investigates the application of adaptive optics scanning laser ophthalmoscopy (AO-SLO) for early detection of cellular changes in diabetic retinopathy. The research demonstrates improved visualization of retinal microvasculature and photoreceptor abnormalities before clinical symptoms appear."
          date="2024-04-19"
        />
        
        <PaperCard
          title={{
            english: "Multi-Modal Adaptive Optics Imaging Combined with OCT for Enhanced Retinal Diagnostics"
          }}
          authors="J. Zhang, M. Williams, K. Yamada"
          journal="American Journal of Ophthalmology"
          tags={["AO-OCT", "Multi-Modal"]}
          abstract="This paper presents a novel approach combining adaptive optics with optical coherence tomography for comprehensive retinal imaging. The multi-modal system achieves unprecedented resolution for in vivo assessment of retinal layers, offering new insights into pathophysiology of macular degeneration."
          date="2024-04-19"
        />
      </ul>
      <Button variant="outline" className="w-full mt-4">
        View all 32 papers
      </Button>
    </div>
  );
};
