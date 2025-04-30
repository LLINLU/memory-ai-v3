
import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface LevelItem {
  id: string;
  name: string;
  info?: string;
  isCustom?: boolean;
  description?: string;
}

interface TreeNodeProps {
  item: LevelItem;
  isSelected: boolean;
  onClick: () => void;
  onEditClick: (e: React.MouseEvent) => void;
  onDeleteClick: (e: React.MouseEvent) => void;
}

export const TreeNode: React.FC<TreeNodeProps> = ({
  item,
  isSelected,
  onClick,
  onEditClick,
  onDeleteClick
}) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <div
            className={`
              py-4 px-3 rounded-lg text-center cursor-pointer transition-all relative
              ${isSelected 
                ? item.isCustom
                  ? 'bg-[#FFE194] border-2 border-[#FBCA17] text-[#483B3B]'
                  : 'bg-blue-500 text-white ring-2 ring-blue-600'
                : item.isCustom
                  ? 'bg-[#FFF4CB] border-2 border-[#FEE27E] text-[#554444]'
                  : 'bg-blue-400 text-white hover:bg-blue-500'
              }
              group
            `}
            onClick={onClick}
          >
            <div className="flex items-center justify-center gap-2">
              <h4 className="text-lg font-bold">{item.name}</h4>
            </div>
            {item.info && <p className="text-xs mt-1">{item.info}</p>}
            
            {/* Edit & Delete buttons - moved down by 16px */}
            <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity mt-8 pt-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 bg-white/30 hover:bg-white/50"
                onClick={onEditClick}
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
                      onClick={onDeleteClick}
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
  );
};
