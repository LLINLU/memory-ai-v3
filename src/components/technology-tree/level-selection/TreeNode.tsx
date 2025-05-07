import React, { useRef, useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
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
  
  // Special color for microscopy custom nodes (RGB 72,58,59)
  const getNodeStyle = () => {
    if (item.isCustom && item.name.toLowerCase().includes('microscopy')) {
      if (isSelected) {
        return 'bg-[rgb(72,58,59)] border-2 border-[#FBCA17] text-white';
      } else {
        return 'bg-[rgb(72,58,59)] text-white hover:border border-blue-400';
      }
    } else if (isSelected) {
      return item.isCustom
        ? 'bg-[#FFE194] border-2 border-[#FBCA17] text-[#483B3B]'
        : 'bg-[#4878e6] text-white';
    } else {
      return item.isCustom
        ? 'bg-[#FFF4CB] text-[#554444] hover:border border-blue-400'
        : 'bg-[#E6F0FF] text-[#2E2E2E] hover:border border-blue-400';
    }
  };

  // Helper function to get text color
  const getTextColor = () => {
    if (item.isCustom && item.name.toLowerCase().includes('microscopy')) {
      return 'text-white';
    } else if (isSelected) {
      return item.isCustom ? 'text-[#483B3B]' : 'text-white';
    } else {
      return item.isCustom ? 'text-[#483B3B]' : 'text-gray-600';
    }
  };

  return (
    <div
      ref={nodeRef}
      className={`
        py-4 px-4 rounded-lg cursor-pointer transition-all relative
        ${getNodeStyle()}
        group
      `}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between">
        <h4 className="text-base leading-6 font-medium">{item.name}</h4>
        
        {isHovered && nodeWidth > 250 && (
          <div className={`flex gap-1`}>
            <button 
              title="編集"
              className="inline-flex items-center justify-center p-0 leading-none bg-white/70 hover:bg-white/90 h-7 w-7 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              onClick={(e) => {
                e.stopPropagation();
                onEditClick(e);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path>
              </svg>
            </button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button 
                  title="削除"
                  className="inline-flex items-center justify-center p-0 leading-none bg-white/70 hover:bg-red-100 h-7 w-7 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
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
        <p className={`text-xs mt-1 ${getTextColor()}`}>{item.info}</p>
      )}
      
      {/* Only display description when hovered */}
      {isHovered && item.description && (
        <p className={`mt-3 text-sm ${getTextColor()}`}>{item.description}</p>
      )}
      
      {/* Only show buttons below if width is smaller than 250px and node is hovered */}
      {isHovered && nodeWidth <= 250 && (
        <div className={buttonPositionClass}>
          <div className="flex gap-1">
            <button 
              title="編集"
              className="inline-flex items-center justify-center p-0 leading-none bg-white/70 hover:bg-white/90 h-7 w-7 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              onClick={(e) => {
                e.stopPropagation();
                onEditClick(e);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path>
              </svg>
            </button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button 
                  title="削除"
                  className="inline-flex items-center justify-center p-0 leading-none bg-white/70 hover:bg-red-100 h-7 w-7 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
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
