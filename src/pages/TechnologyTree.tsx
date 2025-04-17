import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { updateTabsHorizontalState } from "@/components/ui/tabs";
import { MinusIcon, PlusIcon, ArrowRight, X, Search, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { LevelSelection } from "@/components/technology-tree/LevelSelection";
import { SidebarContent } from "@/components/technology-tree/SidebarContent";
import { ChatInput } from "@/components/technology-tree/ChatInput";

const TechnologyTree = () => {
  const navigate = useNavigate();
  const [selectedView, setSelectedView] = useState("tree");
  const [selectedPath, setSelectedPath] = useState({
    level1: "adaptive-optics",
    level2: "medical-applications",
    level3: "retinal-imaging"
  });
  const [sidebarTab, setSidebarTab] = useState("result");
  const [showSidebar, setShowSidebar] = useState(true);
  const [collapsedSidebar, setCollapsedSidebar] = useState(false);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    updateTabsHorizontalState(sidebarTab);
  }, [sidebarTab]);

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

  const chatMessages = [
    {
      type: "system",
      content: "Creating Webset for your search: Research papers about cell regeneration technology, which includes one author who is an MD...",
      showMore: true
    },
    {
      type: "criteria",
      title: "Criteria for your search",
      items: [
        "Research paper focused on cell regeneration technology",
        "At least one author who is an MD",
        "At least one author who is a technologist"
      ],
      searchingCount: 25,
    },
    {
      type: "progress",
      title: "Searching across billions of Exa embeddings",
      analyzed: 73,
      matched: 35
    }
  ];

  const visibleLevel2Items = selectedPath.level1 ? level2Items[selectedPath.level1 as keyof typeof level2Items] || [] : [];
  const visibleLevel3Items = selectedPath.level2 ? level3Items[selectedPath.level2 as keyof typeof level3Items] || [] : [];

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const toggleSidebar = () => {
    if (collapsedSidebar) {
      setCollapsedSidebar(false);
      setShowSidebar(true);
    } else {
      setCollapsedSidebar(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      
      <div className="flex flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={70} minSize={30}>
            <div className="container mx-auto px-4 py-6">
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Technology Tree</h1>
                <p className="text-gray-600 mt-2">
                  Navigate through the hierarchy: Level 1  → Level 2   → Level 3  
                </p>
              </div>

              {/* Selected Path Display */}
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
                            {level2Items[selectedPath.level1]?.find(item => item.id === selectedPath.level2)?.name || selectedPath.level2}
                          </span>
                          {selectedPath.level3 && (
                            <>
                              <ArrowRight className="h-4 w-4 text-gray-500" />
                              <span className="text-blue-500 font-medium">
                                {level3Items[selectedPath.level2]?.find(item => item.id === selectedPath.level3)?.name || selectedPath.level3}
                              </span>
                            </>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Zoom Controls */}
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
                </div>
              </div>

              {/* Level Selection Component */}
              <LevelSelection
                selectedPath={selectedPath}
                level1Items={level1Items}
                level2Items={level2Items}
                level3Items={level3Items}
                onNodeClick={handleNodeClick}
              />

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
          </ResizablePanel>

          {showSidebar && !collapsedSidebar && (
            <ResizableHandle withHandle />
          )}

          {showSidebar && !collapsedSidebar && (
            <ResizablePanel defaultSize={30} minSize={20} maxSize={40}>
              <div className="h-full bg-white border-l border-gray-200 shadow-lg flex flex-col">
                <div className="flex items-center justify-between border-b border-gray-200 h-12">
                  <div className="flex flex-1">
                    <button
                      onClick={() => setSidebarTab("result")}
                      className={`flex-1 h-full font-medium text-center px-4 ${
                        sidebarTab === 'result' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
                      }`}
                    >
                      Result
                    </button>
                    <button
                      onClick={() => setSidebarTab("chat")}
                      className={`flex-1 h-full font-medium text-center px-4 ${
                        sidebarTab === 'chat' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
                      }`}
                    >
                      Chat
                    </button>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={toggleSidebar}
                    className="mr-2"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                
                <div className="flex-1 overflow-hidden">
                  <SidebarContent
                    sidebarTab={sidebarTab}
                    chatMessages={chatMessages}
                    inputValue={inputValue}
                    onInputChange={handleInputChange}
                  />
                </div>
                
                {sidebarTab === 'chat' && (
                  <ChatInput
                    value={inputValue}
                    onChange={handleInputChange}
                  />
                )}
              </div>
            </ResizablePanel>
          )}
        </ResizablePanelGroup>

        {/* Sidebar Toggle Controls */}
        {collapsedSidebar && (
          <div className="fixed right-0 top-[64px] bottom-0 w-[50px] bg-[#F3F3E8] border-l border-gray-200 shadow-sm flex flex-col transition-all duration-300 z-10">
            <Button 
              variant="outline" 
              className="absolute top-2 left-2 w-[40px] h-[40px] p-0 flex items-center justify-center bg-[#1A1F2C] text-white" 
              onClick={toggleSidebar}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>
        )}

        {!showSidebar && !collapsedSidebar && (
          <Button 
            className="fixed right-4 bottom-4 rounded-full bg-blue-500 p-3"
            onClick={() => setShowSidebar(true)}
            size="icon"
          >
            <Search className="h-5 w-5" />
          </Button>
        )}

        {!showSidebar && collapsedSidebar && (
          <div className="fixed right-0 top-[100px] bg-[#1A1F2C] text-white py-3 px-5 rounded-l-lg shadow-lg cursor-pointer"
               onClick={toggleSidebar}>
            <div className="flex items-center gap-2">
              <span className="font-medium">Open Sidebar</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TechnologyTree;
