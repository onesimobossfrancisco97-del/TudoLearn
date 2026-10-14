import React, { useState } from 'react';
import { Check, UploadCloud } from 'lucide-react';
import { Course, Exercise, SubjectType, LessonNode } from '../types';
import { sound } from '../utils/audio';

interface TeacherStudioProps {
  onPublishCourse: (newCourse: Course) => void;
  existingCourses: Course[];
}

export const TeacherStudio: React.FC<TeacherStudioProps> = ({
  onPublishCourse,
}) => {
  const [courseTitle, setCourseTitle] = useState('');
  const [subject, setSubject] = useState<SubjectType>('languages');
  const [level, setLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [description, setDescription] = useState('');
  const [lessonTitle, setLessonTitle] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [explanation, setExplanation] = useState('');
  const [publishedSuccess, setPublishedSuccess] = useState(false);

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle.trim() || !questionText.trim()) return;

    sound.playLevelUp();

    const options = [optionA, optionB, optionC, optionD].filter((o) => o.trim().length > 0);
    const exercise: Exercise = {
      id: `ex-custom-${Date.now()}`,
      type: 'multiple_choice',
      subject,
      topic: 'TudoLearn Creator Course',
      question: questionText.trim(),
      options: options.length > 0 ? options : ['True', 'False'],
      correctAnswer: correctAnswer || optionA,
      explanation: explanation || 'Great job answering this community-created question on TudoLearn!',
    };

    const newLesson: LessonNode = {
      id: `l-custom-${Date.now()}`,
      unitId: `u-custom-1`,
      subject,
      title: lessonTitle.trim() || 'Unit Introduction',
      description: 'Interactive lesson created in TudoLearn Studio.',
      xpReward: 20,
      totalExercises: 1,
      type: 'regular',
      crowns: 1,
      status: 'available',
      exercises: [exercise],
    };

    const newCourse: Course = {
      id: `course-custom-${Date.now()}`,
      subject,
      title: courseTitle.trim(),
      color: '#2563EB',
      level,
      totalLearners: '1',
      description: description.trim() || 'Custom course created in TudoLearn Studio.',
      icon: 'Sparkles',
      units: [
        {
          id: `u-custom-${Date.now()}`,
          unitNumber: 1,
          title: 'Foundation Fundamentals',
          description: 'Created by instructor.',
          color: '#2563EB',
          bannerGradient: 'from-blue-600 to-indigo-700',
          lessons: [newLesson],
        },
      ],
    };

    onPublishCourse(newCourse);
    setPublishedSuccess(true);
    setTimeout(() => setPublishedSuccess(false), 3000);

    setCourseTitle('');
    setDescription('');
    setQuestionText('');
    setOptionA('');
    setOptionB('');
    setOptionC('');
    setOptionD('');
    setCorrectAnswer('');
    setExplanation('');
  };

  return (
    <div className="w-full max-w-xl mx-auto pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-500 rounded-3xl p-6 text-white shadow-xl shadow-blue-500/10 mb-6 border border-blue-400/20">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/20 backdrop-blur-xs rounded-2xl border border-white/20">
            <UploadCloud className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black">TudoLearn Creator Studio</h1>
            <p className="text-xs text-blue-100 font-semibold mt-0.5">
              Publish custom interactive courses, quizzes, and lessons for learners.
            </p>
          </div>
        </div>
      </div>

      {publishedSuccess && (
        <div className="mb-6 p-4 bg-blue-100 border-2 border-blue-400 rounded-2xl flex items-center gap-2 text-blue-900 text-sm font-black animate-fade-in">
          <Check className="w-5 h-5 text-blue-600" />
          <span>Course published to TudoLearn! You can now select it in the course switcher.</span>
        </div>
      )}

      {/* Creation Form */}
      <form onSubmit={handlePublish} className="bg-white border-2 border-slate-200 hover:border-blue-200 transition-colors rounded-3xl p-6 shadow-xs space-y-4">
        <h2 className="text-base font-black text-slate-800 border-b border-slate-100 pb-2">
          1. Course Information
        </h2>

        <div>
          <label className="text-xs font-black uppercase text-slate-500">Course Title</label>
          <input
            type="text"
            required
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            placeholder="e.g. Japanese Hiragana Mastery or Quantum Physics Basics"
            className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-black uppercase text-slate-500">Subject</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value as SubjectType)}
              className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-black"
            >
              <option value="languages">Languages</option>
              <option value="informatics">Informatics & Computers</option>
              <option value="mathematics">Mathematics</option>
              <option value="music">Music</option>
              <option value="science">Science</option>
              <option value="coding">Coding</option>
              <option value="psychology">Psychology</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-black uppercase text-slate-500">Difficulty Level</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as any)}
              className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-black"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-black uppercase text-slate-500">Course Description</label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Briefly describe what learners will achieve..."
            className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <h2 className="text-base font-black text-slate-800 border-b border-slate-100 pb-2 pt-2">
          2. First Interactive Exercise
        </h2>

        <div>
          <label className="text-xs font-black uppercase text-slate-500">Lesson Title</label>
          <input
            type="text"
            value={lessonTitle}
            onChange={(e) => setLessonTitle(e.target.value)}
            placeholder="e.g. Fundamental Greetings"
            className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold"
          />
        </div>

        <div>
          <label className="text-xs font-black uppercase text-slate-500">Exercise Question</label>
          <input
            type="text"
            required
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="e.g. Which character represents 'A' in Hiragana?"
            className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400">Option 1</label>
            <input
              type="text"
              required
              value={optionA}
              onChange={(e) => setOptionA(e.target.value)}
              placeholder="e.g. あ (a)"
              className="w-full mt-0.5 bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-bold"
            />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400">Option 2</label>
            <input
              type="text"
              required
              value={optionB}
              onChange={(e) => setOptionB(e.target.value)}
              placeholder="e.g. い (i)"
              className="w-full mt-0.5 bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-bold"
            />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400">Option 3</label>
            <input
              type="text"
              value={optionC}
              onChange={(e) => setOptionC(e.target.value)}
              placeholder="e.g. う (u)"
              className="w-full mt-0.5 bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-bold"
            />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400">Option 4</label>
            <input
              type="text"
              value={optionD}
              onChange={(e) => setOptionD(e.target.value)}
              placeholder="e.g. え (e)"
              className="w-full mt-0.5 bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-bold"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-black uppercase text-slate-500">Correct Answer</label>
          <input
            type="text"
            required
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            placeholder="Matches one of the options above"
            className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-blue-700"
          />
        </div>

        <div>
          <label className="text-xs font-black uppercase text-slate-500">Explanation / Tip</label>
          <input
            type="text"
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            placeholder="Why this answer is correct..."
            className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium"
          />
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-sm uppercase tracking-wider rounded-2xl border-b-4 border-blue-900 active:border-b-0 active:translate-y-1 shadow-md shadow-blue-500/20 transition-all cursor-pointer mt-4"
        >
          PUBLISH COURSE TO TUDOLEARN
        </button>
      </form>
    </div>
  );
};
