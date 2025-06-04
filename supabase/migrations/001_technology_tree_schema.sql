-- Create enum for axis types
CREATE TYPE axis_type AS ENUM ('Scenario', 'Purpose', 'Function', 'Measure');

-- Create technology_trees table for storing entire tree structures
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

-- Create tree_nodes table for storing individual nodes
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_tree_nodes_tree_id ON tree_nodes(tree_id);
CREATE INDEX idx_tree_nodes_parent_id ON tree_nodes(parent_id);
CREATE INDEX idx_tree_nodes_level ON tree_nodes(level);
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
