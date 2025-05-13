
export interface TreeNode {
  id: string;
  name: string;
  info?: string;
  description?: string;
  isCustom?: boolean;
  tags?: string[];
  dateAdded?: string;
  lastUpdated?: string;
}
