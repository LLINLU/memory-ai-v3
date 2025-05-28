
import { TechTreeLayout } from "./TechTreeLayout";
import { TechTreeSidebar } from "./TechTreeSidebar";
import { TechTreeMainContent } from "./TechTreeMainContent";
import { ChatBox } from "./ChatBox";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

interface TechTreePageProps {
  // Sidebar props
  sidebarTab: string;
  setSidebarTab: (tab: string) => void;
  showSidebar: boolean;
  collapsedSidebar: boolean;
  isExpanded: boolean;
  toggleSidebar: () => void;
  setShowSidebar: (show: boolean) => void;
  toggleExpand: () => void;
  
  // Chat props
  chatMessages: any[];
  inputValue: string;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSendMessage: () => void;
  onUseNode: (suggestion: any) => void;
  onEditNodeFromChat: (suggestion: any) => void;
  onRefineNode: (suggestion: any) => void;
  onCheckResults: () => void;
  onButtonClick: (message: string) => void;
  
  // Main content props
  selectedPath: any;
  level1Items: any[];
  level2Items: Record<string, any[]>;
  level3Items: Record<string, any[]>;
  level4Items: Record<string, any[]>;
  handleNodeClick: (level: string, nodeId: string) => void;
  editNode: (level: string, nodeId: string, updatedNode: any) => void;
  deleteNode: (level: string, nodeId: string) => void;
  levelNames: any;
  hasUserMadeSelection: boolean;
  scenario?: string;
  onEditScenario?: (scenario: string) => void;
  conversationHistory?: any[];
  handleAddLevel4?: () => void;
  searchMode?: string;
  selectedNodeTitle?: string;
  selectedNodeDescription?: string;
  
  // Layout handlers
  handlePanelResize: () => void;
}

export const TechTreePage = ({
  sidebarTab,
  setSidebarTab,
  showSidebar,
  collapsedSidebar,
  isExpanded,
  toggleSidebar,
  setShowSidebar,
  toggleExpand,
  chatMessages,
  inputValue,
  onInputChange,
  onSendMessage,
  onUseNode,
  onEditNodeFromChat,
  onRefineNode,
  onCheckResults,
  onButtonClick,
  selectedPath,
  level1Items,
  level2Items,
  level3Items,
  level4Items,
  handleNodeClick,
  editNode,
  deleteNode,
  levelNames,
  hasUserMadeSelection,
  scenario,
  onEditScenario,
  conversationHistory,
  handleAddLevel4,
  searchMode,
  selectedNodeTitle,
  selectedNodeDescription,
  handlePanelResize
}: TechTreePageProps) => {
  
  const sidebarContent = (
    <TechTreeSidebar
      sidebarTab={sidebarTab}
      setSidebarTab={setSidebarTab}
      toggleSidebar={toggleSidebar}
      isExpanded={isExpanded}
      toggleExpand={toggleExpand}
      chatMessages={chatMessages}
      inputValue={inputValue}
      onInputChange={onInputChange}
      onSendMessage={onSendMessage}
      onUseNode={onUseNode}
      onEditNode={onEditNodeFromChat}
      onRefine={onRefineNode}
      onCheckResults={onCheckResults}
      onResize={handlePanelResize}
      selectedNodeTitle={selectedNodeTitle}
      selectedNodeDescription={selectedNodeDescription}
    />
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1">
          <TechTreeLayout
            showSidebar={showSidebar}
            collapsedSidebar={collapsedSidebar}
            isExpanded={isExpanded}
            toggleSidebar={toggleSidebar}
            setShowSidebar={setShowSidebar}
            handlePanelResize={handlePanelResize}
            sidebarContent={sidebarContent}
          >
            <TechTreeMainContent
              selectedPath={selectedPath}
              level1Items={level1Items}
              level2Items={level2Items}
              level3Items={level3Items}
              level4Items={level4Items}
              handleNodeClick={handleNodeClick}
              editNode={editNode}
              deleteNode={deleteNode}
              levelNames={levelNames}
              hasUserMadeSelection={hasUserMadeSelection}
              scenario={scenario}
              onEditScenario={onEditScenario}
              conversationHistory={conversationHistory}
              handleAddLevel4={handleAddLevel4}
              searchMode={searchMode}
            />
          </TechTreeLayout>
          
          <ChatBox
            messages={chatMessages}
            inputValue={inputValue}
            onInputChange={onInputChange}
            onSendMessage={onSendMessage}
            onButtonClick={onButtonClick}
            onUseNode={onUseNode}
            onEditNode={onEditNodeFromChat}
            onRefine={onRefineNode}
          />
        </div>
      </div>
    </SidebarProvider>
  );
};
