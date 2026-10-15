import React, { useState, useEffect } from 'react';
import {
  Check,
  UploadCloud,
  Link2,
  Settings,
  Shield,
  ExternalLink,
  Sparkles,
  BookOpen,
  DollarSign,
  Eye,
  CreditCard,
  Cloud,
} from 'lucide-react';
import { Course, Exercise, SubjectType, LessonNode, PaymentConfig } from '../types';
import { sound } from '../utils/audio';
import { getPaymentConfig, fetchRemotePaymentConfig, DEFAULT_PAYMENT_CONFIG } from '../utils/paymentConfig';
import { PaymentConfigModal } from './PaymentConfigModal';
import { SubscriptionModal } from './SubscriptionModal';

interface TeacherStudioProps {
  onPublishCourse: (newCourse: Course) => void;
  existingCourses: Course[];
  onPreviewStudentSubscription?: () => void;
}

export const TeacherStudio: React.FC<TeacherStudioProps> = ({
  onPublishCourse,
  existingCourses: _existingCourses,
}) => {
  // Studio management active sub-tab: 'courses' or 'monetization'
  const [managementTab, setManagementTab] = useState<'courses' | 'monetization'>('courses');

  // Course creation state
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

  // Management Payment Links state
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig>(() => getPaymentConfig());
  const [isPaymentConfigOpen, setIsPaymentConfigOpen] = useState(false);
  const [previewStudentModalOpen, setPreviewStudentModalOpen] = useState(false);

  useEffect(() => {
    fetchRemotePaymentConfig().then((remote) => {
      if (remote) setPaymentConfig(remote);
    });
  }, []);

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
      {/* Header with Management Branding */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-500 rounded-3xl p-5 sm:p-6 text-white shadow-xl shadow-blue-500/10 mb-5 border border-blue-400/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 backdrop-blur-xs rounded-2xl border border-white/20">
              <Shield className="w-7 h-7 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black">Management Studio</h1>
                <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Owner
                </span>
              </div>
              <p className="text-xs text-blue-100 font-semibold mt-0.5">
                Publish custom curriculum & manage payment gateways
              </p>
            </div>
          </div>
        </div>

        {/* Management Tab Selector */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-white/15">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setManagementTab('courses');
            }}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-black text-xs transition-all cursor-pointer ${
              managementTab === 'courses'
                ? 'bg-white text-blue-800 shadow-md'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Course Publisher</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setManagementTab('monetization');
            }}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-black text-xs transition-all cursor-pointer ${
              managementTab === 'monetization'
                ? 'bg-white text-blue-800 shadow-md'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <DollarSign className="w-4 h-4 text-amber-500" />
            <span>Payment Links (Management)</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          MANAGEMENT SECTION: PAYMENT & MONETIZATION SETTINGS (MANAGEMENT ONLY)
          ========================================================================= */}
      {managementTab === 'monetization' && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-black text-slate-800 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <span>Stripe & PayPal Payment Links</span>
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  The Edit Link option is exclusively configured here on your management side.
                </p>
              </div>

              {/* Edit Link Button (Management Side) */}
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setIsPaymentConfigOpen(true);
                }}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Settings className="w-4 h-4" />
                <span>Edit Links</span>
              </button>
            </div>

            {/* Config Summary Cards */}
            <div className="space-y-3">
              {/* Active Provider */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-black tracking-wider text-slate-400">
                    Payment Gateway Provider
                  </div>
                  <div className="text-sm font-black text-slate-800 capitalize mt-0.5">
                    {paymentConfig.provider === 'stripe'
                      ? 'Stripe Payment Links'
                      : paymentConfig.provider === 'lemonsqueezy'
                      ? 'Lemon Squeezy Checkout'
                      : 'PayPal Direct'}
                  </div>
                </div>
                <span className="text-[10px] font-black bg-blue-100 text-blue-700 px-2.5 py-1 rounded-lg">
                  Active
                </span>
              </div>

              {/* Annual Plan URL */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-black text-slate-700">Annual Plan Link ($59.99/yr):</span>
                  {paymentConfig.yearlyPaymentUrl && (
                    <a
                      href={paymentConfig.yearlyPaymentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 font-bold hover:underline flex items-center gap-1 text-[11px]"
                    >
                      <span>Test Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="text-xs text-slate-700 font-mono truncate flex-1">
                    {paymentConfig.yearlyPaymentUrl || DEFAULT_PAYMENT_CONFIG.yearlyPaymentUrl}
                  </span>
                </div>
              </div>

              {/* Monthly Plan URL */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-black text-slate-700">Monthly Plan Link ($9.99/mo):</span>
                  {paymentConfig.monthlyPaymentUrl && (
                    <a
                      href={paymentConfig.monthlyPaymentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 font-bold hover:underline flex items-center gap-1 text-[11px]"
                    >
                      <span>Test Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="text-xs text-slate-700 font-mono truncate flex-1">
                    {paymentConfig.monthlyPaymentUrl || DEFAULT_PAYMENT_CONFIG.monthlyPaymentUrl}
                  </span>
                </div>
              </div>

              {/* Database Sync Status */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs font-bold text-emerald-800">
                <Cloud className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Payment links automatically sync with Cloud Firestore (<code className="font-mono text-[11px]">appSettings/paymentConfig</code>).
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setIsPaymentConfigOpen(true);
                }}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Settings className="w-4 h-4" />
                <span>Edit Payment Links</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setPreviewStudentModalOpen(true);
                }}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Eye className="w-4 h-4 text-slate-500" />
                <span>Preview Student View</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          COURSE PUBLISHING SECTION
          ========================================================================= */}
      {managementTab === 'courses' && (
        <>
          {publishedSuccess && (
            <div className="mb-5 p-4 bg-blue-100 border-2 border-blue-400 rounded-2xl flex items-center gap-2 text-blue-900 text-sm font-black animate-fade-in">
              <Check className="w-5 h-5 text-blue-600" />
              <span>Course published to TudoLearn! You can now select it in the course switcher.</span>
            </div>
          )}

          {/* Creation Form */}
          <form onSubmit={handlePublish} className="bg-white border-2 border-slate-200 hover:border-blue-200 transition-colors rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h2 className="text-base font-black text-slate-800">
                1. Course Information
              </h2>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setManagementTab('monetization');
                }}
                className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-1"
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>Payment Settings</span>
              </button>
            </div>

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
        </>
      )}

      {/* Payment Configuration Modal (Triggered by Manager) */}
      <PaymentConfigModal
        isOpen={isPaymentConfigOpen}
        onClose={() => setIsPaymentConfigOpen(false)}
        onConfigSaved={(updated) => {
          setPaymentConfig(updated);
        }}
      />

      {/* Preview Student View Modal (Shows exact student experience: No Edit Link) */}
      {previewStudentModalOpen && (
        <SubscriptionModal
          isOpen={previewStudentModalOpen}
          onClose={() => setPreviewStudentModalOpen(false)}
          onSubscribeSuccess={() => setPreviewStudentModalOpen(false)}
          isManagement={false}
        />
      )}
    </div>
  );
};
