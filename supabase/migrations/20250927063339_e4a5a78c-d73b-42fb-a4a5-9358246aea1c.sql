-- Insert assessment questions with correct enum values
-- JEE Questions
INSERT INTO public.assessment_questions (subject, topic, question, options, correct_answer, difficulty, stream, explanation) VALUES
('Physics', 'Mechanics', 'A projectile is launched at an angle of 45° with the horizontal. What is the range for maximum distance?', '[
  "v²/g",
  "v²sin(2θ)/g", 
  "v²cos(2θ)/g",
  "2v²/g"
]'::jsonb, 1, 'medium', 'JEE', 'For maximum range at 45°, R = v²sin(2θ)/g = v²sin(90°)/g = v²/g'),

('Physics', 'Thermodynamics', 'In an adiabatic process, which quantity remains constant?', '[
  "Temperature",
  "Pressure",
  "Volume", 
  "Entropy"
]'::jsonb, 3, 'medium', 'JEE', 'In an adiabatic process, there is no heat exchange, so entropy remains constant for a reversible process.'),

('Chemistry', 'Organic Chemistry', 'Which reagent is used for Friedel-Crafts alkylation?', '[
  "FeCl₃",
  "AlCl₃",
  "ZnCl₂",
  "CuCl₂"
]'::jsonb, 1, 'medium', 'JEE', 'AlCl₃ (Aluminum chloride) is the Lewis acid catalyst used in Friedel-Crafts alkylation reactions.'),

('Mathematics', 'Calculus', 'What is the derivative of sin(x²)?', '[
  "cos(x²)",
  "2x cos(x²)",
  "2x sin(x²)",
  "-cos(x²)"
]'::jsonb, 1, 'medium', 'JEE', 'Using chain rule: d/dx[sin(x²)] = cos(x²) × d/dx[x²] = cos(x²) × 2x = 2x cos(x²)'),

('Physics', 'Electromagnetism', 'What is the SI unit of magnetic flux?', '[
  "Tesla",
  "Weber",
  "Henry",
  "Ampere"
]'::jsonb, 1, 'medium', 'JEE', 'Weber (Wb) is the SI unit of magnetic flux. 1 Weber = 1 Tesla × 1 m²'),

('Chemistry', 'Physical Chemistry', 'Which law relates partial pressures in ideal gas mixtures?', '[
  "Boyles Law",
  "Charles Law", 
  "Daltons Law",
  "Avogadros Law"
]'::jsonb, 2, 'medium', 'JEE', 'Daltons Law states that the total pressure of a gas mixture equals the sum of partial pressures.'),

('Mathematics', 'Coordinate Geometry', 'What is the equation of a circle with center (h,k) and radius r?', '[
  "(x-h)² + (y-k)² = r",
  "(x-h)² + (y-k)² = r²",
  "(x+h)² + (y+k)² = r²", 
  "x² + y² = r²"
]'::jsonb, 1, 'medium', 'JEE', 'Standard form of circle equation: (x-h)² + (y-k)² = r² where (h,k) is center and r is radius.'),

('Physics', 'Optics', 'For a convex lens, what happens when object is at focus?', '[
  "Image at infinity",
  "Image at 2F",
  "No image formed",
  "Image at F"
]'::jsonb, 0, 'medium', 'JEE', 'When object is placed at focus of convex lens, rays become parallel and image forms at infinity.'),

('Chemistry', 'Inorganic Chemistry', 'What is the hybridization of carbon in methane?', '[
  "sp",
  "sp²", 
  "sp³",
  "sp³d"
]'::jsonb, 2, 'medium', 'JEE', 'Carbon in methane (CH₄) has tetrahedral geometry with sp³ hybridization.'),

('Mathematics', 'Probability', 'What is P(A∪B) if A and B are mutually exclusive?', '[
  "P(A) + P(B)",
  "P(A) × P(B)",
  "P(A) - P(B)",
  "P(A)/P(B)"
]'::jsonb, 0, 'medium', 'JEE', 'For mutually exclusive events, P(A∩B) = 0, so P(A∪B) = P(A) + P(B) - P(A∩B) = P(A) + P(B)');

-- NEET Questions  
INSERT INTO public.assessment_questions (subject, topic, question, options, correct_answer, difficulty, stream, explanation) VALUES
('Biology', 'Cell Biology', 'Which organelle is known as the powerhouse of the cell?', '[
  "Nucleus",
  "Mitochondria",
  "Ribosome",
  "Golgi apparatus"
]'::jsonb, 1, 'medium', 'NEET', 'Mitochondria generate ATP through cellular respiration, hence called powerhouse of the cell.'),

('Biology', 'Genetics', 'What is the probability of getting a heterozygous offspring from Aa × Aa?', '[
  "25%",
  "50%", 
  "75%",
  "100%"
]'::jsonb, 1, 'medium', 'NEET', 'Aa × Aa gives AA:Aa:aa = 1:2:1, so heterozygous (Aa) probability is 2/4 = 50%'),

('Chemistry', 'Biomolecules', 'Which bond connects amino acids in proteins?', '[
  "Glycosidic bond",
  "Peptide bond",
  "Phosphodiester bond", 
  "Hydrogen bond"
]'::jsonb, 1, 'medium', 'NEET', 'Peptide bonds form between amino acids through dehydration synthesis reaction.'),

('Physics', 'Biophysics', 'What is the power of accommodation of a normal human eye?', '[
  "1 dioptre",
  "4 dioptres",
  "10 dioptres",
  "25 dioptres"
]'::jsonb, 1, 'medium', 'NEET', 'Normal human eye can accommodate from infinity to 25cm, giving power of accommodation = 4 dioptres.'),

('Biology', 'Ecology', 'What percentage of energy is transferred to the next trophic level?', '[
  "1%",
  "10%",
  "50%", 
  "90%"
]'::jsonb, 1, 'medium', 'NEET', 'According to 10% law, only 10% of energy is transferred from one trophic level to the next.'),

('Biology', 'Human Physiology', 'Which hormone regulates blood glucose levels?', '[
  "Thyroxine",
  "Insulin",
  "Adrenaline",
  "Growth hormone"
]'::jsonb, 1, 'medium', 'NEET', 'Insulin, produced by pancreatic beta cells, lowers blood glucose by promoting glucose uptake.'),

('Chemistry', 'Coordination Compounds', 'What is the coordination number of central atom in [Cu(NH₃)₄]²⁺?', '[
  "2",
  "4",
  "6", 
  "8"
]'::jsonb, 1, 'medium', 'NEET', 'Four NH₃ ligands coordinate to Cu²⁺, so coordination number is 4.'),

('Physics', 'Electronics', 'What is the function of a transformer?', '[
  "Convert AC to DC",
  "Convert DC to AC",
  "Change voltage levels",
  "Amplify signals"
]'::jsonb, 2, 'medium', 'NEET', 'Transformer changes AC voltage levels using electromagnetic induction principle.'),

('Biology', 'Evolution', 'Who proposed the theory of natural selection?', '[
  "Lamarck",
  "Darwin", 
  "Mendel",
  "Watson"
]'::jsonb, 1, 'medium', 'NEET', 'Charles Darwin proposed the theory of evolution by natural selection in "Origin of Species".'),

('Biology', 'Plant Physiology', 'In which part of chloroplast does light reaction occur?', '[
  "Stroma",
  "Thylakoid membrane",
  "Outer membrane",
  "Intermembrane space"
]'::jsonb, 1, 'medium', 'NEET', 'Light-dependent reactions occur in thylakoid membranes where chlorophyll and photosystems are located.');