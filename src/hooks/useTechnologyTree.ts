
import { useState } from "react";

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
}

export const useTechnologyTree = () => {
  const [selectedPath, setSelectedPath] = useState({
    level1: "adaptive-optics",
    level2: "medical-applications",
    level3: "retinal-imaging"
  });
  const [selectedView, setSelectedView] = useState("tree");
  const [sidebarTab, setSidebarTab] = useState("result");
  const [showSidebar, setShowSidebar] = useState(true);
  const [collapsedSidebar, setCollapsedSidebar] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleNodeClick = (level: string, nodeId: string) => {
    setSelectedPath(prev => {
      // If clicking the same node that's already selected, unselect it and its children
      if (prev[level] === nodeId) {
        if (level === 'level1') {
          return { ...prev, level1: "", level2: "", level3: "" };
        } else if (level === 'level2') {
          return { ...prev, level2: "", level3: "" };
        } else if (level === 'level3') {
          return { ...prev, level3: "" };
        }
      }
      
      // If selecting a new node
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

  const toggleSidebar = () => {
    if (collapsedSidebar) {
      setCollapsedSidebar(false);
      setShowSidebar(true);
    } else {
      setCollapsedSidebar(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  return {
    selectedPath,
    selectedView,
    sidebarTab,
    showSidebar,
    collapsedSidebar,
    inputValue,
    setSelectedView,
    setSidebarTab,
    setShowSidebar,
    handleNodeClick,
    toggleSidebar,
    handleInputChange
  };
};

