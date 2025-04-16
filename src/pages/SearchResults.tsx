import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown, Check, Filter, ArrowDownAZ } from "lucide-react";
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from "@/components/ui/tabs";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

const SearchResults = () => {
  const [activeTab, setActiveTab] = useState("papers");
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Search Bar */}
      <div className="border-b border-gray-200 bg-white px-4 py-4">
        <div className="container mx-auto flex items-center gap-2">
          <Input 
            type="text" 
            defaultValue="補償光学の眼科分野への利用 (Adaptive Optics in Ophthalmology)"
            className="flex-1 h-12"
          />
          <Button className="h-12 px-8 bg-blue-500 hover:bg-blue-600">
            Search
          </Button>
        </div>
      </div>
      
      {/* Search Criteria */}
      <div className="container mx-auto px-4 mb-6">
        <div className="bg-blue-50 rounded-lg border border-blue-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Search Criteria <span className="text-blue-500 text-sm font-normal cursor-pointer">(Edit)</span></h2>
            <button className="text-gray-500">
              <ChevronDown size={20} />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-32 font-medium">Domain:</div>
              <div className="flex-1">
                <div className="inline-flex items-center bg-white rounded-md px-4 py-2 border border-gray-200">
                  Optical Engineering <ChevronDown size={16} className="ml-2 text-gray-500" />
                </div>
                <Button variant="outline" className="ml-4 text-gray-500">+ Add Domain</Button>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-32 font-medium">Sub-domain:</div>
              <div className="inline-flex items-center bg-white rounded-md px-4 py-2 border border-gray-200">
                Adaptive Optics <ChevronDown size={16} className="ml-2 text-gray-500" />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-32 font-medium">Application:</div>
              <div className="inline-flex items-center bg-white rounded-md px-4 py-2 border border-gray-200">
                Ophthalmology <ChevronDown size={16} className="ml-2 text-gray-500" />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-32 font-medium">Techniques:</div>
              <div className="flex flex-wrap gap-2">
                <div className="inline-flex items-center bg-white rounded-md px-4 py-2 border border-gray-200">
                  AO-SLO <Check size={16} className="ml-2 text-blue-500" />
                </div>
                <div className="inline-flex items-center bg-white rounded-md px-4 py-2 border border-gray-200">
                  Wavefront Sensing <Check size={16} className="ml-2 text-blue-500" />
                </div>
                <div className="inline-flex items-center bg-white rounded-md px-4 py-2 border border-gray-200">
                  Retinal Imaging <Check size={16} className="ml-2 text-blue-500" />
                </div>
                <Button variant="outline" className="text-gray-500">+ More</Button>
                <Button variant="outline" className="ml-auto text-blue-500 border-blue-500">
                  Explore Technology Tree
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Results Count and Filters */}
      <div className="container mx-auto px-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
          <h2 className="text-xl font-bold">32 Relevant Results</h2>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">Filter by:</span>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border rounded-md px-4 py-2 bg-gray-50 hover:bg-gray-100">
                    Past 5 years <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="bg-white">
                  <DropdownMenuItem>Past 5 years</DropdownMenuItem>
                  <DropdownMenuItem>Past year</DropdownMenuItem>
                  <DropdownMenuItem>2024</DropdownMenuItem>
                  <DropdownMenuItem>Before 2020</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border rounded-md px-4 py-2 ml-2 bg-gray-50 hover:bg-gray-100">
                    Citations <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="bg-white">
                  <DropdownMenuItem>Any Citations</DropdownMenuItem>
                  <DropdownMenuItem>10+ Citations</DropdownMenuItem>
                  <DropdownMenuItem>50+ Citations</DropdownMenuItem>
                  <DropdownMenuItem>100+ Citations</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">Sort by:</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-md px-6 py-2">
                    Newest First <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white">
                  <DropdownMenuItem>Newest First</DropdownMenuItem>
                  <DropdownMenuItem>Oldest First</DropdownMenuItem>
                  <DropdownMenuItem>Most Relevant</DropdownMenuItem>
                  <DropdownMenuItem>Most Citations</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
      
      {/* Results Tabs */}
      <div className="container mx-auto px-4">
        <Tabs defaultValue="papers" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="inline-flex mb-6">
            <TabsTrigger value="papers" className={`${activeTab === "papers" ? "bg-blue-500 text-white" : "bg-gray-100"} rounded-md py-2 px-6 text-base`}>
              Papers
            </TabsTrigger>
            <TabsTrigger value="implementations" className={`${activeTab === "implementations" ? "bg-blue-500 text-white" : "bg-gray-100"} rounded-md py-2 px-6 text-base`}>
              Implementations
            </TabsTrigger>
            <TabsTrigger value="researchers" className={`${activeTab === "researchers" ? "bg-blue-500 text-white" : "bg-gray-100"} rounded-md py-2 px-6 text-base`}>
              Researchers
            </TabsTrigger>
            <TabsTrigger value="patents" className={`${activeTab === "patents" ? "bg-blue-500 text-white" : "bg-gray-100"} rounded-md py-2 px-6 text-base`}>
              Patents
            </TabsTrigger>
          </TabsList>
          
          {/* Tabs Content */}
          
          <TabsContent value="papers" className="mt-0">
            <div className="space-y-6">
              {/* Paper 1 */}
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
              
              {/* Paper 2 */}
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
    </div>
  );
};

export default SearchResults;
