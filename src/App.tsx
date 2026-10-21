/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HomeView } from './views/HomeView';
import { TopicsView } from './views/TopicsView';
import { TopicDetailView } from './views/TopicDetailView';
import { VoiceMessagesView } from './views/VoiceMessagesView';
import { TeacherDashboardView } from './views/TeacherDashboardView';
import { AuthView } from './views/AuthView';
import { PendingApprovalView } from './views/PendingApprovalView';
import { AvatarView } from './views/AvatarView';
import { SupabaseConfigModal } from './components/SupabaseConfigModal';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { ReportModal } from './components/ReportModal';
import { LiveCallModal } from './components/LiveCallModal';
import { StudentTeacherMessageModal } from './components/StudentTeacherMessageModal';
import { StudentCommunityModal } from './components/StudentCommunityModal';
import { User, ConversationTopic, DisplayLanguageMode } from './types';
import { storage } from './services/storage';
import { supabaseService } from './services/supabase';
import { speechService } from './services/speechService';
import { soundEffects } from './services/soundEffects';
import { ShieldCheck, Volume2, Sparkles, Loader2 } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [partner, setPartner] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [currentView, setCurrentView] = useState<'home' | 'topics' | 'topic-detail' | 'messages' | 'teacher' | 'avatar' | 'achievements'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('limitless_last_view') as any;
      if (saved && ['home', 'topics', 'topic-detail', 'messages', 'teacher', 'avatar', 'achievements'].includes(saved)) {
        return saved;
      }
    }
    return 'home';
  });
  const [selectedTopicId, setSelectedTopicId] = useState<string>('greetings');
  const [topics, setTopics] = useState<ConversationTopic[]>(storage.getTopics());
  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(supabaseService.isConfigured());

  // Accessibility & Language States
  const [highContrast, setHighContrast] = useState(false);
  const [fontSizeMode, setFontSizeMode] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [audioGuidance, setAudioGuidance] = useState(true);
  const [displayLanguageMode, setDisplayLanguageMode] = useState<DisplayLanguageMode>(
    (localStorage.getItem('limitless_language_mode') as DisplayLanguageMode) || 'bilingual'
  );

  // Modals
  const [isSupabaseConfigOpen, setIsSupabaseConfigOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isCallOpen, setIsCallOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportedUser, setReportedUser] = useState<User | null>(null);
  const [isTeacherMessageModalOpen, setIsTeacherMessageModalOpen] = useState(false);
  const [isCommunityModalOpen, setIsCommunityModalOpen] = useState(false);

  // Refresh user and cloud state directly from Supabase Auth & public.profiles
  const refreshUserData = async () => {
    setIsCloudConnected(supabaseService.isConfigured());
    if (supabaseService.isConfigured()) {
      try {
        const sessionUser = await supabaseService.getCurrentSessionUser();
        if (sessionUser) {
          setCurrentUser(sessionUser);
          if (sessionUser.role === 'teacher') {
            setCurrentView('teacher');
          }
          if (sessionUser.partnerId) {
            const partnerData = await supabaseService.fetchPartnerProfile(sessionUser.partnerId);
            setPartner(partnerData);
          } else {
            setPartner(null);
          }
        } else {
          // Guard: Do not wipe out an active in-memory user unless Supabase session is definitively absent
          const client = supabaseService.getClient();
          if (client) {
            const { data } = await client.auth.getSession();
            if (!data?.session) {
              setCurrentUser(null);
              setPartner(null);
            }
          }
        }
      } catch {
        // Network or transient error: preserve existing session state
      }
    } else {
      // Unconfigured cloud mode: ONLY query local mock storage if cloud is disabled
      const localUser = storage.getCurrentUser();
      if (localUser) {
        setCurrentUser(localUser);
        if (localUser.role === 'teacher') {
          setCurrentView('teacher');
        }
      } else {
        setCurrentUser(null);
        setPartner(null);
      }
    }
    setTopics(storage.getTopics());
    setIsAuthLoading(false);
  };

  useEffect(() => {
    refreshUserData();

    // Listen to Supabase Auth State changes across tabs and devices
    const client = supabaseService.getClient();
    if (client) {
      const { data: { subscription } } = client.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          const profile = await supabaseService.fetchProfile(session.user.id);
          if (profile) {
            setCurrentUser(profile);
            if (profile.role === 'teacher') {
              setCurrentView('teacher');
            }
            if (profile.partnerId) {
              const partnerData = await supabaseService.fetchPartnerProfile(profile.partnerId);
              setPartner(partnerData);
            } else {
              setPartner(null);
            }
          }
        } else if (event === 'SIGNED_OUT') {
          setCurrentUser(null);
          setPartner(null);
          setCurrentView('home');
        }
        setIsAuthLoading(false);
      });
      return () => {
        subscription.unsubscribe();
      };
    } else {
      setIsAuthLoading(false);
    }
  }, [isCloudConnected]);

  // Redirection & UUID Registration: Verified teachers automatically route to Teacher Dashboard and register verified UUID
  useEffect(() => {
    if (currentUser?.role === 'teacher' && currentUser.isApproved) {
      if (currentView === 'home') {
        setCurrentView('teacher');
      }
      // Register verified teacher UUID with backend and cache for students
      if (currentUser.id && currentUser.id.length > 20) {
        try {
          localStorage.setItem('le_verified_teacher_uuid_v1', JSON.stringify({
            id: currentUser.id,
            name: currentUser.name || 'Teacher Bahora',
            email: currentUser.email,
            role: 'teacher',
            ageGroup: 'adult',
            visionPreference: 'standard',
            isApproved: true,
            avatarColor: 'bg-purple-700',
            createdAt: '',
          }));
        } catch {}

        fetch('/api/teacher/register-verified-uuid', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: currentUser.id,
            name: currentUser.name || 'Teacher Bahora',
            email: currentUser.email,
          }),
        }).catch(() => {});
      }
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('limitless_last_view', currentView);
    }
  }, [currentUser?.id, currentUser?.role, currentUser?.isApproved, currentView]);

  // Sync high contrast mode with HTML body
  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('theme-high-contrast');
    } else {
      document.body.classList.remove('theme-high-contrast');
    }
  }, [highContrast]);

  // Sync font size mode
  useEffect(() => {
    document.body.classList.remove('font-size-large', 'font-size-xlarge');
    if (fontSizeMode === 'large') {
      document.body.classList.add('font-size-large');
    } else if (fontSizeMode === 'xlarge') {
      document.body.classList.add('font-size-xlarge');
    }
  }, [fontSizeMode]);

  // Sync audio guidance
  useEffect(() => {
    speechService.setAudioGuidance(audioGuidance);
  }, [audioGuidance]);

  // Global Keyboard shortcuts
  useEffect(() => {
    const handleGlobalKeys = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        speechService.stop();
        if (isShortcutsOpen) setIsShortcutsOpen(false);
        if (isReportOpen) setIsReportOpen(false);
        if (isSupabaseConfigOpen) setIsSupabaseConfigOpen(false);
        if (isCallOpen) setIsCallOpen(false);
        return;
      }

      if (e.altKey) {
        const key = e.key.toLowerCase();
        if (key === 'h') {
          e.preventDefault();
          setCurrentView('home');
          speechService.announce('Navigated to Home');
        } else if (key === 't') {
          e.preventDefault();
          setCurrentView('topics');
          speechService.announce(`Navigated to ${topics.length} Topics`);
        } else if (key === 'm') {
          e.preventDefault();
          if (currentUser?.isApproved) {
            setCurrentView('messages');
            speechService.announce('Navigated to Voice Messages');
          } else {
            speechService.announce('Voice messaging requires teacher approval.');
          }
        } else if (key === 'c') {
          e.preventDefault();
          if (currentUser?.isApproved && partner) {
            setIsCallOpen(true);
          } else if (!currentUser?.isApproved) {
            speechService.announce('Voice calls unlock after teacher approval.');
          } else {
            speechService.announce('No speaking partner currently assigned.');
          }
        } else if (key === 'l') {
          e.preventDefault();
          setAudioGuidance((prev) => !prev);
        } else if (key === 'k') {
          e.preventDefault();
          setIsShortcutsOpen(true);
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeys);
    return () => window.removeEventListener('keydown', handleGlobalKeys);
  }, [isShortcutsOpen, isReportOpen, isSupabaseConfigOpen, isCallOpen, currentUser?.isApproved, partner]);

  // Unread messages calculation
  const unreadMessagesCount = currentUser
    ? storage.getMessages().filter((m) => m.receiverId === currentUser.id && !m.isListened).length
    : 0;

  const handleSignOut = async () => {
    soundEffects.playClick();
    if (supabaseService.isConfigured()) {
      await supabaseService.signOut();
    }
    storage.clearCurrentUser();
    setCurrentUser(null);
    setPartner(null);
    setCurrentView('home');
    speechService.announce('Signed out successfully. Returned to login page.');
  };

  const handleSelectTopic = (topicId: string) => {
    setSelectedTopicId(topicId);
    setCurrentView('topic-detail');
  };

  const handleCycleFontSize = () => {
    if (fontSizeMode === 'normal') setFontSizeMode('large');
    else if (fontSizeMode === 'large') setFontSizeMode('xlarge');
    else setFontSizeMode('normal');
  };

  const handleOpenReport = (user: User) => {
    soundEffects.playClick();
    setReportedUser(user);
    setIsReportOpen(true);
  };

  const handleOpenSupabaseConfig = () => {
    if (!currentUser || currentUser.role !== 'teacher' || !currentUser.isApproved) {
      soundEffects.playWarning();
      speechService.announce('Access denied. Database configuration is strictly restricted to verified teacher administrators.');
      return;
    }
    setIsSupabaseConfigOpen(true);
  };

  const handleLanguageModeChange = (mode: DisplayLanguageMode) => {
    setDisplayLanguageMode(mode);
    localStorage.setItem('limitless_language_mode', mode);
    if (currentUser) {
      const updatedUser = { ...currentUser, displayLanguageMode: mode };
      setCurrentUser(updatedUser);
      storage.saveUser(updatedUser);
      if (supabaseService.isConfigured()) {
        supabaseService.updateUserProfile(currentUser.id, { displayLanguageMode: mode }).catch(() => {});
      }
    }
    soundEffects.playClick();
    speechService.announce(`Language display mode set to ${mode === 'bilingual' ? 'English and Uzbek bilingual' : mode === 'uz-support' ? 'Uzbek support mode' : 'English only mode'}`);
  };

  const selectedTopic = topics.find((t) => t.id === selectedTopicId) || topics[0];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Header with Accessibility Controls and Sign Out */}
      <Header
        currentUser={currentUser}
        currentView={currentView}
        onNavigate={(v) => {
          if (v === 'teacher' && (!currentUser || currentUser.role !== 'teacher' || !currentUser.isApproved)) {
            soundEffects.playWarning();
            speechService.announce('Teacher dashboard requires verified teacher administrator account.');
            return;
          }
          if ((v === ('supabase' as any) || v === ('config' as any)) && (!currentUser || currentUser.role !== 'teacher' || !currentUser.isApproved)) {
            soundEffects.playWarning();
            speechService.announce('Access denied. Supabase database configuration is restricted to verified teacher administrators.');
            return;
          }
          setCurrentView(v);
        }}
        onOpenAuth={() => setCurrentView('home')}
        onSignOut={handleSignOut}
        onOpenSupabaseConfig={handleOpenSupabaseConfig}
        isCloudConnected={isCloudConnected}
        topicsCount={topics.length}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onOpenCall={() => {
          if (currentUser?.isApproved && partner) {
            setIsCallOpen(true);
          } else if (!currentUser?.isApproved) {
            soundEffects.playWarning();
            speechService.announce('Account under review. Calls unlock upon teacher approval.');
          } else {
            soundEffects.playWarning();
            speechService.announce('You do not have an approved speaking partner assigned yet.');
          }
        }}
        unreadCount={unreadMessagesCount}
        highContrast={highContrast}
        onToggleHighContrast={() => setHighContrast(!highContrast)}
        fontSizeMode={fontSizeMode}
        onCycleFontSize={handleCycleFontSize}
        audioGuidance={audioGuidance}
        onToggleAudioGuidance={() => setAudioGuidance(!audioGuidance)}
        displayLanguageMode={displayLanguageMode}
        onChangeLanguageMode={handleLanguageModeChange}
        onOpenTeacherMessage={() => setIsTeacherMessageModalOpen(true)}
        onOpenCommunity={() => setIsCommunityModalOpen(true)}
      />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 py-8" tabIndex={-1}>
        {/* State A: Initial Auth Loading State */}
        {isAuthLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4" role="status" aria-live="polite">
            <div className="w-16 h-16 rounded-2xl bg-blue-700 text-white flex items-center justify-center font-black text-2xl shadow-xl animate-pulse">
              LE
            </div>
            <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-blue-700" />
              <span>Checking Limitless English Session...</span>
            </h1>
            <p className="text-sm text-slate-600">Connecting to secure Supabase authentication.</p>
          </div>
        ) : !currentUser ? (
          /* State B: Not Authenticated -> Display Real Sign In / Create Account Page */
          <AuthView
            onAuthSuccess={(user) => {
              setCurrentUser(user);
              if (user.role === 'teacher') {
                setCurrentView('teacher');
              } else {
                setCurrentView('home');
              }
            }}
          />
        ) : !currentUser.isApproved && currentUser.role === 'student' ? (
          /* State C: Logged-in Student Pending Teacher Approval */
          currentView === 'avatar' ? (
            <AvatarView
              currentUser={currentUser}
              onBack={() => setCurrentView('home')}
            />
          ) : currentView === 'topics' ? (
            <TopicsView
              topics={topics}
              onSelectTopic={handleSelectTopic}
            />
          ) : currentView === 'topic-detail' ? (
            <TopicDetailView
              topic={selectedTopic}
              currentUser={currentUser}
              partner={null}
              onBack={() => setCurrentView('topics')}
              onOpenCall={() => {}}
              onNavigateToMessages={() => {}}
            />
          ) : (
            <PendingApprovalView
              currentUser={currentUser}
              onRefresh={refreshUserData}
              onSignOut={handleSignOut}
              onBrowseTopics={() => setCurrentView('topics')}
              onOpenAvatar={() => setCurrentView('avatar')}
            />
          )
        ) : (
          /* State D: Approved Student OR Teacher Admin */
          <>
            {/* If Teacher, automatically route to Teacher Dashboard whenever view is home or teacher */}
            {((currentView === 'home' && currentUser.role === 'teacher' && currentUser.isApproved) || currentView === 'teacher') ? (
              currentUser.role === 'teacher' && currentUser.isApproved ? (
                <TeacherDashboardView
                  currentUser={currentUser}
                  onRefreshData={refreshUserData}
                  onOpenAuth={() => setCurrentView('home')}
                  onOpenSupabaseConfig={handleOpenSupabaseConfig}
                />
              ) : (
                <div className="bg-white rounded-3xl p-8 border-4 border-rose-300 text-center max-w-xl mx-auto space-y-4">
                  <h2 className="text-xl font-black text-rose-950">Restricted Access</h2>
                  <p className="text-sm text-slate-700">
                    The Teacher Dashboard is restricted to approved instructor administrators.
                  </p>
                  <button
                    onClick={() => setCurrentView('home')}
                    className="px-6 py-2.5 rounded-xl bg-blue-700 text-white font-bold text-sm cursor-pointer"
                  >
                    Return to Home
                  </button>
                </div>
              )
            ) : currentView === 'home' ? (
              <HomeView
                currentUser={currentUser}
                partner={partner}
                topics={topics}
                onNavigate={(v) => setCurrentView(v)}
                onSelectTopic={handleSelectTopic}
                onOpenCall={() => {
                  if (currentUser.isApproved && partner) setIsCallOpen(true);
                }}
                onOpenTeacherMessage={() => setIsTeacherMessageModalOpen(true)}
                onOpenCommunity={() => setIsCommunityModalOpen(true)}
                unreadCount={unreadMessagesCount}
              />
            ) : null}

            {currentView === 'avatar' && (
              <AvatarView
                currentUser={currentUser}
                onBack={() => setCurrentView(currentUser.role === 'teacher' ? 'teacher' : 'home')}
              />
            )}

            {currentView === 'topics' && (
              <TopicsView
                topics={topics}
                onSelectTopic={handleSelectTopic}
              />
            )}

            {currentView === 'topic-detail' && (
              <TopicDetailView
                topic={selectedTopic}
                currentUser={currentUser}
                partner={partner}
                onBack={() => setCurrentView('topics')}
                onOpenCall={() => {
                  if (currentUser.isApproved && partner) setIsCallOpen(true);
                }}
                onNavigateToMessages={() => setCurrentView('messages')}
              />
            )}

            {currentView === 'messages' && (
              <VoiceMessagesView
                currentUser={currentUser}
                partner={partner}
                onOpenReport={handleOpenReport}
                onOpenCall={() => {
                  if (currentUser.isApproved && partner) setIsCallOpen(true);
                }}
              />
            )}
          </>
        )}
      </main>

      {/* Accessible Footer */}
      <footer className="bg-slate-900 text-slate-300 border-t-4 border-blue-600 mt-12 py-8 px-4" role="contentinfo">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <span className="block font-black text-white text-lg tracking-tight">
              Limitless English Connect
            </span>
            <p className="text-xs text-slate-400 max-w-md">
              Accessible beginner English speaking practice for blind and low-vision students. Learn, practice, and grow with Limitless English Connect.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold">
            <span className="inline-flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>{isCloudConnected ? 'Supabase Database Active' : 'Supabase Not Connected'}</span>
            </span>

            <span className="text-slate-600">|</span>

            <button
              onClick={() => {
                soundEffects.playClick();
                speechService.speak(
                  "Limitless English Connect is dedicated to making language learning barrier-free, joyful, and safe for blind and visually impaired learners across the world.",
                  true
                );
              }}
              className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300"
              aria-label="Listen to accessibility declaration"
            >
              <Volume2 className="w-4 h-4" />
              <span>Listen to Accessibility Pledge</span>
            </button>

            <span className="text-slate-600">|</span>

            <button
              onClick={() => setIsShortcutsOpen(true)}
              className="text-blue-300 hover:text-white underline"
            >
              Shortcuts (Alt + K)
            </button>
          </div>
        </div>
      </footer>

      {/* Supabase Configuration Modal - Protected strictly for verified teachers */}
      <SupabaseConfigModal
        isOpen={isSupabaseConfigOpen}
        currentUser={currentUser}
        onClose={() => setIsSupabaseConfigOpen(false)}
        onConfigured={refreshUserData}
      />

      {/* Keyboard Shortcuts Guide */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* Safety Report Modal */}
      {currentUser && (
        <ReportModal
          isOpen={isReportOpen}
          onClose={() => {
            setIsReportOpen(false);
            setReportedUser(null);
          }}
          currentUser={currentUser}
          reportedUser={reportedUser}
          onReportSubmitted={refreshUserData}
        />
      )}

      {/* Live Voice Call Modal */}
      {currentUser && (
        <LiveCallModal
          isOpen={isCallOpen}
          onClose={() => setIsCallOpen(false)}
          currentUser={currentUser}
          partner={partner}
          onOpenReport={(user) => {
            setIsCallOpen(false);
            handleOpenReport(user);
          }}
        />
      )}

      {/* Message My Teacher Modal */}
      {currentUser && isTeacherMessageModalOpen && (
        <StudentTeacherMessageModal
          currentUser={currentUser}
          onClose={() => setIsTeacherMessageModalOpen(false)}
        />
      )}

      {/* Student Community & Group Chats Modal */}
      {currentUser && isCommunityModalOpen && (
        <StudentCommunityModal
          currentUser={currentUser}
          onClose={() => setIsCommunityModalOpen(false)}
          onOpenReport={(user) => {
            setIsCommunityModalOpen(false);
            handleOpenReport(user);
          }}
        />
      )}
    </div>
  );
}
