import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Shield, Volume2, CheckCircle2, AlertTriangle, Key } from 'lucide-react';
import { UserRole, AgeGroup, VisionPreference, User } from '../types';
import { supabaseService } from '../services/supabase';
import { soundEffects } from '../services/soundEffects';
import { speechService } from '../services/speechService';
import { storage } from '../services/storage';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'register';
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  onClose,
  onAuthSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('adult');
  const [age, setAge] = useState<number>(24);
  const [visionPreference, setVisionPreference] = useState<VisionPreference>('low-vision-large-text');
  const [nativeLanguage, setNativeLanguage] = useState('Arabic');
  const [guardianConsent, setGuardianConsent] = useState(false);
  const [safetyPledge, setSafetyPledge] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const isConfigured = supabaseService.isConfigured();

  const handleReadInstructions = () => {
    soundEffects.playClick();
    if (mode === 'login') {
      speechService.speak('Login form. Enter your registered email address and password to log into Limitless English Connect.', true);
    } else {
      speechService.speak('Student registration form. Enter your name, email, password, and specify if you are a child under 18 or an adult learner. For minors, parent or guardian consent is strictly required.', true);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessNotice(null);
    setIsLoading(true);

    if (!isConfigured) {
      // Fallback demo login if cloud backend not yet configured
      const localUsers = storage.getUsers();
      const found = localUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (found) {
        soundEffects.playSuccess();
        storage.setCurrentUser(found.id);
        onAuthSuccess(found);
        setIsLoading(false);
        onClose();
        return;
      } else {
        setIsLoading(false);
        setErrorMessage('User not found in local demo. To test multi-device cloud authentication, please connect your free Supabase project.');
        return;
      }
    }

    const { user, error } = await supabaseService.signIn(email.trim(), password);
    setIsLoading(false);

    if (error || !user) {
      soundEffects.playTone(280, 0.25, 'sawtooth');
      setErrorMessage(error || 'Invalid email or password.');
      speechService.announce(`Sign in failed: ${error || 'Invalid credentials'}`);
    } else {
      soundEffects.playSuccess();
      speechService.announce(`Welcome back, ${user.name}!`);
      onAuthSuccess(user);
      onClose();
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessNotice(null);

    if (!name.trim()) {
      setErrorMessage('Please enter your name.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (ageGroup === 'child' && !guardianConsent) {
      setErrorMessage('Safeguard requirement: Parent or guardian consent is mandatory for learners under 18.');
      return;
    }
    if (!safetyPledge) {
      setErrorMessage('Please accept the Limitless English community safety pledge.');
      return;
    }

    setIsLoading(true);

    if (!isConfigured) {
      // Fallback to local registration if cloud backend not configured
      const registered = storage.registerUser({
        name: name.trim(),
        email: email.trim(),
        role,
        ageGroup,
        age: Number(age) || 12,
        visionPreference,
        nativeLanguage,
        avatarColor: 'bg-blue-600',
        bioText: 'Student registered in demo mode'
      });
      setIsLoading(false);
      soundEffects.playSuccess();
      onAuthSuccess(registered);
      onClose();
      return;
    }

    const res = await supabaseService.signUp({
      email: email.trim(),
      password,
      name: name.trim(),
      role: 'student',
      ageGroup,
      age: Number(age) || undefined,
      visionPreference,
      nativeLanguage,
      guardianConsent
    });

    setIsLoading(false);

    if (res.error) {
      soundEffects.playTone(280, 0.25, 'sawtooth');
      setErrorMessage(res.error);
      speechService.announce(`Registration error: ${res.error}`);
    } else if (res.needsEmailConfirmation) {
      soundEffects.playSuccess();
      setSuccessNotice(`Registration submitted! Supabase sent a verification email to ${email}. Please confirm it to log in.`);
      speechService.announce('Registration submitted. Check your email for verification.');
    } else if (res.user) {
      soundEffects.playSuccess();
      setSuccessNotice(`Account created successfully! Status: ${res.user.isApproved ? 'Approved' : 'Pending Teacher Approval'}.`);
      speechService.announce(`Welcome, ${res.user.name}. Your account is registered.`);
      setTimeout(() => {
        if (res.user) onAuthSuccess(res.user);
        onClose();
      }, 1500);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border-4 border-blue-600 relative max-h-[92vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-100 text-blue-800">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h2 id="auth-modal-title" className="text-xl md:text-2xl font-black text-slate-900">
                {mode === 'login' ? 'Student & Teacher Login' : 'Register New Learner'}
              </h2>
              <p className="text-xs text-slate-600">
                {isConfigured ? 'Connected to Cloud PostgreSQL Database' : 'Local Preview Mode (Connect Supabase for multi-device sync)'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 focus:ring-4 focus:ring-blue-600"
            aria-label="Close authentication modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cloud Status Banner */}
        {!isConfigured && (
          <div className="my-4 p-3 rounded-2xl bg-slate-100 border-2 border-slate-200 flex items-center justify-between gap-3 text-xs">
            <div className="text-slate-800 font-semibold">
              <strong className="block text-slate-900">Local Testing Mode:</strong>
              Single-browser session active.
            </div>
          </div>
        )}

        {/* Tab Selector */}
        <div className="grid grid-cols-2 gap-2 my-4 p-1 bg-slate-100 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMessage(null);
              soundEffects.playClick();
            }}
            className={`py-2.5 rounded-xl font-black text-sm transition-all ${
              mode === 'login'
                ? 'bg-blue-700 text-white shadow-sm'
                : 'text-slate-700 hover:text-slate-900'
            }`}
            aria-selected={mode === 'login'}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMessage(null);
              soundEffects.playClick();
            }}
            className={`py-2.5 rounded-xl font-black text-sm transition-all ${
              mode === 'register'
                ? 'bg-blue-700 text-white shadow-sm'
                : 'text-slate-700 hover:text-slate-900'
            }`}
            aria-selected={mode === 'register'}
          >
            Create Account
          </button>
        </div>

        {/* Read instructions aloud */}
        <button
          type="button"
          onClick={handleReadInstructions}
          className="w-full mb-4 py-2 px-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 font-bold text-xs flex items-center justify-center gap-2 hover:bg-blue-100 focus:ring-4 focus:ring-blue-400"
          aria-label="Listen to form instructions aloud"
        >
          <Volume2 className="w-4 h-4 text-blue-700" />
          <span>Listen to Instructions Aloud</span>
        </button>

        {errorMessage && (
          <div className="p-3 mb-4 rounded-xl bg-rose-100 border-2 border-rose-400 text-rose-950 font-bold text-xs flex items-start gap-2" role="alert">
            <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successNotice && (
          <div className="p-3 mb-4 rounded-xl bg-emerald-100 border-2 border-emerald-400 text-emerald-950 font-bold text-xs flex items-start gap-2" role="alert">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="block text-sm font-black text-slate-900 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-slate-300 font-semibold focus:border-blue-600 focus:ring-4 focus:ring-blue-200"
                />
              </div>
            </div>

            <div>
              <label htmlFor="login-password" className="block text-sm font-black text-slate-900 mb-1">
                Password *
              </label>
              <div className="relative">
                <Key className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  id="login-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-slate-300 font-semibold focus:border-blue-600 focus:ring-4 focus:ring-blue-200"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-black text-base shadow-md focus:ring-4 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? 'Signing In...' : 'Sign In to Limitless English'}
            </button>
          </form>
        ) : (
          /* REGISTRATION FORM */
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label htmlFor="reg-name" className="block text-sm font-black text-slate-900 mb-1">
                Learner Full Name *
              </label>
              <input
                id="reg-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Amina, Carlos"
                className="w-full p-3 rounded-xl border-2 border-slate-300 font-semibold focus:border-blue-600 focus:ring-4 focus:ring-blue-200"
              />
            </div>

            <div>
              <label htmlFor="reg-email" className="block text-sm font-black text-slate-900 mb-1">
                Email Address *
              </label>
              <input
                id="reg-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@example.com"
                className="w-full p-3 rounded-xl border-2 border-slate-300 font-semibold focus:border-blue-600 focus:ring-4 focus:ring-blue-200"
              />
            </div>

            <div>
              <label htmlFor="reg-password" className="block text-sm font-black text-slate-900 mb-1">
                Create Password (min. 6 characters) *
              </label>
              <input
                id="reg-password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 rounded-xl border-2 border-slate-300 font-semibold focus:border-blue-600 focus:ring-4 focus:ring-blue-200"
              />
            </div>

            {/* Age Group Selector (Adult-only for Phase 1 testing) */}
            <div>
              <label className="block text-sm font-black text-slate-900 mb-1">
                Learner Cohort Category *
              </label>
              <div className="p-3.5 rounded-xl border-2 border-slate-300 bg-slate-50 flex items-center justify-between">
                <div>
                  <span className="block font-bold text-slate-900 text-sm">Adult Learner (18 and older)</span>
                  <span className="block text-xs text-slate-500 mt-0.5">
                    Phase 1 Testing: Adult accounts only. Minors onboarding opens in Phase 2 with verified consent.
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 text-xs font-black">
                  Active Testing Cohort
                </span>
              </div>
            </div>


            {/* Safety Pledge */}
            <label className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={safetyPledge}
                onChange={(e) => setSafetyPledge(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600"
              />
              <span className="text-xs font-bold text-slate-800">
                I agree to the friendly community rules and pledge to keep personal phone numbers and home addresses private.
              </span>
            </label>

            <button
              type="submit"
              disabled={isLoading || (ageGroup === 'child' && !guardianConsent) || !safetyPledge}
              className="w-full py-3.5 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-black text-base shadow-md focus:ring-4 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? 'Creating Account...' : 'Complete Registration'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
