
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MinusIcon, PlusIcon, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TechnologyTree = () => {
  const navigate = useNavigate();
  const [selectedView, setSelectedView] = useState("tree");
  const [selectedLevel1, setSelectedLevel1] = useState("adaptive-optics");
  const [selectedLevel2, setSelectedLevel2] = useState("medical-applications");
  const [selectedLevel3, setSelectedLevel3] = useState("retinal-imaging");
  
  // Define domain categories with their relevance data
  const level1Items = [
    { id: "ophthalmology", name: "Ophthalmology", relevance: "98% relevance" },
    { id: "adaptive-optics", name: "Adaptive Optics", relevance: "95% relevance", selected: true },
    { id: "medical-imaging", name: "Medical Imaging", relevance: "82% relevance" },
    { id: "optical-engineering", name: "Optical Engineering", relevance: "75% relevance" }
  ];
  
  const level2Items = [
    { id: "wavefront-sensing", name: "Wavefront Sensing", info: "Related to selected" },
    { id: "medical-applications", name: "Medical Applications", info: "22 papers • 6 implementations", selected: true },
    { id: "deformable-mirrors", name: "Deformable Mirrors", info: "Related to selected" },
    { id: "ocular-structure", name: "By Ocular Structure", info: "Alternative classification" }
  ];
  
  const level3Items = [
    { id: "retinal-imaging", name: "Retinal Imaging", info: "32 papers • 9 implementations", selected: true }
  ];

  const handleLevel1Select = (id: string) => {
    setSelectedLevel1(id);
  };

  const handleLevel2Select = (id: string) => {
    setSelectedLevel2(id);
  };

  const handleLevel3Select = (id: string) => {
    setSelectedLevel3(id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Search Input */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <input
            type="text"
            defaultValue="補償光学の眼科分野への利用 (Adaptive Optics in Ophthalmology)"
            className="w-full p-2 text-lg border-0 focus:ring-0 focus:outline-none"
          />
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
            Navigate through the hierarchy: Level 1 (Main Domains) → Level 2 (Sub-domains) → Level 3 (Applications/Techniques)
          </p>
        </div>
      </div>
      
      {/* Technology Tree Levels */}
      <div className="container mx-auto px-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Level 1 - Main Domains */}
          <div className="flex-1">
            <div className="bg-blue-100 p-4 rounded-t-lg">
              <h3 className="text-xl font-bold text-blue-600">Level 1</h3>
              <p className="text-blue-600">Main Domains</p>
            </div>
            <div className="space-y-2 mt-2">
              {level1Items.map((item) => (
                <div 
                  key={item.id} 
                  className={`p-4 bg-blue-500 text-white rounded-lg cursor-pointer transition-all ${
                    item.id === selectedLevel1 ? "ring-4 ring-yellow-400" : ""
                  }`}
                  onClick={() => handleLevel1Select(item.id)}
                >
                  <h4 className="text-center text-lg font-medium">{item.name}</h4>
                  <p className="text-center text-sm text-blue-100">{item.relevance}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Level 2 - Sub-domains */}
          <div className="flex-1">
            <div className="bg-blue-100 p-4 rounded-t-lg">
              <h3 className="text-xl font-bold text-blue-600">Level 2</h3>
              <p className="text-blue-600">Sub-domains</p>
            </div>
            <div className="space-y-2 mt-2">
              {level2Items.map((item) => (
                <div 
                  key={item.id} 
                  className={`p-4 bg-blue-500 text-white rounded-lg cursor-pointer transition-all ${
                    item.id === selectedLevel2 ? "ring-4 ring-yellow-400" : ""
                  }`}
                  onClick={() => handleLevel2Select(item.id)}
                >
                  <h4 className="text-center text-lg font-medium">{item.name}</h4>
                  <p className="text-center text-sm text-blue-100">{item.info}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Level 3 - Applications/Techniques */}
          <div className="flex-1">
            <div className="bg-blue-100 p-4 rounded-t-lg">
              <h3 className="text-xl font-bold text-blue-600">Level 3</h3>
              <p className="text-blue-600">Specific Topics/Techniques</p>
            </div>
            <div className="space-y-2 mt-2">
              {level3Items.map((item) => (
                <div 
                  key={item.id} 
                  className={`p-4 bg-blue-200 text-gray-800 rounded-lg cursor-pointer transition-all ${
                    item.id === selectedLevel3 ? "ring-4 ring-yellow-400" : ""
                  }`}
                  onClick={() => handleLevel3Select(item.id)}
                >
                  <h4 className="text-center text-lg font-medium">{item.name}</h4>
                  <p className="text-center text-sm text-gray-600">{item.info}</p>
                </div>
              ))}
            </div>
          </div>
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
