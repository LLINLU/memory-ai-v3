
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MinusIcon, PlusIcon, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const TechnologyTree = () => {
  const navigate = useNavigate();
  const [selectedView, setSelectedView] = useState("tree");
  const [selectedPath, setSelectedPath] = useState({
    level1: "adaptive-optics",
    level2: "medical-applications",
    level3: "retinal-imaging"
  });

  const handleNodeClick = (level: string, nodeId: string) => {
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

  const visibleLevel2Items = selectedPath.level1 ? level2Items[selectedPath.level1 as keyof typeof level2Items] || [] : [];
  const visibleLevel3Items = selectedPath.level2 ? level3Items[selectedPath.level2 as keyof typeof level3Items] || [] : [];

  // Get the selected card information for each level
  const selectedLevel1Card = level1Items.find(item => item.id === selectedPath.level1);
  const selectedLevel2Card = visibleLevel2Items.find(item => item.id === selectedPath.level2);
  const selectedLevel3Card = visibleLevel3Items.find(item => item.id === selectedPath.level3);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="bg-blue-50 rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Technology Tree</h1>
          <p className="text-gray-600 mt-2">
            Navigate through the hierarchy: Level 1 (Main Domains) → Level 2 (Sub-domains) → Level 3 (Applications/Techniques)
          </p>
        </div>

        {/* Selected Path Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
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

        {/* Controls Section */}
        <div className="container mx-auto mb-6">
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
        
        {/* Technology Tree Content */}
        <div className="flex flex-row gap-6 mb-8 relative">
          {/* Level 1 Column */}
          <div className="w-1/3 bg-blue-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-700 mb-3">Level 1</h2>
            <h3 className="text-sm text-blue-600 mb-4">Main Domains</h3>
            
            <div className="space-y-4">
              {level1Items.map((item) => (
                <div
                  key={item.id}
                  className={`
                    py-4 px-3 rounded-lg text-center cursor-pointer transition-all relative
                    ${selectedPath.level1 === item.id 
                      ? 'bg-blue-500 text-white ring-2 ring-yellow-400' 
                      : 'bg-blue-400 text-white hover:bg-blue-500'
                    }
                  `}
                  onClick={() => handleNodeClick('level1', item.id)}
                  id={`level1-${item.id}`}
                >
                  <h4 className="text-lg font-bold">{item.name}</h4>
                  <p className="text-xs mt-1">{item.relevance}</p>
                  
                  {/* Connection indicator for selected items */}
                  {selectedPath.level1 === item.id && selectedPath.level2 && (
                    <div className="absolute top-1/2 -right-6 w-6 h-0.5 bg-blue-600"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Level 2 Column */}
          <div className="w-1/3 bg-blue-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-700 mb-3">Level 2</h2>
            <h3 className="text-sm text-blue-600 mb-4">Sub-domains</h3>
            
            <div className="space-y-4">
              {visibleLevel2Items.map((item) => (
                <div
                  key={item.id}
                  className={`
                    py-4 px-3 rounded-lg text-center cursor-pointer transition-all relative
                    ${selectedPath.level2 === item.id 
                      ? 'bg-blue-500 text-white ring-2 ring-yellow-400' 
                      : 'bg-blue-400 text-white hover:bg-blue-500'
                    }
                  `}
                  onClick={() => handleNodeClick('level2', item.id)}
                  id={`level2-${item.id}`}
                >
                  <h4 className="text-lg font-bold">{item.name}</h4>
                  <p className="text-xs mt-1">{item.info}</p>
                  
                  {/* Connection indicator for selected items */}
                  {selectedPath.level2 === item.id && selectedPath.level3 && (
                    <div className="absolute top-1/2 -right-6 w-6 h-0.5 bg-blue-600"></div>
                  )}
                </div>
              ))}
              {visibleLevel2Items.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Select a domain from Level 1
                </div>
              )}
            </div>
          </div>

          {/* Level 3 Column */}
          <div className="w-1/3 bg-blue-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-700 mb-3">Level 3</h2>
            <h3 className="text-sm text-blue-600 mb-4">Specific Topics/Techniques</h3>
            
            <div className="space-y-4">
              {visibleLevel3Items.map((item) => (
                <div
                  key={item.id}
                  className={`
                    py-4 px-3 rounded-lg text-center cursor-pointer transition-all
                    ${selectedPath.level3 === item.id 
                      ? 'bg-blue-500 text-white ring-2 ring-yellow-400' 
                      : 'bg-blue-400 text-white hover:bg-blue-500'
                    }
                  `}
                  onClick={() => handleNodeClick('level3', item.id)}
                  id={`level3-${item.id}`}
                >
                  <h4 className="text-lg font-bold">{item.name}</h4>
                  <p className="text-xs mt-1">{item.info}</p>
                </div>
              ))}
              {visibleLevel3Items.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Select a sub-domain from Level 2
                </div>
              )}
            </div>
          </div>

          {/* Connection Lines */}
          {selectedPath.level1 && selectedPath.level2 && (
            <div 
              className="absolute h-0.5 bg-blue-600" 
              style={{
                left: 'calc(33.33% - 6px)', 
                width: '6px',
                top: `${document.getElementById(`level1-${selectedPath.level1}`)?.offsetTop + document.getElementById(`level1-${selectedPath.level1}`)?.offsetHeight / 2}px`
              }}
            />
          )}
          
          {selectedPath.level2 && selectedPath.level3 && (
            <div 
              className="absolute h-0.5 bg-blue-600" 
              style={{
                left: 'calc(66.67% - 6px)', 
                width: '6px',
                top: `${document.getElementById(`level2-${selectedPath.level2}`)?.offsetTop + document.getElementById(`level2-${selectedPath.level2}`)?.offsetHeight / 2}px`
              }}
            />
          )}
        </div>

        {/* Separator */}
        <Separator className="my-8" />
        
        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-12">
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
