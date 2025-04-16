
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MinusIcon, PlusIcon, ArrowRight, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const TechnologyTree = () => {
  const navigate = useNavigate();
  const [selectedView, setSelectedView] = useState("tree");
  const [searchTerm, setSearchTerm] = useState("");
  // Track the currently selected nodes at each level
  const [selectedPath, setSelectedPath] = useState({
    level1: "adaptive-optics",
    level2: "medical-applications",
    level3: "retinal-imaging"
  });

  const handleSearch = () => {
    console.log("Searching for:", searchTerm);
    toast.info(`Searching for: ${searchTerm}`);
  };

  const handleNodeClick = (level: string, nodeId: string) => {
    // Update the selected path based on the clicked node
    if (level === 'level1') {
      setSelectedPath({
        level1: nodeId,
        level2: "",
        level3: ""
      });
    } else if (level === 'level2') {
      setSelectedPath({
        ...selectedPath,
        level2: nodeId,
        level3: ""
      });
    } else if (level === 'level3') {
      setSelectedPath({
        ...selectedPath,
        level3: nodeId
      });
    }
  };

  // Technology tree data
  const level1Items = [
    { id: "ophthalmology", name: "Ophthalmology", relevance: "98% relevance" },
    { id: "adaptive-optics", name: "Adaptive Optics", relevance: "95% relevance" },
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
      { id: "medical-applications", name: "Medical Applications", info: "22 papers • 6 implementations" },
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
      { id: "retinal-imaging", name: "Retinal Imaging", info: "32 papers • 9 implementations" },
      { id: "corneal-imaging", name: "Corneal Imaging", info: "18 papers • 4 implementations" }
    ],
    "deformable-mirrors": [
      { id: "mems-technology", name: "MEMS Technology", info: "14 papers • 2 implementations" }
    ],
    "ocular-structure": [
      { id: "anterior-segment", name: "Anterior Segment", info: "20 papers • 5 implementations" }
    ]
  };

  // Determine which level 2 and level 3 items to show based on selected path
  const visibleLevel2Items = selectedPath.level1 ? level2Items[selectedPath.level1 as keyof typeof level2Items] || [] : [];
  const visibleLevel3Items = selectedPath.level2 ? level3Items[selectedPath.level2 as keyof typeof level3Items] || [] : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Technology Tree Header */}
      <div className="container mx-auto px-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Technology Tree</h2>
          <p className="text-gray-600">
            Click on a domain to explore related technologies.
          </p>
        </div>

        {/* Search Input with Search Button */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center space-x-2 mb-4">
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

        {/* Selected Path Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
          <div className="flex items-center flex-wrap gap-2">
            <span className="text-gray-700 font-medium">Selected path:</span>
            {selectedPath.level1 && (
              <>
                <span className="text-blue-500 font-medium">
                  {level1Items.find(item => item.id === selectedPath.level1)?.name || selectedPath.level1}
                </span>
                {selectedPath.level2 && (
                  <>
                    <ArrowRight className="h-4 w-4 text-gray-500" />
                    <span className="text-blue-500 font-medium">
                      {visibleLevel2Items.find(item => item.id === selectedPath.level2)?.name || selectedPath.level2}
                    </span>
                    {selectedPath.level3 && (
                      <>
                        <ArrowRight className="h-4 w-4 text-gray-500" />
                        <span className="text-blue-500 font-medium">
                          {visibleLevel3Items.find(item => item.id === selectedPath.level3)?.name || selectedPath.level3}
                        </span>
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* Zoom Controls and View Toggle */}
        <div className="container mx-auto mb-4">
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
        
        {/* Visual Technology Tree - Visual Network Format */}
        <div className="container mx-auto mb-8">
          {/* Level 1 Nodes - Arranged in a single row with overflow */}
          <div className="flex justify-start gap-4 mb-12 w-full overflow-x-auto pb-4">
            {level1Items.map((item) => (
              <div
                key={item.id}
                className={`
                  flex-shrink-0 w-64 py-5 px-4 rounded-lg text-center cursor-pointer transition-all
                  ${selectedPath.level1 === item.id 
                    ? 'bg-blue-500 text-white ring-4 ring-yellow-400' 
                    : 'bg-blue-400 text-white hover:bg-blue-500'
                  }
                `}
                onClick={() => handleNodeClick('level1', item.id)}
              >
                <h3 className="text-xl font-bold">{item.name}</h3>
                <p className="text-sm mt-1">{item.relevance}</p>
              </div>
            ))}
          </div>

          {/* Connection Lines */}
          {selectedPath.level1 && visibleLevel2Items.length > 0 && (
            <div className="relative h-24 mb-4">
              <div className="absolute left-1/2 h-full border-l-2 border-gray-400"></div>
              <div className="absolute bottom-0 left-1/3 right-1/3 border-t-2 border-gray-400"></div>
            </div>
          )}

          {/* Level 2 Nodes - Also arranged in a single row with overflow */}
          {selectedPath.level1 && (
            <div className="flex justify-start gap-4 mb-6 w-full overflow-x-auto pb-4">
              {visibleLevel2Items.map((item) => (
                <div
                  key={item.id}
                  className={`
                    flex-shrink-0 w-64 py-4 px-3 rounded-lg text-center cursor-pointer transition-all
                    ${selectedPath.level2 === item.id 
                      ? 'bg-blue-500 text-white ring-4 ring-yellow-400' 
                      : 'bg-blue-400 text-white hover:bg-blue-500'
                    }
                  `}
                  onClick={() => handleNodeClick('level2', item.id)}
                >
                  <h4 className="text-lg font-bold">{item.name}</h4>
                  <p className="text-xs mt-1">{item.info}</p>
                </div>
              ))}
            </div>
          )}

          {/* User Action Note */}
          {selectedPath.level2 && (
            <div className="text-center text-orange-500 font-medium mb-6 italic">
              User clicks "{visibleLevel2Items.find(item => item.id === selectedPath.level2)?.name}"
            </div>
          )}

          {/* Connection Lines */}
          {selectedPath.level2 && visibleLevel3Items.length > 0 && (
            <div className="relative h-12 mb-4">
              <div className="absolute left-1/2 h-full border-l-2 border-gray-400"></div>
            </div>
          )}

          {/* Level 3 Nodes - Also arranged in a single row with overflow */}
          {selectedPath.level2 && (
            <div className="flex justify-start gap-4 mb-8 w-full overflow-x-auto pb-4">
              {visibleLevel3Items.map((item) => (
                <div
                  key={item.id}
                  className={`
                    flex-shrink-0 w-64 py-3 px-3 rounded-lg text-center cursor-pointer transition-all
                    ${selectedPath.level3 === item.id 
                      ? 'bg-blue-500 text-white ring-4 ring-yellow-400' 
                      : 'bg-blue-400 text-white hover:bg-blue-500'
                    }
                  `}
                  onClick={() => handleNodeClick('level3', item.id)}
                >
                  <h5 className="text-md font-bold">{item.name}</h5>
                  <p className="text-xs mt-1">{item.info}</p>
                </div>
              ))}
            </div>
          )}

          {/* Visual Divider */}
          <div className="w-full border-b border-dashed border-gray-300 my-8"></div>
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
    </div>
  );
};

export default TechnologyTree;
