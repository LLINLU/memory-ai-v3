import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateTabsHorizontalState } from "@/components/ui/tabs";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { SidebarContent } from "@/components/technology-tree/SidebarContent";
import { ChatInput } from "@/components/technology-tree/ChatInput";
import { MainContent } from "@/components/technology-tree/MainContent";
import { SidebarControls } from "@/components/technology-tree/SidebarControls";
import { CollapsedSidebar } from "@/components/technology-tree/CollapsedSidebar";

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
    { id: "ophthalmology", name: "Ophthalmology", info: "42 papers • 12 implementations" },
    { id: "adaptive-optics", name: "Adaptive Optics", info: "38 papers • 15 implementations" },
    { id: "medical-imaging", name: "Medical Imaging", info: "45 papers • 18 implementations" },
    { id: "optical-engineering", name: "Optical Engineering", info: "32 papers • 14 implementations" }
  ];

  const level2Items = {
    "ophthalmology": [
      { id: "retinal-disorders", name: "Retinal Disorders", info: "35 papers • 8 implementations" },
      { id: "glaucoma", name: "Glaucoma", info: "27 papers • 5 implementations" }
    ],
    "adaptive-optics": [
      { id: "wavefront-sensing", name: "Wavefront Sensing", info: "28 papers • 7 implementations" },
      { id: "medical-applications", name: "Medical Applications", info: "22 papers • 6 implementations" },
      { id: "deformable-mirrors", name: "Deformable Mirrors", info: "25 papers • 8 implementations" },
      { id: "ocular-structure", name: "By Ocular Structure", info: "20 papers • 5 implementations" }
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
          <ResizablePanel defaultSize={60} minSize={30}>
            <MainContent
              selectedPath={selectedPath}
              level1Items={level1Items}
              level2Items={level2Items}
              level3Items={level3Items}
              onNodeClick={handleNodeClick}
            />
          </ResizablePanel>

          {showSidebar && !collapsedSidebar && (
            <ResizableHandle withHandle />
          )}

          {showSidebar && !collapsedSidebar && (
            <ResizablePanel defaultSize={40} minSize={20} maxSize={50}>
              <div className="h-full bg-white border-l border-gray-200 shadow-lg flex flex-col">
                <SidebarControls
                  sidebarTab={sidebarTab}
                  setSidebarTab={setSidebarTab}
                  toggleSidebar={toggleSidebar}
                />
                
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

        {collapsedSidebar && <CollapsedSidebar toggleSidebar={toggleSidebar} />}

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
