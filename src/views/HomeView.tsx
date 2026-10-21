import React, { useState, useEffect } from 'react';
import { 
  Volume2, 
  BookOpen, 
  MessageSquare, 
  PhoneCall, 
  ShieldCheck, 
  Sparkles, 
  HeartHandshake, 
  ArrowRight,
  UserCheck,
  Clock,
  ExternalLink,
  Coins,
  Palette,
  Trophy,
  Award,
  ClipboardList,
  Calendar,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { User, ConversationTopic, Assignment, AssignmentSubmission, TeacherFeedbackItem } from '../types';
import { StudentAvatarProfile } from '../types/avatar';
import { StudentAchievementsProfile } from '../types/achievements';
import { avatarService, STARTER_AVATAR, describeAvatar } from '../services/avatarService';
import { achievementService } from '../services/achievementService';
import { storage } from '../services/storage';
import { messagingService } from '../services/messagingService';
import { AvatarGraphic } from '../components/AvatarGraphic';
import { speechService } from '../services/speechService';
import { soundEffects } from '../services/soundEffects';

interface HomeViewProps {
  currentUser: User;
  partner: User | null;
  topics: ConversationTopic[];
  onNavigate: (view: 'topics' | 'messages' | 'teacher' | 'avatar' | 'achievements') => void;
  onSelectTopic: (topicId: string) => void;
  onOpenCall: () => void;
  onOpenTeacherMessage?: () => void;
  onOpenCommunity?: () => void;
  unreadCount: number;
}

export const HomeView: React.FC<HomeViewProps> = ({
  currentUser,
  partner,
  topics,
  onNavigate,
  onSelectTopic,
  onOpenCall,
  onOpenTeacherMessage,
  onOpenCommunity,
  unreadCount,
}) => {
  const teacherUser = storage.getUsers().find((u) => u.role === 'teacher' && u.isApproved);
  const teacherDisplayName = teacherUser ? teacherUser.name : 'Teacher Bahora';
  const teacherId = teacherUser ? teacherUser.id : 'teacher-bahora';
  const unreadFromTeacher = messagingService.getUnreadCountFromSender(teacherId, currentUser.id);
  const [avatarProfile, setAvatarProfile] = useState<StudentAvatarProfile | null>(null);
  const [achievements, setAchievements] = useState<StudentAchievementsProfile | null>(null);
  const [myAssignments, setMyAssignments] = useState<Assignment[]>([]);
  const [mySubmissions, setMySubmissions] = useState<AssignmentSubmission[]>([]);
  const [myFeedback, setMyFeedback] = useState<TeacherFeedbackItem[]>([]);

  useEffect(() => {
    let isMounted = true;
    avatarService.getProfile(currentUser.id).then((p) => {
      if (isMounted) setAvatarProfile(p);
    });
    achievementService.getAchievements(currentUser.id).then((a) => {
      if (isMounted) setAchievements(a);
    });

    // Load student assignments & teacher feedback
    const asns = storage.getAssignments(currentUser.id);
    setMyAssignments(asns);
    const subs = storage.getAssignmentSubmissions(undefined, currentUser.id);
    setMySubmissions(subs);
    const fb = storage.getTeacherFeedback(currentUser.id);
    setMyFeedback(fb);

    return () => {
      isMounted = false;
    };
  }, [currentUser.id]);

  const handleMarkFeedbackRead = (id: string) => {
    storage.markTeacherFeedbackRead(id);
    setMyFeedback(storage.getTeacherFeedback(currentUser.id));
    soundEffects.playSuccess();
    speechService.announce('Teacher feedback marked as read.');
    fetch(`/api/student/feedback/${id}/read`, { method: 'POST' }).catch(() => {});
  };

  const handleReadWelcome = () => {
    soundEffects.playClick();
    const charName = avatarProfile?.avatarConfig?.characterName || 'Sam';
    const coins = avatarProfile?.coinsBalance || 0;
    const badgesCount = achievements?.earnedBadges.length || 0;
    const text = `Welcome to Limitless English Connect, ${currentUser.name}! Your cartoon avatar is ${charName}, you have ${coins} English Coins, and you have earned ${badgesCount} achievement badges. Our curriculum now features ${topics.length || 20} progressive conversation topics across four levels. You can practice lessons, take mastery tests, send voice messages, or call your speaking partner. No typing is required!`;
    speechService.speak(text, true);
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Welcome & Audio Tour Hero */}
      <section 
        className="rounded-3xl bg-linear-to-r from-blue-800 via-blue-700 to-sky-700 text-white p-6 md:p-10 shadow-xl border-4 border-blue-600 relative overflow-hidden"
        aria-labelledby="welcome-heading"
      >
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-900/80 text-blue-200 text-xs font-bold border border-blue-400">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Accessible English Community for Blind & Low-Vision Learners</span>
          </div>

          <h1 id="welcome-heading" className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Hello, {currentUser.name}! <br className="hidden sm:inline" />
            Ready to speak English today?
          </h1>

          <p className="text-base md:text-xl text-blue-100 font-medium leading-relaxed max-w-2xl">
            Welcome to <strong className="text-white">Limitless English Connect</strong>, an interactive speaking space designed especially for low-vision learners. Practice real audio conversations with approved partners—no typing needed!
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handleReadWelcome}
              className="px-6 py-3.5 rounded-2xl bg-blue-900/90 hover:bg-blue-950 text-white font-black text-base flex items-center gap-2 shadow-lg hover:shadow-xl border-2 border-blue-400 focus:ring-4 focus:ring-blue-300 active:scale-95 transition-all"
              aria-label="Listen to welcome message aloud"
            >
              <Volume2 className="w-6 h-6 text-amber-300" />
              <span>Listen to Welcome Message</span>
            </button>

            <button
              onClick={() => {
                soundEffects.playClick();
                onNavigate('avatar');
              }}
              className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-base flex items-center gap-2 shadow-lg hover:shadow-xl focus:ring-4 focus:ring-amber-200 active:scale-95 transition-all"
              aria-label={`Open My Avatar and English Coins. You currently have ${avatarProfile?.coinsBalance || 0} coins.`}
            >
              <Sparkles className="w-6 h-6 text-amber-950" />
              <span>My Avatar ({avatarProfile?.coinsBalance || 0} Coins)</span>
            </button>

            {partner && (
              <button
                onClick={() => {
                  soundEffects.playClick();
                  onOpenCall();
                }}
                className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-base flex items-center gap-2 shadow-lg focus:ring-4 focus:ring-emerald-300 active:scale-95 transition-all"
                aria-label={`Call your speaking partner ${partner.name}`}
              >
                <PhoneCall className="w-6 h-6" />
                <span>Call {partner.name} Now</span>
              </button>
            )}
          </div>
        </div>

        {/* Decorative background element */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-10 translate-y-10">
          <HeartHandshake className="w-96 h-96 text-white" />
        </div>
      </section>

      {/* Speaking Partner Status Banner */}
      <section 
        className="rounded-3xl bg-white p-6 md:p-8 shadow-md border-2 border-slate-200"
        aria-labelledby="partner-heading"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            {partner ? (
              <div className={`w-16 h-16 rounded-2xl ${partner.avatarColor} text-white flex items-center justify-center text-2xl font-black shadow-md border-2 border-white shrink-0`}>
                {partner.name.charAt(0)}
              </div>
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <Clock className="w-8 h-8" />
              </div>
            )}

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Speaking Partner Status
                </span>
                {currentUser.isApproved && partner ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5" />
                    Teacher Approved
                  </span>
                ) : !currentUser.isApproved ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-black flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Pending {teacherDisplayName} Review
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 text-xs font-black">
                    Awaiting Partner Match
                  </span>
                )}
              </div>

              <h2 id="partner-heading" className="text-2xl font-black text-slate-900 mt-0.5">
                {!currentUser.isApproved
                  ? 'Account Under Teacher Review'
                  : partner
                  ? `Your Partner: ${partner.name}`
                  : 'Awaiting Safe Partner Assignment'}
              </h2>

              <p className="text-sm md:text-base text-slate-600 mt-1 max-w-xl">
                {!currentUser.isApproved ? (
                  <>
                    Safeguard in place: For child and learner safety, direct voice messaging and calling unlock once {teacherDisplayName} verifies your registration. In the meantime, you can practice speaking on the 5 conversation topics below!
                  </>
                ) : partner ? (
                  <>
                    {partner.name} is a fellow {partner.ageGroup} learner (Native language: {partner.nativeLanguage || 'Beginner'}). Send voice notes or ring them for real-time practice.
                  </>
                ) : (
                  <>
                    {teacherDisplayName} is finding a friendly speaking buddy in your {currentUser.ageGroup} cohort.
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {currentUser.isApproved && partner ? (
              <>
                <button
                  onClick={() => onNavigate('messages')}
                  className="flex-1 md:flex-none px-5 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm focus:ring-4 focus:ring-blue-600 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Voice Messages ({unreadCount} new)</span>
                </button>

                <button
                  onClick={onOpenCall}
                  className="flex-1 md:flex-none px-5 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm focus:ring-4 focus:ring-emerald-600 cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Live Call</span>
                </button>
              </>
            ) : !currentUser.isApproved ? (
              <button
                onClick={() => onNavigate('topics')}
                className="px-5 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-sm flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>Practice Solo Topics While Waiting</span>
              </button>
            ) : (
              <button
                onClick={() => onNavigate('topics')}
                className="px-5 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-sm flex items-center gap-2 cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>Explore Topics</span>
              </button>
            )}

            {onOpenTeacherMessage && (
              <button
                onClick={() => {
                  soundEffects.playClick();
                  onOpenTeacherMessage();
                }}
                className="px-4 py-3 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-950 border-2 border-purple-300 font-black text-sm flex items-center gap-2 cursor-pointer"
                title="Message My Teacher"
              >
                <MessageSquare className="w-4 h-4 text-purple-700" />
                <span>Message Teacher {unreadFromTeacher > 0 ? `(${unreadFromTeacher})` : ''}</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Primary Communication Hub: Message Teacher Bahora & Student Community */}
      <section 
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        aria-label="Teacher Guidance & Classmate Community"
      >
        {/* Prominent Card 1: MESSAGE MY TEACHER */}
        <div className="rounded-3xl bg-linear-to-r from-purple-800 to-indigo-900 text-white p-6 shadow-xl border-4 border-purple-500 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-purple-950/80 text-purple-200 border border-purple-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Instructor</span>
              </span>
              {unreadFromTeacher > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-400 text-amber-950 animate-pulse">
                  {unreadFromTeacher} new message{unreadFromTeacher > 1 ? 's' : ''}
                </span>
              )}
            </div>
            <h2 className="text-2xl font-black text-white">
              Message {teacherDisplayName}
            </h2>
            <p className="text-sm text-purple-100 font-medium leading-relaxed">
              Have questions about vocabulary, need pronunciation feedback, or want to send a voice practice recording? Chat directly in private.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                soundEffects.playClick();
                if (onOpenTeacherMessage) onOpenTeacherMessage();
              }}
              className="w-full py-3.5 px-6 rounded-2xl bg-white hover:bg-purple-50 text-purple-950 font-black text-base flex items-center justify-center gap-2 shadow-lg focus:ring-4 focus:ring-purple-300 transition-all active:scale-95 cursor-pointer"
              aria-label={`MESSAGE MY TEACHER: Open private conversation with ${teacherDisplayName}`}
            >
              <MessageSquare className="w-5 h-5 text-purple-700" />
              <span>MESSAGE MY TEACHER</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>

        {/* Prominent Card 2: STUDENT COMMUNITY & GROUPS */}
        <div className="rounded-3xl bg-linear-to-r from-blue-800 to-cyan-900 text-white p-6 shadow-xl border-4 border-cyan-500 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-950/80 text-cyan-200 border border-cyan-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span>Safe Peer Community</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-950 text-cyan-200 border border-cyan-700">
                {currentUser.ageGroup === 'child' ? 'Youth Cohort' : 'Adult Cohort'}
              </span>
            </div>
            <h2 className="text-2xl font-black text-white">
              Student Community & Groups
            </h2>
            <p className="text-sm text-blue-100 font-medium leading-relaxed">
              Connect with fellow learners, exchange gentle English practice notes, and join teacher-moderated topic practice groups.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                soundEffects.playClick();
                if (onOpenCommunity) onOpenCommunity();
              }}
              className="w-full py-3.5 px-6 rounded-2xl bg-white hover:bg-cyan-50 text-blue-950 font-black text-base flex items-center justify-center gap-2 shadow-lg focus:ring-4 focus:ring-cyan-300 transition-all active:scale-95 cursor-pointer"
              aria-label="Open Student Community and Group Chats"
            >
              <HeartHandshake className="w-5 h-5 text-blue-700" />
              <span>EXPLORE STUDENT COMMUNITY</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </section>

      {/* Featured Dashboard Card: My Avatar & English Coins */}
      <section 
        className="rounded-3xl bg-linear-to-r from-amber-500 via-amber-400 to-yellow-400 text-amber-950 p-6 md:p-8 shadow-lg border-4 border-amber-300 relative overflow-hidden"
        aria-labelledby="avatar-feature-heading"
      >
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <div className="p-3 bg-white/95 rounded-3xl shadow-md border-2 border-amber-200 shrink-0">
              <AvatarGraphic
                config={avatarProfile?.avatarConfig || STARTER_AVATAR}
                size="md"
                showDescriptionButton={true}
              />
            </div>

            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950 text-amber-200 text-xs font-bold shadow-xs">
                <Coins className="w-3.5 h-3.5 text-yellow-300" />
                <span>Virtual Reward System • 100% Free Forever</span>
              </div>

              <h2 id="avatar-feature-heading" className="text-2xl md:text-3xl font-black text-amber-950 tracking-tight">
                My Avatar: {avatarProfile?.avatarConfig?.characterName || 'Sam'}
              </h2>

              <p className="text-sm md:text-base font-bold text-amber-900 leading-relaxed">
                {describeAvatar(avatarProfile?.avatarConfig || STARTER_AVATAR)}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1 justify-center sm:justify-start">
                <div 
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-amber-950 font-black text-base shadow-sm border border-amber-200"
                  role="status"
                  aria-label={`Current balance: ${avatarProfile?.coinsBalance || 0} English Coins`}
                >
                  <Coins className="w-5 h-5 text-amber-600" />
                  <span>{avatarProfile?.coinsBalance || 0} English Coins</span>
                </div>

                <span className="text-xs font-bold text-amber-900 bg-amber-300/80 px-2.5 py-1.5 rounded-lg border border-amber-400">
                  +20/lesson • +10/speaking • +50/topic • +100 bonus
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full sm:w-auto shrink-0">
            <button
              onClick={() => {
                soundEffects.playClick();
                onNavigate('avatar');
              }}
              className="px-6 py-4 rounded-2xl bg-blue-900 hover:bg-blue-950 text-white font-black text-base flex items-center justify-center gap-2 shadow-md hover:shadow-xl focus:ring-4 focus:ring-blue-400 transition-all active:scale-95"
              aria-label="Open My Avatar customizer and Avatar Shop"
            >
              <Palette className="w-5 h-5 text-amber-300" />
              <span>Customize Avatar & Shop</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={() => {
                soundEffects.playClick();
                const bal = avatarProfile?.coinsBalance || 0;
                const name = avatarProfile?.avatarConfig?.characterName || 'Sam';
                const desc = describeAvatar(avatarProfile?.avatarConfig || STARTER_AVATAR);
                speechService.speak(
                  `Your cartoon avatar is named ${name}. ${desc} You currently have ${bal} English Coins. Earn coins by practicing lessons, and spend them in the avatar shop to unlock new clothes, hairstyles, and accessories.`,
                  true
                );
              }}
              className="px-5 py-3 rounded-2xl bg-white/80 hover:bg-white text-amber-950 font-bold text-sm flex items-center justify-center gap-2 shadow-xs focus:ring-4 focus:ring-amber-300 transition-colors"
              aria-label="Listen to avatar and coin balance summary aloud"
            >
              <Volume2 className="w-4 h-4 text-amber-900" />
              <span>Listen to Avatar Summary</span>
            </button>
          </div>
        </div>
      </section>

      {/* Student Assigned Work Section (Teacher-Assigned Tasks) */}
      {myAssignments.length > 0 && (
        <section 
          className="rounded-3xl bg-linear-to-r from-emerald-900 to-teal-900 text-white p-6 md:p-8 shadow-xl border-4 border-emerald-500 space-y-4"
          aria-labelledby="assigned-work-heading"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-700/80 pb-3">
            <div className="flex items-center gap-2.5">
              <ClipboardList className="w-6 h-6 text-emerald-300" />
              <div>
                <span className="text-xs font-black uppercase text-emerald-300 tracking-wider">Teacher Assignments</span>
                <h2 id="assigned-work-heading" className="text-2xl font-black text-white">
                  My Assigned Tasks ({myAssignments.length})
                </h2>
              </div>
            </div>
            <span className="text-xs text-emerald-200 font-bold bg-emerald-950/80 px-3 py-1.5 rounded-full border border-emerald-600">
              Assigned by {teacherDisplayName}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {myAssignments.map((asn) => {
              const sub = mySubmissions.find((s) => s.assignmentId === asn.id);
              const isReviewed = sub?.status === 'reviewed';
              const isCompleted = sub?.status === 'completed' || isReviewed;

              return (
                <div 
                  key={asn.id} 
                  className="p-5 rounded-2xl bg-white/10 backdrop-blur-xs border-2 border-emerald-400/40 hover:border-emerald-300 space-y-3 flex flex-col justify-between transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg font-black text-white">{asn.title}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-black shrink-0 ${
                        isReviewed ? 'bg-purple-300 text-purple-950' :
                        isCompleted ? 'bg-emerald-300 text-emerald-950' : 'bg-amber-300 text-amber-950'
                      }`}>
                        {isReviewed ? `Reviewed (${sub?.score}%)` : isCompleted ? 'Completed' : 'Assigned'}
                      </span>
                    </div>

                    <p className="text-xs text-emerald-100 font-medium">
                      Topic: <strong>{asn.topicTitle}</strong> {asn.lessonTitle ? `• ${asn.lessonTitle}` : ''}
                    </p>

                    {asn.dueDate && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-200 text-xs font-bold">
                        <Calendar className="w-3.5 h-3.5 text-amber-300" />
                        <span>Due: {asn.dueDate}</span>
                      </div>
                    )}

                    {asn.instructions && (
                      <p className="text-xs text-emerald-100/90 italic bg-black/20 p-2.5 rounded-xl border border-white/10">
                        "{asn.instructions}"
                      </p>
                    )}

                    {isReviewed && sub?.teacherFeedback && (
                      <div className="p-3 rounded-xl bg-purple-950/80 border border-purple-400 text-xs text-purple-100 space-y-1">
                        <strong className="text-purple-300 block font-black">{teacherDisplayName} Feedback:</strong>
                        <p>{sub.teacherFeedback}</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => {
                        soundEffects.playClick();
                        onSelectTopic(asn.topicId);
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                    >
                      <span>{isCompleted ? 'Review Lesson & Practice Again' : 'Start Assigned Lesson Now'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Teacher Feedback & Praise Section */}
      {myFeedback.length > 0 && (
        <section 
          className="rounded-3xl bg-linear-to-r from-purple-900 to-indigo-900 text-white p-6 md:p-8 shadow-xl border-4 border-purple-500 space-y-4"
          aria-labelledby="teacher-feedback-heading"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-700/80 pb-3">
            <div className="flex items-center gap-2.5">
              <MessageSquare className="w-6 h-6 text-purple-300" />
              <div>
                <span className="text-xs font-black uppercase text-purple-300 tracking-wider">Direct Learning Guidance</span>
                <h2 id="teacher-feedback-heading" className="text-2xl font-black text-white">
                  Teacher Guidance & Praise
                </h2>
              </div>
            </div>
            <span className="text-xs text-purple-200 font-bold bg-purple-950/80 px-3 py-1.5 rounded-full border border-purple-600">
              Personalized Notes from {teacherDisplayName}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {myFeedback.map((fb) => (
              <div 
                key={fb.id} 
                className={`p-5 rounded-2xl border-2 space-y-3 transition-colors ${
                  fb.isReadByStudent 
                    ? 'bg-white/10 border-white/20' 
                    : 'bg-purple-950/80 border-purple-400 shadow-md ring-2 ring-purple-400/40'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-black text-white">{fb.targetTitle}</h3>
                    <span className="text-[10px] text-purple-300 font-mono">
                      {new Date(fb.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {!fb.isReadByStudent && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-amber-400 text-amber-950">
                      NEW NOTE
                    </span>
                  )}
                </div>

                <p className="text-xs md:text-sm text-purple-100 font-medium leading-relaxed bg-black/20 p-3 rounded-xl border border-white/10">
                  {fb.feedbackText}
                </p>

                {(fb.praisePoints || fb.improvementTip) && (
                  <div className="space-y-1.5 text-xs">
                    {fb.praisePoints && (
                      <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 font-medium">
                        <strong className="text-emerald-300 block font-black">🌟 Praise:</strong> {fb.praisePoints}
                      </div>
                    )}
                    {fb.improvementTip && (
                      <div className="p-2.5 rounded-xl bg-blue-950/80 border border-blue-500/60 text-blue-200 font-medium">
                        <strong className="text-blue-300 block font-black">💡 Next Step Tip:</strong> {fb.improvementTip}
                      </div>
                    )}
                  </div>
                )}

                {!fb.isReadByStudent && (
                  <div className="pt-1 flex justify-end">
                    <button
                      onClick={() => handleMarkFeedbackRead(fb.id)}
                      className="px-4 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-purple-950 font-black text-xs shadow-xs transition-colors cursor-pointer"
                    >
                      Mark as Read & Understood
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Primary Feature Hub (3 Big Accessible Cards) */}
      <section aria-labelledby="features-heading">
        <h2 id="features-heading" className="text-2xl font-black text-slate-900 mb-4">
          Choose How You Want to Practice
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: 5 Conversation Topics */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-slate-200 hover:border-blue-400 shadow-md hover:shadow-lg transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                <BookOpen className="w-7 h-7" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                  Structured Practice
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-1">
                  {topics.length} Speaking Topics
                </h3>
              </div>

              <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                Step-by-step curriculum across 4 levels: Foundations, Everyday Life, Practical Situations, and Expressing Yourself. Includes spoken vocabulary, model dialogues, interactive activities, and topic tests!
              </p>
            </div>

            <div className="pt-6">
              <button
                onClick={() => onNavigate('topics')}
                className="w-full py-3.5 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-sm flex items-center justify-center gap-2 focus:ring-4 focus:ring-blue-600"
              >
                <span>Explore All {topics.length} Topics</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 2: Voice Messaging */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-slate-200 hover:border-blue-400 shadow-md hover:shadow-lg transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageSquare className="w-7 h-7" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                  Audio-First Communication
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-1">
                  Voice Messaging
                </h3>
              </div>

              <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                Record your voice with one big tactile button. Listen back, re-record if needed, and send audio messages back and forth at your own pace.
              </p>
            </div>

            <div className="pt-6">
              <button
                onClick={() => onNavigate('messages')}
                className="w-full py-3.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-sm flex items-center justify-center gap-2 focus:ring-4 focus:ring-teal-600"
              >
                <span>Open Voice Inbox</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 3: Live Audio Calling */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-slate-200 hover:border-blue-400 shadow-md hover:shadow-lg transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                <PhoneCall className="w-7 h-7" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Real-Time Conversation
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-1">
                  Live Voice Call
                </h3>
              </div>

              <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                Simulate or make a live phone-call style conversation with your partner. In-call prompts help you ask questions if you ever feel stuck!
              </p>
            </div>

            <div className="pt-6">
              <button
                onClick={onOpenCall}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm flex items-center justify-center gap-2 focus:ring-4 focus:ring-emerald-600"
              >
                <span>Start Audio Call</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Topics Preview */}
      <section aria-labelledby="topics-preview-heading">
        <div className="flex items-center justify-between mb-4">
          <h2 id="topics-preview-heading" className="text-2xl font-black text-slate-900">
            {topics.length} Conversation Topics (Curriculum Preview)
          </h2>
          <button
            onClick={() => onNavigate('topics')}
            className="text-sm font-extrabold text-blue-700 hover:text-blue-900 flex items-center gap-1 focus:ring-2 focus:ring-blue-600 p-1 rounded-md"
          >
            <span>View All {topics.length} Topics</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topics.slice(0, 6).map((t, idx) => (
            <div
              key={t.id}
              className="p-5 rounded-2xl bg-white border-2 border-slate-200 hover:border-blue-400 transition-colors shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
                    Topic #{idx + 1}
                  </span>
                  <button
                    onClick={() => {
                      soundEffects.playClick();
                      speechService.speak(t.audioInstruction, true);
                    }}
                    className="p-1.5 rounded-lg text-blue-700 hover:bg-blue-50 focus:ring-2 focus:ring-blue-600"
                    aria-label={`Listen to summary for ${t.title}`}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="text-lg font-black text-slate-900">{t.title}</h3>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">{t.subtitle}</p>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => onSelectTopic(t.id)}
                  className="w-full py-2.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold text-xs flex items-center justify-center gap-1.5 border border-blue-200 focus:ring-4 focus:ring-blue-400"
                >
                  <span>Practice This Topic</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Accessibility & Safeguarding Standards */}
      <section 
        className="rounded-3xl bg-slate-100 p-6 md:p-8 border-2 border-slate-300"
        aria-labelledby="safety-heading"
      >
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-blue-800 font-black text-sm">
            <ShieldCheck className="w-5 h-5 text-blue-700" />
            <span>Built for Blind & Low-Vision Learners with Strict Safeguards</span>
          </div>
          <h2 id="safety-heading" className="text-2xl font-black text-slate-900">
            Safety, Accessibility & Privacy Commitment
          </h2>
          <p className="text-sm md:text-base text-slate-700 leading-relaxed">
            Limitless English Connect adheres to <strong>WCAG 2.2 AA</strong> standards with screen reader semantic markup, high-contrast options, large tactile tap areas, and voice-first actions. To safeguard minors, learners under 18 can only be paired with fellow minors approved by {teacherDisplayName}. All recordings remain strictly private.
          </p>
        </div>
      </section>
    </div>
  );
};
