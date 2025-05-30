
import React, { createContext, useContext, ReactNode } from 'react';
import { useTechnologyTree } from "@/hooks/useTechnologyTree";
import { useTechTreeChat } from "@/hooks/tree/useTechTreeChat";
import { useTechTreeSidebarActions } from "@/components/technology-tree/hooks/useTechTreeSidebarActions";
import { useNodeInfo } from "@/hooks/tree/useNodeInfo";
import { useScenarioState } from "@/hooks/tree/useScenarioState";

interface TechnologyTreeContextType {
  // Tree state
  selectedPath: any;
  sidebarTab: string;
  showSidebar: boolean;
  collapsedSidebar: boolean;
  setSidebarTab: (tab: string) => void;
  setShowSidebar: (show: boolean) => void;
  handleNodeClick: (level: string, nodeId: string) => void;
  toggleSidebar: () => void;
  hasUserMadeSelection: boolean;
  addCustomNode: any;
  editNode: any;
  deleteNode: any;
  level1Items: any[];
  level2Items: Record<string, any[]>;
  level3Items: Record<string, any[]>;
  level4Items: Record<string, any[]>;
  showLevel4: boolean;
  handleAddLevel4: () => void;
  
  // Chat state
  inputValue: string;
  chatMessages: any[];
  isLoading: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSendMessage: () => void;
  initializeChat: (sidebarTab: string) => void;
  handleSwitchToChat: (message: string) => void;
  handleButtonClick: (action: string) => void;
  setChatMessages: any;
  
  // Sidebar actions
  isExpanded: boolean;
  toggleExpand: () => void;
  handleCheckResults: () => void;
  handleUseNode: (suggestion: any) => void;
  handleEditNodeFromChat: (suggestion: any) => void;
  handleRefineNode: (suggestion: any) => void;
  
  // Selected node info
  selectedNodeInfo: any;
  levelNames: any;
  
  // Scenario state
  scenario: string;
  handleEditScenario: (newScenario: string) => void;
  searchMode: string;
  
  // Panel resize handler
  handlePanelResize: () => void;
}

const TechnologyTreeContext = createContext<TechnologyTreeContextType | undefined>(undefined);

export const useTechnologyTreeContext = () => {
  const context = useContext(TechnologyTreeContext);
  if (!context) {
    throw new Error('useTechnologyTreeContext must be used within TechnologyTreeProvider');
  }
  return context;
};

interface TechnologyTreeProviderProps {
  children: ReactNode;
  locationState: any;
}

export const TechnologyTreeProvider: React.FC<TechnologyTreeProviderProps> = ({ 
  children, 
  locationState 
}) => {
  const { scenario, handleEditScenario, searchMode } = useScenarioState({ 
    initialScenario: locationState?.scenario,
    initialSearchMode: locationState?.searchMode
  });

  const {
    selectedPath,
    sidebarTab,
    showSidebar,
    collapsedSidebar,
    setSidebarTab,
    setShowSidebar,
    handleNodeClick,
    toggleSidebar,
    hasUserMadeSelection,
    addCustomNode,
    editNode,
    deleteNode,
    level1Items,
    level2Items,
    level3Items,
    level4Items,
    showLevel4,
    handleAddLevel4
  } = useTechnologyTree();

  const {
    inputValue,
    chatMessages,
    isLoading,
    handleInputChange,
    handleSendMessage,
    initializeChat,
    handleSwitchToChat,
    handleButtonClick,
    setChatMessages
  } = useTechTreeChat();

  const { 
    isExpanded, 
    toggleExpand, 
    handleCheckResults, 
    handleUseNode, 
    handleEditNodeFromChat, 
    handleRefineNode 
  } = useTechTreeSidebarActions(setChatMessages, addCustomNode, setSidebarTab);

  const selectedNodeInfo = useNodeInfo(selectedPath, level1Items, level2Items, level3Items);
  
  const levelNames = {
    level1: "目的",
    level2: "機能",
    level3: "手段／技術",
    level4: "実装"
  };

  const handlePanelResize = () => {
    const event = new CustomEvent('panel-resize');
    document.dispatchEvent(event);
  };

  const value: TechnologyTreeContextType = {
    selectedPath,
    sidebarTab,
    showSidebar,
    collapsedSidebar,
    setSidebarTab,
    setShowSidebar,
    handleNodeClick,
    toggleSidebar,
    hasUserMadeSelection,
    addCustomNode,
    editNode,
    deleteNode,
    level1Items,
    level2Items,
    level3Items,
    level4Items,
    showLevel4,
    handleAddLevel4,
    inputValue,
    chatMessages,
    isLoading,
    handleInputChange,
    handleSendMessage,
    initializeChat,
    handleSwitchToChat,
    handleButtonClick,
    setChatMessages,
    isExpanded,
    toggleExpand,
    handleCheckResults,
    handleUseNode,
    handleEditNodeFromChat,
    handleRefineNode,
    selectedNodeInfo,
    levelNames,
    scenario,
    handleEditScenario,
    searchMode,
    handlePanelResize
  };

  return (
    <TechnologyTreeContext.Provider value={value}>
      {children}
    </TechnologyTreeContext.Provider>
  );
};
