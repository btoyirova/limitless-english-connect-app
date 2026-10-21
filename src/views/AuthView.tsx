import React, { useState } from 'react';
import { 
  UserCheck, 
  LogIn, 
  UserPlus, 
  Volume2, 
  ShieldCheck, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Settings, 
  ExternalLink,
  BookOpen,
  Eye,
  Info
} from 'lucide-react';
import { User, VisionPreference } from '../types';
import { supabaseService } from '../services/supabase';
import { speechService } from '../services/speechService';
import { soundEffects } from '../services/soundEffects';

interface AuthViewProps {
  onAuthSuccess: (user: User) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({
  onAuthSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'signin' | 'register'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(24);
  const [visionPreference, setVisionPreference] = useState<VisionPreference>('low-vision-large-text');
  const [nativeLanguage, setNativeLanguage] = useState('Arabic');
  const [safetyPledge, setSafetyPledge] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isConfigured = supabaseService.isConfigured();

  const handleReadInstructions = () => {
    soundEffects.playClick();
    if (activeTab === 'signin') {
      speechService.speak(
        'Limitless English Connect sign in page. Enter your email address and password to log into your account.',
        true
      );
    } else {
      speechService.speak(
        'Adult learner registration page. Limitless English is designed for blind and low-vision learners. Enter your name, email, password, and confirm that you are an adult learner 18 years or older. All accounts begin as pending teacher approval for student safety.',
        true
      );
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    if (!supabaseService.isConfigured()) {
      setErrorMessage('Cloud database is not connected. Please ask your instructor administrator to connect Supabase.');
      return;
    }

    setIsLoading(true);
    soundEffects.playClick();

    const { user, error } = await supabaseService.signIn(email.trim(), password);
    setIsLoading(false);

    if (error) {
      soundEffects.playWarning();
      setErrorMessage(error);
      speechService.announce(`Sign in error: ${error}`);
      return;
    }

    if (user) {
      soundEffects.playSuccess();
      speechService.announce(`Welcome back, ${user.name}!`);
      onAuthSuccess(user);
    } else {
      setErrorMessage('Login succeeded but your profile record could not be loaded from public.profiles.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!email.trim()) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (age < 18) {
      setErrorMessage('Registration is currently limited to adult learners aged 18 and older.');
      return;
    }
    if (!safetyPledge) {
      setErrorMessage('Please accept the Limitless English community safety pledge.');
      return;
    }

    if (!supabaseService.isConfigured()) {
      setErrorMessage('Cloud database is not connected. Please ask your instructor administrator to connect Supabase.');
      return;
    }

    setIsLoading(true);
    soundEffects.playClick();

    const res = await supabaseService.signUp({
      email: email.trim(),
      password,
      name: name.trim(),
      role: 'student',
      ageGroup: 'adult',
      age: Number(age),
      visionPreference,
      nativeLanguage,
      guardianConsent: false,
      bioText: 'Excited to practice English speaking!'
    });

    setIsLoading(false);

    if (res.error) {
      soundEffects.playWarning();
      setErrorMessage(res.error);
      speechService.announce(`Registration error: ${res.error}`);
      return;
    }

    if (res.needsEmailConfirmation) {
      soundEffects.playSuccess();
      setSuccessMessage(
        'Account created! A confirmation email has been sent. Please verify your email, then switch to the Sign In tab to log in.'
      );
      speechService.announce('Account created. Please check your email to verify before signing in.');
      setActiveTab('signin');
      return;
    }

    if (res.user) {
      soundEffects.playSuccess();
      speechService.announce(`Registration complete! Welcome, ${res.user.name}. Your account is pending teacher approval.`);
      onAuthSuccess(res.user);
    } else {
      setSuccessMessage('Account registered in Supabase Auth! Please switch to the Sign In tab to log in.');
      setActiveTab('signin');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in" role="region" aria-label="Limitless English Authentication">
      {/* Welcome Hero Banner */}
      <section className="bg-linear-to-r from-blue-900 via-blue-800 to-indigo-900 text-white rounded-3xl p-6 md:p-8 shadow-xl border-4 border-blue-400">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-700/80 text-blue-200 text-xs font-bold border border-blue-400">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Limitless English Connect • Audio-First Practice</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-black tracking-tight leading-tight">
              Sign In or Create Account
            </h1>
            <p className="text-sm md:text-base text-blue-100 font-medium max-w-xl">
              Accessible English speaking practice and audio conversations for blind and low-vision learners.
            </p>
          </div>

          <button
            onClick={handleReadInstructions}
            className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs md:text-sm flex items-center gap-2 shadow-md focus:ring-4 focus:ring-amber-200 shrink-0 transition-transform active:scale-95"
            aria-label="Listen to page instructions aloud"
          >
            <Volume2 className="w-4 h-4 text-amber-950" />
            <span>Listen Aloud</span>
          </button>
        </div>
      </section>



      {/* Main Authentication Card */}
      <section className="bg-white rounded-3xl p-6 md:p-8 border-4 border-slate-200 shadow-xl space-y-6">
        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl border-2 border-slate-200" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'signin'}
            onClick={() => {
              setActiveTab('signin');
              setErrorMessage(null);
              soundEffects.playClick();
            }}
            className={`py-3 rounded-xl font-black text-sm md:text-base flex items-center justify-center gap-2 transition-all ${
              activeTab === 'signin'
                ? 'bg-blue-700 text-white shadow-md'
                : 'text-slate-700 hover:text-slate-950'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'register'}
            onClick={() => {
              setActiveTab('register');
              setErrorMessage(null);
              soundEffects.playClick();
            }}
            className={`py-3 rounded-xl font-black text-sm md:text-base flex items-center justify-center gap-2 transition-all ${
              activeTab === 'register'
                ? 'bg-blue-700 text-white shadow-md'
                : 'text-slate-700 hover:text-slate-950'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Account (Adult 18+)</span>
          </button>
        </div>

        {/* Error / Success Feedback */}
        {errorMessage && (
          <div 
            className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-900 font-bold text-sm flex items-start gap-3"
            role="alert"
          >
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-rose-950">Error:</strong>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {successMessage && (
          <div 
            className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-900 font-bold text-sm flex items-start gap-3"
            role="status"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-emerald-950">Success:</strong>
              <span>{successMessage}</span>
            </div>
          </div>
        )}

        {/* --- SIGN IN FORM --- */}
        {activeTab === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-5">
            <div className="space-y-1">
              <label htmlFor="auth-signin-email" className="block text-sm font-black text-slate-900">
                Email Address *
              </label>
              <input
                id="auth-signin-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full p-3.5 rounded-xl border-2 border-slate-300 font-semibold focus:border-blue-600 focus:ring-4 focus:ring-blue-200"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="auth-signin-password" className="block text-sm font-black text-slate-900">
                Password *
              </label>
              <input
                id="auth-signin-password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3.5 rounded-xl border-2 border-slate-300 font-semibold focus:border-blue-600 focus:ring-4 focus:ring-blue-200"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-black text-base shadow-md focus:ring-4 focus:ring-blue-400 disabled:opacity-50 transition-all active:scale-95"
            >
              {isLoading ? 'Signing In...' : 'Sign In to Limitless English'}
            </button>
          </form>
        )}

        {/* --- CREATE ACCOUNT FORM (ADULT 18+) --- */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-1">
              <label htmlFor="auth-reg-name" className="block text-sm font-black text-slate-900">
                Full Name *
              </label>
              <input
                id="auth-reg-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Alex Smith"
                className="w-full p-3.5 rounded-xl border-2 border-slate-300 font-semibold focus:border-blue-600 focus:ring-4 focus:ring-blue-200"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="auth-reg-email" className="block text-sm font-black text-slate-900">
                  Email Address *
                </label>
                <input
                  id="auth-reg-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full p-3.5 rounded-xl border-2 border-slate-300 font-semibold focus:border-blue-600 focus:ring-4 focus:ring-blue-200"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="auth-reg-password" className="block text-sm font-black text-slate-900">
                  Password (min. 6 characters) *
                </label>
                <input
                  id="auth-reg-password"
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-3.5 rounded-xl border-2 border-slate-300 font-semibold focus:border-blue-600 focus:ring-4 focus:ring-blue-200"
                />
              </div>
            </div>

            {/* Adult Learner Confirmation */}
            <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <strong className="block text-sm font-black text-slate-900">
                    Cohort: Adult Learner (18+)
                  </strong>
                  <span className="text-xs text-slate-600 block mt-0.5">
                    Phase 1 is configured for adult test accounts only. Minors onboarding will open in Phase 2 with verified guardian consent.
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 text-xs font-black shrink-0">
                  18+ Verified
                </span>
              </div>

              <div>
                <label htmlFor="auth-reg-age" className="block text-xs font-bold text-slate-700 mb-1">
                  Learner Age (Must be 18 or older) *
                </label>
                <input
                  id="auth-reg-age"
                  type="number"
                  min={18}
                  max={120}
                  required
                  value={age}
                  onChange={(e) => setAge(Math.max(18, Number(e.target.value)))}
                  className="w-32 p-2.5 rounded-xl border-2 border-slate-300 font-bold text-sm bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-200"
                />
              </div>
            </div>

            {/* Accessibility & Language Preferences */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="auth-reg-vision" className="block text-sm font-black text-slate-900">
                  Visual Accessibility Setting
                </label>
                <select
                  id="auth-reg-vision"
                  value={visionPreference}
                  onChange={(e) => setVisionPreference(e.target.value as VisionPreference)}
                  className="w-full p-3.5 rounded-xl border-2 border-slate-300 font-bold text-sm bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-200"
                >
                  <option value="low-vision-large-text">Low Vision Large Text (Recommended)</option>
                  <option value="high-contrast">High Contrast Mode</option>
                  <option value="screen-reader">Screen Reader Optimized</option>
                  <option value="standard">Standard Display</option>
                </select>
              </div>

              <div className="space-y-1">
                <label htmlFor="auth-reg-language" className="block text-sm font-black text-slate-900">
                  Native Language
                </label>
                <select
                  id="auth-reg-language"
                  value={nativeLanguage}
                  onChange={(e) => setNativeLanguage(e.target.value)}
                  className="w-full p-3.5 rounded-xl border-2 border-slate-300 font-bold text-sm bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-200"
                >
                  <option value="Arabic">Arabic</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="Uzbek">Uzbek</option>
                  <option value="Turkish">Turkish</option>
                  <option value="Chinese">Chinese</option>
                  <option value="Portuguese">Portuguese</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Community Safety Pledge */}
            <label className="flex items-start gap-3 p-4 rounded-2xl bg-blue-50 border-2 border-blue-200 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={safetyPledge}
                onChange={(e) => setSafetyPledge(e.target.checked)}
                className="w-5 h-5 mt-0.5 rounded-md border-2 border-blue-400 text-blue-600 focus:ring-blue-500 shrink-0"
              />
              <span className="text-xs md:text-sm text-blue-950 font-bold leading-relaxed">
                I agree to the Limitless English Community Code of Conduct: respectful communication, no sharing of personal contact details, and audio practice only with approved partners.
              </span>
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-black text-base shadow-md focus:ring-4 focus:ring-blue-400 disabled:opacity-50 transition-all active:scale-95"
            >
              {isLoading ? 'Creating Account...' : 'Create Student Account in Supabase'}
            </button>
          </form>
        )}
      </section>
    </div>
  );
};
