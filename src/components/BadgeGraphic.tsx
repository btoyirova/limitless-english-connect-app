import React from 'react';
import { Badge } from '../types/achievements';
import { 
  Award, 
  Star, 
  Shield, 
  Trophy, 
  Crown, 
  Mic, 
  Hand, 
  User, 
  Users, 
  Utensils, 
  Smile, 
  Clock, 
  Calendar, 
  ShoppingBag, 
  Home, 
  Sun, 
  Coffee, 
  MapPin, 
  Heart, 
  Activity, 
  Compass, 
  Book, 
  Target, 
  MessageSquare, 
  HelpCircle,
  Lock,
  Volume2
} from 'lucide-react';
import { speechService } from '../services/speechService';
import { soundEffects } from '../services/soundEffects';

interface BadgeGraphicProps {
  badge: Badge;
  isUnlocked?: boolean;
  earnedAt?: string;
  size?: 'sm' | 'md' | 'lg';
  showAudioButton?: boolean;
  className?: string;
}

export const BadgeGraphic: React.FC<BadgeGraphicProps> = ({
  badge,
  isUnlocked = false,
  earnedAt,
  size = 'md',
  showAudioButton = true,
  className = '',
}) => {
  const renderIcon = () => {
    const iconProps = { className: size === 'sm' ? 'w-5 h-5' : size === 'lg' ? 'w-10 h-10' : 'w-7 h-7' };
    switch (badge.iconName) {
      case 'hand': return <Hand {...iconProps} />;
      case 'user': return <User {...iconProps} />;
      case 'users': return <Users {...iconProps} />;
      case 'utensils': return <Utensils {...iconProps} />;
      case 'smile': return <Smile {...iconProps} />;
      case 'clock': return <Clock {...iconProps} />;
      case 'calendar': return <Calendar {...iconProps} />;
      case 'shopping': return <ShoppingBag {...iconProps} />;
      case 'home': return <Home {...iconProps} />;
      case 'sun': return <Sun {...iconProps} />;
      case 'coffee': return <Coffee {...iconProps} />;
      case 'map-pin': return <MapPin {...iconProps} />;
      case 'heart': return <Heart {...iconProps} />;
      case 'activity': return <Activity {...iconProps} />;
      case 'compass': return <Compass {...iconProps} />;
      case 'book': return <Book {...iconProps} />;
      case 'target': return <Target {...iconProps} />;
      case 'message': return <MessageSquare {...iconProps} />;
      case 'help': return <HelpCircle {...iconProps} />;
      case 'star': return <Star {...iconProps} />;
      case 'shield': return <Shield {...iconProps} />;
      case 'trophy': return <Trophy {...iconProps} />;
      case 'crown': return <Crown {...iconProps} />;
      case 'mic': return <Mic {...iconProps} />;
      case 'award':
      default:
        return <Award {...iconProps} />;
    }
  };

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEffects.playClick();
    const status = isUnlocked
      ? `Badge: ${badge.name}. Status: Unlocked! ${badge.description}. Earned 30 English Coins.`
      : `Badge: ${badge.name}. Status: Locked. How to unlock: ${badge.unlockCriteria}. Reward: ${badge.coinReward} coins.`;
    speechService.speak(status, true);
  };

  const sizeDimensions = {
    sm: 'w-14 h-14',
    md: 'w-20 h-20',
    lg: 'w-28 h-28',
  }[size];

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div className="relative group">
        <div
          className={`${sizeDimensions} rounded-3xl p-1.5 flex items-center justify-center shadow-md transition-transform group-hover:scale-105 ${
            isUnlocked
              ? `bg-linear-to-br ${badge.color} text-white border-4 border-amber-300 ring-2 ring-amber-400/50`
              : 'bg-slate-200 text-slate-400 border-4 border-slate-300'
          }`}
          role="img"
          aria-label={`${badge.name}. ${isUnlocked ? 'Earned achievement badge' : 'Locked badge'}.`}
        >
          {isUnlocked ? (
            <div className="flex flex-col items-center justify-center drop-shadow-md">
              {renderIcon()}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <Lock className={size === 'sm' ? 'w-5 h-5' : 'w-7 h-7'} />
            </div>
          )}
        </div>

        {/* Small gold reward pill on top-right */}
        {isUnlocked && (
          <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 rounded-full bg-amber-400 text-amber-950 font-black text-[10px] border border-amber-500 shadow-xs">
            +{badge.coinReward}
          </span>
        )}
      </div>

      <div className="text-center space-y-0.5 max-w-[130px]">
        <h4 className={`font-black text-xs md:text-sm leading-tight ${isUnlocked ? 'text-slate-900' : 'text-slate-500'}`}>
          {badge.name}
        </h4>
        <span className="block text-[11px] font-bold text-slate-500">
          {isUnlocked ? (earnedAt ? `Unlocked ${new Date(earnedAt).toLocaleDateString()}` : 'Unlocked') : 'Locked'}
        </span>
      </div>

      {showAudioButton && (
        <button
          type="button"
          onClick={handleSpeak}
          className="p-1 rounded-lg text-slate-600 hover:text-blue-700 hover:bg-slate-100 focus:ring-2 focus:ring-blue-400 transition-colors"
          aria-label={`Listen to details for badge ${badge.name}`}
        >
          <Volume2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
