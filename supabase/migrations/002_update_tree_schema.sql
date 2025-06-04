-- Update technology tree schema to handle variable depth structure
-- This migration updates the existing schema to properly handle the reference JSON format

-- Drop existing tables and recreate with improved structure
DROP TABLE IF EXISTS tree_nodes CASCADE;
DROP TABLE IF EXISTS technology_trees CASCADE;
DROP TYPE IF EXISTS axis_type CASCADE;

-- Create enum for axis types (note: Measure can appear at multiple levels)
CREATE TYPE axis_type AS ENUM ('Scenario', 'Purpose', 'Function', 'Measure');

-- Create technology_trees table for storing entire tree metadata
CREATE TABLE technology_trees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  search_theme TEXT NOT NULL,
  reasoning TEXT DEFAULT '',
  layer_config JSONB DEFAULT '["Scenario","Purpose","Function","Measure"]'::jsonb,
  scenario_inputs JSONB DEFAULT '{"what": null, "who": null, "where": null, "when": null}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create tree_nodes table for storing individual nodes with hierarchical structure
CREATE TABLE tree_nodes (
  id TEXT PRIMARY KEY,
  tree_id UUID REFERENCES technology_trees(id) ON DELETE CASCADE,
  parent_id TEXT REFERENCES tree_nodes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  axis axis_type NOT NULL,
  level INTEGER NOT NULL,
  node_order INTEGER DEFAULT 0,
  children_count INTEGER DEFAULT 0,
  path TEXT, -- Full path from root (e.g., "root/lev1_a17f3b/lev2_b23a9c")
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_tree_nodes_tree_id ON tree_nodes(tree_id);
CREATE INDEX idx_tree_nodes_parent_id ON tree_nodes(parent_id);
CREATE INDEX idx_tree_nodes_level ON tree_nodes(level);
CREATE INDEX idx_tree_nodes_axis ON tree_nodes(axis);
CREATE INDEX idx_tree_nodes_path ON tree_nodes(path);
CREATE INDEX idx_technology_trees_search_theme ON technology_trees(search_theme);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_technology_trees_updated_at BEFORE UPDATE ON technology_trees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tree_nodes_updated_at BEFORE UPDATE ON tree_nodes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE technology_trees ENABLE ROW LEVEL SECURITY;
ALTER TABLE tree_nodes ENABLE ROW LEVEL SECURITY;

-- Create policies (for now, allow all operations - you can restrict later)
CREATE POLICY "Allow all operations on technology_trees" ON technology_trees FOR ALL USING (true);
CREATE POLICY "Allow all operations on tree_nodes" ON tree_nodes FOR ALL USING (true);

-- Add function to update node paths automatically
CREATE OR REPLACE FUNCTION update_node_path()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.parent_id IS NULL THEN
        NEW.path = NEW.id;
    ELSE
        SELECT path || '/' || NEW.id INTO NEW.path
        FROM tree_nodes 
        WHERE id = NEW.parent_id;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update paths
CREATE TRIGGER update_tree_node_path BEFORE INSERT OR UPDATE ON tree_nodes FOR EACH ROW EXECUTE FUNCTION update_node_path();
