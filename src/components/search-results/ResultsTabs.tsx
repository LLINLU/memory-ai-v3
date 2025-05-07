
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from "@/components/ui/tabs";

export const ResultsTabs = () => {
  const [activeTab, setActiveTab] = React.useState("papers");

  return (
    <div className="container mx-auto px-4 mb-12">
      <Tabs defaultValue="papers" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="inline-flex mb-6">
          <TabsTrigger value="papers" className={`${activeTab === "papers" ? "bg-blue-500 text-white" : "bg-gray-100"} rounded-md py-2 px-6 text-base`}>
            論文
          </TabsTrigger>
          <TabsTrigger value="implementations" className={`${activeTab === "implementations" ? "bg-blue-500 text-white" : "bg-gray-100"} rounded-md py-2 px-6 text-base`}>
            実装
          </TabsTrigger>
          <TabsTrigger value="researchers" className={`${activeTab === "researchers" ? "bg-blue-500 text-white" : "bg-gray-100"} rounded-md py-2 px-6 text-base`}>
            Researchers
          </TabsTrigger>
          <TabsTrigger value="patents" className={`${activeTab === "patents" ? "bg-blue-500 text-white" : "bg-gray-100"} rounded-md py-2 px-6 text-base`}>
            Patents
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="papers" className="mt-0">
          <div className="space-y-6">
            <div className="bg-white p-6 border border-gray-200 rounded-md">
              <h3 className="text-lg font-bold mb-1">高解像度適応光学走査レーザー検眼鏡による糖尿病網膜症の細胞レベル評価</h3>
              <h4 className="text-base mb-2">(Cellular-level Assessment of Diabetic Retinopathy Using High-resolution AO-SLO)</h4>
              <div className="text-gray-600 mb-3">田中 健太, 佐藤 明子, 山田 雄一 • 日本眼科学会誌 • 2024</div>
              <div className="flex gap-2 mb-3">
                <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">AO-SLO</span>
                <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">糖尿病網膜症</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                This study investigates the application of adaptive optics scanning laser ophthalmoscopy (AO-SLO) for early detection of cellular changes in diabetic retinopathy. The research demonstrates improved visualization of retinal microvasculature and photoreceptor abnormalities before clinical symptoms appear.
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" className="border-gray-300">PDF</Button>
                <Button variant="outline" className="border-gray-300">Save</Button>
              </div>
            </div>
            
            <div className="bg-white p-6 border border-gray-200 rounded-md">
              <h3 className="text-lg font-bold mb-1">Multi-Modal Adaptive Optics Imaging Combined with OCT for Enhanced Retinal Diagnostics</h3>
              <div className="text-gray-600 mb-3">J. Zhang, M. Williams, K. Yamada • American Journal of Ophthalmology • 2023</div>
              <div className="flex gap-2 mb-3">
                <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">AO-OCT</span>
                <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">Multi-Modal</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                This paper presents a novel approach combining adaptive optics with optical coherence tomography for comprehensive retinal imaging. The multi-modal system achieves unprecedented resolution for in vivo assessment of retinal layers, offering new insights into pathophysiology of macular degeneration.
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" className="border-gray-300">PDF</Button>
                <Button variant="outline" className="border-gray-300">Save</Button>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="implementations" className="mt-0">
          <div className="bg-white p-6 border border-gray-200 rounded-md">
            <h3 className="text-xl font-bold mb-4">Implementation Examples</h3>
            <p className="text-gray-600 mb-4">Implementation data will be displayed here.</p>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h4 className="font-semibold mb-2">Commercial AO-SLO System by OptiVision</h4>
                <p className="text-sm text-gray-600">
                  Commercially available adaptive optics system for clinical ophthalmology applications. Featuring real-time wavefront sensing and high-speed image acquisition for cellular-level retinal assessment.
                </p>
              </div>
              <div className="border-b pb-4">
                <h4 className="font-semibold mb-2">Research-Grade AO Platform at Tokyo Medical University</h4>
                <p className="text-sm text-gray-600">
                  Custom-built adaptive optics system integrating multiple imaging modalities for advanced research applications. The platform enables simultaneous fluorescence imaging and structural assessment.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="researchers" className="mt-0">
          <div className="bg-white p-6 border border-gray-200 rounded-md">
            <h3 className="text-xl font-bold mb-4">Key Researchers</h3>
            <p className="text-gray-600 mb-4">Researcher profiles will be displayed here.</p>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h4 className="font-semibold mb-2">Dr. Keiko Suzuki - University of Tokyo</h4>
                <p className="text-sm text-gray-600">
                  Leading researcher in adaptive optics applications for ophthalmic imaging with over 45 publications. Pioneer in developing novel wavefront sensing techniques for improved retinal visualization.
                </p>
              </div>
              <div className="border-b pb-4">
                <h4 className="font-semibold mb-2">Prof. Michael Chen - Stanford University</h4>
                <p className="text-sm text-gray-600">
                  Principal investigator focusing on computational approaches to enhance adaptive optics imaging. His work bridges optical engineering and clinical applications for early disease detection.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="patents" className="mt-0">
          <div className="bg-white p-6 border border-gray-200 rounded-md">
            <h3 className="text-xl font-bold mb-4">Related Patents</h3>
            <p className="text-gray-600 mb-4">Patent information will be displayed here.</p>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h4 className="font-semibold mb-2">JP2023-178456: Advanced Wavefront Correction System</h4>
                <p className="text-sm text-gray-600">
                  Patent covering novel deformable mirror technology with enhanced stroke and spatial resolution for improved correction of high-order aberrations in ophthalmic imaging systems.
                </p>
              </div>
              <div className="border-b pb-4">
                <h4 className="font-semibold mb-2">US10,892,345: Multi-conjugate Adaptive Optics for Retinal Imaging</h4>
                <p className="text-sm text-gray-600">
                  Patented approach using multiple deformable mirrors to correct aberrations at different depths in the eye, enabling volumetric imaging with consistent quality throughout retinal layers.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
