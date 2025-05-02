import { useEffect, useState } from "react";
import { updateTabsHorizontalState } from "@/components/ui/tabs";
import { MainContent } from "@/components/technology-tree/MainContent";
import { TechTreeLayout } from "@/components/technology-tree/TechTreeLayout";
import { TechTreeSidebar } from "@/components/technology-tree/TechTreeSidebar";
import { useTechnologyTree } from "@/hooks/useTechnologyTree";
import { useTechTreeChat } from "@/hooks/tree/useTechTreeChat";
import { NodeSuggestion } from '@/types/chat';
import { SidebarProvider } from "@/components/ui/sidebar";

const getLevelNames = (selectedPath: { level1: string }) => {
  if (selectedPath.level1.includes('optics')) {
    return {
      level1: "Optical Technologies",
      level2: "Applications",
      level3: "Implementation Methods"
    };
  } else if (selectedPath.level1.includes('medical')) {
    return {
      level1: "Medical Fields",
      level2: "Specializations",
      level3: "Procedures"
    };
  }
  return {
    level1: "Technology Areas",
    level2: "Focus Areas",
    level3: "Specific Methods"
  };
};

const TechnologyTree = () => {
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
    level3Items
  } = useTechnologyTree();

  const {
    inputValue,
    chatMessages,
    handleInputChange,
    handleSendMessage,
    initializeChat,
    handleSwitchToChat,
    setChatMessages
  } = useTechTreeChat();

  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedNodeInfo, setSelectedNodeInfo] = useState({
    title: "",
    description: ""
  });
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Function to find the selected node's info
  const getSelectedNodeInfo = () => {
    if (!level1Items || !level2Items || !level3Items) {
      return { title: "", description: "" };
    }
    
    let title = "";
    let description = "";

    // Check level 3 first (most specific)
    if (selectedPath.level3) {
      const level3NodeItems = level3Items[selectedPath.level2] || [];
      const selectedNode = level3NodeItems.find(item => item.id === selectedPath.level3);
      if (selectedNode) {
        title = selectedNode.name;
        description = selectedNode.description || "";
      }
    }
    // Then check level 2
    else if (selectedPath.level2) {
      const level2NodeItems = level2Items[selectedPath.level1] || [];
      const selectedNode = level2NodeItems.find(item => item.id === selectedPath.level2);
      if (selectedNode) {
        title = selectedNode.name;
        description = selectedNode.description || "";
      }
    }
    // Finally check level 1
    else if (selectedPath.level1) {
      const selectedNode = level1Items.find(item => item.id === selectedPath.level1);
      if (selectedNode) {
        title = selectedNode.name;
        description = selectedNode.description || "";
      }
    }

    return { title, description };
  };

  useEffect(() => {
    updateTabsHorizontalState(sidebarTab);
  }, [sidebarTab]);

  useEffect(() => {
    initializeChat(sidebarTab);
  }, [sidebarTab]);

  useEffect(() => {
    const handleSwitchToChatEvent = (event: CustomEvent) => {
      setSidebarTab("chat");
      setShowSidebar(true);
      handleSwitchToChat(event.detail.message);
    };

    document.addEventListener('switch-to-chat', handleSwitchToChatEvent as EventListener);
    
    return () => {
      document.removeEventListener('switch-to-chat', handleSwitchToChatEvent as EventListener);
    };
  }, [setSidebarTab, setShowSidebar]);

  // Update selected node info when path changes or level items change
  useEffect(() => {
    if (level1Items && level2Items && level3Items) {
      setSelectedNodeInfo(getSelectedNodeInfo());
    }
  }, [selectedPath, level1Items, level2Items, level3Items]);

  const levelNames = getLevelNames(selectedPath);

  const handlePanelResize = () => {
    const event = new CustomEvent('panel-resize');
    document.dispatchEvent(event);
  };

  const handleCheckResults = () => {
    console.log("Check Results button clicked, switching to result tab");
    setSidebarTab("result");
    
    // Also trigger a refresh of the papers
    const refreshEvent = new CustomEvent('refresh-papers', {
      detail: { source: 'checkResults', timestamp: Date.now() }
    });
    document.dispatchEvent(refreshEvent);
  };

  const handleUseNode = (suggestion: NodeSuggestion) => {
    if (chatMessages.length > 0) {
      // Try to find a message that mentions a level
      for (const message of chatMessages) {
        const levelMatch = message.content?.match(/Level (\d+)/i);
        if (levelMatch) {
          const levelNum = levelMatch[1];
          const level = `level${levelNum}`;
          console.log(`Adding custom node to ${level}:`, suggestion);
          addCustomNode(level, suggestion);

          // Add completion message with the showCheckResults property set to true
          setChatMessages(prev => [...prev, {
            content: "The node has been created 😊",
            isUser: false,
            showCheckResults: true
          }]);
          return;
        }
      }
      
      // Default to level2 if no specific level found
      addCustomNode('level2', suggestion);
      setChatMessages(prev => [...prev, {
        content: "The node has been created 😊",
        isUser: false,
        showCheckResults: true
      }]);
    }
  };

  const handleEditNodeFromChat = (suggestion: NodeSuggestion) => {
    // Find which level the edit is for from chat messages
    if (chatMessages.length > 0) {
      // Try to find a message that mentions a level
      for (const message of chatMessages) {
        const levelMatch = message.content?.match(/Level (\d+)/i);
        if (levelMatch) {
          const levelNum = levelMatch[1];
          const level = `level${levelNum}`;
          // For now just add as new since we don't have node ID from chat
          addCustomNode(level, suggestion);
          return;
        }
      }
      // Default to level2 if no specific level found
      addCustomNode('level2', suggestion);
    }
  };

  const mainContent = (
    <MainContent
      selectedPath={selectedPath}
      level1Items={level1Items}
      level2Items={level2Items}
      level3Items={level3Items}
      onNodeClick={handleNodeClick}
      onEditNode={editNode}
      onDeleteNode={deleteNode}
      levelNames={levelNames}
      hasUserMadeSelection={hasUserMadeSelection}
    />
  );

  const sidebarContent = (
    <TechTreeSidebar
      sidebarTab={sidebarTab}
      setSidebarTab={setSidebarTab}
      toggleSidebar={toggleSidebar}
      isExpanded={isExpanded}
      toggleExpand={toggleExpand}
      chatMessages={chatMessages}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      onSendMessage={handleSendMessage}
      onUseNode={handleUseNode}
      onEditNode={handleEditNodeFromChat}
      onRefine={(suggestion) => console.log('Refine node:', suggestion)}
      onCheckResults={handleCheckResults}
      onResize={handlePanelResize}
      selectedNodeTitle={selectedNodeInfo.title}
      selectedNodeDescription={selectedNodeInfo.description}
    />
  );

  return (
    <SidebarProvider>
      <TechTreeLayout
        showSidebar={showSidebar}
        collapsedSidebar={collapsedSidebar}
        isExpanded={isExpanded}
        toggleSidebar={toggleSidebar}
        setShowSidebar={setShowSidebar}
        handlePanelResize={handlePanelResize}
        sidebarContent={sidebarContent}
      >
        {mainContent}
      </TechTreeLayout>
    </SidebarProvider>
  );
};

export default TechnologyTree;
