-- New tables for storing enriched tree data from Python API
-- These tables store papers and use cases generated for each tree node

-- Papers table for storing research papers linked to tree nodes
CREATE TABLE node_papers (
  id TEXT PRIMARY KEY, -- Use API-generated ID directly as primary key
  node_id TEXT NOT NULL REFERENCES tree_nodes(id) ON DELETE CASCADE,
  tree_id UUID NOT NULL REFERENCES technology_trees(id) ON DELETE CASCADE,
  
  -- Paper metadata (from Python API)
  title TEXT NOT NULL,
  authors TEXT NOT NULL, -- Comma-separated author names
  journal TEXT NOT NULL, -- Publication journal/conference
  tags JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of tags
  abstract TEXT NOT NULL,
  date DATE NOT NULL, -- Publication date
  citations INTEGER NOT NULL DEFAULT 0,
  region TEXT NOT NULL CHECK (region IN ('domestic', 'international')),
  doi TEXT, -- Optional DOI
  url TEXT, -- Optional paper URL
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  team_id UUID REFERENCES teams(id)
);

-- Press releases table for use case press releases
CREATE TABLE use_case_press_releases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  use_case_id TEXT NOT NULL, -- References node_use_cases.id (now TEXT)
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  date DATE, -- Optional publication date
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Use cases table for storing use cases linked to tree nodes
CREATE TABLE node_use_cases (
  id TEXT PRIMARY KEY, -- Use API-generated ID directly as primary key
  node_id TEXT NOT NULL REFERENCES tree_nodes(id) ON DELETE CASCADE,
  tree_id UUID NOT NULL REFERENCES technology_trees(id) ON DELETE CASCADE,
  
  -- Use case metadata (from Python API)
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  releases INTEGER NOT NULL DEFAULT 0, -- Number of press releases
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  team_id UUID REFERENCES teams(id)
);

-- Add foreign key constraint for press releases
ALTER TABLE use_case_press_releases 
ADD CONSTRAINT use_case_press_releases_use_case_id_fkey 
FOREIGN KEY (use_case_id) REFERENCES node_use_cases(id) ON DELETE CASCADE;

-- Indexes for performance
CREATE INDEX idx_node_papers_node_id ON node_papers(node_id);
CREATE INDEX idx_node_papers_tree_id ON node_papers(tree_id);
CREATE INDEX idx_node_papers_date ON node_papers(date);
CREATE INDEX idx_node_papers_region ON node_papers(region);
CREATE INDEX idx_node_papers_citations ON node_papers(citations);

CREATE INDEX idx_node_use_cases_node_id ON node_use_cases(node_id);
CREATE INDEX idx_node_use_cases_tree_id ON node_use_cases(tree_id);
CREATE INDEX idx_node_use_cases_releases ON node_use_cases(releases);

CREATE INDEX idx_use_case_press_releases_use_case_id ON use_case_press_releases(use_case_id);
CREATE INDEX idx_use_case_press_releases_date ON use_case_press_releases(date);

-- Triggers for updated_at
CREATE TRIGGER update_node_papers_updated_at 
BEFORE UPDATE ON node_papers 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_node_use_cases_updated_at 
BEFORE UPDATE ON node_use_cases 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
