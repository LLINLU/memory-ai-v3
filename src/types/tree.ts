export interface TreeNode {
  id: string;
  name: string;
  info?: string;
  description?: string;
  isCustom?: boolean;
  level?: number;
  children_count?: number; // Number of children nodes, 0 indicates generation in progress
}

// Define path levels for better type safety
export type PathLevel =
  | "level1"
  | "level2"
  | "level3"
  | "level4"
  | "level5"
  | "level6"
  | "level7"
  | "level8"
  | "level9"
  | "level10";
