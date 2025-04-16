import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, MinusIcon, PlusIcon, ArrowRight, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TechnologyTree = () => {
  const navigate = useNavigate();
  const [selectedView, setSelectedView] = useState("tree");
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    console.log("Searching for:", searchTerm);
  };

  const toggleExpand = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId) 
        : [...prev, itemId]
    );
  };

  const isExpanded = (itemId: string) => expandedItems.includes(itemId);

  const level1Items = [
    { id: "ophthalmology", name: "Ophthalmology", relevance: "98% relevance" },
    { id: "adaptive-optics", name: "Adaptive Optics", relevance: "95% relevance", selected: true },
    { id: "medical-imaging", name: "Medical Imaging", relevance: "82% relevance" },
    { id: "optical-engineering", name: "Optical Engineering", relevance: "75% relevance" }
  ];

  const level2Items = {
    "ophthalmology": [
      { id: "retinal-disorders", name: "Retinal Disorders", info: "35 papers • 8 implementations" },
      { id: "glaucoma", name: "Glaucoma", info: "27 papers • 5 implementations" }
    ],
    "adaptive-optics": [
      { id: "wavefront-sensing", name: "Wavefront Sensing", info: "Related to selected" },
      { id: "medical-applications", name: "Medical Applications", info: "22 papers • 6 implementations", selected: true },
      { id: "deformable-mirrors", name: "Deformable Mirrors", info: "Related to selected" },
      { id: "ocular-structure", name: "By Ocular Structure", info: "Alternative classification" }
    ],
    "medical-imaging": [
      { id: "mri-techniques", name: "MRI Techniques", info: "18 papers • 3 implementations" },
      { id: "ct-scanning", name: "CT Scanning", info: "15 papers • 2 implementations" }
    ],
    "optical-engineering": [
      { id: "lens-design", name: "Lens Design", info: "20 papers • 4 implementations" },
      { id: "optical-materials", name: "Optical Materials", info: "16 papers • 3 implementations" }
    ]
  };

  const level3Items = {
    "wavefront-sensing": [
      { id: "shack-hartmann", name: "Shack-Hartmann Sensors", info: "12 papers • 3 implementations" }
    ],
    "medical-applications": [
      { id: "retinal-imaging", name: "Retinal Imaging", info: "32 papers • 9 implementations", selected: true },
      { id: "corneal-imaging", name: "Corneal Imaging", info: "18 papers • 4 implementations" }
    ],
    "deformable-mirrors": [
      { id: "mems-technology", name: "MEMS Technology", info: "14 papers • 2 implementations" }
    ],
    "ocular-structure": [
      { id: "anterior-segment", name: "Anterior Segment", info: "20 papers • 5 implementations" }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Search Input with Search Button */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center space-x-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="補償光学の眼科分野への利用 (Adaptive Optics in Ophthalmology)"
            className="flex-grow p-2 text-lg border-0 focus:ring-0 focus:outline-none"
          />
          <Button 
            variant="default" 
            size="icon" 
            onClick={handleSearch}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Zoom Controls and View Toggle */}
      <div className="container mx-auto px-4 mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <span className="text-gray-600 mr-2">Zoom:</span>
            <Button variant="outline" size="sm" className="rounded-md">
              <MinusIcon className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="rounded-md ml-1">
              <PlusIcon className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center">
            <span className="text-gray-600 mr-2">View:</span>
            <Tabs value={selectedView} onValueChange={setSelectedView} className="inline-flex">
              <TabsList>
                <TabsTrigger value="tree" className={selectedView === "tree" ? "bg-blue-500 text-white" : ""}>
                  Tree
                </TabsTrigger>
                <TabsTrigger value="network" className={selectedView === "network" ? "bg-blue-500 text-white" : ""}>
                  Network
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>
      
      {/* Technology Tree Header */}
      <div className="container mx-auto px-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <h2 className="text-2xl font-bold text-gray-800">Technology Tree</h2>
          <p className="text-gray-600">
            Click on a domain to expand and see its sub-domains and specific techniques.
          </p>
        </div>
      </div>
      
      {/* Technology Tree with Drill-down Format */}
      <div className="container mx-auto px-4 mb-8">
        <div className="space-y-4">
          {level1Items.map((item) => (
            <Collapsible 
              key={item.id} 
              open={isExpanded(item.id)} 
              onOpenChange={() => toggleExpand(item.id)}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <CollapsibleTrigger className="w-full">
                <div className={`p-4 flex justify-between items-center bg-blue-500 text-white cursor-pointer ${item.selected ? "ring-2 ring-yellow-400" : ""}`}>
                  <div className="flex items-center gap-2">
                    {isExpanded(item.id) ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    <div>
                      <h3 className="text-lg font-medium text-left">{item.name}</h3>
                      <p className="text-sm text-blue-100 text-left">{item.relevance}</p>
                    </div>
                  </div>
                </div>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <div className="pl-8 bg-blue-50">
                  {level2Items[item.id as keyof typeof level2Items]?.map((subItem) => (
                    <Collapsible 
                      key={subItem.id} 
                      open={isExpanded(subItem.id)}
                      onOpenChange={() => toggleExpand(subItem.id)}
                      className="border-t border-blue-200"
                    >
                      <CollapsibleTrigger className="w-full">
                        <div className={`p-3 flex justify-between items-center bg-blue-100 text-blue-800 cursor-pointer ${subItem.selected ? "ring-2 ring-yellow-400" : ""}`}>
                          <div className="flex items-center gap-2">
                            {isExpanded(subItem.id) ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                            <div>
                              <h4 className="text-md font-medium text-left">{subItem.name}</h4>
                              <p className="text-sm text-blue-600 text-left">{subItem.info}</p>
                            </div>
                          </div>
                        </div>
                      </CollapsibleTrigger>
                      
                      <CollapsibleContent>
                        <div className="pl-8 bg-white">
                          {level3Items[subItem.id as keyof typeof level3Items]?.map((technique) => (
                            <div 
                              key={technique.id} 
                              className={`p-2 flex items-center border-t border-gray-100 ${technique.selected ? "bg-blue-50 ring-2 ring-inset ring-yellow-400" : ""}`}
                            >
                              <div className="ml-6">
                                <h5 className="text-sm font-medium text-gray-800">{technique.name}</h5>
                                <p className="text-xs text-gray-600">{technique.info}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </div>
      
      {/* Selected Path */}
      <div className="container mx-auto px-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center flex-wrap gap-2">
            <span className="text-gray-700 font-medium">Selected path:</span>
            <span className="text-blue-500 font-medium">Adaptive Optics</span>
            <ArrowRight className="h-4 w-4 text-gray-500" />
            <span className="text-blue-500 font-medium">Medical Applications</span>
            <ArrowRight className="h-4 w-4 text-gray-500" />
            <span className="text-blue-500 font-medium">Retinal Imaging</span>
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="container mx-auto px-4 pb-12">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <Button
            variant="outline"
            className="border-2 border-gray-300 text-blue-500 py-6 px-8 text-lg font-medium"
          >
            Show All Results
          </Button>
          
          <Button
            variant="outline"
            className="border-2 border-gray-300 text-blue-500 py-6 px-8 text-lg font-medium"
          >
            Export Technology Map
          </Button>
          
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white py-6 px-8 text-lg font-medium"
            onClick={() => navigate("/search-results")}
          >
            View Research
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TechnologyTree;
