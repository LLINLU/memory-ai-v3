
export interface MindMapNode {
  id: string;
  name: string;
  x: number;
  y: number;
  level: number;
  isSelected: boolean;
  description: string;
  children_count?: number;
}

export interface Connection {
  source: string;
  target: string;
}

export interface MindMapConnection extends Connection {
  id: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
}
