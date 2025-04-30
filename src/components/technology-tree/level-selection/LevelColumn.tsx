
import React from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface LevelItem {
  id: string;
  name: string;
  info?: string;
  isCustom?: boolean;
  description?: string;
}

interface LevelColumnProps {
  title: string;
  subtitle: string;
  items: LevelItem[];
  selectedId: string;
  onNodeClick: (nodeId: string) => void;
  onEditNode?: (nodeId: string, updatedNode: { title: string; description: string }) => void;
  onDeleteNode?: (nodeId: string) => void;
}

export const LevelColumn: React.FC<LevelColumnProps> = ({
  title,
  subtitle,
  items,
  selectedId,
  onNodeClick,
  onEditNode,
  onDeleteNode
}) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [editingNode, setEditingNode] = React.useState<LevelItem | null>(null);
  const [editTitle, setEditTitle] = React.useState("");
  const [editDescription, setEditDescription] = React.useState("");
  
  const handleCustomNodeClick = () => {
    // Scroll to the top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Extract the level number from the title (e.g., "Level 1" -> "1")
    const levelNumber = title.slice(-1);
    
    // Update sidebar tab to chat with level-specific message
    const customEvent = new CustomEvent('switch-to-chat', {
      detail: {
        message: `👋 Hi there!\nReady to add a new node under Level ${levelNumber}? Here's how you can start:\n🔹 Option 1: Enter a clear Title and Description yourself.\n🔹 Option 2: Just describe your idea in natural language — I'll help turn it into a well-structured node!`
      }
    });
    document.dispatchEvent(customEvent);
  };

  const handleEditClick = (e: React.MouseEvent, item: LevelItem) => {
    e.stopPropagation(); // Prevent triggering node selection
    setEditingNode(item);
    setEditTitle(item.name);
    setEditDescription(item.description || "");
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation(); // Prevent triggering node selection
    if (onDeleteNode) {
      onDeleteNode(nodeId);
    }
  };

  const handleSaveEdit = () => {
    if (editingNode && onEditNode) {
      onEditNode(editingNode.id, {
        title: editTitle,
        description: editDescription
      });
    }
    setIsEditDialogOpen(false);
  };

  return (
    <div className="w-1/3 bg-blue-50 p-4 rounded-lg relative">
      <h2 className="text-lg font-semibold text-blue-700 mb-3">{title}</h2>
      <h3 className="text-sm text-blue-600 mb-4">{subtitle}</h3>
      
      <div className="space-y-4">
        {items.map((item) => (
          <TooltipProvider key={item.id}>
            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <div
                  className={`
                    py-4 px-3 rounded-lg text-center cursor-pointer transition-all relative
                    ${selectedId === item.id 
                      ? item.isCustom
                        ? 'bg-[#FFE194] border-2 border-[#FBCA17] text-[#483B3B]'
                        : 'bg-blue-500 text-white ring-2 ring-blue-600'
                      : item.isCustom
                        ? 'bg-[#FFF4CB] border-2 border-[#FEE27E] text-[#554444]'
                        : 'bg-blue-400 text-white hover:bg-blue-500'
                    }
                    group
                  `}
                  onClick={() => onNodeClick(item.id)}
                  id={`level${title.slice(-1)}-${item.id}`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <h4 className="text-lg font-bold">{item.name}</h4>
                  </div>
                  {item.info && <p className="text-xs mt-1">{item.info}</p>}
                  
                  {/* Edit & Delete buttons */}
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 bg-white/30 hover:bg-white/50"
                      onClick={(e) => handleEditClick(e, item)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 bg-white/30 hover:bg-red-100"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete the node "{item.name}". This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            className="bg-red-600 hover:bg-red-700" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(e, item.id);
                            }}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[250px] text-sm">
                <p>{item.description || `Details about ${item.name}`}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}

        <button
          onClick={handleCustomNodeClick}
          className="w-full py-3 px-3 rounded-lg border-2 border-dashed border-gray-300 text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Custom node
        </button>

        {items.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {title === "Level 2" ? "Select a domain from Level 1" : "Select a sub-domain from Level 2"}
          </div>
        )}
      </div>

      {/* Edit node dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Node</DialogTitle>
            <DialogDescription>
              Make changes to the node information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="title" className="text-sm font-medium">Title</label>
              <input
                id="title"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <textarea
                id="description"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
