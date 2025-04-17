
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MinusIcon, PlusIcon, ArrowRight, X, Search, ExternalLink, Send, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";

const TechnologyTree = () => {
  const navigate = useNavigate();
  const [selectedView, setSelectedView] = useState("tree");
  const [selectedPath, setSelectedPath] = useState({
    level1: "adaptive-optics",
    level2: "medical-applications",
    level3: "retinal-imaging"
  });
  const [sidebarTab, setSidebarTab] = useState("chat");
  const [showSidebar, setShowSidebar] = useState(true);
  const [inputValue, setInputValue] = useState("");

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

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  // Dummy chat messages for the demo
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      
      <div className="flex flex-1 overflow-hidden">
        <div className={`flex-1 ${showSidebar ? 'mr-[400px]' : ''} transition-all duration-300 overflow-auto`}>
          <div className="container mx-auto px-4 py-6">
            {/* Header Section */}
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <h1 className="text-3xl font-bold text-gray-800">Technology Tree</h1>
              <p className="text-gray-600 mt-2">
                Navigate through the hierarchy: Level 1  → Level 2   → Level 3  
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
                      
                      {/* Horizontal Connection Line */}
                      {selectedPath.level1 === item.id && selectedPath.level2 && (
                        <div className="absolute top-1/2 right-0 w-6 h-0.5 bg-blue-600 -mr-6"></div>
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
                      
                      {/* Horizontal Connection Line */}
                      {selectedPath.level2 === item.id && selectedPath.level3 && (
                        <div className="absolute top-1/2 right-0 w-6 h-0.5 bg-blue-600 -mr-6"></div>
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

        {/* Right Sidebar */}
        <div 
          className={`fixed right-0 top-[64px] bottom-0 w-[400px] bg-white border-l border-gray-200 shadow-lg flex flex-col transition-transform duration-300 z-10 ${
            showSidebar ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Sidebar Header with Tabs */}
          <div className="flex items-center border-b border-gray-200">
            <div 
              className={`px-6 py-3 text-lg font-medium cursor-pointer ${sidebarTab === 'chat' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
              onClick={() => setSidebarTab('chat')}
            >
              Chat
            </div>
            <div 
              className={`px-6 py-3 text-lg font-medium cursor-pointer ${sidebarTab === 'result' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
              onClick={() => setSidebarTab('result')}
            >
              Result
            </div>
            <div className="ml-auto pr-3">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowSidebar(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-auto p-4 bg-[#fffdf5]">
            {/* Chat Tab Content */}
            {sidebarTab === 'chat' && (
              <div className="space-y-6">
                {chatMessages.map((message, index) => (
                  <div key={index} className="bg-[#f3f2e8] rounded-lg p-4">
                    {message.type === "system" && (
                      <div>
                        <p className="text-gray-800 text-lg font-medium">{message.content}</p>
                        {message.showMore && (
                          <button className="text-gray-600 mt-2 font-medium">Show more</button>
                        )}
                      </div>
                    )}
                    
                    {message.type === "criteria" && (
                      <div>
                        <h3 className="text-gray-800 text-xl font-bold mb-3">{message.title}</h3>
                        <ul className="space-y-2 mb-3">
                          {message.items.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-gray-600">
                              <ArrowRight className="h-4 w-4 mt-1" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                        <p className="font-semibold mb-3">Searching for {message.searchingCount} results</p>
                        <div className="flex items-center">
                          <span className="font-semibold text-gray-700 underline mr-2">Search for more</span>
                          <Search className="h-4 w-4" />
                        </div>
                      </div>
                    )}
                    
                    {message.type === "progress" && (
                      <div>
                        <h3 className="text-gray-800 text-xl font-bold mb-4">{message.title}</h3>
                        <div className="space-y-2 mb-4">
                          <div className="flex items-start gap-2 text-gray-600">
                            <ArrowRight className="h-4 w-4 mt-1" />
                            <span>{message.analyzed} results analyzed</span>
                          </div>
                          <div className="flex items-start gap-2 text-gray-600">
                            <ArrowRight className="h-4 w-4 mt-1" />
                            <span>{message.matched} results matched</span>
                          </div>
                        </div>
                        <Progress value={65} className="h-2 w-full bg-gray-300" />
                      </div>
                    )}
                  </div>
                ))}
                
                <div className="mt-auto pt-4">
                  <div className="text-gray-500 mb-2">Need a custom webset? 
                    <button className="text-blue-500 ml-2 flex items-center gap-1 inline">
                      Talk to us <ExternalLink className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="bg-white rounded-lg border border-gray-300 p-2">
                    <div className="flex items-center mb-2 px-2">
                      <p className="text-gray-500">Add abstract as an enrichment</p>
                      <span className="ml-2 px-2 py-0.5 border border-gray-300 rounded text-sm">Tab</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between items-center px-2">
                      <Button variant="outline" className="flex items-center gap-1 text-gray-500">
                        <Edit className="h-4 w-4" /> Edit search criteria
                      </Button>
                      
                      <Button variant="ghost" className="text-gray-300 hover:text-gray-600">
                        Send <Send className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Result Tab Content */}
            {sidebarTab === 'result' && (
              <div className="p-2">
                <h3 className="text-xl font-bold mb-4">Research Results</h3>
                <div className="bg-[#f3f2e8] p-4 rounded-lg">
                  <div className="mb-4">
                    <h4 className="font-semibold">Adaptive Optics: Medical Applications</h4>
                    <p className="text-sm text-gray-600">32 papers • 9 implementations</p>
                  </div>
                  <ul className="space-y-4">
                    <li className="bg-white p-3 rounded border border-gray-200">
                      <h5 className="font-medium">High-resolution retinal imaging using adaptive optics</h5>
                      <p className="text-sm text-gray-600">Journal of Vision Science, 2023</p>
                      <div className="flex gap-2 mt-2">
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">Retinal Imaging</span>
                        <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded">Clinical</span>
                      </div>
                    </li>
                    <li className="bg-white p-3 rounded border border-gray-200">
                      <h5 className="font-medium">Advancements in corneal imaging with adaptive optics technology</h5>
                      <p className="text-sm text-gray-600">Ophthalmology Research, 2022</p>
                      <div className="flex gap-2 mt-2">
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">Corneal Imaging</span>
                        <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded">Technique</span>
                      </div>
                    </li>
                  </ul>
                  <Button variant="outline" className="w-full mt-4">
                    View all 32 papers
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          {/* Sidebar Input Area */}
          <div className="bg-white border-t border-gray-200 p-4">
            <Textarea 
              placeholder="Type your query here..."
              className="w-full resize-none"
              value={inputValue}
              onChange={handleInputChange}
              rows={2}
            />
          </div>
        </div>
        
        {/* Toggle Sidebar Button (when sidebar is hidden) */}
        {!showSidebar && (
          <Button 
            className="fixed right-4 bottom-4 rounded-full bg-blue-500 p-3"
            onClick={() => setShowSidebar(true)}
            size="icon"
          >
            <Search className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default TechnologyTree;
