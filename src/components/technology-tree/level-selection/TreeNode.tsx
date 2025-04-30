
import React, { useRef, useEffect, useState } from 'react';
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
  const nodeRef = useRef<HTMLDivElement>(null);
  const [nodeWidth, setNodeWidth] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Update width on mount and window resize
    const updateWidth = () => {
      if (nodeRef.current) {
        setNodeWidth(nodeRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const buttonPositionClass = nodeWidth > 250 ? "absolute top-4 right-2" : "mt-2 flex justify-end";

  return (
    <div
      ref={nodeRef}
      className={`
        py-4 px-4 rounded-lg cursor-pointer transition-all relative
        ${isSelected 
          ? item.isCustom
            ? 'bg-[#FFE194] border-2 border-[#FBCA17] text-[#483B3B]'
            : 'bg-[#4A7DFC] text-white'
          : item.isCustom
            ? 'bg-[#FFF4CB] text-[#554444] hover:border-2 hover:border-blue-400'
            : 'bg-[#E6F0FF] text-[#2E2E2E] hover:border-2 hover:border-blue-400'
        }
        group
      `}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-medium">{item.name}</h4>
        
        {isHovered && nodeWidth > 250 && (
          <div className={`flex gap-1`}>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 bg-white/70 hover:bg-white/90"
              onClick={(e) => {
                e.stopPropagation();
                onEditClick(e);
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 bg-white/70 hover:bg-red-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Trash2 className="h-4 w-4" />
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
                      onDeleteClick(e);
                    }}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
      
      {item.info && (
        <p className="text-xs mt-1 text-gray-600">{item.info}</p>
      )}
      
      {/* Only display description when hovered */}
      {isHovered && item.description && (
        <p className="mt-3 text-sm">{item.description}</p>
      )}
      
      {/* Only show buttons below if width is smaller than 250px and node is hovered */}
      {isHovered && nodeWidth <= 250 && (
        <div className={buttonPositionClass}>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 bg-white/70 hover:bg-white/90"
              onClick={(e) => {
                e.stopPropagation();
                onEditClick(e);
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 bg-white/70 hover:bg-red-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Trash2 className="h-4 w-4" />
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
                      onDeleteClick(e);
                    }}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      )}
    </div>
  );
};
