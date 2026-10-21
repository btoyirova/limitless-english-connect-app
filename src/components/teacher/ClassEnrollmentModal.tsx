import React, { useState } from 'react';
import { X, Users, UserPlus, UserMinus, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { User, ClassRoom } from '../../types';
import { teacherService } from '../../services/teacherService';
import { soundEffects } from '../../services/soundEffects';
import { speechService } from '../../services/speechService';
import { storage } from '../../services/storage';

interface ClassEnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onEnrolled: () => void;
}

export const ClassEnrollmentModal: React.FC<ClassEnrollmentModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onEnrolled,
}) => {
  const [selectedClassId, setSelectedClassId] = useState<string>(() => {
    const classes = storage.getClasses();
    const bahoraClass = classes.find(
      (c) => c.teacherId === currentUser.id || c.teacherName.toLowerCase().includes('bahora')
    );
    return bahoraClass?.id || classes[0]?.id || 'class-bahora-cohort-a';
  });

  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const classes = storage.getClasses();
  const currentClass = classes.find((c) => c.id === selectedClassId) || classes[0];

  const allStudents = storage.getUsers().filter((u) => u.role === 'student' && u.isApproved);
  const enrolledStudentIds = new Set(currentClass ? currentClass.studentIds : []);

  const enrolledStudents = allStudents.filter((s) => enrolledStudentIds.has(s.id));
  const availableStudents = allStudents.filter((s) => !enrolledStudentIds.has(s.id));

  const handleEnroll = (studentId: string, studentName: string) => {
    if (!currentClass) return;
    try {
      soundEffects.playSuccess();
      teacherService.enrollStudent(currentClass.id, studentId, currentUser);
      speechService.announce(`${studentName} enrolled into ${currentClass.name}.`);
      setStatusMessage(`${studentName} successfully enrolled into your class.`);
      onEnrolled();
    } catch (err: any) {
      soundEffects.playWarning();
      setStatusMessage(err?.message || 'Failed to enroll student.');
    }
  };

  const handleUnenroll = (studentId: string, studentName: string) => {
    if (!currentClass) return;
    try {
      soundEffects.playClick();
      teacherService.unenrollStudent(currentClass.id, studentId, currentUser);
      speechService.announce(`${studentName} removed from ${currentClass.name}.`);
      setStatusMessage(`${studentName} removed from class.`);
      onEnrolled();
    } catch (err: any) {
      soundEffects.playWarning();
      setStatusMessage(err?.message || 'Failed to remove student.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="enrollment-modal-title"
    >
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 md:p-8 shadow-2xl border-4 border-purple-600 space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-black">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 text-xs font-black mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />
                <span>Authorized Teacher Roster Control</span>
              </div>
              <h2 id="enrollment-modal-title" className="text-xl md:text-2xl font-black text-slate-900">
                Enroll Students into Teacher Bahora's Class
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {statusMessage && (
          <div className="p-3 bg-purple-50 text-purple-950 border border-purple-200 rounded-xl text-xs font-bold flex items-center justify-between" role="status">
            <span>ℹ️ {statusMessage}</span>
            <button onClick={() => setStatusMessage(null)} className="underline ml-2">Dismiss</button>
          </div>
        )}

        {/* Cohort Selector */}
        <div className="space-y-1">
          <label className="text-xs font-black uppercase text-slate-700 block">Class Cohort:</label>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="w-full p-3 rounded-xl border-2 border-slate-300 font-bold text-sm bg-white focus:border-purple-600"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.studentIds.length} currently enrolled)
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Currently Enrolled */}
          <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-sm text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Enrolled in Class ({enrolledStudents.length})</span>
              </h3>
            </div>

            {enrolledStudents.length === 0 ? (
              <div className="p-6 text-center text-slate-500 font-bold bg-white rounded-xl border border-dashed border-slate-300 text-xs">
                No students enrolled yet. Add students from the right panel.
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {enrolledStudents.map((st) => (
                  <div
                    key={st.id}
                    className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-2 shadow-2xs"
                  >
                    <div>
                      <strong className="block text-xs font-black text-slate-900">{st.name}</strong>
                      <span className="text-[10px] text-slate-500">{st.email} • {st.ageGroup}</span>
                    </div>
                    <button
                      onClick={() => handleUnenroll(st.id, st.name)}
                      className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center gap-1 border border-rose-200 cursor-pointer"
                      title="Remove from class"
                    >
                      <UserMinus className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Available to Enroll */}
          <div className="p-4 bg-purple-50 rounded-2xl border-2 border-purple-200 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-sm text-purple-950 flex items-center gap-1.5">
                <UserPlus className="w-4 h-4 text-purple-700" />
                <span>Available Verified Students ({availableStudents.length})</span>
              </h3>
            </div>

            {availableStudents.length === 0 ? (
              <div className="p-6 text-center text-slate-500 font-bold bg-white rounded-xl border border-dashed border-purple-200 text-xs">
                All approved students are currently enrolled.
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {availableStudents.map((st) => (
                  <div
                    key={st.id}
                    className="p-3 bg-white rounded-xl border border-purple-200 flex items-center justify-between gap-2 shadow-2xs"
                  >
                    <div>
                      <strong className="block text-xs font-black text-slate-900">{st.name}</strong>
                      <span className="text-[10px] text-slate-500">{st.email} • {st.ageGroup}</span>
                    </div>
                    <button
                      onClick={() => handleEnroll(st.id, st.name)}
                      className="px-3 py-1 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-black text-xs flex items-center gap-1 shadow-xs cursor-pointer"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Enroll</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-sm shadow-md cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
