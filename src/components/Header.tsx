import React, { useState } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Sun, 
  Moon, 
  Type, 
  HelpCircle, 
  ShieldCheck, 
  MessageSquare, 
  BookOpen, 
  PhoneCall, 
  Users, 
  User as UserIcon,
  Home,
  LogOut,
  Sparkles,
  Palette,
  Trophy,
  Award,
  Languages,
  Database
} from 'lucide-react';
import { User, DisplayLanguageMode } from '../types';
import { speechService } from '../services/speechService';
import { soundEffects } from '../services/soundEffects';

interface HeaderProps {
  currentUser: User | null;
  currentView: 'home' | 'topics' | 'topic-detail' | 'messages' | 'teacher' | 'avatar' | 'achievements';
  onNavigate: (view: 'home' | 'topics' | 'messages' | 'teacher' | 'avatar' | 'achievements') => void;
  onOpenAuth: () => void;
  onSignOut: () => void;
  onOpenSupabaseConfig: () => void;
  isCloudConnected: boolean;
  onOpenShortcuts: () => void;
  onOpenCall: () => void;
  unreadCount: number;
  topicsCount?: number;
  highContrast: boolean;
  onToggleHighContrast: () => void;
  fontSizeMode: 'normal' | 'large' | 'xlarge';
  onCycleFontSize: () => void;
  audioGuidance: boolean;
  onToggleAudioGuidance: () => void;
  displayLanguageMode?: DisplayLanguageMode;
  onChangeLanguageMode?: (mode: DisplayLanguageMode) => void;
  onOpenTeacherMessage?: () => void;
  onOpenCommunity?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  currentView,
  onNavigate,
  onOpenAuth,
  onSignOut,
  onOpenSupabaseConfig,
  isCloudConnected,
  onOpenShortcuts,
  onOpenCall,
  unreadCount,
  topicsCount = 20,
  highContrast,
  onToggleHighContrast,
  fontSizeMode,
  onCycleFontSize,
  audioGuidance,
  onToggleAudioGuidance,
  displayLanguageMode = 'bilingual',
  onChangeLanguageMode,
  onOpenTeacherMessage,
  onOpenCommunity
}) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleNavClick = (view: 'home' | 'topics' | 'messages' | 'teacher' | 'avatar' | 'achievements', label: string) => {
    soundEffects.playClick();
    if (audioGuidance) {
      speechService.announce(`Navigating to ${label}`);
    }
    onNavigate(view);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b-2 border-blue-200 shadow-xs" role="banner">
      {/* Skip to Content accessible link for keyboard & screen reader users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-800 focus:text-white focus:rounded-md focus:font-bold focus:shadow-xl focus:ring-4 focus:ring-yellow-400"
      >
        Skip to main content
      </a>

      {/* Top Accessibility & Wix Connection Bar */}
      <div className="bg-blue-900 text-blue-50 px-4 py-2 border-b border-blue-800 text-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-medium">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
          <span>Connected to Limitless English Connect</span>
            <span className="hidden sm:inline text-blue-200">| Blind & Low-Vision Accessible Platform</span>
          </div>

          {/* Accessibility Quick Toggles */}
          <div className="flex items-center flex-wrap gap-2" role="region" aria-label="Accessibility settings">
            {/* Language Learning Mode Toggle (English + Uzbek, Uzbek Support, English Only) */}
            <button
              onClick={() => {
                soundEffects.playClick();
                const nextMode: DisplayLanguageMode =
                  displayLanguageMode === 'bilingual'
                    ? 'uz-support'
                    : displayLanguageMode === 'uz-support'
                    ? 'en-only'
                    : 'bilingual';
                if (onChangeLanguageMode) onChangeLanguageMode(nextMode);
                const labels: Record<DisplayLanguageMode, string> = {
                  'bilingual': 'Inglizcha va O‘zbekcha (Bilingual mode)',
                  'en-only': 'Faqat Inglizcha (English only mode)',
                  'uz-support': 'O‘zbekcha tushuntirish bilan (Uzbek support mode)',
                };
                speechService.announce(`Til rejimi: ${labels[nextMode]}`);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-800 text-blue-200 hover:bg-blue-700 text-xs font-bold transition-colors focus:ring-2 focus:ring-yellow-300"
              aria-label={`Til rejimi: ${displayLanguageMode}. Tanlash uchun bosing.`}
              title="Til rejimini o‘zgartirish (Language mode)"
            >
              <Languages className="w-4 h-4 text-emerald-400" />
              <span>
                {displayLanguageMode === 'uz-support'
                  ? '🇺🇿 O‘zbekcha Yordam'
                  : displayLanguageMode === 'en-only'
                  ? '🇬🇧 English Only'
                  : '🇬🇧 Eng + 🇺🇿 O‘zb'}
              </span>
            </button>

            {/* Audio Guidance / Screen reader spoken prompt toggle */}
            <button
              onClick={() => {
                onToggleAudioGuidance();
                soundEffects.playClick();
                if (!audioGuidance) {
                  speechService.announce('Spoken audio guidance is now enabled.');
                }
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-colors ${
                audioGuidance
                  ? 'bg-amber-400 text-amber-950 hover:bg-amber-300 ring-2 ring-amber-300'
                  : 'bg-blue-800 text-blue-200 hover:bg-blue-700'
              }`}
              aria-pressed={audioGuidance}
              aria-label={`Spoken audio guidance is currently ${audioGuidance ? 'On' : 'Off'}. Press to toggle.`}
            >
              {audioGuidance ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span>{audioGuidance ? 'Audio Voice: ON' : 'Audio Voice: OFF'}</span>
            </button>

            {/* High Contrast Mode Toggle */}
            <button
              onClick={() => {
                onToggleHighContrast();
                soundEffects.playClick();
                speechService.announce(`High contrast mode ${!highContrast ? 'enabled' : 'disabled'}`);
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-colors ${
                highContrast
                  ? 'bg-yellow-400 text-black hover:bg-yellow-300 ring-2 ring-yellow-200'
                  : 'bg-blue-800 text-blue-200 hover:bg-blue-700'
              }`}
              aria-pressed={highContrast}
              aria-label={`High contrast mode is currently ${highContrast ? 'On' : 'Off'}. Press to toggle.`}
            >
              {highContrast ? <Sun className="w-4 h-4 text-black" /> : <Moon className="w-4 h-4" />}
              <span>{highContrast ? 'High Contrast ON' : 'Contrast'}</span>
            </button>

            {/* Text Size Cycler */}
            <button
              onClick={() => {
                onCycleFontSize();
                soundEffects.playClick();
                const nextSize = fontSizeMode === 'normal' ? 'Large' : fontSizeMode === 'large' ? 'Extra Large' : 'Normal';
                speechService.announce(`Text size changed to ${nextSize}`);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-800 text-blue-200 hover:bg-blue-700 text-xs font-bold"
              aria-label={`Current text size is ${fontSizeMode}. Press to cycle font size.`}
            >
              <Type className="w-4 h-4" />
              <span>Text: {fontSizeMode.toUpperCase()}</span>
            </button>

            {/* Keyboard Shortcuts Button */}
            <button
              onClick={() => {
                soundEffects.playClick();
                onOpenShortcuts();
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-800 text-blue-200 hover:bg-blue-700 text-xs font-semibold"
              aria-label="View keyboard shortcuts. Shortcut key: Alt plus K"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Shortcuts (?)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <button
          onClick={() => handleNavClick('home', 'Homepage')}
          className="flex items-center gap-3 text-left group rounded-md p-1 focus:ring-4 focus:ring-blue-600 focus:outline-hidden"
          aria-label="Limitless English Connect - Return to Home"
        >
          <div className="w-11 h-11 rounded-xl bg-blue-700 text-white flex items-center justify-center font-black text-xl shadow-md border-2 border-blue-600 group-hover:scale-105 transition-transform">
            LE
          </div>
          <div>
            <span className="block text-xl font-extrabold text-blue-950 tracking-tight leading-none group-hover:text-blue-700">
              Limitless English <span className="text-blue-600">Connect</span>
            </span>
            <span className="block text-xs font-medium text-slate-700 mt-1">
              Beginner English Speaking & Voice Partner Community
            </span>
          </div>
        </button>

        {/* Primary Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-2" aria-label="Main Navigation">
          <button
            onClick={() => handleNavClick('home', 'Homepage')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-sm transition-colors border-2 ${
              currentView === 'home'
                ? 'bg-blue-700 text-white border-blue-800 shadow-sm'
                : 'bg-white text-slate-800 border-slate-200 hover:bg-blue-50 hover:border-blue-300'
            }`}
            aria-current={currentView === 'home' ? 'page' : undefined}
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </button>

          <button
            onClick={() => handleNavClick('topics', `${topicsCount || 20} Topics`)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-sm transition-colors border-2 ${
              currentView === 'topics' || currentView === 'topic-detail'
                ? 'bg-blue-700 text-white border-blue-800 shadow-sm'
                : 'bg-white text-slate-800 border-slate-200 hover:bg-blue-50 hover:border-blue-300'
            }`}
            aria-current={currentView === 'topics' || currentView === 'topic-detail' ? 'page' : undefined}
          >
            <BookOpen className="w-4 h-4" />
            <span>{topicsCount || 20} Topics</span>
          </button>

          {/* My Achievements & Badges: Accessible to all signed-in students */}
          {currentUser && (
            <button
              onClick={() => handleNavClick('achievements', 'My Achievements and Badges')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-sm transition-colors border-2 ${
                currentView === 'achievements'
                  ? 'bg-amber-400 text-amber-950 border-amber-500 shadow-sm font-black'
                  : 'bg-white text-slate-800 border-slate-200 hover:bg-amber-50 hover:border-amber-300'
              }`}
              aria-current={currentView === 'achievements' ? 'page' : undefined}
              aria-label="My Achievements and Badges"
            >
              <Trophy className="w-4 h-4 text-amber-600" />
              <span>Achievements</span>
            </button>
          )}

          {/* My Avatar & Coins Tab: Accessible to all signed-in students */}
          {currentUser && (
            <button
              onClick={() => handleNavClick('avatar', 'My Avatar and English Coins')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-sm transition-colors border-2 ${
                currentView === 'avatar'
                  ? 'bg-amber-400 text-amber-950 border-amber-500 shadow-sm font-black'
                  : 'bg-amber-50/90 text-amber-950 border-amber-300 hover:bg-amber-100 hover:border-amber-400'
              }`}
              aria-current={currentView === 'avatar' ? 'page' : undefined}
              aria-label="My Avatar and English Coins Shop"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>My Avatar</span>
            </button>
          )}

          {/* Messages & Calls: Only visible when learner is approved */}
          {currentUser?.isApproved && (
            <>
              <button
                onClick={() => handleNavClick('messages', 'Voice Messages')}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-sm transition-colors border-2 relative ${
                  currentView === 'messages'
                    ? 'bg-blue-700 text-white border-blue-800 shadow-sm'
                    : 'bg-white text-slate-800 border-slate-200 hover:bg-blue-50 hover:border-blue-300'
                }`}
                aria-current={currentView === 'messages' ? 'page' : undefined}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Voice Messages</span>
                {unreadCount > 0 && (
                  <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-black bg-rose-600 text-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  soundEffects.playClick();
                  onOpenCall();
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-sm bg-emerald-700 text-white hover:bg-emerald-800 border-2 border-emerald-800 shadow-sm transition-transform active:scale-95"
                aria-label="Start Live Voice Conversation with your speaking partner"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Live Audio Call</span>
              </button>
            </>
          )}

          {/* Student: Direct Message Teacher & Community Access */}
          {currentUser?.role === 'student' && (
            <>
              {onOpenTeacherMessage && (
                <button
                  onClick={() => {
                    soundEffects.playClick();
                    onOpenTeacherMessage();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold text-xs md:text-sm bg-purple-50 text-purple-900 hover:bg-purple-100 border-2 border-purple-300 transition-colors cursor-pointer"
                  aria-label="Message My Teacher"
                >
                  <MessageSquare className="w-4 h-4 text-purple-700" />
                  <span className="hidden sm:inline">Message</span> Teacher
                </button>
              )}

              {onOpenCommunity && (
                <button
                  onClick={() => {
                    soundEffects.playClick();
                    onOpenCommunity();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold text-xs md:text-sm bg-cyan-50 text-cyan-950 hover:bg-cyan-100 border-2 border-cyan-300 transition-colors cursor-pointer"
                  aria-label="Student Community & Group Chats"
                >
                  <Users className="w-4 h-4 text-cyan-700" />
                  <span className="hidden sm:inline">Student</span> Community
                </button>
              )}
            </>
          )}

          {/* Teacher Dashboard Link: ONLY for approved teachers */}
          {currentUser?.role === 'teacher' && currentUser.isApproved && (
            <button
              onClick={() => handleNavClick('teacher', 'Teacher Dashboard')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-sm transition-colors border-2 ${
                currentView === 'teacher'
                  ? 'bg-purple-800 text-white border-purple-900 shadow-sm'
                  : 'bg-purple-50 text-purple-900 border-purple-300 hover:bg-purple-100'
              }`}
              aria-current={currentView === 'teacher' ? 'page' : undefined}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Teacher Dashboard</span>
            </button>
          )}
        </nav>

        {/* Cloud Status Indicator & User Account / Sign In */}
        <div className="flex items-center gap-2">
          {/* Supabase status button - STRICTLY RESTRICTED TO VERIFIED TEACHER ADMINS */}
          {currentUser?.role === 'teacher' && currentUser.isApproved && (
            <button
              onClick={onOpenSupabaseConfig}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors ${
                isCloudConnected
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
              }`}
              aria-label={`Teacher Admin: Cloud database is ${isCloudConnected ? 'Connected to Supabase' : 'Not configured'}. Click to configure database.`}
            >
              <span className={`w-2 h-2 rounded-full ${isCloudConnected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              <span>{isCloudConnected ? 'Cloud: Supabase' : 'Connect Cloud'}</span>
            </button>
          )}

          {currentUser ? (
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl border-2 border-slate-300 bg-slate-50 hover:bg-white text-left focus:ring-4 focus:ring-blue-600 focus:outline-hidden"
                  aria-expanded={userDropdownOpen}
                  aria-haspopup="true"
                  aria-label={`Logged in as ${currentUser.name}, role ${currentUser.role}. Press to open profile options.`}
                >
                  <div className={`w-9 h-9 rounded-full ${currentUser.avatarColor} text-white flex items-center justify-center font-bold text-sm border-2 border-white shadow-xs`}>
                    {currentUser.role === 'teacher' ? 'B' : currentUser.name.charAt(0)}
                  </div>
                  <div className="hidden sm:block pr-1">
                    <span className="block text-sm font-extrabold text-slate-900 leading-tight">
                      {currentUser.role === 'teacher' ? 'Teacher Bahora' : currentUser.name}
                    </span>
                    <span className="block text-xs font-semibold text-blue-700">
                      {currentUser.role === 'teacher' ? 'Teacher Admin' : currentUser.isApproved ? 'Approved Learner' : '⏳ Pending Review'}
                    </span>
                  </div>
                </button>

                {/* Account Dropdown */}
                {userDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border-2 border-slate-300 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                    role="menu"
                    aria-label="User profile and switcher"
                  >
                    <div className="px-4 py-2 border-b border-slate-100 bg-slate-50">
                      <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Signed In As
                      </span>
                      <span className="block text-sm font-black text-slate-900">
                        {currentUser.role === 'teacher' ? 'Teacher Bahora' : currentUser.name}
                      </span>
                      <span className="block text-xs text-slate-600 mt-0.5 truncate">
                        {currentUser.email}
                      </span>
                      <span className="block text-xs text-blue-700 font-bold mt-1">
                        {currentUser.role === 'teacher' 
                          ? '⭐ Verified Teacher Admin' 
                          : currentUser.isApproved 
                          ? '✓ Approved Learner' 
                          : '⏳ Pending Teacher Review'}
                      </span>
                    </div>

                    <div className="px-3 py-2 space-y-1">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          handleNavClick('achievements', 'My Achievements & Badges');
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-amber-950 bg-amber-50 hover:bg-amber-100 border border-amber-200 flex items-center gap-2"
                      >
                        <Trophy className="w-3.5 h-3.5 text-amber-600" />
                        <span>My Achievements & Badges</span>
                      </button>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          handleNavClick('avatar', 'My Avatar & English Coins');
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center gap-2"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <span>My Avatar & English Coins</span>
                      </button>

                      {currentUser?.role === 'teacher' && currentUser.isApproved && (
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onOpenSupabaseConfig();
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                        >
                          <Database className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Cloud Database Settings</span>
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onSignOut();
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-rose-700 hover:bg-rose-50 flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Explicit, Always-Visible Sign Out Button */}
              <button
                onClick={onSignOut}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 border-2 border-slate-300 text-slate-800 font-bold text-xs shadow-xs focus:ring-4 focus:ring-rose-200 transition-colors"
                aria-label="Sign out of Limitless English"
              >
                <LogOut className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-black text-sm shadow-md focus:ring-4 focus:ring-blue-500 flex items-center gap-1.5"
            >
              <UserIcon className="w-4 h-4" />
              <span>Sign In / Create Account</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Navigation Bar */}
      <div className="md:hidden border-t border-slate-200 bg-slate-50 px-3 py-2 flex items-center justify-around gap-1" aria-label="Mobile Navigation">
        <button
          onClick={() => handleNavClick('home', 'Home')}
          className={`flex flex-col items-center py-1 px-2 rounded-md text-xs font-bold ${
            currentView === 'home' ? 'text-blue-700 font-black' : 'text-slate-600'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => handleNavClick('topics', `${topicsCount || 20} Topics`)}
          className={`flex flex-col items-center py-1 px-2 rounded-md text-xs font-bold ${
            currentView === 'topics' || currentView === 'topic-detail' ? 'text-blue-700 font-black' : 'text-slate-600'
          }`}
        >
          <BookOpen className="w-5 h-5 mb-0.5" />
          <span>Topics</span>
        </button>

        {currentUser && (
          <button
            onClick={() => handleNavClick('achievements', 'My Achievements')}
            className={`flex flex-col items-center py-1 px-2 rounded-md text-xs font-bold ${
              currentView === 'achievements' ? 'text-amber-800 font-black' : 'text-slate-600'
            }`}
            aria-label="My Achievements and Badges"
          >
            <Trophy className="w-5 h-5 mb-0.5 text-amber-600" />
            <span>Badges</span>
          </button>
        )}

        {currentUser && (
          <button
            onClick={() => handleNavClick('avatar', 'My Avatar')}
            className={`flex flex-col items-center py-1 px-2 rounded-md text-xs font-bold ${
              currentView === 'avatar' ? 'text-amber-800 font-black' : 'text-slate-600'
            }`}
            aria-label="My Avatar and English Coins"
          >
            <Sparkles className="w-5 h-5 mb-0.5 text-amber-500" />
            <span>Avatar</span>
          </button>
        )}

        {currentUser?.isApproved && (
          <>
            <button
              onClick={() => handleNavClick('messages', 'Messages')}
              className={`flex flex-col items-center py-1 px-2 rounded-md text-xs font-bold relative ${
                currentView === 'messages' ? 'text-blue-700 font-black' : 'text-slate-600'
              }`}
            >
              <MessageSquare className="w-5 h-5 mb-0.5" />
              <span>Messages</span>
              {unreadCount > 0 && (
                <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-rose-600" />
              )}
            </button>

            <button
              onClick={onOpenCall}
              className="flex flex-col items-center py-1 px-2 rounded-md text-xs font-bold text-emerald-700"
            >
              <PhoneCall className="w-5 h-5 mb-0.5" />
              <span>Call</span>
            </button>
          </>
        )}

        {currentUser?.role === 'teacher' && currentUser.isApproved && (
          <button
            onClick={() => handleNavClick('teacher', 'Teacher')}
            className={`flex flex-col items-center py-1 px-2 rounded-md text-xs font-bold ${
              currentView === 'teacher' ? 'text-purple-700 font-black' : 'text-slate-600'
            }`}
          >
            <ShieldCheck className="w-5 h-5 mb-0.5" />
            <span>Teacher</span>
          </button>
        )}

        {!currentUser && (
          <button
            onClick={onOpenAuth}
            className="flex flex-col items-center py-1 px-2 rounded-md text-xs font-bold text-blue-700"
          >
            <UserIcon className="w-5 h-5 mb-0.5" />
            <span>Log In</span>
          </button>
        )}
      </div>
    </header>
  );
};
