-- Add support for FAST tree generation mode

-- Update axis_type enum to include FAST axis types
ALTER TYPE axis_type ADD VALUE 'Technology';
ALTER TYPE axis_type ADD VALUE 'How1';
ALTER TYPE axis_type ADD VALUE 'How2';
ALTER TYPE axis_type ADD VALUE 'How3';
ALTER TYPE axis_type ADD VALUE 'How4';
ALTER TYPE axis_type ADD VALUE 'How5';
ALTER TYPE axis_type ADD VALUE 'How6';
ALTER TYPE axis_type ADD VALUE 'How7';

-- Add mode column to technology_trees table to distinguish between TED and FAST
ALTER TABLE technology_trees ADD COLUMN mode TEXT DEFAULT 'TED' CHECK (mode IN ('TED', 'FAST'));

-- Create index for mode column
CREATE INDEX idx_technology_trees_mode ON technology_trees(mode);

-- Update the RLS policies to handle both modes
DROP POLICY IF EXISTS "Allow all operations on technology_trees" ON technology_trees;
DROP POLICY IF EXISTS "Allow all operations on tree_nodes" ON tree_nodes;

-- Recreate policies for both modes
CREATE POLICY "Allow all operations on technology_trees" ON technology_trees FOR ALL USING (true);
CREATE POLICY "Allow all operations on tree_nodes" ON tree_nodes FOR ALL USING (true);
