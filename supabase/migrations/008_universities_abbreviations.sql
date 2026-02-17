-- Add abbreviations column and more schools for better search
-- This allows searching by common abbreviations like NJIT, MIT, UCLA, etc.

-- Add abbreviations column (comma-separated)
ALTER TABLE universities ADD COLUMN IF NOT EXISTS abbreviations TEXT;

-- Create index for abbreviation search
CREATE INDEX IF NOT EXISTS idx_universities_abbrev_trgm ON universities USING gin (abbreviations gin_trgm_ops);

-- Update existing schools with common abbreviations
UPDATE universities SET abbreviations = 'MIT' WHERE name = 'Massachusetts Institute of Technology';
UPDATE universities SET abbreviations = 'Caltech' WHERE name = 'California Institute of Technology';
UPDATE universities SET abbreviations = 'UCLA' WHERE name = 'University of California, Los Angeles';
UPDATE universities SET abbreviations = 'UCB, Berkeley, Cal' WHERE name = 'University of California, Berkeley';
UPDATE universities SET abbreviations = 'UCSD' WHERE name = 'University of California, San Diego';
UPDATE universities SET abbreviations = 'USC' WHERE name = 'University of Southern California';
UPDATE universities SET abbreviations = 'NYU' WHERE name = 'New York University';
UPDATE universities SET abbreviations = 'CMU' WHERE name = 'Carnegie Mellon University';
UPDATE universities SET abbreviations = 'UPenn, Penn' WHERE name = 'University of Pennsylvania';
UPDATE universities SET abbreviations = 'UMich, Michigan' WHERE name = 'University of Michigan';
UPDATE universities SET abbreviations = 'UIUC' WHERE name = 'University of Illinois Urbana-Champaign';
UPDATE universities SET abbreviations = 'GT, GaTech' WHERE name = 'Georgia Institute of Technology';
UPDATE universities SET abbreviations = 'UT Austin, Texas' WHERE name = 'University of Texas at Austin';
UPDATE universities SET abbreviations = 'UW, Washington' WHERE name = 'University of Washington';
UPDATE universities SET abbreviations = 'LSE' WHERE name = 'London School of Economics';
UPDATE universities SET abbreviations = 'ETH' WHERE name = 'ETH Zurich';
UPDATE universities SET abbreviations = 'NUS' WHERE name = 'National University of Singapore';
UPDATE universities SET abbreviations = 'HKU' WHERE name = 'University of Hong Kong';
UPDATE universities SET abbreviations = 'HKUST' WHERE name = 'Hong Kong University of Science and Technology';
UPDATE universities SET abbreviations = 'Tsinghua' WHERE name = 'Tsinghua University';
UPDATE universities SET abbreviations = 'PKU, Peking' WHERE name = 'Peking University';
UPDATE universities SET abbreviations = 'UofT, Toronto' WHERE name = 'University of Toronto';
UPDATE universities SET abbreviations = 'McGill' WHERE name = 'McGill University';
UPDATE universities SET abbreviations = 'UBC' WHERE name = 'University of British Columbia';
UPDATE universities SET abbreviations = 'Waterloo' WHERE name = 'University of Waterloo';
UPDATE universities SET abbreviations = 'ANU' WHERE name = 'Australian National University';
UPDATE universities SET abbreviations = 'UNSW' WHERE name = 'University of New South Wales';
UPDATE universities SET abbreviations = 'Oxbridge' WHERE name = 'University of Oxford';

-- Add more NJ schools
INSERT INTO universities (name, country, state, abbreviations) VALUES
  ('New Jersey Institute of Technology', 'US', 'NJ', 'NJIT'),
  ('Stevens Institute of Technology', 'US', 'NJ', 'Stevens'),
  ('Seton Hall University', 'US', 'NJ', 'SHU'),
  ('Montclair State University', 'US', 'NJ', 'MSU'),
  ('Rowan University', 'US', 'NJ', NULL),
  ('The College of New Jersey', 'US', 'NJ', 'TCNJ'),
  ('Fairleigh Dickinson University', 'US', 'NJ', 'FDU'),
  ('Kean University', 'US', 'NJ', NULL),
  ('William Paterson University', 'US', 'NJ', 'WPU')
ON CONFLICT (name) DO UPDATE SET abbreviations = EXCLUDED.abbreviations;

-- Update Rutgers abbreviation
UPDATE universities SET abbreviations = 'RU' WHERE name = 'Rutgers University';

-- Add more commonly searched schools with abbreviations
INSERT INTO universities (name, country, state, abbreviations) VALUES
  ('Boston University', 'US', 'MA', 'BU'),
  ('Boston College', 'US', 'MA', 'BC'),
  ('Northeastern University', 'US', 'MA', 'NEU'),
  ('Ohio State University', 'US', 'OH', 'OSU'),
  ('Penn State University', 'US', 'PA', 'PSU'),
  ('University of Maryland', 'US', 'MD', 'UMD'),
  ('Virginia Tech', 'US', 'VA', 'VT'),
  ('University of Virginia', 'US', 'VA', 'UVA'),
  ('Arizona State University', 'US', 'AZ', 'ASU'),
  ('University of Arizona', 'US', 'AZ', 'UA'),
  ('University of Florida', 'US', 'FL', 'UF, Gators'),
  ('Florida State University', 'US', 'FL', 'FSU'),
  ('University of Miami', 'US', 'FL', 'UM'),
  ('University of Colorado Boulder', 'US', 'CO', 'CU Boulder'),
  ('Texas A&M University', 'US', 'TX', 'TAMU, A&M'),
  ('Rice University', 'US', 'TX', 'Rice'),
  ('University of Wisconsin-Madison', 'US', 'WI', 'UW-Madison, Wisconsin'),
  ('University of Minnesota', 'US', 'MN', 'UMN'),
  ('Indiana University Bloomington', 'US', 'IN', 'IU'),
  ('Purdue University', 'US', 'IN', 'Purdue'),
  ('Case Western Reserve University', 'US', 'OH', 'CWRU'),
  ('University of Rochester', 'US', 'NY', 'UR'),
  ('Rensselaer Polytechnic Institute', 'US', 'NY', 'RPI'),
  ('Syracuse University', 'US', 'NY', 'Cuse'),
  ('Stony Brook University', 'US', 'NY', 'SBU, SUNY Stony Brook'),
  ('University at Buffalo', 'US', 'NY', 'UB, SUNY Buffalo'),
  ('Binghamton University', 'US', 'NY', 'SUNY Binghamton'),
  ('CUNY Baruch College', 'US', 'NY', 'Baruch'),
  ('CUNY City College', 'US', 'NY', 'CCNY'),
  ('Fordham University', 'US', 'NY', 'Fordham')
ON CONFLICT (name) DO UPDATE SET abbreviations = EXCLUDED.abbreviations;
