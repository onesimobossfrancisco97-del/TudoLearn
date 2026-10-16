import React, { useState } from 'react';
import { X, Award, Printer, Share2, Check, Sparkles, ShieldCheck } from 'lucide-react';
import { sound } from '../utils/audio';
import { AppLanguage, t } from '../utils/i18n';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  courseTitle: string;
  subjectName: string;
  level?: number;
  tier?: 'intermediate' | 'master';
  credentialId?: string;
  dateStr?: string;
  lang?: AppLanguage;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  studentName,
  courseTitle,
  subjectName,
  level = 10,
  tier = level === 5 ? 'intermediate' : 'master',
  credentialId,
  dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  lang = 'en',
}) => {
  const [copiedShare, setCopiedShare] = useState(false);

  if (!isOpen) return null;

  const generatedCredentialId =
    credentialId || `TUDO-CERT-L${level}-${Math.floor(100000 + Math.random() * 900000)}`;

  const isMaster = tier === 'master' || level === 10;

  const handlePrint = () => {
    sound.playClick();
    window.print();
  };

  const handleShare = () => {
    sound.playClick();
    const shareText = `🎓 Proud to announce that I completed Level ${level} in ${courseTitle} on TudoLearn! Credential ID: ${generatedCredentialId}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border-4 border-blue-500 overflow-hidden relative my-6">
        {/* Top Controls */}
        <div className="p-4 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className={`w-5 h-5 ${isMaster ? 'text-amber-400' : 'text-sky-400'}`} />
            <span className="text-xs font-black uppercase tracking-wider text-sky-200">
              {isMaster ? 'TudoLearn Master Certification' : 'TudoLearn Intermediate Diploma'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/15 hover:bg-white/25 rounded-xl text-xs font-black transition-colors cursor-pointer"
              title="Share credential"
            >
              {copiedShare ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-black transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{t('cert.print_pdf', lang)}</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="p-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-slate-300 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Printable Canvas Body */}
        <div
          id="tudolearn-certificate-canvas"
          className="p-6 sm:p-10 bg-[#FCFAF6] border-8 border-double border-blue-800/20 text-center relative m-3 sm:m-4 rounded-2xl print:m-0 print:border-none shadow-inner"
        >
          {/* Subtle Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
            <Award className="w-96 h-96 text-blue-900" />
          </div>

          <div className="relative z-10">
            {/* Header / Academy Name */}
            <div className="text-[11px] uppercase font-black tracking-widest text-blue-700 mb-1 flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>TUDOLEARN GLOBAL LEARNING ACADEMY</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            </div>

            <div className="inline-block bg-blue-100/70 text-blue-900 text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full mb-3 border border-blue-200">
              {isMaster ? '★ Level 10 Capstone Mastery Credential ★' : '★ Level 5 Intermediate Milestone Credential ★'}
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 mb-2">
              {isMaster ? t('cert.master_title', lang) : t('cert.intermediate_title', lang)}
            </h1>

            <p className="text-xs font-semibold text-slate-500 mb-6 italic max-w-lg mx-auto">
              {t('cert.for_completing', lang)} rigorous syllabus modules, interactive practice drills, and milestone evaluations.
            </p>

            <div className="text-xs text-slate-400 uppercase font-black tracking-wider mb-1">
              {t('cert.awarded_to', lang)}
            </div>

            <div className="text-2xl sm:text-3xl font-serif font-extrabold text-blue-950 border-b-2 border-blue-300 max-w-md mx-auto pb-1 mb-5">
              {studentName || 'Dedicated Learner'}
            </div>

            <p className="text-xs sm:text-sm font-semibold text-slate-700 max-w-lg mx-auto mb-6">
              For completing <strong className="text-blue-900 font-black">Level {level}</strong> in{' '}
              <strong className="text-slate-900 font-black">{courseTitle}</strong> ({subjectName}) with exemplary persistence and demonstrated fluency.
            </p>

            {/* Seal & Signatures */}
            <div className="flex items-center justify-between pt-6 border-t-2 border-slate-200 mt-6 max-w-lg mx-auto">
              <div className="text-left">
                <div className="text-xs font-black text-slate-900">Onesimo Boss Francisco</div>
                <div className="text-[10px] text-blue-800 font-extrabold">Founder & Executive Director</div>
                <div className="text-[9px] text-slate-400 font-semibold">TudoLearn Academic Board</div>
                <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold mt-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified Accreditation</span>
                </div>
              </div>

              {/* Gold Official Wax Seal */}
              <div
                className={`w-16 h-16 sm:w-18 sm:h-18 rounded-full p-1 shadow-md flex items-center justify-center ring-2 ${
                  isMaster
                    ? 'bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 ring-amber-500'
                    : 'bg-gradient-to-tr from-blue-600 via-sky-400 to-indigo-300 ring-blue-500'
                }`}
              >
                <div className="w-full h-full border border-dashed border-slate-900/40 rounded-full flex flex-col items-center justify-center text-slate-950 font-black text-[9px] text-center p-1">
                  <span>OFFICIAL</span>
                  <Award className="w-4 h-4 text-slate-900 my-0.5" />
                  <span>SEAL</span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-black text-slate-800">{dateStr}</div>
                <div className="text-[10px] text-slate-500 font-mono font-bold mt-0.5">{generatedCredentialId}</div>
                <div className="text-[10px] text-blue-700 font-bold mt-1">tudolearn.com/verify</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-xs gap-2">
          <span>This verified credential is officially issued by TudoLearn (Founder: <strong className="text-slate-800 font-black">Onesimo Boss Francisco</strong>).</span>
          <button
            onClick={handlePrint}
            className="text-blue-600 font-black hover:underline cursor-pointer flex items-center gap-1"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Save as PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
