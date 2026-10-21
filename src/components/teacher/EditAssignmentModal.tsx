import React, { useState } from 'react';
import { X, Calendar, ClipboardList, CheckCircle2, Trash2, AlertCircle } from 'lucide-react';
import { User, Assignment, ClassRoom } from '../../types';
import { teacherService } from '../../services/teacherService';
import { soundEffects } from '../../services/soundEffects';
import { speechService } from '../../services/speechService';
import { storage } from '../../services/storage';

interface EditAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: Assignment | null;
  currentUser: User;
  onSaved: () => void;
}

export const EditAssignmentModal: React.FC<EditAssignmentModalProps> = ({
  isOpen,
  onClose,
  assignment,
  currentUser,
  onSaved,
}) => {
  if (!isOpen || !assignment) return null;

  const [title, setTitle] = useState(assignment.title);
  const [instructions, setInstructions] = useState(assignment.instructions || '');
  const [dueDate, setDueDate] = useState(assignment.dueDate || '');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>(assignment.studentIds || []);
  const [isDeleting, setIsDeleting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const activeStudents = storage.getUsers().filter((u) => u.role === 'student' && u.isApproved);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setStatusMessage('Assignment title cannot be empty.');
      return;
    }
    if (selectedStudentIds.length === 0) {
      setStatusMessage('Please assign to at least one student.');
      return;
    }

    try {
      soundEffects.playSuccess();
      teacherService.updateAssignment(
        assignment.id,
        {
          title: title.trim(),
          instructions: instructions.trim(),
          dueDate: dueDate || undefined,
          studentIds: selectedStudentIds,
        },
        currentUser
      );
      speechService.announce('Assignment updated successfully.');
      onSaved();
      onClose();
    } catch (err: any) {
      soundEffects.playWarning();
      setStatusMessage(err?.message || 'Failed to update assignment.');
    }
  };

  const handleDelete = () => {
    try {
      soundEffects.playClick();
      teacherService.deleteAssignment(assignment.id, currentUser);
      speechService.announce('Assignment cancelled and removed from active list.');
      onSaved();
      onClose();
    } catch (err: any) {
      soundEffects.playWarning();
      setStatusMessage(err?.message || 'Failed to delete assignment.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-asn-title"
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border-4 border-emerald-600 space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 block uppercase">Assignment Editor</span>
              <h2 id="edit-asn-title" className="text-xl md:text-2xl font-black text-slate-900">
                Edit Assignment Details
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
          <div className="p-3 bg-rose-50 text-rose-950 border border-rose-200 rounded-xl text-xs font-bold flex items-center justify-between">
            <span>⚠️ {statusMessage}</span>
            <button onClick={() => setStatusMessage(null)} className="underline ml-2">Dismiss</button>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-xs font-black uppercase text-slate-700 block mb-1">
              Assignment Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 rounded-xl border-2 border-slate-300 font-bold text-sm bg-white focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="text-xs font-black uppercase text-slate-700 block mb-1">
              Deadline / Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-3 rounded-xl border-2 border-slate-300 font-bold text-sm bg-white focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="text-xs font-black uppercase text-slate-700 block mb-1">
              Instructions & Practice Guidance
            </label>
            <textarea
              rows={3}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full p-3 rounded-xl border-2 border-slate-300 text-xs bg-white focus:border-emerald-600 font-medium"
            />
          </div>

          <div>
            <label className="text-xs font-black uppercase text-slate-700 block mb-2">
              Assign to Selected Students ({selectedStudentIds.length} selected):
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
              {activeStudents.map((st) => (
                <label key={st.id} className="p-2 bg-white rounded-lg border border-slate-200 flex items-center gap-2 text-xs font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedStudentIds.includes(st.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedStudentIds([...selectedStudentIds, st.id]);
                      } else {
                        setSelectedStudentIds(selectedStudentIds.filter((id) => id !== st.id));
                      }
                    }}
                  />
                  <span className="truncate">{st.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            {isDeleting ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-rose-700 font-bold">Confirm cancellation?</span>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-3 py-1.5 rounded-lg bg-rose-700 hover:bg-rose-800 text-white font-black text-xs cursor-pointer"
                >
                  Yes, Cancel Assignment
                </button>
                <button
                  type="button"
                  onClick={() => setIsDeleting(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-bold"
                >
                  No
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsDeleting(true)}
                className="px-4 py-2 rounded-xl text-rose-700 hover:bg-rose-50 font-bold text-xs flex items-center gap-1.5 border border-rose-200 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Cancel / Delete Assignment</span>
              </button>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs"
              >
                Close
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs shadow-md cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
