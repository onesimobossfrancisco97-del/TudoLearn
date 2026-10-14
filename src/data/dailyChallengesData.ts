import { DailyChallenge } from '../types';

export const DAILY_CHALLENGES: DailyChallenge[] = [
  // 1. Guitar / Instrument Ear & Theory
  {
    id: 'dc-guitar-standard-tuning',
    dateKey: '2026-10-12',
    title: 'Guitar Strings & Acoustic Pitch Riddle',
    category: 'music',
    categoryLabel: 'Guitar & Music',
    categoryEmoji: '🎸',
    difficulty: 'Medium',
    gemsReward: 50,
    xpReward: 25,
    question: 'On a standard 6-string acoustic guitar (tuned E-A-D-G-B-E), which musical interval separates the 3rd string (G) from the 2nd string (B)?',
    context: 'All guitar string pairs are tuned in perfect 4ths (5 semitones), EXCEPT one unique pair! Can you identify the interval between the G and B strings?',
    puzzleType: 'multiple_choice',
    options: [
      'Major 3rd (4 semitones)',
      'Perfect 4th (5 semitones)',
      'Minor 3rd (3 semitones)',
      'Perfect 5th (7 semitones)',
    ],
    correctAnswer: 'Major 3rd (4 semitones)',
    explanation: 'While strings 6-5, 5-4, 4-3, and 2-1 are all tuned in Perfect 4ths (5 frets), strings 3 (G) and 2 (B) are separated by a Major 3rd (4 semitones / 4 frets). This irregularity is designed to make standard chord fingerings like E, C, and G easily playable!',
    hint: 'Count the semitones: G -> G# -> A -> A# -> B. How many half steps is that?',
    soundNote: 'G3',
    instrumentType: 'guitar',
  },

  // 2. Polyglot Word Anagram / Linguistics
  {
    id: 'dc-lang-anagram',
    dateKey: '2026-10-13',
    title: 'Polyglot Word Decryptor',
    category: 'languages',
    categoryLabel: 'Linguistics & Anagram',
    categoryEmoji: '🌍',
    difficulty: 'Medium',
    gemsReward: 60,
    xpReward: 30,
    question: 'Unscramble the 7 letters to reveal the linguistic term for words that look identical across languages but have completely different meanings!',
    context: 'Example: Spanish "éxito" means "success", not "exit". French "actuellement" means "currently", not "actually".',
    puzzleType: 'word_scramble',
    scrambleLetters: ['C', 'O', 'G', 'N', 'A', 'T', 'E'],
    correctAnswer: 'COGNATE',
    explanation: 'In linguistics, a "cognate" shares common ancestry, whereas a "false cognate" (or false friend / faux ami) tricks learners by resembling a word in their native tongue with a deceptive meaning.',
    hint: 'Starts with C, ends with E. Often paired with "false".',
  },

  // 3. Rapid Mental Math Shortcut
  {
    id: 'dc-math-rapid-calc',
    dateKey: '2026-10-14',
    title: 'Lightning Percent Trick',
    category: 'mathematics',
    categoryLabel: 'Rapid Arithmetic',
    categoryEmoji: '🧮',
    difficulty: 'Easy',
    gemsReward: 50,
    xpReward: 25,
    question: 'Calculate: What is 16% of 75?',
    context: 'Pro tip: Percentages are reversible! X% of Y = Y% of X. Therefore, 16% of 75 is exactly the same as 75% of 16!',
    puzzleType: 'math_input',
    correctAnswer: '12',
    explanation: 'Using the symmetry principle: 16% of 75 = 75% of 16. Since 75% is 3/4, 3/4 of 16 is 3 * 4 = 12! Solving in reverse turns tricky calculations into instant mental arithmetic.',
    hint: 'Compute 3/4 of 16: divide 16 by 4, then multiply by 3.',
  },

  // 4. Drums & Rhythm Meter
  {
    id: 'dc-drum-polyrhythm',
    dateKey: '2026-10-15',
    title: 'The Polyrhythm Syncopation Puzzle',
    category: 'music',
    categoryLabel: 'Drums & Rhythm',
    categoryEmoji: '🥁',
    difficulty: 'Challenging',
    gemsReward: 60,
    xpReward: 35,
    question: 'In Afro-Cuban and jazz drumming, what is the rhythmic term for playing 3 evenly spaced pulses against 2 standard beats?',
    context: 'Think of the classic spoken phrase mnemonic: "Not dif-fi-cult" or "Carol-ina".',
    puzzleType: 'multiple_choice',
    options: [
      'Hemiola (3:2 Polyrhythm)',
      'Subdivision Quintuplet',
      'Paradiddle Shuffle',
      'Inverted Flam',
    ],
    correctAnswer: 'Hemiola (3:2 Polyrhythm)',
    explanation: 'A hemiola is the ratio 3:2. In music theory, playing three beats of equal value in the time normally occupied by two beats creates a delightful rhythmic tension and groove foundational to flamenco, West African, and modern jazz!',
    hint: 'From the Greek word meaning "one and a half" (ratio 3 to 2).',
    instrumentType: 'drums',
  },

  // 5. Science & Astrophysics Enigma
  {
    id: 'dc-science-cosmic-redshift',
    dateKey: '2026-10-16',
    title: 'Cosmic Redshift & The Expanding Universe',
    category: 'science',
    categoryLabel: 'Astrophysics & Light',
    categoryEmoji: '🔭',
    difficulty: 'Medium',
    gemsReward: 50,
    xpReward: 25,
    question: 'When astronomers observe light from distant galaxies shifting toward longer red wavelengths (Redshift), what does this primarily prove?',
    context: 'Edwin Hubble noticed this Doppler-like phenomenon in 1929 using the Mount Wilson 100-inch Hooker telescope.',
    puzzleType: 'multiple_choice',
    options: [
      'Space itself is expanding, carrying galaxies away from us',
      'Stars are cooling down and losing nuclear fusion energy',
      'Interstellar dust absorbs all blue photons permanently',
      'The speed of light slows down drastically over billions of years',
    ],
    correctAnswer: 'Space itself is expanding, carrying galaxies away from us',
    explanation: 'Cosmological redshift occurs because space itself expands as photons travel through it, stretching light waves into longer (redder) wavelengths. This provided the first observational evidence for the expanding universe and the Big Bang!',
    hint: 'Think about what stretches the wave as it travels across billions of light years.',
  },

  // 6. Coding & Algorithmic Logic
  {
    id: 'dc-coding-binary-search',
    dateKey: '2026-10-17',
    title: 'Algorithmic Scale & The Power of Logarithms',
    category: 'coding',
    categoryLabel: 'Computer Science',
    categoryEmoji: '💻',
    difficulty: 'Challenging',
    gemsReward: 70,
    xpReward: 35,
    question: 'If you have a sorted array with 1,048,576 elements (2^20), what is the MAXIMUM number of comparisons needed to find any target using Binary Search?',
    context: 'Binary search cuts the remaining search space in half with every single inspection step: O(log2 N).',
    puzzleType: 'math_input',
    correctAnswer: '20',
    explanation: 'Since 2^20 = 1,048,576, binary search will halve the search pool at most 20 times before pinpointing the element (or discovering it is absent). This logarithmic efficiency is why binary search is fundamental to databases and search engines!',
    hint: '2 to the power of what equals 1,048,576? Look at 2^20.',
  },

  // 7. Piano Pitch & Harmony Ear Challenge
  {
    id: 'dc-piano-triad-harmony',
    dateKey: '2026-10-18',
    title: 'The Emotional Secret of the Minor 3rd',
    category: 'music',
    categoryLabel: 'Piano & Ear Training',
    categoryEmoji: '🎹',
    difficulty: 'Easy',
    gemsReward: 50,
    xpReward: 25,
    question: 'What is the root-third-fifth formula that distinguishes a melancholic Minor Triad from an uplifting Major Triad on the piano?',
    context: 'Listen to the interval between C and Eb compared to C and E.',
    puzzleType: 'multiple_choice',
    options: [
      'Minor Triad lowers the 3rd by one half-step (flat 3rd)',
      'Minor Triad raises the 5th by one half-step (sharp 5th)',
      'Minor Triad drops both root and 5th down an octave',
      'Minor Triad uses two consecutive augmented 4ths',
    ],
    correctAnswer: 'Minor Triad lowers the 3rd by one half-step (flat 3rd)',
    explanation: 'A Major chord consists of Root + Major 3rd (4 semitones) + Perfect 5th (7 semitones). Lowering that middle 3rd note by just one half-step (to 3 semitones) transforms the tonal character from bright and triumphant to introspective and melancholic!',
    hint: 'The 3rd note determines the mode: major vs minor.',
    soundNote: 'C4',
    instrumentType: 'piano',
  },

  // 8. Spanish Polyglot Idiom
  {
    id: 'dc-lang-spanish-idiom',
    dateKey: '2026-10-19',
    title: 'Spanish Idiomatic Riddle',
    category: 'languages',
    categoryLabel: 'Spanish Polyglot',
    categoryEmoji: '🇪🇸',
    difficulty: 'Medium',
    gemsReward: 50,
    xpReward: 25,
    question: 'If a friend in Madrid says: "¡Me estás tomando el pelo!", what are they saying in English?',
    context: 'Literally translated, it means "You are taking my hair!". But what is the true cultural meaning?',
    puzzleType: 'multiple_choice',
    options: [
      'You are pulling my leg / teasing me!',
      'You are giving me a haircut!',
      'You are making me angry!',
      'You are giving me good advice!',
    ],
    correctAnswer: 'You are pulling my leg / teasing me!',
    explanation: '"Tomar el pelo" is the Spanish equivalent of "pulling someone\'s leg" or joking around with them playfully. It dates back centuries and is one of the most widely used colloquial idioms across Spain and Latin America!',
    hint: 'Think of English idioms involving body limbs when joking around.',
  },

  // 9. Ukulele Island Chording & Re-entrant Tuning
  {
    id: 'dc-ukulele-tuning',
    dateKey: '2026-10-20',
    title: 'The Ukulele My Dog Has Fleas Mystery',
    category: 'music',
    categoryLabel: 'Ukulele Acoustics',
    categoryEmoji: '🪕',
    difficulty: 'Medium',
    gemsReward: 55,
    xpReward: 30,
    question: 'Why does a standard soprano/concert ukulele have its 4th string (G4) sound higher in pitch than the 3rd string (C4)?',
    context: 'This unique tuning style gives the ukulele its signature joyful Hawaiian chime.',
    puzzleType: 'multiple_choice',
    options: [
      'It uses re-entrant tuning (high-G), where strings are not in ascending order',
      'The 4th string is wound with steel while others are nylon',
      'The fretboard has microtonal spacing on the top string only',
      'Hawaiian traditional lutherie skips the fundamental octave',
    ],
    correctAnswer: 'It uses re-entrant tuning (high-G), where strings are not in ascending order',
    explanation: 'Unlike guitars or violins where strings descend steadily from high to low, the ukulele uses "re-entrant tuning" (g4-c4-e4-a4). The top G string is tuned one octave higher than expected, creating the iconic "My dog has fleas" chime!',
    hint: 'Look for the term "re-entrant".',
    soundNote: 'G4',
    instrumentType: 'guitar',
  },

  // 10. Neuroscience & Cognitive Riddle
  {
    id: 'dc-science-stroop-effect',
    dateKey: '2026-10-21',
    title: 'The Stroop Interference Mind Experiment',
    category: 'science',
    categoryLabel: 'Cognitive Neuroscience',
    categoryEmoji: '🧠',
    difficulty: 'Medium',
    gemsReward: 50,
    xpReward: 25,
    question: 'When asked to say the ink color of the word "RED" written in blue ink, why is your reaction time significantly slower than reading the word itself?',
    context: 'Discovered by J. Ridley Stroop in 1935, this is one of the most famous experiments in cognitive psychology.',
    puzzleType: 'multiple_choice',
    options: [
      'Reading words is an automatic learned reflex that interferes with color naming',
      'The optical nerve processes wavelengths before language centers activate',
      'The eyes physically vibrate when scanning blue vs red light spectra',
      'Short-term memory wipes color recognition after 200 milliseconds',
    ],
    correctAnswer: 'Reading words is an automatic learned reflex that interferes with color naming',
    explanation: 'Because literate humans read automatically and involuntarily, the brain\'s language processing network rapidly retrieves the word "RED" before the prefrontal cortex can suppress it and name the actual ink color "BLUE". This cognitive conflict is called the Stroop Effect!',
    hint: 'Reading is automatic for adults; naming colors requires deliberate inhibitory control.',
  },

  // 11. Mathematics Gauss Summation Trick
  {
    id: 'dc-math-gauss-sum',
    dateKey: '2026-10-22',
    title: 'The 10-Year-Old Genius Summation',
    category: 'mathematics',
    categoryLabel: 'Number Theory',
    categoryEmoji: '📐',
    difficulty: 'Challenging',
    gemsReward: 65,
    xpReward: 35,
    question: 'When 10-year-old Carl Friedrich Gauss was asked to sum all integers from 1 to 100, he answered in seconds! What is the sum of 1 + 2 + 3 + ... + 100?',
    context: 'Formula shortcut: n * (n + 1) / 2. Pair numbers: (1+100)=101, (2+99)=101, etc. 50 pairs of 101!',
    puzzleType: 'math_input',
    correctAnswer: '5050',
    explanation: 'By pairing the ends: 1+100=101, 2+99=101, up to 50+51=101, Gauss observed there are 50 pairs, each totaling 101. 50 * 101 = 5,050! The formula S = n(n+1)/2 remains one of mathematics\' most celebrated insights.',
    hint: 'Multiply 50 by 101.',
  },

  // 12. Bass Guitar Low Frequency Resonance
  {
    id: 'dc-bass-low-e',
    dateKey: '2026-10-23',
    title: 'The Deep Low-End Foundation',
    category: 'music',
    categoryLabel: 'Bass Guitar & Acoustics',
    categoryEmoji: '🎸',
    difficulty: 'Medium',
    gemsReward: 50,
    xpReward: 25,
    question: 'The lowest string on a standard 4-string electric bass (open E1) vibrates at approximately what frequency in Hertz (Hz)?',
    context: 'Human hearing spans roughly 20 Hz to 20,000 Hz. The bass guitar lives in the visceral low-frequency range you feel in your chest!',
    puzzleType: 'multiple_choice',
    options: [
      '41.2 Hz',
      '110.0 Hz',
      '220.0 Hz',
      '440.0 Hz',
    ],
    correctAnswer: '41.2 Hz',
    explanation: 'Open E1 on a standard electric bass oscillates at approximately 41.2 Hz (A0 on piano is 27.5 Hz, standard guitar low E is 82.4 Hz). Because it produces deep acoustic wavelengths over 8 meters long, bass waves physically travel through walls and floors!',
    hint: 'Standard guitar low E is 82.4 Hz. The bass is exactly one octave lower (half the frequency).',
    soundNote: 'E2',
    instrumentType: 'bass',
  },

  // 13. Polyglot Japanese Untranslatable Concept
  {
    id: 'dc-lang-japanese-concept',
    dateKey: '2026-10-24',
    title: 'The Poetry of Untranslatable Words',
    category: 'languages',
    categoryLabel: 'Japanese Polyglot',
    categoryEmoji: '🇯🇵',
    difficulty: 'Medium',
    gemsReward: 55,
    xpReward: 30,
    question: 'In Japanese, what beautiful word refers specifically to sunlight filtering gently through the leaves of trees in a forest?',
    context: 'Composed of characters for tree (木), leak/escape (漏れ), and sun (日).',
    puzzleType: 'multiple_choice',
    options: [
      'Komorebi (木漏れ日)',
      'Ikigai (生きがい)',
      'Wabi-sabi (侘寂)',
      'Kintsugi (金継ぎ)',
    ],
    correctAnswer: 'Komorebi (木漏れ日)',
    explanation: 'Komorebi (木漏れ日) expresses the dappled interplay between sunlight and leaf shadows as light filters through tree canopies. It captures a peaceful visual sensation with no direct single-word equivalent in English!',
    hint: 'The word contains "ko" (tree) and "bi" (sun).',
  },

  // 14. Chemistry Periodic Table Noble Gases
  {
    id: 'dc-science-noble-gases',
    dateKey: '2026-10-25',
    title: 'The Chemistry of Complete Valence Shells',
    category: 'science',
    categoryLabel: 'Chemistry & Elements',
    categoryEmoji: '🧪',
    difficulty: 'Easy',
    gemsReward: 50,
    xpReward: 25,
    question: 'Why do Noble Gases (Helium, Neon, Argon, Krypton, Xenon) rarely form chemical bonds with other elements under standard conditions?',
    context: 'They occupy Group 18 on the far right column of the Periodic Table.',
    puzzleType: 'multiple_choice',
    options: [
      'Their outer electron valence shell is already completely full (octet rule)',
      'Their atomic nuclei have zero neutrons to stabilize covalent bonds',
      'Their electrons travel at the speed of light, preventing molecular bonding',
      'They carry a net negative electrical charge that repels all nearby matter',
    ],
    correctAnswer: 'Their outer electron valence shell is already completely full (octet rule)',
    explanation: 'Elements form chemical bonds by sharing, gaining, or losing electrons to achieve a stable outer shell of 8 electrons (or 2 for Helium). Because noble gases already possess full valence shells, they are energetically stable and chemically inert!',
    hint: 'Think about the "octet rule" in electron configuration.',
  },

  // 15. Informatics: Binary Byte Value Calculation
  {
    id: 'dc-info-binary-calc',
    dateKey: '2026-10-26',
    title: 'Binary Byte Decryptor',
    category: 'informatics',
    categoryLabel: 'Informatics & Binary',
    categoryEmoji: '💻',
    difficulty: 'Medium',
    gemsReward: 60,
    xpReward: 30,
    question: 'Calculate the decimal integer value represented by this 8-bit binary byte: 00101011',
    context: 'Evaluate positional place values: 128, 64, 32, 16, 8, 4, 2, 1.',
    puzzleType: 'math_input',
    correctAnswer: '43',
    explanation: 'Binary 00101011 = (0 × 128) + (0 × 64) + (1 × 32) + (0 × 16) + (1 × 8) + (0 × 4) + (1 × 2) + (1 × 1) = 32 + 8 + 2 + 1 = 43 in decimal!',
    hint: 'Add 32 + 8 + 2 + 1 together.',
  },

  // 16. Informatics: Linux Permissions Riddle
  {
    id: 'dc-info-linux-chmod',
    dateKey: '2026-10-27',
    title: 'Linux Permissions Decoded',
    category: 'informatics',
    categoryLabel: 'Informatics & Linux',
    categoryEmoji: '🖥️',
    difficulty: 'Medium',
    gemsReward: 50,
    xpReward: 25,
    question: 'In Unix / Linux systems, what exact access rights does "chmod 755 app.sh" grant?',
    context: 'Remember: 7 = rwx (4+2+1), 5 = r-x (4+0+1).',
    puzzleType: 'multiple_choice',
    options: [
      'Owner: Read, Write & Execute; Group & Others: Read & Execute only',
      'Everyone on the server gets complete Read and Write access',
      'The file is encrypted with a 755-bit AES cipher key',
      'Only root superuser can read the file; everyone else is blocked',
    ],
    correctAnswer: 'Owner: Read, Write & Execute; Group & Others: Read & Execute only',
    explanation: 'In octal notation, the first digit (7) is for user/owner (4+2+1 = rwx), second digit (5) is for group (4+1 = r-x), and third digit (5) is for others (4+1 = r-x). This is the standard security permission for executable scripts and binaries!',
    hint: '7 gives full control (rwx); 5 allows reading and running (r-x).',
  },

  // 17. Informatics: Protocol Word Scramble
  {
    id: 'dc-info-protocols',
    dateKey: '2026-10-28',
    title: 'Secure Web Protocol Unscrambler',
    category: 'informatics',
    categoryLabel: 'Networking & Web',
    categoryEmoji: '🌐',
    difficulty: 'Easy',
    gemsReward: 50,
    xpReward: 25,
    question: 'Unscramble the letters to reveal the primary protocol securing e-commerce, banking, and web browsing over Port 443!',
    context: 'Combines HyperText Transfer Protocol with TLS/SSL encryption.',
    puzzleType: 'word_scramble',
    scrambleLetters: ['H', 'T', 'T', 'P', 'S'],
    correctAnswer: 'HTTPS',
    explanation: 'HTTPS (HyperText Transfer Protocol Secure) encrypts communication between the client web browser and host server using TLS/SSL, preventing eavesdropping and man-in-the-middle attacks.',
    hint: 'Starts with H and ends with S.',
  },
];

/**
 * Returns today's formatted local date key: 'YYYY-MM-DD'
 */
export function getTodayDateKey(overrideDate?: Date): string {
  const d = overrideDate || new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Deterministically select a challenge for a given date
 */
export function getDailyChallengeForDate(date?: Date): DailyChallenge {
  const targetDate = date || new Date();
  const dateKey = getTodayDateKey(targetDate);

  // Check if there is an exact date match
  const exactMatch = DAILY_CHALLENGES.find((c) => c.dateKey === dateKey);
  if (exactMatch) {
    return exactMatch;
  }

  // Otherwise, use a deterministic day-of-year index
  const startOfYear = new Date(targetDate.getFullYear(), 0, 0);
  const diff = targetDate.getTime() - startOfYear.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  const index = Math.abs(dayOfYear) % DAILY_CHALLENGES.length;
  const challenge = DAILY_CHALLENGES[index];

  return {
    ...challenge,
    dateKey,
  };
}

/**
 * Calculate countdown time remaining until next midnight (reset time)
 */
export function getTimeUntilMidnight(): {
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  formatted: string;
} {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);

  const diffMs = Math.max(0, midnight.getTime() - now.getTime());
  const totalSeconds = Math.floor(diffMs / 1000);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => String(n).padStart(2, '0');
  const formatted = `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;

  return {
    hours,
    minutes,
    seconds,
    totalSeconds,
    formatted,
  };
}
