-- Add abbreviations column for better search (US and Canada only)
-- This allows searching by common abbreviations like NJIT, MIT, UCLA, etc.

-- Add abbreviations column (comma-separated)
ALTER TABLE universities ADD COLUMN IF NOT EXISTS abbreviations TEXT;

-- Create index for abbreviation search
CREATE INDEX IF NOT EXISTS idx_universities_abbrev_trgm ON universities USING gin (abbreviations gin_trgm_ops);

-- US Schools - Ivy League & Top Private
UPDATE universities SET abbreviations = 'MIT' WHERE name = 'Massachusetts Institute of Technology';
UPDATE universities SET abbreviations = 'Caltech' WHERE name = 'California Institute of Technology';
UPDATE universities SET abbreviations = 'UCLA' WHERE name = 'University of California, Los Angeles';
UPDATE universities SET abbreviations = 'UCB, Berkeley, Cal' WHERE name = 'University of California, Berkeley';
UPDATE universities SET abbreviations = 'UCSD' WHERE name = 'University of California, San Diego';
UPDATE universities SET abbreviations = 'UCSB' WHERE name = 'University of California, Santa Barbara';
UPDATE universities SET abbreviations = 'UCI' WHERE name = 'University of California, Irvine';
UPDATE universities SET abbreviations = 'UCD' WHERE name = 'University of California, Davis';
UPDATE universities SET abbreviations = 'UCSC' WHERE name = 'University of California, Santa Cruz';
UPDATE universities SET abbreviations = 'UCR' WHERE name = 'University of California, Riverside';
UPDATE universities SET abbreviations = 'USC' WHERE name = 'University of Southern California';
UPDATE universities SET abbreviations = 'NYU' WHERE name = 'New York University';
UPDATE universities SET abbreviations = 'CMU' WHERE name = 'Carnegie Mellon University';
UPDATE universities SET abbreviations = 'UPenn, Penn' WHERE name = 'University of Pennsylvania';
UPDATE universities SET abbreviations = 'UMich, Michigan' WHERE name = 'University of Michigan';
UPDATE universities SET abbreviations = 'UIUC' WHERE name = 'University of Illinois Urbana-Champaign';
UPDATE universities SET abbreviations = 'GT, GaTech' WHERE name = 'Georgia Institute of Technology';
UPDATE universities SET abbreviations = 'UT Austin, Texas' WHERE name = 'University of Texas at Austin';
UPDATE universities SET abbreviations = 'UW, Washington' WHERE name = 'University of Washington';
UPDATE universities SET abbreviations = 'JHU' WHERE name = 'Johns Hopkins University';
UPDATE universities SET abbreviations = 'WashU, WUSTL' WHERE name = 'Washington University in St. Louis';
UPDATE universities SET abbreviations = 'RU' WHERE name = 'Rutgers University';
UPDATE universities SET abbreviations = 'BU' WHERE name = 'Boston University';
UPDATE universities SET abbreviations = 'BC' WHERE name = 'Boston College';
UPDATE universities SET abbreviations = 'NEU' WHERE name = 'Northeastern University';
UPDATE universities SET abbreviations = 'OSU' WHERE name = 'Ohio State University';
UPDATE universities SET abbreviations = 'PSU' WHERE name = 'Penn State University';
UPDATE universities SET abbreviations = 'UMD' WHERE name = 'University of Maryland, College Park';
UPDATE universities SET abbreviations = 'VT' WHERE name = 'Virginia Tech';
UPDATE universities SET abbreviations = 'UVA' WHERE name = 'University of Virginia';
UPDATE universities SET abbreviations = 'ASU' WHERE name = 'Arizona State University';
UPDATE universities SET abbreviations = 'UA' WHERE name = 'University of Arizona';
UPDATE universities SET abbreviations = 'UF, Gators' WHERE name = 'University of Florida';
UPDATE universities SET abbreviations = 'FSU' WHERE name = 'Florida State University';
UPDATE universities SET abbreviations = 'UM' WHERE name = 'University of Miami';
UPDATE universities SET abbreviations = 'CU Boulder' WHERE name = 'University of Colorado Boulder';
UPDATE universities SET abbreviations = 'TAMU, A&M' WHERE name = 'Texas A&M University';
UPDATE universities SET abbreviations = 'UW-Madison, Wisconsin' WHERE name = 'University of Wisconsin-Madison';
UPDATE universities SET abbreviations = 'UMN' WHERE name = 'University of Minnesota';
UPDATE universities SET abbreviations = 'IU' WHERE name = 'Indiana University Bloomington';
UPDATE universities SET abbreviations = 'CWRU' WHERE name = 'Case Western Reserve University';
UPDATE universities SET abbreviations = 'UR' WHERE name = 'University of Rochester';
UPDATE universities SET abbreviations = 'RPI' WHERE name = 'Rensselaer Polytechnic Institute';
UPDATE universities SET abbreviations = 'Cuse' WHERE name = 'Syracuse University';
UPDATE universities SET abbreviations = 'SBU, SUNY Stony Brook' WHERE name = 'Stony Brook University';
UPDATE universities SET abbreviations = 'UB, SUNY Buffalo' WHERE name = 'University at Buffalo';
UPDATE universities SET abbreviations = 'SUNY Binghamton' WHERE name = 'Binghamton University';
UPDATE universities SET abbreviations = 'GWU' WHERE name = 'George Washington University';
UPDATE universities SET abbreviations = 'GMU' WHERE name = 'George Mason University';
UPDATE universities SET abbreviations = 'UCF' WHERE name = 'University of Central Florida';
UPDATE universities SET abbreviations = 'USF' WHERE name = 'University of South Florida';
UPDATE universities SET abbreviations = 'FIU' WHERE name = 'Florida International University';
UPDATE universities SET abbreviations = 'FAU' WHERE name = 'Florida Atlantic University';
UPDATE universities SET abbreviations = 'UNT' WHERE name = 'University of North Texas';
UPDATE universities SET abbreviations = 'TTU' WHERE name = 'Texas Tech University';
UPDATE universities SET abbreviations = 'UH' WHERE name = 'University of Houston';
UPDATE universities SET abbreviations = 'SDSU' WHERE name = 'San Diego State University';
UPDATE universities SET abbreviations = 'SJSU' WHERE name = 'San Jose State University';
UPDATE universities SET abbreviations = 'SFSU' WHERE name = 'San Francisco State University';
UPDATE universities SET abbreviations = 'CSULB' WHERE name = 'California State University, Long Beach';
UPDATE universities SET abbreviations = 'CSUF' WHERE name = 'California State University, Fullerton';
UPDATE universities SET abbreviations = 'CSUN' WHERE name = 'California State University, Northridge';
UPDATE universities SET abbreviations = 'CSULA' WHERE name = 'California State University, Los Angeles';
UPDATE universities SET abbreviations = 'Cal Poly, SLO' WHERE name = 'California Polytechnic State University';
UPDATE universities SET abbreviations = 'WPI' WHERE name = 'Worcester Polytechnic Institute';
UPDATE universities SET abbreviations = 'IIT' WHERE name = 'Illinois Institute of Technology';
UPDATE universities SET abbreviations = 'RIT' WHERE name = 'Rochester Institute of Technology';
UPDATE universities SET abbreviations = 'SMU' WHERE name = 'Southern Methodist University';
UPDATE universities SET abbreviations = 'LMU' WHERE name = 'Loyola Marymount University';
UPDATE universities SET abbreviations = 'SCU' WHERE name = 'Santa Clara University';

-- New Jersey Schools
UPDATE universities SET abbreviations = 'NJIT' WHERE name = 'New Jersey Institute of Technology';
UPDATE universities SET abbreviations = 'Stevens' WHERE name = 'Stevens Institute of Technology';
UPDATE universities SET abbreviations = 'SHU' WHERE name = 'Seton Hall University';
UPDATE universities SET abbreviations = 'MSU' WHERE name = 'Montclair State University';
UPDATE universities SET abbreviations = 'TCNJ' WHERE name = 'The College of New Jersey';
UPDATE universities SET abbreviations = 'FDU' WHERE name = 'Fairleigh Dickinson University';
UPDATE universities SET abbreviations = 'WPU' WHERE name = 'William Paterson University';

-- CUNY System
UPDATE universities SET abbreviations = 'Baruch' WHERE name = 'CUNY Baruch College';
UPDATE universities SET abbreviations = 'CCNY' WHERE name = 'CUNY City College';
UPDATE universities SET abbreviations = 'Hunter' WHERE name = 'CUNY Hunter College';

-- Community Colleges
UPDATE universities SET abbreviations = 'SMC' WHERE name = 'Santa Monica College';
UPDATE universities SET abbreviations = 'PCC' WHERE name = 'Pasadena City College';
UPDATE universities SET abbreviations = 'CCSF' WHERE name = 'City College of San Francisco';
UPDATE universities SET abbreviations = 'NOVA, NVCC' WHERE name = 'Northern Virginia Community College';
UPDATE universities SET abbreviations = 'MDC' WHERE name = 'Miami Dade College';

-- Canada Universities
UPDATE universities SET abbreviations = 'UofT, Toronto' WHERE name = 'University of Toronto';
UPDATE universities SET abbreviations = 'McGill' WHERE name = 'McGill University';
UPDATE universities SET abbreviations = 'UBC' WHERE name = 'University of British Columbia';
UPDATE universities SET abbreviations = 'Waterloo, UW' WHERE name = 'University of Waterloo';
UPDATE universities SET abbreviations = 'Western, UWO' WHERE name = 'Western University';
UPDATE universities SET abbreviations = 'McMaster, Mac' WHERE name = 'McMaster University';
UPDATE universities SET abbreviations = 'Queen''s' WHERE name = 'Queen''s University';
UPDATE universities SET abbreviations = 'UOttawa' WHERE name = 'University of Ottawa';
UPDATE universities SET abbreviations = 'SFU' WHERE name = 'Simon Fraser University';
UPDATE universities SET abbreviations = 'UAlberta' WHERE name = 'University of Alberta';
UPDATE universities SET abbreviations = 'UCalgary' WHERE name = 'University of Calgary';
UPDATE universities SET abbreviations = 'UManitoba' WHERE name = 'University of Manitoba';
UPDATE universities SET abbreviations = 'Dal' WHERE name = 'Dalhousie University';
UPDATE universities SET abbreviations = 'UdeM' WHERE name = 'Université de Montréal';
UPDATE universities SET abbreviations = 'HEC' WHERE name = 'HEC Montreal';
UPDATE universities SET abbreviations = 'Concordia' WHERE name = 'Concordia University';

-- Canadian Colleges
UPDATE universities SET abbreviations = 'BCIT' WHERE name = 'BCIT';
UPDATE universities SET abbreviations = 'SAIT' WHERE name = 'SAIT';
UPDATE universities SET abbreviations = 'NAIT' WHERE name = 'NAIT';
UPDATE universities SET abbreviations = 'SaskPoly' WHERE name = 'Saskatchewan Polytechnic';
UPDATE universities SET abbreviations = 'NSCC' WHERE name = 'Nova Scotia Community College';
