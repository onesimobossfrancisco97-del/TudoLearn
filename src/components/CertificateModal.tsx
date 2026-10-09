import React from 'react';
import { X, Award, Printer } from 'lucide-react';
import { sound } from '../utils/audio';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  courseTitle: string;
  subjectName: string;
  dateStr?: string;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  studentName,
  courseTitle,
  subjectName,
  dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    sound.playClick();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border-4 border-blue-400 overflow-hidden relative my-6">
        {/* Top Controls */}
        <div className="p-4 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-sky-400" />
            <span className="text-xs font-black uppercase tracking-wider text-sky-300">
              TudoLearn Verified Certificate of Mastery
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-black transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / PDF</span>
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
        <div className="p-8 sm:p-12 bg-[#FCFAF6] border-8 border-double border-blue-700/20 text-center relative m-4 rounded-2xl print:m-0 print:border-none">
          {/* Subtle Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
            <Award className="w-96 h-96 text-blue-900" />
          </div>

          <div className="relative z-10">
            <div className="text-xs uppercase font-black tracking-widest text-blue-700 mb-2">
              TudoLearn Global Learning Academy
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 mb-2">
              Certificate of Completion
            </h1>
            <p className="text-xs font-semibold text-slate-500 mb-6 italic">
              This credential certifies outstanding mastery, intellectual discipline, and course completion.
            </p>

            <div className="text-xs text-slate-400 uppercase font-black tracking-wider mb-1">
              Awarded To
            </div>
            <div className="text-2xl sm:text-3xl font-serif font-extrabold text-blue-950 border-b-2 border-blue-200 max-w-sm mx-auto pb-1 mb-6">
              {studentName}
            </div>

            <p className="text-xs sm:text-sm font-semibold text-slate-600 max-w-md mx-auto mb-6">
              For successfully conquering all syllabus units, challenge checkpoints, and interactive drills in{' '}
              <strong className="text-slate-900 font-black">{courseTitle}</strong> ({subjectName}).
            </p>

            {/* Seal & Signatures */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-200 mt-6 max-w-lg mx-auto">
              <div className="text-left">
                <div className="text-xs font-black text-slate-800">Pip AI & Pedagogical Board</div>
                <div className="text-[10px] text-slate-400">TudoLearn Academic Council</div>
              </div>

              {/* Gold Seal with Blue Ring */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 p-1 shadow-md flex items-center justify-center ring-2 ring-blue-500">
                <div className="w-full h-full border border-dashed border-amber-800/40 rounded-full flex flex-col items-center justify-center text-amber-950 font-black text-[9px]">
                  <span>OFFICIAL</span>
                  <Award className="w-4 h-4 text-amber-900" />
                  <span>SEAL</span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-black text-slate-800">{dateStr}</div>
                <div className="text-[10px] text-slate-400">Credential ID: TUDO-{Math.floor(100000 + Math.random() * 900000)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
