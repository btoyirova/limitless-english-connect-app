import React, { useState } from 'react';
import { 
  Volume2, 
  ArrowRight, 
  Hand, 
  User, 
  Users, 
  Utensils, 
  Smile, 
  Sparkles,
  BookOpen,
  Heart,
  Clock,
  Compass,
  Calendar,
  MapPin,
  MessageSquare,
  ShoppingBag,
  Sun,
  Star,
  Activity,
  HelpCircle,
  Home,
  Target
} from 'lucide-react';
import { ConversationTopic } from '../types';
import { speechService } from '../services/speechService';
import { soundEffects } from '../services/soundEffects';

interface TopicsViewProps {
  topics: ConversationTopic[];
  onSelectTopic: (topicId: string) => void;
}

export const TopicsView: React.FC<TopicsViewProps> = ({
  topics,
  onSelectTopic
}) => {
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  const getTopicIcon = (iconName: string) => {
    switch (iconName) {
      case 'hand': return <Hand className="w-8 h-8 text-blue-700" />;
      case 'user': return <User className="w-8 h-8 text-teal-700" />;
      case 'users': return <Users className="w-8 h-8 text-indigo-700" />;
      case 'utensils': return <Utensils className="w-8 h-8 text-amber-700" />;
      case 'smile': return <Smile className="w-8 h-8 text-emerald-700" />;
      case 'heart': return <Heart className="w-8 h-8 text-rose-600" />;
      case 'clock': return <Clock className="w-8 h-8 text-cyan-700" />;
      case 'compass': return <Compass className="w-8 h-8 text-blue-600" />;
      case 'calendar': return <Calendar className="w-8 h-8 text-purple-600" />;
      case 'map-pin': return <MapPin className="w-8 h-8 text-red-600" />;
      case 'message': return <MessageSquare className="w-8 h-8 text-teal-600" />;
      case 'shopping': return <ShoppingBag className="w-8 h-8 text-amber-600" />;
      case 'sun': return <Sun className="w-8 h-8 text-amber-500" />;
      case 'star': return <Star className="w-8 h-8 text-yellow-500" />;
      case 'activity': return <Activity className="w-8 h-8 text-emerald-600" />;
      case 'home': return <Home className="w-8 h-8 text-indigo-600" />;
      case 'target': return <Target className="w-8 h-8 text-rose-500" />;
      case 'help': return <HelpCircle className="w-8 h-8 text-blue-500" />;
      default: return <BookOpen className="w-8 h-8 text-blue-700" />;
    }
  };

  const handleReadOverview = () => {
    soundEffects.playClick();
    const overview = `Welcome to the Limitless English speaking curriculum. We have ${topics.length} comprehensive units arranged across four progressive levels: Level 1 Foundations covering Topics 1 through 5. Level 2 Everyday Life covering Topics 6 through 10. Level 3 Practical Situations covering Topics 11 through 15. And Level 4 Expressing Yourself covering Topics 16 through 20. Each topic includes key vocabulary, model conversations, interactive practice activities, and an end of topic test with English Coins rewards.`;
    speechService.speak(overview, true);
  };

  // Group or filter topics
  const filteredTopics = selectedLevel === 'all'
    ? topics
    : topics.filter((t) => t.levelGroup === selectedLevel);

  const levelTabs = [
    { id: 'all', label: `All Topics (${topics.length})` },
    { id: 'Level 1', label: 'Level 1: Foundations (1-5)' },
    { id: 'Level 2', label: 'Level 2: Everyday Life (6-10)' },
    { id: 'Level 3', label: 'Level 3: Practical (11-15)' },
    { id: 'Level 4', label: 'Level 4: Expressing (16-20)' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Topics Header */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-black">
            <Sparkles className="w-4 h-4" />
            <span>Complete Pre-A1 to A2 English Speaking Curriculum</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            {topics.length} Conversation Topics
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            Accessible, step-by-step speaking units designed specifically for blind and low-vision learners. Practice vocabulary, listen to dialogues, complete sentence challenges, chat with AI, and take the end-of-topic test to earn English Coins!
          </p>
        </div>

        <button
          onClick={handleReadOverview}
          className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-sm flex items-center gap-2.5 shadow-md focus:ring-4 focus:ring-amber-200 active:scale-95 transition-all shrink-0"
          aria-label={`Listen to spoken audio overview of all ${topics.length} topics across 4 levels`}
        >
          <Volume2 className="w-5 h-5 text-amber-950" />
          <span>Listen to Topics Overview</span>
        </button>
      </div>

      {/* Level Filter Tabs */}
      <nav 
        className="flex items-center gap-2 overflow-x-auto pb-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200"
        role="tablist"
        aria-label="Filter topics by learning level"
      >
        {levelTabs.map((tab) => {
          const isSelected = selectedLevel === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isSelected}
              onClick={() => {
                soundEffects.playClick();
                setSelectedLevel(tab.id);
                speechService.announce(`Filtered by ${tab.label}`);
              }}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm whitespace-nowrap transition-all border-2 ${
                isSelected
                  ? 'bg-blue-700 text-white border-blue-800 shadow-sm'
                  : 'bg-white text-slate-700 border-transparent hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" role="list" aria-label={`Conversation topics list: ${filteredTopics.length} shown`}>
        {filteredTopics.map((topic, index) => {
          const globalTopicIndex = topics.findIndex((t) => t.id === topic.id);
          const displayIndex = globalTopicIndex !== -1 ? globalTopicIndex + 1 : index + 1;

          return (
            <div
              key={topic.id}
              className="bg-white rounded-3xl p-6 md:p-8 border-2 border-slate-200 hover:border-blue-500 shadow-md hover:shadow-xl transition-all flex flex-col justify-between group"
              role="listitem"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="p-3.5 rounded-2xl bg-slate-100 border border-slate-200 group-hover:scale-110 transition-transform">
                    {getTopicIcon(topic.iconName)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-300">
                      {topic.levelGroup || 'Level 1'} • {topic.level || 'A1'}
                    </span>
                    <span className="text-xs font-black px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                      Topic #{displayIndex}
                    </span>
                    <button
                      onClick={() => {
                        soundEffects.playClick();
                        speechService.speak(topic.audioInstruction, true);
                      }}
                      className="p-2 rounded-xl text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 focus:ring-4 focus:ring-blue-400"
                      aria-label={`Listen to spoken instruction for Topic ${displayIndex}: ${topic.title}`}
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-black text-slate-900 group-hover:text-blue-700 transition-colors">
                    {topic.title}
                  </h2>
                  <p className="text-sm md:text-base text-slate-600 mt-2 font-medium">
                    {topic.subtitle}
                  </p>
                </div>

                {/* Sample Prompts Preview */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500 block">
                    Practice Questions:
                  </span>
                  <ul className="space-y-1.5 text-xs md:text-sm font-semibold text-slate-700">
                    {topic.prompts.map((p) => (
                      <li key={p.id} className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">•</span>
                        <span>{p.question}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => {
                    soundEffects.playClick();
                    onSelectTopic(topic.id);
                  }}
                  className="w-full py-4 px-6 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-black text-base flex items-center justify-center gap-3 shadow-md focus:ring-4 focus:ring-blue-600 active:scale-95 transition-transform"
                  aria-label={`Open practice page and test for Topic ${displayIndex}: ${topic.title}`}
                >
                  <span>Open Practice & Audio Guide</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
