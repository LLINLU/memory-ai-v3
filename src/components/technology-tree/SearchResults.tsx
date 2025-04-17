
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const SearchResults = () => {
  return (
    <div className="h-full p-4 overflow-auto bg-[#fffdf5]">
      <h3 className="text-xl font-bold mb-4">Research Results</h3>
      <div className="bg-[#f3f2e8] p-4 rounded-lg">
        <div className="mb-4">
          <h4 className="font-semibold">Adaptive Optics: Medical Applications</h4>
          <p className="text-sm text-gray-600">32 papers • 9 implementations</p>
        </div>
        <ul className="space-y-4">
          <li className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="space-y-3">
              <div>
                <h5 className="text-xl font-bold mb-2">高解像度適応光学走査レーザー検眼鏡による糖尿病網膜症の細胞レベル評価</h5>
                <h6 className="text-lg text-gray-700">(Cellular-level Assessment of Diabetic Retinopathy Using High-resolution AO-SLO)</h6>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600 truncate">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="truncate">田中 健太, 佐藤 明子, 山田 雄一</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>田中 健太, 佐藤 明子, 山田 雄一</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <span className="shrink-0">•</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="truncate">日本眼科学会誌</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>日本眼科学会誌</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="flex gap-2">
                <span className="text-xs bg-[#E8F1FF] text-blue-600 px-3 py-1 rounded-full">AO-SLO</span>
                <span className="text-xs bg-[#E8F1FF] text-blue-600 px-3 py-1 rounded-full">糖尿病網膜症</span>
              </div>

              <p className="text-sm text-gray-700 leading-relaxed">
                This study investigates the application of adaptive optics scanning laser ophthalmoscopy (AO-SLO) for early detection of cellular changes in diabetic retinopathy. The research demonstrates improved visualization of retinal microvasculature and photoreceptor abnormalities before clinical symptoms appear.
              </p>

              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-500">2024-04-19</div>
                <div className="flex gap-2">
                  <Button variant="outline" className="text-sm">View PDF</Button>
                  <Button variant="outline" className="text-sm">Save</Button>
                </div>
              </div>
            </div>
          </li>

          <li className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="space-y-3">
              <h5 className="text-xl font-bold mb-2">Multi-Modal Adaptive Optics Imaging Combined with OCT for Enhanced Retinal Diagnostics</h5>
              
              <div className="flex items-center gap-2 text-sm text-gray-600 truncate">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="truncate">J. Zhang, M. Williams, K. Yamada</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>J. Zhang, M. Williams, K. Yamada</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <span className="shrink-0">•</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="truncate">American Journal of Ophthalmology</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>American Journal of Ophthalmology</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="flex gap-2">
                <span className="text-xs bg-[#E8F1FF] text-blue-600 px-3 py-1 rounded-full">AO-OCT</span>
                <span className="text-xs bg-[#E8F1FF] text-blue-600 px-3 py-1 rounded-full">Multi-Modal</span>
              </div>

              <p className="text-sm text-gray-700 leading-relaxed">
                This paper presents a novel approach combining adaptive optics with optical coherence tomography for comprehensive retinal imaging. The multi-modal system achieves unprecedented resolution for in vivo assessment of retinal layers, offering new insights into pathophysiology of macular degeneration.
              </p>

              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-500">2024-04-19</div>
                <div className="flex gap-2">
                  <Button variant="outline" className="text-sm">View PDF</Button>
                  <Button variant="outline" className="text-sm">Save</Button>
                </div>
              </div>
            </div>
          </li>
        </ul>
        <Button variant="outline" className="w-full mt-4">
          View all 32 papers
        </Button>
      </div>
    </div>
  );
};

