
import React, { useState, useEffect } from "react";
import { NodeSuggestion } from "@/types/chat";
import { toast } from "@/hooks/use-toast";
import { level1Items as initialLevel1Items, level2Items as initialLevel2Items, level3Items as initialLevel3Items } from "@/data/technologyTreeData";

export interface TechnologyTreeState {
  selectedPath: {
    level1: string;
    level2: string;
    level3: string;
  };
  selectedView: string;
  sidebarTab: string;
  showSidebar: boolean;
  collapsedSidebar: boolean;
  inputValue: string;
  query?: string;
  hasUserMadeSelection: boolean;
}

export const usePathSelection = (initialPath = {
  level1: "adaptive-optics",
  level2: "medical-applications",
  level3: "retinal-imaging"
}) => {
  const [selectedPath, setSelectedPath] = useState(initialPath);
  const [hasUserMadeSelection, setHasUserMadeSelection] = useState(false);
  const [level1Items, setLevel1Items] = useState(initialLevel1Items);
  const [level2Items, setLevel2Items] = useState(initialLevel2Items);
  const [level3Items, setLevel3Items] = useState(initialLevel3Items);

  const handleNodeClick = (level: string, nodeId: string) => {
    setHasUserMadeSelection(true);
    
    setSelectedPath(prev => {
      if (prev[level] === nodeId) {
        if (level === 'level1') {
          return { ...prev, level1: "", level2: "", level3: "" };
        } else if (level === 'level2') {
          return { ...prev, level2: "", level3: "" };
        } else if (level === 'level3') {
          return { ...prev, level3: "" };
        }
      }
      
      if (level === 'level1') {
        return { ...prev, level1: nodeId, level2: "", level3: "" };
      } else if (level === 'level2') {
        return { ...prev, level2: nodeId, level3: "" };
      } else if (level === 'level3') {
        return { ...prev, level3: nodeId };
      }
      return prev;
    });
  };

  const addCustomNode = (level: string, node: NodeSuggestion) => {
    console.log('Adding custom node:', { level, node });
    
    // Create a URL-friendly ID from the title
    const nodeId = node.title.toLowerCase().replace(/\s+/g, '-');
    
    // Create a new node object
    const newNode = {
      id: nodeId,
      name: node.title,
      info: "New node • 0 implementations"
    };
    
    // Add the new node to the appropriate level
    if (level === 'level1') {
      setLevel1Items(prev => [...prev, newNode]);
      setSelectedPath(prev => ({ ...prev, level1: nodeId, level2: "", level3: "" }));
    } 
    else if (level === 'level2') {
      // For level2, we need to update the object for the current level1 selection
      setLevel2Items(prev => {
        const currentLevel1 = selectedPath.level1;
        const currentItems = prev[currentLevel1] || [];
        
        return {
          ...prev,
          [currentLevel1]: [...currentItems, newNode]
        };
      });
      setSelectedPath(prev => ({ ...prev, level2: nodeId, level3: "" }));
    } 
    else if (level === 'level3') {
      // For level3, we need to update the object for the current level2 selection
      setLevel3Items(prev => {
        const currentLevel2 = selectedPath.level2;
        const currentItems = prev[currentLevel2] || [];
        
        return {
          ...prev,
          [currentLevel2]: [...currentItems, newNode]
        };
      });
      setSelectedPath(prev => ({ ...prev, level3: nodeId }));
    }
    
    toast({
      title: "Node added",
      description: `Added "${node.title}" to Level ${level.charAt(5)}`,
      duration: 2000,
    });
  };

  return {
    selectedPath,
    hasUserMadeSelection,
    handleNodeClick,
    addCustomNode,
    level1Items,
    level2Items,
    level3Items
  };
};

export const useSidebar = (initialTab = "result") => {
  const [sidebarTab, setSidebarTab] = useState(initialTab);
  const [showSidebar, setShowSidebar] = useState(true);
  const [collapsedSidebar, setCollapsedSidebar] = useState(false);

  const toggleSidebar = () => {
    if (collapsedSidebar) {
      setCollapsedSidebar(false);
      setShowSidebar(true);
    } else {
      setCollapsedSidebar(true);
    }
  };

  return {
    sidebarTab,
    showSidebar,
    collapsedSidebar,
    setSidebarTab,
    setShowSidebar,
    toggleSidebar
  };
};

export const useInputQuery = (sidebarTab: string) => {
  const [inputValue, setInputValue] = useState("");
  const [query, setQuery] = useState("");
  const [chatMessages, setChatMessages] = useState<any[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  useEffect(() => {
    if (sidebarTab === 'chat' && chatMessages.length === 0) {
      setChatMessages([
        {
          type: "agent",
          content: "I've found research on\nAdaptive Optics → Medical Applications → Retinal Imaging\nHow can I refine this for you?",
          isUser: false
        }
      ]);
    }
  }, [sidebarTab, chatMessages.length]);

  return {
    inputValue,
    query,
    chatMessages,
    handleInputChange,
    setQuery,
    setChatMessages,
    setInputValue
  };
};

export const useTechnologyTree = () => {
  const [selectedView, setSelectedView] = useState("tree");
  const { 
    selectedPath, 
    hasUserMadeSelection, 
    handleNodeClick, 
    addCustomNode,
    level1Items,
    level2Items,
    level3Items
  } = usePathSelection();
  const { 
    sidebarTab, 
    showSidebar, 
    collapsedSidebar, 
    setSidebarTab, 
    setShowSidebar, 
    toggleSidebar 
  } = useSidebar();
  const { 
    inputValue, 
    query, 
    chatMessages, 
    handleInputChange, 
    setQuery, 
    setChatMessages,
    setInputValue 
  } = useInputQuery(sidebarTab);

  return {
    selectedPath,
    selectedView,
    sidebarTab,
    showSidebar,
    collapsedSidebar,
    inputValue,
    query,
    chatMessages,
    hasUserMadeSelection,
    setSelectedView,
    setSidebarTab,
    setShowSidebar,
    handleNodeClick,
    toggleSidebar,
    handleInputChange,
    setQuery,
    setChatMessages,
    setInputValue,
    addCustomNode,
    level1Items,
    level2Items,
    level3Items
  };
};
