
import React from "react";
import { MindMapNode as MindMapNodeType } from "@/hooks/tree/useMindMapState";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Edit, Trash2 } from "lucide-react";

interface MindMapNodeProps {
  node: MindMapNodeType;
  isSelected: boolean;
  onToggleExpansion: (nodeId: string) => void;
  onNodeClick: (nodeId: string) => void;
  onEditClick?: (nodeId: string) => void;
  onDeleteClick?: (nodeId: string) => void;
}

export const MindMapNode: React.FC<MindMapNodeProps> = ({
  node,
  isSelected,
  onToggleExpansion,
  onNodeClick,
  onEditClick,
  onDeleteClick,
}) => {
  const hasChildren = node.children.length > 0;
  const nodeStyle = {
    left: `${node.x}px`,
    top: `${node.y}px`,
    transform: 'translate(-50%, -50%)',
  };

  const getNodeColor = () => {
    switch (node.level) {
      case 1: return "bg-blue-600 text-white";
      case 2: return "bg-blue-500 text-white";
      case 3: return "bg-blue-400 text-white";
      case 4: return "bg-blue-300 text-gray-800";
      default: return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <>
      <div
        className={`absolute min-w-32 max-w-48 p-3 rounded-lg cursor-pointer transition-all duration-200 border-2 group hover:scale-105 ${
          isSelected ? "border-yellow-400 shadow-lg" : "border-transparent"
        } ${getNodeColor()}`}
        style={nodeStyle}
        onClick={() => onNodeClick(node.id)}
      >
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-medium truncate pr-2">{node.name}</h3>
          {hasChildren && (
            <Button
              variant="ghost"
              size="sm"
              className="w-6 h-6 p-0 hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpansion(node.id);
              }}
            >
              {node.isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </Button>
          )}
        </div>
        
        {node.description && (
          <p className="text-xs opacity-80 line-clamp-2">{node.description}</p>
        )}
        
        {node.info && (
          <p className="text-xs opacity-70 mt-1">{node.info}</p>
        )}

        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1 mt-2">
          {onEditClick && (
            <Button
              variant="ghost"
              size="sm"
              className="w-6 h-6 p-0 hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation();
                onEditClick(node.id);
              }}
            >
              <Edit className="h-3 w-3" />
            </Button>
          )}
          {onDeleteClick && (
            <Button
              variant="ghost"
              size="sm"
              className="w-6 h-6 p-0 hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteClick(node.id);
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Render children recursively */}
      {node.isExpanded && node.children.map((child) => (
        <MindMapNode
          key={child.id}
          node={child}
          isSelected={isSelected}
          onToggleExpansion={onToggleExpansion}
          onNodeClick={onNodeClick}
          onEditClick={onEditClick}
          onDeleteClick={onDeleteClick}
        />
      ))}
    </>
  );
};
