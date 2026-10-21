import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Coins, 
  ShoppingBag, 
  Palette, 
  Check, 
  Volume2, 
  Save, 
  Lock, 
  Info, 
  ArrowLeft,
  Shirt,
  Smile,
  Scissors,
  Glasses,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { User } from '../types';
import { AvatarConfig, ShopItem, StudentAvatarProfile, ShopCategory } from '../types/avatar';
import { 
  avatarService, 
  SKIN_TONES, 
  HAIR_COLORS, 
  EYE_COLORS, 
  SHOP_CATALOG, 
  STARTER_AVATAR,
  PRESENTATIONS,
  describeAvatar,
  getShopItem
} from '../services/avatarService';
import { AvatarGraphic } from '../components/AvatarGraphic';
import { speechService } from '../services/speechService';
import { soundEffects } from '../services/soundEffects';

interface AvatarViewProps {
  currentUser: User;
  onBack: () => void;
  onAvatarUpdated?: () => void;
}

export const AvatarView: React.FC<AvatarViewProps> = ({
  currentUser,
  onBack,
  onAvatarUpdated,
}) => {
  const [profile, setProfile] = useState<StudentAvatarProfile | null>(null);
  const [draftConfig, setDraftConfig] = useState<AvatarConfig>(STARTER_AVATAR);
  const [activeTab, setActiveTab] = useState<'customize' | 'shop' | 'wardrobe' | 'earn'>('customize');
  const [shopCategoryFilter, setShopCategoryFilter] = useState<'all' | ShopCategory>('all');
  const [isSaving, setIsSaving] = useState(false);
  const [statusAnnouncement, setStatusAnnouncement] = useState<string>('');

  useEffect(() => {
    loadProfile();
  }, [currentUser.id]);

  const loadProfile = async () => {
    const p = await avatarService.getProfile(currentUser.id);
    setProfile(p);
    setDraftConfig({ ...p.avatarConfig });
  };

  const handleTabChange = (tab: 'customize' | 'shop' | 'wardrobe' | 'earn', label: string) => {
    soundEffects.playClick();
    setActiveTab(tab);
    speechService.announce(`Switched to ${label}`);
  };

  const handleSaveAvatar = async () => {
    if (!profile) return;
    setIsSaving(true);
    soundEffects.playClick();
    try {
      const updated = await avatarService.saveAvatarConfig(currentUser.id, draftConfig);
      setProfile(updated);
      const msg = `Avatar "${draftConfig.characterName}" saved successfully!`;
      setStatusAnnouncement(msg);
      if (onAvatarUpdated) onAvatarUpdated();
    } catch {
      setStatusAnnouncement('Failed to save avatar. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePurchase = async (item: ShopItem) => {
    if (!profile) return;
    soundEffects.playClick();
    const res = await avatarService.purchaseItem(currentUser.id, item.id);
    setStatusAnnouncement(res.message);
    if (res.success) {
      setProfile({ ...res.profile });
      // If purchased item fits an equip slot, prompt or auto-equip
      if (item.category === 'hairStyle') {
        setDraftConfig((prev) => ({ ...prev, hairStyle: item.id }));
      } else if (item.category === 'eyeColor') {
        const colorKey = item.id.replace('eye-color-', '');
        setDraftConfig((prev) => ({ ...prev, eyeColor: colorKey }));
      } else if (item.category === 'eyeStyle') {
        const styleKey = item.id.replace('eye-style-', '');
        setDraftConfig((prev) => ({ ...prev, eyeStyle: styleKey }));
      } else if (item.category === 'clothing') {
        setDraftConfig((prev) => ({ ...prev, clothing: item.id }));
      } else if (item.category === 'accessory') {
        setDraftConfig((prev) => ({ ...prev, accessory: item.id }));
      }
      if (onAvatarUpdated) onAvatarUpdated();
    }
  };

  const handleEquipOwnedItem = (item: ShopItem) => {
    soundEffects.playClick();
    if (item.category === 'hairStyle') {
      setDraftConfig((prev) => ({ ...prev, hairStyle: item.id }));
    } else if (item.category === 'eyeColor') {
      const colorKey = item.id.replace('eye-color-', '');
      setDraftConfig((prev) => ({ ...prev, eyeColor: colorKey }));
    } else if (item.category === 'eyeStyle') {
      const styleKey = item.id.replace('eye-style-', '');
      setDraftConfig((prev) => ({ ...prev, eyeStyle: styleKey }));
    } else if (item.category === 'clothing') {
      setDraftConfig((prev) => ({ ...prev, clothing: item.id }));
    } else if (item.category === 'accessory') {
      setDraftConfig((prev) => ({ ...prev, accessory: item.id }));
    }
    const msg = `Equipped ${item.name}. Click "Save Changes" to keep.`;
    setStatusAnnouncement(msg);
    speechService.announce(msg);
  };

  const handleListenOverview = () => {
    soundEffects.playClick();
    if (!profile) return;
    const balance = profile.coinsBalance;
    const desc = describeAvatar(draftConfig);
    const text = `My Avatar page. You currently have ${balance} English Coins. Your character is named ${draftConfig.characterName}. ${desc} You can customize your look, buy items in the shop, or practice lessons to earn more coins.`;
    speechService.speak(text, true);
  };

  const filteredShopItems = SHOP_CATALOG.filter((item) => {
    if (shopCategoryFilter === 'all') return true;
    return item.category === shopCategoryFilter;
  });

  const ownedItems = profile
    ? SHOP_CATALOG.filter((item) => profile.ownedItemIds.includes(item.id))
    : [];

  const coinHistory = profile ? avatarService.getTransactionHistory(currentUser.id) : [];

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in pb-12">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 bg-white rounded-3xl border-2 border-slate-200 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundEffects.playClick();
                onBack();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-300 focus:ring-4 focus:ring-blue-300"
              aria-label="Back to previous page"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
              Limitless Gamification
            </span>
          </div>

          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Palette className="w-8 h-8 text-blue-700" />
            <span>My Avatar & English Coins</span>
          </h1>
          <p className="text-sm text-slate-600">
            Create your friendly cartoon speaking partner, earn coins by practicing, and collect new styles.
          </p>
        </div>

        {/* Coin Balance Badge & Listen Overview Button */}
        <div className="flex flex-wrap items-center gap-3">
          <div 
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 shadow-sm"
            role="status"
            aria-label={`Current balance: ${profile?.coinsBalance || 0} English Coins`}
          >
            <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center font-black text-amber-950 shadow-xs">
              <Coins className="w-5 h-5 text-amber-950" />
            </div>
            <div>
              <span className="block text-xs font-bold uppercase tracking-wider text-amber-800">English Coins</span>
              <span className="text-xl font-black text-amber-950">{profile?.coinsBalance || 0} Coins</span>
            </div>
          </div>

          <button
            onClick={handleListenOverview}
            className="px-4 py-2.5 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm flex items-center gap-2 shadow-sm focus:ring-4 focus:ring-blue-300"
            aria-label="Listen to avatar and coin balance overview aloud"
          >
            <Volume2 className="w-5 h-5 text-amber-300" />
            <span>Read Page Aloud</span>
          </button>
        </div>
      </div>

      {/* Screen Reader ARIA Live Region */}
      <div className="sr-only" role="status" aria-live="polite">
        {statusAnnouncement}
      </div>

      {/* Storage & Persistence Transparency Banner */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-blue-900">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-700 shrink-0" />
          <span>
            <strong>Storage & Balance Status:</strong> Your character customizer and English Coins balance are live and active in this browser. To sync across other devices, run the avatar tables script in your Supabase SQL Editor.
          </span>
        </div>
        <span className="shrink-0 px-2.5 py-1 rounded-full font-bold bg-white text-blue-800 border border-blue-300">
          Virtual Rewards (No Real Money)
        </span>
      </div>

      {/* Main Grid: Avatar Preview Left, Tabs Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Avatar Preview Card */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-md space-y-6 sticky top-24">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Live Avatar Preview
            </span>

            <div className="flex justify-center py-2">
              <AvatarGraphic
                config={draftConfig}
                size="xl"
                showDescriptionButton={true}
              />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-black text-slate-900">
                {draftConfig.characterName || 'My Character'}
              </h2>
              <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 text-left leading-relaxed">
                <strong className="text-slate-800">Spoken Description:</strong><br />
                {describeAvatar(draftConfig)}
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 space-y-3">
            <button
              onClick={handleSaveAvatar}
              disabled={isSaving}
              className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base flex items-center justify-center gap-2 shadow-md hover:shadow-lg focus:ring-4 focus:ring-emerald-300 disabled:opacity-50 transition-all active:scale-95"
              aria-label={`Save changes to avatar ${draftConfig.characterName}`}
            >
              <Save className="w-5 h-5" />
              <span>{isSaving ? 'Saving...' : 'Save Avatar Changes'}</span>
            </button>

            <p className="text-xs text-center text-slate-500">
              Your avatar appears in your student header and dashboard!
            </p>
          </div>
        </div>

        {/* Right Column: Interactive Navigation & Panels */}
        <div className="lg:col-span-8 space-y-6">
          {/* Navigation Tabs */}
          <nav 
            className="flex flex-wrap gap-2 p-2 bg-slate-200/80 rounded-2xl border border-slate-300"
            role="tablist"
            aria-label="Avatar Sections"
          >
            <button
              role="tab"
              aria-selected={activeTab === 'customize'}
              onClick={() => handleTabChange('customize', 'Customize Avatar')}
              className={`flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all border-2 ${
                activeTab === 'customize'
                  ? 'bg-blue-700 text-white border-blue-800 shadow-sm'
                  : 'bg-white text-slate-700 border-transparent hover:bg-slate-100'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>Customize</span>
            </button>

            <button
              role="tab"
              aria-selected={activeTab === 'shop'}
              onClick={() => handleTabChange('shop', 'Avatar Shop')}
              className={`flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all border-2 ${
                activeTab === 'shop'
                  ? 'bg-blue-700 text-white border-blue-800 shadow-sm'
                  : 'bg-white text-slate-700 border-transparent hover:bg-slate-100'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Avatar Shop</span>
            </button>

            <button
              role="tab"
              aria-selected={activeTab === 'wardrobe'}
              onClick={() => handleTabChange('wardrobe', 'Owned Wardrobe')}
              className={`flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all border-2 ${
                activeTab === 'wardrobe'
                  ? 'bg-blue-700 text-white border-blue-800 shadow-sm'
                  : 'bg-white text-slate-700 border-transparent hover:bg-slate-100'
              }`}
            >
              <Shirt className="w-4 h-4" />
              <span>Owned Items ({ownedItems.length})</span>
            </button>

            <button
              role="tab"
              aria-selected={activeTab === 'earn'}
              onClick={() => handleTabChange('earn', 'How to Earn Coins')}
              className={`flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all border-2 ${
                activeTab === 'earn'
                  ? 'bg-blue-700 text-white border-blue-800 shadow-sm'
                  : 'bg-white text-slate-700 border-transparent hover:bg-slate-100'
              }`}
            >
              <Coins className="w-4 h-4 text-amber-500" />
              <span>Earn Coins</span>
            </button>
          </nav>

          {/* TAB 1: CUSTOMIZE AVATAR */}
          {activeTab === 'customize' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-slate-200 shadow-sm space-y-8 animate-in fade-in">
              <div className="border-b border-slate-200 pb-4">
                <h2 className="text-xl font-black text-slate-900">Customize Your Appearance</h2>
                <p className="text-sm text-slate-600">
                  Select your character name, skin tone, hair, eyes, and owned clothing. All options feature full text labels for screen readers.
                </p>
              </div>

              {/* 1. Character Name */}
              <div className="space-y-2">
                <label htmlFor="character-name-input" className="block text-sm font-black text-slate-900">
                  1. Character Name
                </label>
                <div className="max-w-md">
                  <input
                    id="character-name-input"
                    type="text"
                    value={draftConfig.characterName}
                    onChange={(e) => setDraftConfig({ ...draftConfig, characterName: e.target.value })}
                    placeholder="Enter character name (e.g., Alex, Sam, Taylor)"
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 text-slate-900 font-bold focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none"
                    aria-describedby="char-name-hint"
                  />
                  <p id="char-name-hint" className="text-xs text-slate-500 mt-1">
                    Choose a friendly name for your cartoon speaking persona.
                  </p>
                </div>
              </div>

              {/* 2. Avatar Presentation Style (Female, Male, Gender-Neutral) */}
              <div className="space-y-3">
                <span className="block text-sm font-black text-slate-900">
                  2. Avatar Presentation (3 inclusive options)
                </span>
                <p className="text-xs text-slate-600">
                  Choose how your cartoon character is styled. You can choose ANY hairstyles, clothes, accessories, or eye styles with any presentation!
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" role="radiogroup" aria-label="Avatar presentation options">
                  {PRESENTATIONS.map((pres) => {
                    const isSelected = (draftConfig.presentation || 'neutral') === pres.id;
                    return (
                      <button
                        key={pres.id}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => {
                          soundEffects.playClick();
                          setDraftConfig({ ...draftConfig, presentation: pres.id });
                          speechService.announce(`Selected ${pres.name}. ${pres.text}`);
                        }}
                        className={`p-3.5 rounded-2xl border-2 text-left flex flex-col justify-between gap-2 transition-all focus:ring-4 focus:ring-blue-300 ${
                          isSelected
                            ? 'border-blue-700 bg-blue-50/80 shadow-sm ring-2 ring-blue-500'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                        aria-label={`${pres.name}: ${pres.text}. ${isSelected ? 'Currently selected' : 'Press to select'}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-black text-slate-900">{pres.name}</span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-700" />}
                        </div>
                        <span className="text-xs text-slate-600 leading-snug">{pres.text}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Skin Tone Selection */}
              <div className="space-y-3">
                <span className="block text-sm font-black text-slate-900">
                  3. Skin Tone (6 inclusive options)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {SKIN_TONES.map((tone) => {
                    const isSelected = draftConfig.skinTone === tone.id;
                    return (
                      <button
                        key={tone.id}
                        type="button"
                        onClick={() => {
                          soundEffects.playClick();
                          setDraftConfig({ ...draftConfig, skinTone: tone.id });
                          speechService.announce(`Selected skin tone: ${tone.name}. ${tone.text}`);
                        }}
                        className={`p-3 rounded-2xl border-2 text-left flex items-center gap-3 transition-all focus:ring-4 focus:ring-blue-300 ${
                          isSelected
                            ? 'border-blue-700 bg-blue-50/70 shadow-sm'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                        aria-pressed={isSelected}
                        aria-label={`${tone.name}: ${tone.text}. ${isSelected ? 'Currently selected' : 'Press to select'}`}
                      >
                        <div
                          className="w-8 h-8 rounded-full border-2 border-slate-400 shrink-0 shadow-xs"
                          style={{ backgroundColor: tone.color }}
                        />
                        <div className="flex-1 min-w-0">
                          <span className="block text-xs font-bold text-slate-900 truncate">
                            {tone.name}
                          </span>
                          <span className="block text-[11px] text-slate-500 truncate">
                            {isSelected ? '✓ Selected' : 'Choose'}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Hair Styles & Colors */}
              <div className="space-y-4">
                <span className="block text-sm font-black text-slate-900">
                  3. Hairstyle & Hair Color
                </span>

                {/* Hair Color Options */}
                <div className="space-y-2">
                  <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Select Hair Color:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {HAIR_COLORS.map((hc) => {
                      const isSelected = draftConfig.hairColor === hc.id;
                      return (
                        <button
                          key={hc.id}
                          type="button"
                          onClick={() => {
                            soundEffects.playClick();
                            setDraftConfig({ ...draftConfig, hairColor: hc.id });
                            speechService.announce(`Selected hair color: ${hc.name}`);
                          }}
                          className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border-2 text-xs font-bold transition-all ${
                            isSelected
                              ? 'border-blue-700 bg-blue-50 text-blue-950 shadow-xs'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                          }`}
                          aria-pressed={isSelected}
                          aria-label={`${hc.name}. ${isSelected ? 'Selected' : 'Press to choose'}`}
                        >
                          <span
                            className="w-4 h-4 rounded-full border border-slate-400 inline-block"
                            style={{ backgroundColor: hc.color }}
                          />
                          <span>{hc.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Hairstyle Selection (Filtered to owned styles) */}
                <div className="space-y-2 pt-2">
                  <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Select Hairstyle (From your owned styles):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {SHOP_CATALOG.filter((i) => i.category === 'hairStyle').map((item) => {
                      const isOwned = profile?.ownedItemIds.includes(item.id) || item.isStarter;
                      const isEquipped = draftConfig.hairStyle === item.id;
                      return (
                        <div
                          key={item.id}
                          className={`p-3.5 rounded-2xl border-2 transition-all flex items-start justify-between gap-3 ${
                            isEquipped
                              ? 'border-blue-700 bg-blue-50/70 shadow-sm'
                              : isOwned
                              ? 'border-slate-200 bg-white hover:border-slate-300'
                              : 'border-dashed border-slate-300 bg-slate-50 opacity-75'
                          }`}
                        >
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-slate-900">{item.name}</span>
                              {isEquipped && (
                                <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-black">
                                  Equipped
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-600">{item.description}</p>
                          </div>

                          <div className="shrink-0">
                            {isOwned ? (
                              <button
                                type="button"
                                onClick={() => {
                                  soundEffects.playClick();
                                  setDraftConfig({ ...draftConfig, hairStyle: item.id });
                                  speechService.announce(`Equipped hairstyle: ${item.name}`);
                                }}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                  isEquipped
                                    ? 'bg-blue-700 text-white'
                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                                }`}
                                aria-label={`Equip ${item.name}`}
                              >
                                {isEquipped ? '✓ Equipped' : 'Equip'}
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveTab('shop');
                                  setShopCategoryFilter('hairStyle');
                                  speechService.announce(`Opening shop for ${item.name}`);
                                }}
                                className="px-2.5 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold flex items-center gap-1"
                                aria-label={`${item.name} is locked in shop for ${item.price} coins. Click to visit shop.`}
                              >
                                <Lock className="w-3.5 h-3.5 text-amber-700" />
                                <span>{item.price} Coins</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 4. Eyes: Shape & Color */}
              <div className="space-y-4">
                <span className="block text-sm font-black text-slate-900">
                  4. Eye Shape & Eye Color
                </span>

                {/* Eye Color */}
                <div className="space-y-2">
                  <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Select Eye Color:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {EYE_COLORS.map((ec) => {
                      const isSelected = draftConfig.eyeColor === ec.id;
                      return (
                        <button
                          key={ec.id}
                          type="button"
                          onClick={() => {
                            soundEffects.playClick();
                            setDraftConfig({ ...draftConfig, eyeColor: ec.id });
                            speechService.announce(`Selected eye color: ${ec.name}. ${ec.text}`);
                          }}
                          className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border-2 text-xs font-bold transition-all ${
                            isSelected
                              ? 'border-blue-700 bg-blue-50 text-blue-950 shadow-xs'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                          }`}
                          aria-pressed={isSelected}
                          aria-label={`${ec.name}. ${isSelected ? 'Selected' : 'Press to choose'}`}
                        >
                          <span
                            className="w-4 h-4 rounded-full border border-slate-400 inline-block"
                            style={{ backgroundColor: ec.color }}
                          />
                          <span>{ec.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Eye Style */}
                <div className="space-y-2 pt-2">
                  <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Select Eye Style:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { id: 'gentle', name: 'Gentle Smiling Eyes', desc: 'Approachable curved smiling eyes' },
                      { id: 'round', name: 'Attentive Round Eyes', desc: 'Clear and wide open round eyes' },
                      { id: 'almond', name: 'Expressive Almond Eyes', desc: 'Elongated almond shaped eyes' },
                      { id: 'sparkle', name: 'Cheerful Sparkle Eyes', desc: 'Enthusiastic eyes with double catchlights' },
                    ].map((style) => {
                      const isEquipped = draftConfig.eyeStyle === style.id;
                      return (
                        <button
                          key={style.id}
                          type="button"
                          onClick={() => {
                            soundEffects.playClick();
                            setDraftConfig({ ...draftConfig, eyeStyle: style.id });
                            speechService.announce(`Selected eye style: ${style.name}. ${style.desc}`);
                          }}
                          className={`p-3 rounded-2xl border-2 text-left transition-all ${
                            isEquipped
                              ? 'border-blue-700 bg-blue-50 shadow-sm'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                          aria-pressed={isEquipped}
                          aria-label={`${style.name}: ${style.desc}. ${isEquipped ? 'Currently equipped' : 'Click to select'}`}
                        >
                          <span className="block text-sm font-bold text-slate-900">{style.name}</span>
                          <span className="block text-xs text-slate-500 mt-0.5">{style.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 5. Clothing & Outfits */}
              <div className="space-y-3">
                <span className="block text-sm font-black text-slate-900">
                  5. Clothing & Outfits
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SHOP_CATALOG.filter((i) => i.category === 'clothing').map((item) => {
                    const isOwned = profile?.ownedItemIds.includes(item.id) || item.isStarter;
                    const isEquipped = draftConfig.clothing === item.id;
                    return (
                      <div
                        key={item.id}
                        className={`p-3.5 rounded-2xl border-2 flex items-start justify-between gap-3 ${
                          isEquipped
                            ? 'border-blue-700 bg-blue-50 shadow-sm'
                            : isOwned
                            ? 'border-slate-200 bg-white hover:border-slate-300'
                            : 'border-dashed border-slate-300 bg-slate-50 opacity-75'
                        }`}
                      >
                        <div className="space-y-1 flex-1">
                          <span className="font-bold text-sm text-slate-900 block">{item.name}</span>
                          <p className="text-xs text-slate-600">{item.description}</p>
                        </div>

                        <div className="shrink-0">
                          {isOwned ? (
                            <button
                              type="button"
                              onClick={() => {
                                soundEffects.playClick();
                                setDraftConfig({ ...draftConfig, clothing: item.id });
                                speechService.announce(`Equipped clothing: ${item.name}`);
                              }}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                isEquipped
                                  ? 'bg-blue-700 text-white'
                                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                              }`}
                              aria-label={`Equip ${item.name}`}
                            >
                              {isEquipped ? '✓ Equipped' : 'Equip'}
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setActiveTab('shop');
                                setShopCategoryFilter('clothing');
                                speechService.announce(`Opening shop for ${item.name}`);
                              }}
                              className="px-2.5 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold flex items-center gap-1"
                              aria-label={`${item.name} costs ${item.price} coins. Click to visit shop.`}
                            >
                              <Lock className="w-3.5 h-3.5 text-amber-700" />
                              <span>{item.price} Coins</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 6. Special Accessories */}
              <div className="space-y-3">
                <span className="block text-sm font-black text-slate-900">
                  6. Special Accessories (Glasses, Headphones, Star Pin)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SHOP_CATALOG.filter((i) => i.category === 'accessory').map((item) => {
                    const isOwned = profile?.ownedItemIds.includes(item.id) || item.isStarter;
                    const isEquipped = draftConfig.accessory === item.id;
                    return (
                      <div
                        key={item.id}
                        className={`p-3.5 rounded-2xl border-2 flex items-start justify-between gap-3 ${
                          isEquipped
                            ? 'border-blue-700 bg-blue-50 shadow-sm'
                            : isOwned
                            ? 'border-slate-200 bg-white hover:border-slate-300'
                            : 'border-dashed border-slate-300 bg-slate-50 opacity-75'
                        }`}
                      >
                        <div className="space-y-1 flex-1">
                          <span className="font-bold text-sm text-slate-900 block">{item.name}</span>
                          <p className="text-xs text-slate-600">{item.description}</p>
                        </div>

                        <div className="shrink-0">
                          {isOwned ? (
                            <button
                              type="button"
                              onClick={() => {
                                soundEffects.playClick();
                                setDraftConfig({ ...draftConfig, accessory: item.id });
                                speechService.announce(`Equipped accessory: ${item.name}`);
                              }}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                isEquipped
                                  ? 'bg-blue-700 text-white'
                                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                              }`}
                              aria-label={`Equip accessory: ${item.name}`}
                            >
                              {isEquipped ? '✓ Equipped' : 'Equip'}
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setActiveTab('shop');
                                setShopCategoryFilter('accessory');
                                speechService.announce(`Opening shop for ${item.name}`);
                              }}
                              className="px-2.5 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold flex items-center gap-1"
                              aria-label={`${item.name} costs ${item.price} coins. Click to visit shop.`}
                            >
                              <Lock className="w-3.5 h-3.5 text-amber-700" />
                              <span>{item.price} Coins</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Action Button */}
              <div className="pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleSaveAvatar}
                  disabled={isSaving}
                  className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl focus:ring-4 focus:ring-emerald-300 disabled:opacity-50 transition-all active:scale-95"
                  aria-label="Save all avatar changes"
                >
                  <Save className="w-6 h-6" />
                  <span>{isSaving ? 'Saving Changes...' : 'Save Avatar Changes'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: AVATAR SHOP */}
          {activeTab === 'shop' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-slate-200 shadow-sm space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <ShoppingBag className="w-6 h-6 text-blue-700" />
                    <span>Avatar Shop</span>
                  </h2>
                  <p className="text-sm text-slate-600">
                    Spend your earned English Coins on new styles, outfits, and accessories.
                  </p>
                </div>

                <div className="px-4 py-2 rounded-xl bg-amber-100 text-amber-950 font-black text-sm flex items-center gap-2">
                  <Coins className="w-4 h-4 text-amber-700" />
                  <span>Your Balance: {profile?.coinsBalance || 0} Coins</span>
                </div>
              </div>

              {/* Shop Category Filter Chips */}
              <div className="flex flex-wrap gap-2" role="group" aria-label="Shop Category Filter">
                {[
                  { id: 'all', label: 'All Items' },
                  { id: 'hairStyle', label: 'Hairstyles (30)' },
                  { id: 'eyeStyle', label: 'Eyes & Colors (20)' },
                  { id: 'clothing', label: 'Shirts & Outfits (40-80)' },
                  { id: 'accessory', label: 'Accessories (50)' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      soundEffects.playClick();
                      setShopCategoryFilter(cat.id as any);
                      speechService.announce(`Filtering shop by ${cat.label}`);
                    }}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors border ${
                      shopCategoryFilter === cat.id
                        ? 'bg-blue-700 text-white border-blue-800'
                        : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                    }`}
                    aria-pressed={shopCategoryFilter === cat.id}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredShopItems.map((item) => {
                  const isOwned = profile?.ownedItemIds.includes(item.id) || item.isStarter;
                  const canAfford = (profile?.coinsBalance || 0) >= item.price;
                  return (
                    <div
                      key={item.id}
                      className={`p-5 rounded-2xl border-2 flex flex-col justify-between gap-4 transition-all ${
                        isOwned
                          ? 'border-emerald-300 bg-emerald-50/40'
                          : canAfford
                          ? 'border-slate-200 bg-white hover:border-blue-400 hover:shadow-sm'
                          : 'border-slate-200 bg-slate-50'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-black text-base text-slate-900">{item.name}</h3>
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-black ${
                              item.price === 0
                                ? 'bg-slate-200 text-slate-800'
                                : 'bg-amber-100 text-amber-900 border border-amber-300'
                            }`}
                          >
                            {item.price === 0 ? 'Free Starter' : `${item.price} Coins`}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between gap-3">
                        {isOwned ? (
                          <div className="flex items-center gap-1.5 text-xs font-black text-emerald-800">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Owned in Wardrobe</span>
                          </div>
                        ) : (
                          <div className="text-xs font-semibold text-slate-500">
                            {canAfford
                              ? 'You have enough coins!'
                              : `Need ${item.price - (profile?.coinsBalance || 0)} more coins`}
                          </div>
                        )}

                        <div>
                          {isOwned ? (
                            <button
                              type="button"
                              onClick={() => handleEquipOwnedItem(item)}
                              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs"
                              aria-label={`Equip owned item ${item.name}`}
                            >
                              Equip Item
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handlePurchase(item)}
                              disabled={!canAfford}
                              className={`px-4 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all ${
                                canAfford
                                  ? 'bg-amber-500 hover:bg-amber-400 text-amber-950 shadow-sm focus:ring-4 focus:ring-amber-200 active:scale-95'
                                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                              }`}
                              aria-label={`Buy ${item.name} for ${item.price} English Coins. ${
                                canAfford ? 'Available to purchase' : 'Insufficient coins'
                              }`}
                            >
                              <Coins className="w-3.5 h-3.5" />
                              <span>Buy ({item.price} Coins)</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <div>
                  <strong>No Real Money:</strong> English Coins are 100% free and earned by completing speaking activities. Students never need to pay real money.
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: OWNED WARDROBE */}
          {activeTab === 'wardrobe' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-slate-200 shadow-sm space-y-6 animate-in fade-in">
              <div className="border-b border-slate-200 pb-4">
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Shirt className="w-6 h-6 text-blue-700" />
                  <span>My Owned Wardrobe</span>
                </h2>
                <p className="text-sm text-slate-600">
                  Every item you purchase stays permanently in your collection. Click "Equip" to wear any item on your avatar.
                </p>
              </div>

              {ownedItems.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <p>No owned items yet. Visit the Avatar Shop to browse styles!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {ownedItems.map((item) => {
                    const isEquipped =
                      draftConfig.hairStyle === item.id ||
                      draftConfig.clothing === item.id ||
                      draftConfig.accessory === item.id ||
                      draftConfig.eyeStyle === item.id.replace('eye-style-', '') ||
                      draftConfig.eyeColor === item.id.replace('eye-color-', '');

                    return (
                      <div
                        key={item.id}
                        className={`p-4 rounded-2xl border-2 flex items-start justify-between gap-3 ${
                          isEquipped
                            ? 'border-blue-600 bg-blue-50/70 shadow-sm'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900">{item.name}</span>
                            {isEquipped && (
                              <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-black">
                                Wearing
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500">{item.description}</p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleEquipOwnedItem(item)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                            isEquipped
                              ? 'bg-blue-700 text-white'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                          }`}
                          aria-label={`Wear ${item.name}`}
                        >
                          {isEquipped ? '✓ Wearing' : 'Wear'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: HOW TO EARN COINS & TRANSACTION HISTORY */}
          {activeTab === 'earn' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-slate-200 shadow-sm space-y-6 animate-in fade-in">
              <div className="border-b border-slate-200 pb-4">
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Coins className="w-6 h-6 text-amber-500" />
                  <span>English Coins Reward Guide</span>
                </h2>
                <p className="text-sm text-slate-600">
                  Earn virtual English Coins simply by practicing spoken English lessons and speaking activities!
                </p>
              </div>

              {/* Reward Rules Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-slate-900 text-base">Complete a Lesson</span>
                    <span className="px-3 py-1 rounded-full bg-amber-400 text-amber-950 font-black text-sm shadow-xs">
                      +20 Coins
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Listen to and practice any lesson section across the 5 beginner topics.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-slate-900 text-base">Complete Speaking Activity</span>
                    <span className="px-3 py-1 rounded-full bg-emerald-500 text-white font-black text-sm shadow-xs">
                      +10 Coins
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Record your speaking answers or complete pair speaking exercises.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50 border-2 border-blue-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-slate-900 text-base">Complete Entire Topic</span>
                    <span className="px-3 py-1 rounded-full bg-blue-600 text-white font-black text-sm shadow-xs">
                      +50 Coins
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Finish all lessons and speaking activities in any single topic.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-purple-50 border-2 border-purple-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-slate-900 text-base">Master All 5 Topics</span>
                    <span className="px-3 py-1 rounded-full bg-purple-600 text-white font-black text-sm shadow-xs">
                      +100 Bonus Coins
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Special bonus for finishing all five topics: Greetings, Myself, Family, Food, Feelings!
                  </p>
                </div>
              </div>

              {/* Encouragement Notice */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                <p className="font-bold text-slate-900">Fair Learning Guarantee:</p>
                <p>
                  Coins are awarded once per qualifying activity to prevent accidental resets. You can repeat lessons as many times as you like without ever losing coins. You are never penalized for pronunciation differences or taking time to learn.
                </p>
              </div>

              {/* Transaction History */}
              <div className="space-y-3 pt-2">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                  Recent Coin Activity
                </h3>

                {coinHistory.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No coin transactions recorded yet. Go to "5 Topics" and practice a lesson to earn your first coins!</p>
                ) : (
                  <div className="space-y-2">
                    {coinHistory.slice(0, 8).map((tx) => (
                      <div
                        key={tx.id}
                        className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-bold text-slate-800">{tx.description}</span>
                          <span className="block text-slate-400 text-[10px]">
                            {new Date(tx.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <span
                          className={`font-black ${
                            tx.amount > 0 ? 'text-emerald-700' : 'text-rose-600'
                          }`}
                        >
                          {tx.amount > 0 ? `+${tx.amount}` : tx.amount} Coins
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
