import React, { useState } from 'react';
import { X, UserPlus, Shield, Volume2, CheckCircle2 } from 'lucide-react';
import { UserRole, AgeGroup, VisionPreference } from '../types';
import { speechService } from '../services/speechService';
import { soundEffects } from '../services/soundEffects';
import { storage } from '../services/storage';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegistered: () => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  onRegistered
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('child');
  const [age, setAge] = useState<number>(12);
  const [visionPreference, setVisionPreference] = useState<VisionPreference>('low-vision-large-text');
  const [nativeLanguage, setNativeLanguage] = useState('Arabic');
  const [bioText, setBioText] = useState('');
  const [agreedToSafety, setAgreedToSafety] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const teacherUser = storage.getUsers().find((u) => u.role === 'teacher' && u.isApproved);
  const teacherName = teacherUser ? teacherUser.name : 'Teacher Bahora';

  const handleReadExplanation = () => {
    soundEffects.playClick();
    speechService.speak(
      `Student registration for Limitless English Connect. Please enter your name, select whether you are a child or an adult learner, and choose your vision preferences. For safety, new students are reviewed by ${teacherName} before starting conversations.`,
      true
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (!agreedToSafety) return;

    soundEffects.playSuccess();

    const colors = ['bg-blue-600', 'bg-emerald-600', 'bg-indigo-600', 'bg-amber-600', 'bg-purple-600', 'bg-teal-600'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    storage.registerUser({
      name: name.trim(),
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '')}@student.limitless.org`,
      role,
      ageGroup,
      age: Number(age) || undefined,
      visionPreference,
      nativeLanguage,
      bioText: bioText.trim() || 'Excited to practice beginner English speaking!',
      avatarColor: randomColor
    });

    setIsSuccess(true);
    speechService.announce(`Registration successful for ${name}. Your profile is sent for teacher review.`);
    onRegistered();

    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="register-title"
    >
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl border-4 border-blue-600 relative max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-blue-100 text-blue-800">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <h2 id="register-title" className="text-xl md:text-2xl font-black text-slate-900">
                Register as a New Learner
              </h2>
              <p className="text-sm text-slate-600">Join our welcoming beginner English voice community</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 focus:ring-4 focus:ring-blue-600"
            aria-label="Close registration dialog"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3" role="alert">
            <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto animate-bounce" />
            <h3 className="text-2xl font-black text-slate-900">Welcome, {name}!</h3>
            <p className="text-base text-slate-700 max-w-md mx-auto">
              Your registration has been created. {teacherName} will safely pair you with an approved speaking partner!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <button
              type="button"
              onClick={handleReadExplanation}
              className="w-full py-2.5 px-3 rounded-xl bg-blue-50 border-2 border-blue-300 text-blue-900 font-bold flex items-center justify-center gap-2 hover:bg-blue-100 focus:ring-4 focus:ring-blue-600"
              aria-label="Listen to registration instructions"
            >
              <Volume2 className="w-5 h-5 text-blue-700" />
              <span>Listen to Registration Instructions</span>
            </button>

            {/* Name Input */}
            <div>
              <label htmlFor="reg-name" className="block text-sm font-black text-slate-900 mb-1">
                Your Full Name or First Name *
              </label>
              <input
                id="reg-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Fatima, Alex, Marcus"
                className="w-full p-3.5 rounded-xl border-2 border-slate-300 text-base font-semibold focus:border-blue-600 focus:ring-4 focus:ring-blue-200"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="reg-email" className="block text-sm font-black text-slate-900 mb-1">
                Email Address (Parent or Learner)
              </label>
              <input
                id="reg-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="learner@example.com"
                className="w-full p-3.5 rounded-xl border-2 border-slate-300 text-base font-semibold focus:border-blue-600 focus:ring-4 focus:ring-blue-200"
              />
            </div>

            {/* Role & Age Group Safeguard */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-black text-slate-900 mb-1">
                  Age Category (Safety Guard) *
                </label>
                <select
                  value={ageGroup}
                  onChange={(e) => {
                    const newGroup = e.target.value as AgeGroup;
                    setAgeGroup(newGroup);
                    setAge(newGroup === 'child' ? 12 : 25);
                  }}
                  className="w-full p-3.5 rounded-xl border-2 border-slate-300 font-bold text-slate-900 focus:border-blue-600 focus:ring-4 focus:ring-blue-200 bg-white"
                >
                  <option value="child">Child / Minor (Under 18)</option>
                  <option value="adult">Adult Learner (18 and above)</option>
                </select>
                <p className="text-xs text-slate-500 mt-1">
                  Minors and adults are kept strictly in separate cohorts.
                </p>
              </div>

              <div>
                <label htmlFor="reg-age" className="block text-sm font-black text-slate-900 mb-1">
                  Age (Years)
                </label>
                <input
                  id="reg-age"
                  type="number"
                  min="6"
                  max="99"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full p-3.5 rounded-xl border-2 border-slate-300 text-base font-bold focus:border-blue-600 focus:ring-4 focus:ring-blue-200"
                />
              </div>
            </div>

            {/* Vision Preference */}
            <div>
              <label className="block text-sm font-black text-slate-900 mb-1">
                Visual or Accessibility Needs
              </label>
              <select
                value={visionPreference}
                onChange={(e) => setVisionPreference(e.target.value as VisionPreference)}
                className="w-full p-3.5 rounded-xl border-2 border-slate-300 font-bold text-slate-900 focus:border-blue-600 focus:ring-4 focus:ring-blue-200 bg-white"
              >
                <option value="low-vision-large-text">Low Vision (Large text & tactile buttons)</option>
                <option value="high-contrast">High Contrast Mode (Yellow / Dark)</option>
                <option value="screen-reader">Screen Reader (NVDA / JAWS / VoiceOver user)</option>
                <option value="standard">Standard Accessibility</option>
              </select>
            </div>

            {/* Native Language */}
            <div>
              <label htmlFor="reg-native" className="block text-sm font-black text-slate-900 mb-1">
                Native Language (First Language)
              </label>
              <input
                id="reg-native"
                type="text"
                value={nativeLanguage}
                onChange={(e) => setNativeLanguage(e.target.value)}
                placeholder="e.g. Arabic, Spanish, French, Japanese"
                className="w-full p-3.5 rounded-xl border-2 border-slate-300 text-base font-semibold focus:border-blue-600 focus:ring-4 focus:ring-blue-200"
              />
            </div>

            {/* Safety Pledge */}
            <div className="p-4 rounded-2xl bg-blue-50 border-2 border-blue-200 space-y-2">
              <div className="flex items-center gap-2 text-blue-900 font-black text-sm">
                <Shield className="w-5 h-5 text-blue-700 shrink-0" />
                <span>Limitless English Safety Pledge</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                I agree to use kind, respectful language, practice beginner English, and keep all personal phone numbers and private addresses strictly confidential.
              </p>
              <label className="flex items-center gap-3 pt-2 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={agreedToSafety}
                  onChange={(e) => setAgreedToSafety(e.target.checked)}
                  className="w-5 h-5 rounded text-blue-600 focus:ring-blue-600"
                />
                <span className="text-sm font-bold text-slate-900">
                  I understand and agree to the safety guidelines
                </span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-3 rounded-xl border-2 border-slate-300 font-bold text-slate-700 hover:bg-slate-100 focus:ring-4 focus:ring-slate-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!agreedToSafety || !name.trim()}
                className="px-8 py-3 rounded-xl bg-blue-700 text-white font-black hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-4 focus:ring-blue-600 shadow-md text-base"
              >
                Create Account & Join
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
