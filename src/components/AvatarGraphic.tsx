import React from 'react';
import { AvatarConfig } from '../types/avatar';
import { SKIN_TONES, HAIR_COLORS, EYE_COLORS, describeAvatar } from '../services/avatarService';
import { Volume2 } from 'lucide-react';
import { speechService } from '../services/speechService';
import { soundEffects } from '../services/soundEffects';

interface AvatarGraphicProps {
  config: AvatarConfig;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showDescriptionButton?: boolean;
  className?: string;
}

export const AvatarGraphic: React.FC<AvatarGraphicProps> = ({
  config,
  size = 'md',
  showDescriptionButton = false,
  className = '',
}) => {
  const skinColor = SKIN_TONES.find((s) => s.id === config.skinTone)?.color || '#f3c299';
  const hairColorHex = HAIR_COLORS.find((h) => h.id === config.hairColor)?.color || '#1a1a1a';
  const eyeColorHex = EYE_COLORS.find((e) => e.id === config.eyeColor)?.color || '#3e2723';
  const presentation = config.presentation || 'neutral';
  const description = describeAvatar(config);

  const sizePixels = {
    sm: 56,
    md: 96,
    lg: 160,
    xl: 240,
  }[size];

  const handleSpeakDescription = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEffects.playClick();
    speechService.speak(description, true);
  };

  // Render clothing paths and colors
  const renderClothing = () => {
    switch (config.clothing) {
      case 'floral-dress':
        return (
          <g id="clothing-floral-dress">
            {/* Soft yellow floral dress */}
            <path d="M 40 160 Q 60 135 120 135 Q 180 135 200 160 L 210 240 L 30 240 Z" fill="#fef08a" />
            {/* Peach neckline trim */}
            <path d="M 85 138 Q 120 156 155 138" stroke="#fb923c" strokeWidth="4" fill="none" strokeLinecap="round" />
            {/* Little daisy flowers */}
            <circle cx="70" cy="180" r="4" fill="#ffffff" />
            <circle cx="70" cy="180" r="1.5" fill="#f59e0b" />
            <circle cx="170" cy="185" r="4" fill="#ffffff" />
            <circle cx="170" cy="185" r="1.5" fill="#f59e0b" />
            <circle cx="120" cy="195" r="4.5" fill="#ffffff" />
            <circle cx="120" cy="195" r="1.8" fill="#f59e0b" />
            <circle cx="95" cy="220" r="4" fill="#ffffff" />
            <circle cx="95" cy="220" r="1.5" fill="#f59e0b" />
            <circle cx="150" cy="220" r="4" fill="#ffffff" />
            <circle cx="150" cy="220" r="1.5" fill="#f59e0b" />
          </g>
        );
      case 'summer-sundress':
        return (
          <g id="clothing-summer-sundress">
            {/* Breezy sky blue tiered sundress */}
            <path d="M 40 160 Q 60 135 120 135 Q 180 135 200 160 L 210 240 L 30 240 Z" fill="#38bdf8" />
            {/* Tier ruffle */}
            <path d="M 45 190 Q 120 205 195 190 L 198 200 Q 120 215 42 200 Z" fill="#0284c7" />
            {/* Sweetheart collar */}
            <path d="M 85 136 Q 102 148 120 142 Q 138 148 155 136" stroke="#ffffff" strokeWidth="3.5" fill="none" />
          </g>
        );
      case 'evening-dress':
        return (
          <g id="clothing-evening-dress">
            {/* Royal sapphire evening dress */}
            <path d="M 38 160 Q 60 135 120 135 Q 180 135 202 160 L 215 240 L 25 240 Z" fill="#1e1b4b" />
            {/* Shimmering jewel collar */}
            <path d="M 82 135 Q 120 160 158 135" stroke="#38bdf8" strokeWidth="5" fill="none" />
            {/* Gold pendant */}
            <circle cx="120" cy="162" r="5" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
          </g>
        );
      case 'smart-suit':
        return (
          <g id="clothing-smart-suit">
            {/* Deep navy tailored jacket */}
            <path d="M 35 160 Q 60 135 120 135 Q 180 135 205 160 L 215 240 L 25 240 Z" fill="#1e293b" />
            {/* White crisp shirt insert */}
            <polygon points="120,190 90,135 150,135" fill="#ffffff" />
            {/* Dark red tie */}
            <polygon points="120,146 114,156 116,210 120,218 124,210 126,156" fill="#991b1b" />
            {/* Suit lapels */}
            <polygon points="80,136 108,185 88,195 60,155" fill="#0f172a" />
            <polygon points="160,136 132,185 152,195 180,155" fill="#0f172a" />
          </g>
        );
      case 'striped-sweater':
        return (
          <g id="clothing-striped-sweater">
            {/* Burgundy and cream chunky sweater */}
            <path d="M 35 160 Q 60 135 120 135 Q 180 135 205 160 L 215 240 L 25 240 Z" fill="#881337" />
            {/* Cream knit stripes */}
            <path d="M 32 170 L 208 170 L 210 185 L 30 185 Z" fill="#fef3c7" />
            <path d="M 28 205 L 212 205 L 214 220 L 26 220 Z" fill="#fef3c7" />
            {/* Rolled turtle collar */}
            <rect x="85" y="130" width="70" height="18" rx="6" fill="#9f1239" stroke="#4c0519" strokeWidth="2" />
          </g>
        );
      case 'athletic-tracksuit':
        return (
          <g id="clothing-athletic-tracksuit">
            {/* Teal sporty tracksuit */}
            <path d="M 35 160 Q 60 135 120 135 Q 180 135 205 160 L 215 240 L 25 240 Z" fill="#0f766e" />
            {/* White racing stripes down shoulders */}
            <line x1="50" y1="160" x2="35" y2="240" stroke="#ffffff" strokeWidth="6" />
            <line x1="190" y1="160" x2="205" y2="240" stroke="#ffffff" strokeWidth="6" />
            {/* Center zip */}
            <line x1="120" y1="140" x2="120" y2="240" stroke="#facc15" strokeWidth="3" />
            <rect x="117" y="150" width="6" height="8" rx="2" fill="#e2e8f0" />
          </g>
        );
      case 'green-hoodie':
        return (
          <g id="clothing-hoodie">
            <path d="M 35 160 Q 60 135 120 135 Q 180 135 205 160 L 215 240 L 25 240 Z" fill="#2d6a4f" />
            <path d="M 80 138 Q 120 162 160 138 Q 120 126 80 138 Z" fill="#1b4332" />
            <line x1="102" y1="145" x2="102" y2="185" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="138" y1="145" x2="138" y2="185" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
          </g>
        );
      case 'white-oxford':
        return (
          <g id="clothing-oxford">
            <path d="M 35 160 Q 60 135 120 135 Q 180 135 205 160 L 215 240 L 25 240 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
            <polygon points="120,155 90,132 120,140" fill="#e2e8f0" />
            <polygon points="120,155 150,132 120,140" fill="#e2e8f0" />
            <circle cx="120" cy="172" r="3" fill="#64748b" />
            <circle cx="120" cy="198" r="3" fill="#64748b" />
          </g>
        );
      case 'striped-polo':
        return (
          <g id="clothing-striped-polo">
            <path d="M 35 160 Q 60 135 120 135 Q 180 135 205 160 L 215 240 L 25 240 Z" fill="#f59e0b" />
            <path d="M 30 172 L 210 172 L 212 186 L 28 186 Z" fill="#fef3c7" />
            <path d="M 26 205 L 214 205 L 215 218 L 25 218 Z" fill="#fef3c7" />
            <polygon points="120,152 86,134 120,140" fill="#d97706" />
            <polygon points="120,152 154,134 120,140" fill="#d97706" />
          </g>
        );
      case 'denim-jacket':
        return (
          <g id="clothing-denim">
            <path d="M 35 160 Q 60 135 120 135 Q 180 135 205 160 L 215 240 L 25 240 Z" fill="#1e3a8a" />
            <polygon points="120,165 102,135 138,135" fill="#f1f5f9" />
            <line x1="102" y1="135" x2="102" y2="240" stroke="#fbbf24" strokeWidth="2.5" strokeDasharray="4,2" />
            <line x1="138" y1="135" x2="138" y2="240" stroke="#fbbf24" strokeWidth="2.5" strokeDasharray="4,2" />
          </g>
        );
      case 'academia-blazer':
        return (
          <g id="clothing-blazer">
            <path d="M 35 160 Q 60 135 120 135 Q 180 135 205 160 L 215 240 L 25 240 Z" fill="#334155" />
            <polygon points="120,185 96,135 144,135" fill="#ffffff" />
            <polygon points="120,146 114,156 116,200 120,208 124,200 126,156" fill="#1e3a8a" />
            <polygon points="80,136 108,185 88,195 60,155" fill="#1e293b" />
            <polygon points="160,136 132,185 152,195 180,155" fill="#1e293b" />
          </g>
        );
      case 'varsity-jacket':
        return (
          <g id="clothing-varsity">
            <path d="M 55 160 Q 75 135 120 135 Q 165 135 185 160 L 195 240 L 45 240 Z" fill="#1d4ed8" />
            <path d="M 25 240 L 45 240 L 60 160 L 38 165 Z" fill="#fef08a" />
            <path d="M 215 240 L 195 240 L 180 160 L 202 165 Z" fill="#fef08a" />
            <text x="80" y="182" fill="#fef08a" fontSize="18" fontWeight="900" fontFamily="sans-serif">LE</text>
            <path d="M 85 138 Q 120 155 155 138" stroke="#fef08a" strokeWidth="6" fill="none" />
          </g>
        );
      case 'explorer-outfit':
        return (
          <g id="clothing-explorer">
            <path d="M 35 160 Q 60 135 120 135 Q 180 135 205 160 L 215 240 L 25 240 Z" fill="#d97706" />
            <rect x="60" y="170" width="34" height="34" rx="5" fill="#b45309" stroke="#78350f" strokeWidth="2" />
            <rect x="146" y="170" width="34" height="34" rx="5" fill="#b45309" stroke="#78350f" strokeWidth="2" />
          </g>
        );
      case 'festive-attire':
        return (
          <g id="clothing-festive">
            <path d="M 35 160 Q 60 135 120 135 Q 180 135 205 160 L 215 240 L 25 240 Z" fill="#831843" />
            <path d="M 80 138 Q 120 162 160 138" stroke="#facc15" strokeWidth="7" fill="none" />
            <line x1="120" y1="155" x2="120" y2="240" stroke="#facc15" strokeWidth="5" />
          </g>
        );
      case 'starter-slate-crew':
        return (
          <g id="clothing-slate-crew">
            <path d="M 35 160 Q 60 135 120 135 Q 180 135 205 160 L 215 240 L 25 240 Z" fill="#475569" />
            <path d="M 85 138 Q 120 156 155 138" stroke="#334155" strokeWidth="6" fill="none" />
          </g>
        );
      case 'starter-navy-tee':
      default:
        return (
          <g id="clothing-navy-tee">
            <path d="M 35 160 Q 60 135 120 135 Q 180 135 205 160 L 215 240 L 25 240 Z" fill="#1e3a8a" />
            <path d="M 85 138 Q 120 160 155 138" stroke="#172554" strokeWidth="6" fill="none" />
          </g>
        );
    }
  };

  // Render eyes based on style and color
  const renderEyes = () => {
    switch (config.eyeStyle) {
      case 'sparkle':
        return (
          <g id="eyes-sparkle">
            {/* Left Eye */}
            <ellipse cx="96" cy="100" rx="11" ry="13" fill="#ffffff" />
            <ellipse cx="96" cy="100" rx="8" ry="10" fill={eyeColorHex} />
            <circle cx="98" cy="97" r="3.2" fill="#ffffff" />
            <circle cx="93" cy="104" r="1.6" fill="#ffffff" />
            {presentation === 'female' && <path d="M 86 94 Q 84 88 88 90" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" fill="none" />}
            {/* Right Eye */}
            <ellipse cx="144" cy="100" rx="11" ry="13" fill="#ffffff" />
            <ellipse cx="144" cy="100" rx="8" ry="10" fill={eyeColorHex} />
            <circle cx="146" cy="97" r="3.2" fill="#ffffff" />
            <circle cx="141" cy="104" r="1.6" fill="#ffffff" />
            {presentation === 'female' && <path d="M 154 94 Q 156 88 152 90" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" fill="none" />}
          </g>
        );
      case 'almond':
        return (
          <g id="eyes-almond">
            {/* Left Eye */}
            <path d="M 84 102 Q 96 92 108 102 Q 96 112 84 102 Z" fill="#ffffff" />
            <ellipse cx="96" cy="102" rx="6.5" ry="7.5" fill={eyeColorHex} />
            <circle cx="98" cy="100" r="2.2" fill="#ffffff" />
            {presentation === 'female' && <path d="M 82 102 Q 80 97 84 99" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" fill="none" />}
            {/* Right Eye */}
            <path d="M 132 102 Q 144 92 156 102 Q 144 112 132 102 Z" fill="#ffffff" />
            <ellipse cx="144" cy="102" rx="6.5" ry="7.5" fill={eyeColorHex} />
            <circle cx="146" cy="100" r="2.2" fill="#ffffff" />
            {presentation === 'female' && <path d="M 158 102 Q 160 97 156 99" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" fill="none" />}
          </g>
        );
      case 'round':
        return (
          <g id="eyes-round">
            {/* Left Eye */}
            <circle cx="94" cy="102" r="10" fill="#ffffff" />
            <circle cx="94" cy="102" r="7" fill={eyeColorHex} />
            <circle cx="96" cy="99" r="2.5" fill="#ffffff" />
            {presentation === 'female' && <path d="M 85 96 Q 83 91 87 93" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" fill="none" />}
            {/* Right Eye */}
            <circle cx="146" cy="102" r="10" fill="#ffffff" />
            <circle cx="146" cy="102" r="7" fill={eyeColorHex} />
            <circle cx="148" cy="99" r="2.5" fill="#ffffff" />
            {presentation === 'female' && <path d="M 155 96 Q 157 91 153 93" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" fill="none" />}
          </g>
        );
      case 'gentle':
      default:
        return (
          <g id="eyes-gentle">
            {/* Left Eye */}
            <ellipse cx="94" cy="102" rx="10" ry="11" fill="#ffffff" />
            <circle cx="94" cy="102" r="7" fill={eyeColorHex} />
            <circle cx="96" cy="99" r="2.4" fill="#ffffff" />
            {presentation === 'female' && <path d="M 85 97 Q 83 92 87 94" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" fill="none" />}
            {/* Right Eye */}
            <ellipse cx="146" cy="102" rx="10" ry="11" fill="#ffffff" />
            <circle cx="146" cy="102" r="7" fill={eyeColorHex} />
            <circle cx="148" cy="99" r="2.4" fill="#ffffff" />
            {presentation === 'female' && <path d="M 155 97 Q 157 92 153 94" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" fill="none" />}
          </g>
        );
    }
  };

  // Render hairstyle
  const renderHair = () => {
    switch (config.hairStyle) {
      case 'high-ponytail':
        return (
          <g id="hair-ponytail">
            {/* Crown and sweeping bangs */}
            <path d="M 58 105 C 50 35, 190 35, 182 105 C 160 80, 135 85, 120 85 C 105 85, 80 80, 58 105 Z" fill={hairColorHex} />
            {/* High pony arching upwards and flowing right */}
            <path d="M 120 45 C 110 15, 150 5, 185 20 C 210 35, 215 80, 195 125 C 185 110, 180 80, 160 55 C 145 45, 130 45, 120 45 Z" fill={hairColorHex} />
            {/* Bright pink scrunchie */}
            <ellipse cx="140" cy="40" rx="9" ry="6" fill="#f43f5e" stroke="#be123c" strokeWidth="2" transform="rotate(-20 140 40)" />
          </g>
        );
      case 'side-braid':
        return (
          <g id="hair-side-braid">
            {/* Sleek crown */}
            <path d="M 58 105 C 52 40, 188 40, 182 105 C 160 85, 135 88, 120 88 C 105 88, 80 85, 58 105 Z" fill={hairColorHex} />
            {/* Braid flowing down right shoulder */}
            <path d="M 175 90 C 185 120, 180 150, 175 180 C 172 195, 178 215, 170 230 C 160 215, 165 195, 162 180 C 160 150, 165 120, 155 90 Z" fill={hairColorHex} />
            {/* Braid hair tie */}
            <rect x="162" y="210" width="14" height="6" rx="2" fill="#38bdf8" />
          </g>
        );
      case 'long-waves':
        return (
          <g id="hair-long-waves">
            {/* Back hair layers flowing past shoulders */}
            <path d="M 55 100 C 40 140, 42 195, 52 235 C 72 235, 65 190, 72 150 C 72 110, 168 110, 168 150 C 175 190, 168 235, 188 235 C 198 195, 200 140, 185 100 Z" fill={hairColorHex} />
            {/* Front top crown & face framing locks */}
            <path d="M 58 105 C 52 35, 188 35, 182 105 C 165 80, 135 84, 120 84 C 105 84, 75 80, 58 105 Z" fill={hairColorHex} />
          </g>
        );
      case 'curly-buns':
        return (
          <g id="hair-curly-buns">
            {/* Base hair */}
            <path d="M 60 105 C 55 45, 185 45, 180 105 C 160 85, 135 88, 120 88 C 105 88, 80 85, 60 105 Z" fill={hairColorHex} />
            {/* Left High Bun */}
            <circle cx="65" cy="45" r="22" fill={hairColorHex} />
            <circle cx="58" cy="40" r="10" fill={hairColorHex} />
            {/* Right High Bun */}
            <circle cx="175" cy="45" r="22" fill={hairColorHex} />
            <circle cx="182" cy="40" r="10" fill={hairColorHex} />
            {/* Cute gold hair pins */}
            <circle cx="65" cy="58" r="4" fill="#fbbf24" />
            <circle cx="175" cy="58" r="4" fill="#fbbf24" />
          </g>
        );
      case 'afro-puffs':
        return (
          <g id="hair-afro-puffs">
            {/* Sleek center part base */}
            <path d="M 62 105 C 58 55, 182 55, 178 105 C 160 88, 135 90, 120 90 C 105 90, 80 88, 62 105 Z" fill={hairColorHex} />
            {/* Left Large Puff */}
            <circle cx="55" cy="48" r="30" fill={hairColorHex} />
            <circle cx="45" cy="55" r="16" fill={hairColorHex} />
            {/* Right Large Puff */}
            <circle cx="185" cy="48" r="30" fill={hairColorHex} />
            <circle cx="195" cy="55" r="16" fill={hairColorHex} />
          </g>
        );
      case 'afro':
        return (
          <g id="hair-afro">
            <circle cx="120" cy="85" r="74" fill={hairColorHex} />
            <circle cx="65" cy="90" r="40" fill={hairColorHex} />
            <circle cx="175" cy="90" r="40" fill={hairColorHex} />
            <circle cx="120" cy="35" r="40" fill={hairColorHex} />
          </g>
        );
      case 'braids':
        return (
          <g id="hair-braids">
            <path d="M 60 95 Q 120 30 180 95 L 180 70 Q 120 25 60 70 Z" fill={hairColorHex} />
            <path d="M 60 85 L 52 180 Q 64 186 68 174 L 74 85 Z" fill={hairColorHex} />
            <path d="M 48 90 L 40 170 Q 50 175 54 162 L 60 90 Z" fill={hairColorHex} />
            <path d="M 180 85 L 188 180 Q 176 186 172 174 L 166 85 Z" fill={hairColorHex} />
            <path d="M 192 90 L 200 170 Q 190 175 186 162 L 180 90 Z" fill={hairColorHex} />
          </g>
        );
      case 'curly-crop':
        return (
          <g id="hair-curly-crop">
            <path d="M 60 95 C 55 45, 185 45, 180 95 C 160 80, 140 85, 120 82 C 100 85, 80 80, 60 95 Z" fill={hairColorHex} />
            <circle cx="78" cy="58" r="18" fill={hairColorHex} />
            <circle cx="108" cy="50" r="20" fill={hairColorHex} />
            <circle cx="138" cy="50" r="20" fill={hairColorHex} />
            <circle cx="162" cy="58" r="18" fill={hairColorHex} />
          </g>
        );
      case 'bob':
        return (
          <g id="hair-bob">
            <path d="M 54 115 C 48 35, 192 35, 186 115 L 190 145 C 174 150, 170 132, 174 108 C 162 84, 78 84, 66 108 C 70 132, 66 150, 50 145 Z" fill={hairColorHex} />
            <path d="M 72 78 Q 120 94 168 78 L 168 66 Q 120 60 72 66 Z" fill={hairColorHex} />
          </g>
        );
      case 'wavy-locks':
        return (
          <g id="hair-wavy-locks">
            <path d="M 60 85 C 48 35, 192 35, 180 85 C 204 135, 168 195, 186 215 C 162 190, 174 148, 166 110 C 144 86, 96 86, 74 110 C 66 148, 78 190, 54 215 C 72 195, 36 135, 60 85 Z" fill={hairColorHex} />
          </g>
        );
      case 'natural-waves':
        return (
          <g id="hair-natural-waves">
            <path d="M 58 100 C 54 40, 186 40, 182 100 C 192 135, 168 160, 178 168 C 162 155, 168 120, 162 102 C 138 78, 102 78, 78 102 C 72 120, 78 155, 62 168 C 72 160, 48 135, 58 100 Z" fill={hairColorHex} />
          </g>
        );
      case 'buzz-cut':
        return (
          <g id="hair-buzz-cut">
            <path d="M 62 90 C 60 50, 180 50, 178 90 C 168 72, 144 65, 120 65 C 96 65, 72 72, 62 90 Z" fill={hairColorHex} />
          </g>
        );
      case 'short-crop':
      default:
        return (
          <g id="hair-short-crop">
            <path d="M 58 90 C 54 42, 186 42, 182 90 C 162 72, 138 74, 120 74 C 102 74, 78 72, 58 90 Z" fill={hairColorHex} />
            <rect x="59" y="84" width="8" height="22" rx="4" fill={hairColorHex} />
            <rect x="173" y="84" width="8" height="22" rx="4" fill={hairColorHex} />
          </g>
        );
    }
  };

  // Render accessories
  const renderAccessories = () => {
    switch (config.accessory) {
      case 'studio-headphones':
        return (
          <g id="acc-headphones">
            <path d="M 50 102 A 74 74 0 0 1 190 102" stroke="#1e293b" strokeWidth="10" fill="none" strokeLinecap="round" />
            <path d="M 62 96 A 62 62 0 0 1 178 96" stroke="#f59e0b" strokeWidth="3.5" fill="none" />
            <rect x="40" y="90" width="16" height="38" rx="8" fill="#0f172a" stroke="#f59e0b" strokeWidth="2.5" />
            <rect x="184" y="90" width="16" height="38" rx="8" fill="#0f172a" stroke="#f59e0b" strokeWidth="2.5" />
          </g>
        );
      case 'reading-glasses':
        return (
          <g id="acc-glasses">
            <circle cx="94" cy="102" r="17" stroke="#78350f" strokeWidth="3.5" fill="none" />
            <circle cx="146" cy="102" r="17" stroke="#78350f" strokeWidth="3.5" fill="none" />
            <line x1="111" y1="102" x2="129" y2="102" stroke="#78350f" strokeWidth="3.5" />
            <line x1="77" y1="100" x2="60" y2="95" stroke="#78350f" strokeWidth="3" />
            <line x1="163" y1="100" x2="180" y2="95" stroke="#78350f" strokeWidth="3" />
          </g>
        );
      case 'aviator-sunglasses':
        return (
          <g id="acc-aviators">
            <path d="M 77 95 Q 94 90 111 95 L 109 112 Q 94 122 79 112 Z" fill="#0f172a" opacity="0.92" stroke="#fbbf24" strokeWidth="3" />
            <path d="M 129 95 Q 146 90 163 95 L 161 112 Q 146 122 131 112 Z" fill="#0f172a" opacity="0.92" stroke="#fbbf24" strokeWidth="3" />
            <line x1="78" y1="93" x2="162" y2="93" stroke="#fbbf24" strokeWidth="3" />
          </g>
        );
      case 'winter-beanie':
        return (
          <g id="acc-beanie">
            <path d="M 54 82 C 54 18, 186 18, 186 82 Z" fill="#eab308" />
            <rect x="50" y="72" width="140" height="18" rx="6" fill="#ca8a04" />
            <circle cx="120" cy="22" r="13" fill="#fef08a" />
          </g>
        );
      case 'woven-scarf':
        return (
          <g id="acc-scarf">
            <path d="M 72 150 Q 120 178 168 150 Q 120 138 72 150 Z" fill="#b91c1c" stroke="#fef08a" strokeWidth="2.5" />
            <polygon points="132,162 156,162 163,222 127,222" fill="#b91c1c" stroke="#fef08a" strokeWidth="2" />
            <line x1="127" y1="222" x2="163" y2="222" stroke="#fef08a" strokeWidth="3.5" strokeDasharray="4,2" />
          </g>
        );
      case 'champion-star':
        return (
          <g id="acc-champion-star">
            <polygon points="78,180 82,190 92,190 84,196 87,206 78,200 69,206 72,196 64,190 74,190" fill="#eab308" stroke="#a16207" strokeWidth="2" />
            <circle cx="78" cy="195" r="3.5" fill="#fef08a" />
          </g>
        );
      case 'none':
      default:
        return null;
    }
  };

  // Face shape with presentation variations
  const renderFace = () => {
    if (presentation === 'female') {
      return (
        /* Soft, gentle feminine jawline */
        <path
          d="M 68 100 C 68 55, 172 55, 172 100 C 172 135, 150 158, 120 162 C 90 158, 68 135, 68 100 Z"
          fill={skinColor}
        />
      );
    } else if (presentation === 'male') {
      return (
        /* Slightly more structured masculine jawline */
        <path
          d="M 66 98 C 66 52, 174 52, 174 98 C 174 135, 155 162, 120 165 C 85 162, 66 135, 66 98 Z"
          fill={skinColor}
        />
      );
    } else {
      /* Balanced, harmonious gender-neutral contour */
      return (
        <path
          d="M 68 100 C 68 54, 172 54, 172 100 C 172 135, 152 160, 120 164 C 88 160, 68 135, 68 100 Z"
          fill={skinColor}
        />
      );
    }
  };

  return (
    <div className={`inline-flex flex-col items-center gap-2 ${className}`}>
      <div
        className="relative rounded-3xl p-2 bg-linear-to-b from-blue-100 via-indigo-50 to-indigo-100 border-4 border-blue-400 shadow-md flex items-center justify-center shrink-0 overflow-hidden"
        style={{ width: sizePixels, height: sizePixels }}
      >
        <svg
          viewBox="0 0 240 240"
          width="100%"
          height="100%"
          role="img"
          aria-label={description}
          className="overflow-hidden"
        >
          {/* Background circle badge */}
          <circle cx="120" cy="120" r="114" fill="#e0e7ff" />
          <circle cx="120" cy="120" r="105" fill="#f8fafc" opacity="0.6" />

          {/* Neck */}
          <rect x="106" y="125" width="28" height="36" rx="5" fill={skinColor} />

          {/* Clothing / Torso */}
          {renderClothing()}

          {/* Ears */}
          <circle cx="60" cy="108" r="13" fill={skinColor} />
          <circle cx="180" cy="108" r="13" fill={skinColor} />
          <circle cx="60" cy="108" r="7" fill="#f43f5e" opacity="0.15" />
          <circle cx="180" cy="108" r="7" fill="#f43f5e" opacity="0.15" />

          {/* Face Base */}
          {renderFace()}

          {/* Warm Friendly Blush */}
          <circle cx="82" cy="118" r="8" fill="#f43f5e" opacity="0.25" />
          <circle cx="158" cy="118" r="8" fill="#f43f5e" opacity="0.25" />

          {/* Eyebrows */}
          <path d="M 82 88 Q 94 83 106 88" stroke={hairColorHex} strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <path d="M 134 88 Q 146 83 158 88" stroke={hairColorHex} strokeWidth="3.5" strokeLinecap="round" fill="none" />

          {/* Expressive Eyes */}
          {renderEyes()}

          {/* Cute Nose */}
          <path d="M 120 105 Q 116 116 124 116" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" fill="none" />

          {/* Warm, Friendly Smiling Lips */}
          <path d="M 106 128 Q 120 144 134 128" stroke="#991b1b" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <path d="M 112 133 Q 120 138 128 133" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" fill="none" />

          {/* Hairstyle */}
          {renderHair()}

          {/* Accessories */}
          {renderAccessories()}
        </svg>
      </div>

      {showDescriptionButton && (
        <button
          type="button"
          onClick={handleSpeakDescription}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-black shadow-sm focus:ring-4 focus:ring-blue-300 transition-transform active:scale-95"
          aria-label={`Listen to spoken description of avatar ${config.characterName}`}
        >
          <Volume2 className="w-4 h-4 text-amber-300" />
          <span>Hear Appearance</span>
        </button>
      )}
    </div>
  );
};
