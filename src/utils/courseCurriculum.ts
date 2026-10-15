import { Course, Unit, LessonNode, Exercise, SubjectType } from '../types';

/**
 * Returns whether a level index/number requires Super TudoLearn premium access.
 * Levels 1 and 2 are 100% Free.
 * Levels 3 through 10 require Super TudoLearn.
 */
export function isLevelSuperExclusive(levelNumber: number): boolean {
  return levelNumber >= 3;
}

/**
 * Returns whether a level awards an official certificate upon completion.
 * Level 5: Intermediate Milestone Diploma
 * Level 10: Master Milestone Capstone Certificate
 */
export function getLevelCertificateInfo(levelNumber: number, courseTitle: string) {
  if (levelNumber === 5) {
    return {
      hasCertificate: true,
      level: 5,
      tier: 'intermediate' as const,
      badge: '📜 Level 5 Diploma',
      title: 'Intermediate Diploma of Proficiency',
      subtitle: `Demonstrates solid applied mastery of core ${courseTitle} skills.`,
    };
  }
  if (levelNumber === 10) {
    return {
      hasCertificate: true,
      level: 10,
      tier: 'master' as const,
      badge: '🎓 Level 10 Master Certification',
      title: 'Master Certification of Excellence',
      subtitle: `Honors complete syllabus mastery and capstone execution in ${courseTitle}.`,
    };
  }
  return null;
}

interface CurriculumTemplate {
  title: string;
  description: string;
  lessonTitles: string[];
}

const LANGUAGE_LEVEL_TEMPLATES: CurriculumTemplate[] = [
  { title: 'Foundations & Greetings', description: 'Essential hello, polite introductions, and foundational words.', lessonTitles: ['Saying Hello & Names', 'Polite Courtesies', 'Unit 1 Checkpoint'] },
  { title: 'Café & Everyday Dining', description: 'Ordering food, beverages, asking for prices and the bill.', lessonTitles: ['At the Café', 'Ordering Meals', 'Unit 2 Checkpoint'] },
  { title: 'City Transit & Directions', description: 'Navigating train stations, taxis, asking for maps and locations.', lessonTitles: ['Asking for Directions', 'Public Transportation', 'City Navigation Checkpoint'] },
  { title: 'Home, Family & Daily Routines', description: 'Describing family members, time of day, and habitual actions.', lessonTitles: ['My Family & Friends', 'Daily Habits & Clock Time', 'Daily Routine Checkpoint'] },
  { title: 'Workplace & Professional Life', description: 'Office communication, job titles, interviews, and emails.', lessonTitles: ['Workplace Dialogues', 'Writing Professional Emails', 'Milestone Level 5 Assessment'] },
  { title: 'Emotions, Opinions & Debates', description: 'Expressing your viewpoint, feelings, agreements, and disagreements.', lessonTitles: ['Sharing Personal Views', 'Expressing Feelings & Moods', 'Debate & Discussion Checkpoint'] },
  { title: 'Culture, Idioms & Slang', description: 'Unlocking native idioms, popular colloquial expressions, and humor.', lessonTitles: ['Popular Native Idioms', 'Slang & Casual Chit-chat', 'Cultural Fluency Checkpoint'] },
  { title: 'News, Travel & Media', description: 'Understanding headlines, articles, podcasts, and global events.', lessonTitles: ['Reading the News', 'Travel Stories & Reports', 'Media Immersion Checkpoint'] },
  { title: 'Complex Grammar & Stylistic Nuance', description: 'Advanced conjunctions, subjunctive moods, and elegant phrasing.', lessonTitles: ['Subtle Grammar Distinctions', 'Polished Rhetoric', 'Advanced Stylistics Checkpoint'] },
  { title: 'Master Capstone & Near-Native Fluency', description: 'Comprehensive capstone review, spontaneous speaking, and graduation.', lessonTitles: ['Capstone Conversational Review', 'Spontaneous Fluency Challenge', 'Level 10 Master Capstone Exam'] },
];

const MATH_LEVEL_TEMPLATES: CurriculumTemplate[] = [
  { title: 'Rapid Arithmetic & Operations', description: 'Mental addition, subtraction, multiplication shortcuts and logic.', lessonTitles: ['Fast Mental Math', 'Order of Operations', 'Unit 1 Checkpoint'] },
  { title: 'Fractions, Decimals & Percentages', description: 'Proportions, decimal conversions, ratios, and percentages.', lessonTitles: ['Mastering Fractions', 'Percentages & Discounts', 'Unit 2 Checkpoint'] },
  { title: 'Algebraic Expressions & Equations', description: 'Solving for unknown variables, simplification, and linear formulas.', lessonTitles: ['One-Variable Equations', 'Linear Formulas', 'Algebra Checkpoint'] },
  { title: 'Systems of Equations & Inequalities', description: 'Simultaneous equations, graphing lines, and coordinate inequalities.', lessonTitles: ['Substitution & Elimination', 'Inequalities on the Number Line', 'Systems Checkpoint'] },
  { title: 'Quadratics & Polynomials', description: 'Factoring quadratic equations, the quadratic formula, and parabolas.', lessonTitles: ['Factoring Quadratics', 'The Quadratic Formula', 'Milestone Level 5 Math Assessment'] },
  { title: 'Trigonometry & The Unit Circle', description: 'Sine, cosine, tangent ratios, Pythagorean theorem, and angles.', lessonTitles: ['Right-Triangle Trigonometry', 'The Unit Circle', 'Trigonometry Checkpoint'] },
  { title: 'Exponents & Logarithms', description: 'Logarithmic properties, exponential growth, and natural logarithms.', lessonTitles: ['Exponential Laws', 'Logarithms Decoded', 'Exponents Checkpoint'] },
  { title: 'Sequences, Series & Combinatorics', description: 'Arithmetic & geometric progressions, permutations, and probability.', lessonTitles: ['Sequences & Series', 'Permutations & Odds', 'Combinatorics Checkpoint'] },
  { title: 'Calculus Foundations & Limits', description: 'Concept of limits, derivatives, rates of change, and tangents.', lessonTitles: ['Limits & Continuity', 'Derivatives & Rates of Change', 'Calculus Prep Checkpoint'] },
  { title: 'Master Capstone: Mathematical Modeling', description: 'Real-world problem modeling, optimization, and capstone certification.', lessonTitles: ['Applied Mathematical Modeling', 'Complex Word Problem Solver', 'Level 10 Master Math Exam'] },
];

const MUSIC_LEVEL_TEMPLATES: CurriculumTemplate[] = [
  { title: 'Anatomy, Tuning & First Notes', description: 'Instrument overview, proper posture, tuning, and initial tones.', lessonTitles: ['Holding & Tuning', 'First Clear Notes', 'Unit 1 Checkpoint'] },
  { title: 'Essential Chords & Open Shapes', description: 'Fundamental chord shapes, clean finger placement, and resonance.', lessonTitles: ['Core Open Chords', 'Smooth Finger Transitions', 'Unit 2 Checkpoint'] },
  { title: 'Rhythm Dynamics & Strumming Flow', description: 'Metronome timing, quarter/eighth notes, and rhythmic groove.', lessonTitles: ['Strumming Patterns & Groove', 'Subdivisions & Metronome Drill', 'Rhythm Checkpoint'] },
  { title: 'Pentatonic Scales & Key Centers', description: 'Root notes, minor pentatonic box 1, and musical phrasing.', lessonTitles: ['Minor Pentatonic Box 1', 'Musical Riffs & Licks', 'Scales Checkpoint'] },
  { title: 'Barre Chords & Harmonic Movement', description: 'Index finger barre technique, F chord, and chromatic shifting.', lessonTitles: ['Conquering Barre Chords', 'Harmonic Progressions (I-IV-V)', 'Milestone Level 5 Music Assessment'] },
  { title: 'Arpeggios & Fingerpicking', description: 'Individual note articulation, fingerstyle accuracy, and melodic picking.', lessonTitles: ['Fingerstyle Foundations', 'Rolling Arpeggio Patterns', 'Fingerpicking Checkpoint'] },
  { title: 'Modes & Improvisational Expression', description: 'Dorian, Mixolydian moods, and expressing emotions through soloing.', lessonTitles: ['The Dorian Sound', 'Bending & Vibrato Expression', 'Improvisation Checkpoint'] },
  { title: 'Song Repertoire & Tight Timing', description: 'Playing along to backing tracks, song structure, and transitions.', lessonTitles: ['Full Song Performance', 'Dynamic Accents & Resting', 'Repertoire Checkpoint'] },
  { title: 'Advanced Soloing & Ear Training', description: 'Transcribing phrases by ear, interval recognition, and lead runs.', lessonTitles: ['Playing What You Hear', 'Speed & Articulation Drills', 'Advanced Solo Checkpoint'] },
  { title: 'Master Virtuosity & Capstone Concert', description: 'Flawless execution, solo performance, and master graduation.', lessonTitles: ['Concert Piece Performance', 'Improvised Cadenza', 'Level 10 Master Music Capstone'] },
];

const TECH_LEVEL_TEMPLATES: CurriculumTemplate[] = [
  { title: 'Core Foundations & Hardware Architecture', description: 'Binary logic, CPU cycles, RAM, storage, and computing history.', lessonTitles: ['Bits, Bytes & Memory', 'CPU & System Architecture', 'Unit 1 Checkpoint'] },
  { title: 'Command Line & Core Scripting', description: 'Navigation, bash pipelines, file permissions, and process management.', lessonTitles: ['Terminal Navigation', 'Pipes & Redirection', 'Unit 2 Checkpoint'] },
  { title: 'Data Structures & Algorithmic Logic', description: 'Arrays, hashes, stacks, queues, and Big-O computational cost.', lessonTitles: ['Arrays & Key-Value Maps', 'Big-O Complexity Analysis', 'Data Structures Checkpoint'] },
  { title: 'Networks & Internet Protocols', description: 'TCP/IP model, DNS resolution, HTTP/HTTPS, and socket connections.', lessonTitles: ['IP Addressing & Subnets', 'HTTP Requests & Headers', 'Networking Checkpoint'] },
  { title: 'Databases & Relational Queries', description: 'Relational schemas, SQL queries, JOINs, indexing, and ACID transactions.', lessonTitles: ['SELECT, WHERE & JOINs', 'Database Normalization', 'Milestone Level 5 Tech Assessment'] },
  { title: 'Security Protocols & Cyber Defense', description: 'Public key cryptography, hashing, SSL certificates, and threat vectors.', lessonTitles: ['Hashing vs Encryption', 'Common Vulnerabilities (OWASP)', 'Cybersecurity Checkpoint'] },
  { title: 'APIs, Microservices & Architecture', description: 'RESTful API contracts, JSON payloads, and distributed architecture.', lessonTitles: ['Designing REST APIs', 'Authentication & JWTs', 'System Design Checkpoint'] },
  { title: 'Cloud Infrastructure & DevOps', description: 'Docker containers, CI/CD pipelines, and cloud scaling strategies.', lessonTitles: ['Containerization with Docker', 'Automated CI/CD Pipelines', 'Cloud Deployments Checkpoint'] },
  { title: 'Performance Optimization & Debugging', description: 'Memory leaks, network latency reduction, and profiling hot paths.', lessonTitles: ['Profiling & Bottlenecks', 'Production Debugging Techniques', 'Performance Checkpoint'] },
  { title: 'Master Capstone: Enterprise Architecture', description: 'End-to-end full architecture design, resilience testing, and certification.', lessonTitles: ['High-Availability Architecture', 'Incident Response Capstone', 'Level 10 Master Tech Exam'] },
];

const DEFAULT_LEVEL_TEMPLATES: CurriculumTemplate[] = [
  { title: 'Foundations & Core Principles', description: 'Key concepts, terminology, and foundational understanding.', lessonTitles: ['Introduction & Core Terms', 'First Principles', 'Unit 1 Checkpoint'] },
  { title: 'Elementary Methods & Application', description: 'Practicing essential mechanisms and everyday examples.', lessonTitles: ['Practical Scenarios', 'Methodological Rules', 'Unit 2 Checkpoint'] },
  { title: 'Intermediate Concepts & Flow', description: 'Deepening understanding with varied case studies.', lessonTitles: ['Case Study Analysis', 'Pattern Recognition', 'Unit 3 Checkpoint'] },
  { title: 'Applied Problem Solving', description: 'Tackling real-world challenges with structured thinking.', lessonTitles: ['Problem Diagnostics', 'Applied Frameworks', 'Unit 4 Checkpoint'] },
  { title: 'Milestone 5: Advanced Synthesis', description: 'Combining all earlier knowledge into a comprehensive assessment.', lessonTitles: ['Synthesis of Concepts', 'Deep Diagnostic Exercise', 'Milestone Level 5 Assessment'] },
  { title: 'In-Depth Theory & Mechanics', description: 'Exploring underlying logic, edge cases, and nuances.', lessonTitles: ['Edge Case Exploration', 'Advanced Theory Breakdown', 'Unit 6 Checkpoint'] },
  { title: 'Real-World Case Studies', description: 'Analyzing complex real-world dynamics and practical outcomes.', lessonTitles: ['Global Case Studies', 'Strategy & Execution', 'Unit 7 Checkpoint'] },
  { title: 'High Proficiency & Critical Evaluation', description: 'Evaluating trade-offs, critiques, and advanced scenarios.', lessonTitles: ['Critical Analysis', 'Trade-off Evaluation', 'Unit 8 Checkpoint'] },
  { title: 'Professional & Expert Immersion', description: 'Operating at a professional level with rigorous standards.', lessonTitles: ['Professional Standards', 'Expert Techniques', 'Unit 9 Checkpoint'] },
  { title: 'Master Capstone & Graduation', description: 'Final capstone demonstration of complete mastery.', lessonTitles: ['Comprehensive Capstone', 'Final Defense Drill', 'Level 10 Master Exam'] },
];

function getTemplateForCourse(course: Course): CurriculumTemplate[] {
  if (course.subject === 'languages') return LANGUAGE_LEVEL_TEMPLATES;
  if (course.subject === 'mathematics') return MATH_LEVEL_TEMPLATES;
  if (course.subject === 'music' || course.id.startsWith('course-instrument-')) return MUSIC_LEVEL_TEMPLATES;
  if (course.subject === 'informatics' || course.subject === 'coding' || course.id.startsWith('course-info-')) return TECH_LEVEL_TEMPLATES;
  return DEFAULT_LEVEL_TEMPLATES;
}

/**
 * Ensures that a course has exactly 10 Levels (Units 1 to 10).
 * Existing units (e.g. Unit 1 and Unit 2) are preserved intact.
 * Missing units are filled with rich pedagogical lessons and exercises.
 */
export function ensureTenLevelsForCourse(course: Course): Course {
  if (course.units.length >= 10) return course;

  const templates = getTemplateForCourse(course);
  const existingUnits = [...course.units];
  const newUnits: Unit[] = [...existingUnits];

  for (let unitNum = existingUnits.length + 1; unitNum <= 10; unitNum++) {
    const template = templates[unitNum - 1] || DEFAULT_LEVEL_TEMPLATES[unitNum - 1];
    const unitId = `u-${course.id}-${unitNum}`;

    const lessons: LessonNode[] = template.lessonTitles.map((lessonTitle, lIdx) => {
      const isCheckpoint = lIdx === template.lessonTitles.length - 1;
      const lessonId = `l-${course.id}-${unitNum}-${lIdx + 1}`;

      // Create realistic exercises for this lesson
      const exercises: Exercise[] = [
        {
          id: `ex-${lessonId}-1`,
          type: 'multiple_choice',
          subject: course.subject,
          topic: template.title,
          question: `Regarding ${template.title}: What is the primary principle of ${lessonTitle}?`,
          options: [
            `Mastering fundamental rules and applying consistent practice in ${lessonTitle}`,
            'Skipping prerequisites and guessing answers',
            'Memorizing without contextual application',
            'Using outdated practices',
          ],
          correctAnswer: `Mastering fundamental rules and applying consistent practice in ${lessonTitle}`,
          explanation: `In ${course.title}, mastering ${lessonTitle} requires understanding core mechanics and applying them consistently.`,
          hint: 'Look for the option emphasizing solid fundamentals and consistent practice.',
          audioPrompt: course.language ? lessonTitle : undefined,
          audioLang: course.language === 'English' ? 'en-US' : course.language === 'Spanish' ? 'es-ES' : 'en-US',
        },
        {
          id: `ex-${lessonId}-2`,
          type: 'multiple_choice',
          subject: course.subject,
          topic: template.title,
          question: `Which approach produces the highest retention and mastery in Level ${unitNum}?`,
          options: [
            'Interactive active recall, spaced repetition, and real-world drill',
            'Passive scanning of notes once a month',
            'Rushing through without checking mistakes',
            'Ignoring explanations',
          ],
          correctAnswer: 'Interactive active recall, spaced repetition, and real-world drill',
          explanation: 'Cognitive science shows active retrieval combined with immediate corrective feedback provides superior retention.',
          hint: 'Select the evidence-based study method (active recall).',
        },
        {
          id: `ex-${lessonId}-3`,
          type: isCheckpoint ? 'multiple_choice' : 'sentence_order',
          subject: course.subject,
          topic: template.title,
          question: isCheckpoint
            ? `Level ${unitNum} Comprehensive Check: Validate your core understanding of ${template.title}:`
            : `Assemble the core formula or rule for ${lessonTitle}:`,
          wordBank: ['Consistent', 'practice', 'and', 'mastery', 'yield', 'great', 'results'],
          correctAnswer: isCheckpoint
            ? 'Consistent practice and deliberate study yield mastery'
            : 'Consistent practice and mastery yield great results',
          options: isCheckpoint
            ? [
                'Consistent practice and deliberate study yield mastery',
                'Success happens without effort or study',
                'Knowledge remains static forever',
                'Only theory matters, never practice',
              ]
            : undefined,
          explanation: `Successfully finishing Level ${unitNum} demonstrates strong dedication and solid conceptual grounding.`,
          hint: isCheckpoint ? 'Choose the positive statement of deliberate study.' : 'Start with "Consistent".',
        },
      ];

      return {
        id: lessonId,
        unitId,
        subject: course.subject,
        title: lessonTitle,
        description: `Explore ${lessonTitle.toLowerCase()} in depth for Level ${unitNum}.`,
        xpReward: isCheckpoint ? 35 : 20,
        totalExercises: exercises.length,
        type: isCheckpoint ? 'checkpoint' : 'regular',
        crowns: 0,
        status: 'locked',
        exercises,
      };
    });

    // Add a reward chest after milestone checkpoints
    if (unitNum === 3 || unitNum === 6 || unitNum === 9) {
      lessons.push({
        id: `l-${course.id}-${unitNum}-chest`,
        unitId,
        subject: course.subject,
        title: `Level ${unitNum} Treasure Chest`,
        description: 'Claim your bonus study gems for reaching this milestone!',
        xpReward: 10,
        totalExercises: 0,
        type: 'chest',
        crowns: 0,
        status: 'locked',
        exercises: [],
      });
    }

    newUnits.push({
      id: unitId,
      unitNumber: unitNum,
      title: `Level ${unitNum}: ${template.title}`,
      description: template.description,
      color: course.color || '#2563EB',
      bannerGradient:
        unitNum <= 2
          ? 'from-blue-600 via-indigo-600 to-sky-500'
          : unitNum === 5
          ? 'from-amber-600 via-orange-600 to-yellow-500'
          : unitNum === 10
          ? 'from-emerald-600 via-teal-600 to-cyan-500'
          : 'from-indigo-700 via-purple-700 to-blue-700',
      lessons,
    });
  }

  return {
    ...course,
    units: newUnits,
  };
}

/**
 * Maps an array of courses so that EVERY course is guaranteed to have all 10 Levels.
 */
export function enhanceAllCoursesWithTenLevels(courses: Course[]): Course[] {
  return courses.map(ensureTenLevelsForCourse);
}
