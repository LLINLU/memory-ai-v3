
import React from 'react';
import { Edit } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { DeleteNodeButton } from './DeleteNodeButton';

interface NodeActionsProps {
  itemName: string;
  onEditClick: (e: React.MouseEvent) => void;
  onDeleteClick: (e: React.MouseEvent) => void;
}

export const NodeActions: React.FC<NodeActionsProps> = ({ 
  itemName, 
  onEditClick, 
  onDeleteClick 
}) => {
  return (
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
      
      <DeleteNodeButton 
        itemName={itemName} 
        onDeleteClick={onDeleteClick} 
      />
    </div>
  );
};
