import { LessonNode, Course, SubjectType } from '../types';

export interface ConceptItem {
  title: string;
  explanation: string;
  example?: string;
}

export interface VocabularyItem {
  term: string;
  definition: string;
  audioPrompt?: string;
  audioLang?: string;
}

export interface FlashcardItem {
  id: string;
  front: string;
  back: string;
  category: string;
  hint?: string;
  audioPrompt?: string;
  audioLang?: string;
}

export interface LessonStudyGuide {
  lessonId: string;
  title: string;
  subject: SubjectType;
  overview: string;
  keyConcepts: ConceptItem[];
  vocabulary: VocabularyItem[];
  proTips: string[];
  flashcards: FlashcardItem[];
}

/**
 * Extracts and synthesizes rich study notes and flashcards for any lesson
 */
export function getLessonStudyGuide(lesson: LessonNode, course?: Course): LessonStudyGuide {
  const subject = lesson.subject;
  const exercises = lesson.exercises || [];

  // Generate vocabulary from exercises
  const vocabulary: VocabularyItem[] = [];
  const flashcards: FlashcardItem[] = [];
  const keyConcepts: ConceptItem[] = [];

  exercises.forEach((ex, idx) => {
    // If multiple choice or translation with audioPrompt
    if (ex.audioPrompt || ex.correctAnswer) {
      const term = ex.audioPrompt || ex.correctAnswer;
      const def = ex.explanation || ex.question;

      vocabulary.push({
        term,
        definition: def,
        audioPrompt: ex.audioPrompt || ex.correctAnswer,
        audioLang: ex.audioLang || (subject === 'languages' ? 'es-ES' : 'en-US'),
      });

      flashcards.push({
        id: `fc-${lesson.id}-${idx}`,
        front: ex.question.replace('Which of the following means ', '').replace('Translate: ', ''),
        back: `${ex.correctAnswer} — ${ex.explanation}`,
        category: ex.topic || 'Core Concept',
        hint: ex.hint,
        audioPrompt: ex.audioPrompt || ex.correctAnswer,
        audioLang: ex.audioLang,
      });
    }

    if (ex.topic && !keyConcepts.some((c) => c.title === ex.topic)) {
      keyConcepts.push({
        title: ex.topic,
        explanation: ex.explanation,
        example: ex.correctAnswer ? `Example: "${ex.correctAnswer}"` : undefined,
      });
    }
  });

  // Domain-specific tailored study notes
  let overview = `In this lesson, you explore "${lesson.title}". Focus on understanding the core logic, practicing pronunciation or syntax, and reviewing key patterns before jumping into the exercises.`;
  const proTips: string[] = [
    'Read through the concepts and key terms first before attempting the quiz.',
    'Use the audio button to hear native pronunciation and rhythm.',
    'Test yourself with the interactive flashcards to build long-term memory.',
  ];

  if (subject === 'languages') {
    overview = `Welcome to "${lesson.title}"! Language mastery comes from combining active vocabulary, natural sentence rhythms, and spoken repetition. Review the terms below and listen carefully to the native audio before taking the quiz.`;
    proTips.push('Say each word out loud 3 times to engage muscle memory.');
  } else if (subject === 'coding' || subject === 'informatics') {
    overview = `In "${lesson.title}", you will understand essential computational concepts, algorithms, and syntax. Breaking down complex code into simple inputs and outputs is the key to mastery.`;
    proTips.push('Pay attention to data types, variable scopes, and boundary conditions.');
  } else if (subject === 'music') {
    overview = `In "${lesson.title}", you will learn note positions, harmonic intervals, and rhythm timing. Ear training and tactile finger placements work together to create music.`;
    proTips.push('Hum or sing the note pitch to train your inner ear as you practice.');
  } else if (subject === 'mathematics') {
    overview = `In "${lesson.title}", math is about recognizing patterns and applying step-by-step principles to solve problems with confidence.`;
    proTips.push('Break formulas into smaller pieces and verify with simple numbers first.');
  }

  // Ensure we have at least 2 key concepts if none were generated
  if (keyConcepts.length === 0) {
    keyConcepts.push(
      {
        title: 'Core Fundamentals',
        explanation: lesson.description || 'Master the primary rules and concepts of this module.',
      },
      {
        title: 'Practical Application',
        explanation: 'Apply these ideas in real-world scenarios and interactive challenges.',
      }
    );
  }

  return {
    lessonId: lesson.id,
    title: lesson.title,
    subject: lesson.subject,
    overview,
    keyConcepts,
    vocabulary: vocabulary.slice(0, 8),
    proTips,
    flashcards: flashcards.length > 0 ? flashcards : [
      {
        id: `fc-default-${lesson.id}`,
        front: lesson.title,
        back: lesson.description,
        category: 'Lesson Summary',
      },
    ],
  };
}
