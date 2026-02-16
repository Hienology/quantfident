-- Universities table for school autocomplete
-- Part of Contact Form anti-spam + UX feature

-- Enable trigram extension for fuzzy search (if available)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE IF NOT EXISTS universities (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  country TEXT NOT NULL DEFAULT 'US',
  state TEXT,                           -- US state code if applicable
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast prefix search (trigram for fuzzy matching)
CREATE INDEX IF NOT EXISTS idx_universities_name_trgm ON universities USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_universities_name_lower ON universities (lower(name));

-- Enable RLS
ALTER TABLE universities ENABLE ROW LEVEL SECURITY;

-- Public can read (for autocomplete)
DROP POLICY IF EXISTS "Public can read universities" ON universities;
CREATE POLICY "Public can read universities"
  ON universities FOR SELECT
  USING (true);
