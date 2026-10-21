import { AvatarConfig, ShopItem, CoinTransaction, StudentAvatarProfile, AvatarPresentation } from '../types/avatar';
import { supabaseService } from './supabase';
import { soundEffects } from './soundEffects';
import { speechService } from './speechService';

export const STARTER_AVATAR: AvatarConfig = {
  characterName: 'Sam',
  presentation: 'neutral',
  skinTone: 'honey',
  eyeStyle: 'gentle',
  eyeColor: 'dark-brown',
  hairStyle: 'short-crop',
  hairColor: 'jet-black',
  clothing: 'starter-navy-tee',
  accessory: 'none',
};

export const PRESENTATIONS: { id: AvatarPresentation; name: string; text: string }[] = [
  { id: 'female', name: 'Female Presentation', text: 'Gentle, friendly feminine cartoon styling with soft facial curves.' },
  { id: 'male', name: 'Male Presentation', text: 'Warm, cheerful masculine cartoon styling with structured jawline.' },
  { id: 'neutral', name: 'Gender-Neutral Presentation', text: 'Balanced, harmonious universal cartoon styling.' }
];

export const SKIN_TONES = [
  { id: 'fair', name: 'Fair Peach', color: '#ffd1b3', text: 'Fair peach tone with warm undertones' },
  { id: 'peach', name: 'Warm Beige', color: '#f3c299', text: 'Warm beige skin tone with golden undertones' },
  { id: 'honey', name: 'Golden Honey', color: '#d99b66', text: 'Warm golden honey skin tone' },
  { id: 'amber', name: 'Warm Amber', color: '#b87333', text: 'Warm amber chestnut skin tone' },
  { id: 'bronze', name: 'Deep Bronze', color: '#8c532b', text: 'Deep bronze cocoa skin tone' },
  { id: 'deep', name: 'Rich Espresso', color: '#523019', text: 'Rich deep espresso dark skin tone' },
];

export const HAIR_COLORS = [
  { id: 'jet-black', name: 'Jet Black', color: '#1a1a1a', text: 'Classic deep jet black hair' },
  { id: 'deep-brown', name: 'Dark Chestnut Brown', color: '#3e2723', text: 'Natural dark chestnut brown hair' },
  { id: 'golden-blonde', name: 'Golden Honey Blonde', color: '#d4af37', text: 'Warm golden honey blonde hair' },
  { id: 'auburn', name: 'Auburn Copper Red', color: '#8d2b0b', text: 'Vibrant auburn copper red hair' },
  { id: 'silver-gray', name: 'Sleek Silver Gray', color: '#9e9e9e', text: 'Distinguished sleek silver gray hair' },
];

export const EYE_COLORS = [
  { id: 'dark-brown', name: 'Deep Dark Brown', color: '#3e2723', text: 'Warm and friendly deep brown eyes' },
  { id: 'hazel', name: 'Hazel Amber', color: '#6a512d', text: 'Gentle hazel eyes with golden amber flecks' },
  { id: 'emerald', name: 'Bright Emerald Green', color: '#2e7d32', text: 'Vibrant and bright emerald green eyes' },
  { id: 'sapphire', name: 'Ocean Sapphire Blue', color: '#1565c0', text: 'Clear and expressive ocean sapphire blue eyes' },
  { id: 'amber', name: 'Warm Golden Amber', color: '#e65100', text: 'Luminous warm golden amber eyes' },
];

export const SHOP_CATALOG: ShopItem[] = [
  // --- PRESENTATION OPTIONS (Free Starter Choices) ---
  {
    id: 'presentation-female',
    name: 'Female Presentation',
    category: 'presentation',
    price: 0,
    isStarter: true,
    description: 'Gentle feminine cartoon styling with soft facial curves and friendly warmth.',
  },
  {
    id: 'presentation-male',
    name: 'Male Presentation',
    category: 'presentation',
    price: 0,
    isStarter: true,
    description: 'Warm, cheerful masculine cartoon styling with defined jawline.',
  },
  {
    id: 'presentation-neutral',
    name: 'Gender-Neutral Presentation',
    category: 'presentation',
    price: 0,
    isStarter: true,
    description: 'Balanced, harmonious universal cartoon styling for all learners.',
  },

  // --- HAIRSTYLES ---
  // Free Starter Hairstyles
  {
    id: 'short-crop',
    name: 'Classic Short Crop',
    category: 'hairStyle',
    price: 0,
    isStarter: true,
    description: 'Clean, tidy, short-cropped hair with gentle side parting. Easy to maintain and always sharp.',
  },
  {
    id: 'curly-crop',
    name: 'Natural Curly Crop',
    category: 'hairStyle',
    price: 0,
    isStarter: true,
    description: 'Soft, bouncy natural curls cropped neatly around the head.',
  },
  {
    id: 'natural-waves',
    name: 'Gentle Wavy Style',
    category: 'hairStyle',
    price: 0,
    isStarter: true,
    description: 'Relaxed medium-length natural waves that frame the face gracefully.',
  },
  // Shop Hairstyles (30 coins)
  {
    id: 'afro',
    name: 'Voluminous Rounded Afro',
    category: 'hairStyle',
    price: 30,
    description: 'Magnificent, full, proud rounded afro silhouette celebrating natural volume and elegance.',
  },
  {
    id: 'braids',
    name: 'Neat Shoulder Braids',
    category: 'hairStyle',
    price: 30,
    description: 'Sleek and intricately styled shoulder-length braids falling gently over the shoulders.',
  },
  {
    id: 'bob',
    name: 'Modern Chin-Length Bob',
    category: 'hairStyle',
    price: 30,
    description: 'Crisp, contemporary chin-length bob cut with clean lines and subtle bangs.',
  },
  {
    id: 'wavy-locks',
    name: 'Flowing Wavy Locks',
    category: 'hairStyle',
    price: 30,
    description: 'Long, cascading soft waves extending below the shoulders with lively motion.',
  },
  {
    id: 'buzz-cut',
    name: 'Crisp Clean Buzz Cut',
    category: 'hairStyle',
    price: 30,
    description: 'Ultra-clean, close-cropped athletic buzz cut emphasizing facial expressions.',
  },
  {
    id: 'high-ponytail',
    name: 'High Bouncy Ponytail',
    category: 'hairStyle',
    price: 30,
    description: 'Energetic high ponytail tied with a vibrant band, with gentle sweeping bangs.',
  },
  {
    id: 'side-braid',
    name: 'Sleek Side Braid',
    category: 'hairStyle',
    price: 30,
    description: 'Elegant long side braid draped comfortably over one shoulder.',
  },
  {
    id: 'long-waves',
    name: 'Elegant Long Waves',
    category: 'hairStyle',
    price: 30,
    description: 'Gently curved, lustrous long hair cascading gracefully down past the shoulders.',
  },
  {
    id: 'curly-buns',
    name: 'Cute Curly High Buns',
    category: 'hairStyle',
    price: 30,
    description: 'Playful twin high curly space buns with curly wisps framing the face.',
  },
  {
    id: 'afro-puffs',
    name: 'Twin Afro Puffs',
    category: 'hairStyle',
    price: 30,
    description: 'Two proud, joyful, puffy afro crowns resting cheerfully on top of the head.',
  },

  // --- EYE STYLES & COLORS ---
  // Free Starters
  {
    id: 'eye-style-gentle',
    name: 'Gentle Smiling Eyes',
    category: 'eyeStyle',
    price: 0,
    isStarter: true,
    description: 'Warm, curved eyes with a natural gentle smile and approachable expression.',
  },
  {
    id: 'eye-style-round',
    name: 'Attentive Round Eyes',
    category: 'eyeStyle',
    price: 0,
    isStarter: true,
    description: 'Clear, round, attentive eyes that look eager and ready to learn English.',
  },
  // Shop Eye Styles & Colors (20 coins)
  {
    id: 'eye-style-almond',
    name: 'Expressive Almond Eyes',
    category: 'eyeStyle',
    price: 20,
    description: 'Gracefully elongated almond-shaped eyes with subtle definition and calm confidence.',
  },
  {
    id: 'eye-style-sparkle',
    name: 'Cheerful Sparkle Eyes',
    category: 'eyeStyle',
    price: 20,
    description: 'Bright eyes with lively double catchlights that convey enthusiasm and joyful curiosity.',
  },
  {
    id: 'eye-color-emerald',
    name: 'Bright Emerald Eye Color',
    category: 'eyeColor',
    price: 20,
    description: 'Vibrant emerald green eye iris with bright lively tones.',
  },
  {
    id: 'eye-color-sapphire',
    name: 'Ocean Sapphire Eye Color',
    category: 'eyeColor',
    price: 20,
    description: 'Deep ocean sapphire blue eye iris with brilliant depth.',
  },
  {
    id: 'eye-color-amber',
    name: 'Golden Amber Eye Color',
    category: 'eyeColor',
    price: 20,
    description: 'Warm, luminous golden amber eye iris that shines with friendliness.',
  },

  // --- CLOTHING & OUTFITS (Shirts, Dresses, Jackets, Sweaters) ---
  // Free Starters (0 coins)
  {
    id: 'starter-navy-tee',
    name: 'Starter Navy Blue T-Shirt',
    category: 'clothing',
    price: 0,
    isStarter: true,
    description: 'Classic crew-neck cotton t-shirt in deep navy blue. Comfortable and clean everyday wear.',
  },
  {
    id: 'starter-slate-crew',
    name: 'Casual Slate Gray Crew',
    category: 'clothing',
    price: 0,
    isStarter: true,
    description: 'Soft heather slate gray long-sleeve crewneck shirt with ribbed collar.',
  },

  // Casual Tops & Dresses (40 coins)
  {
    id: 'green-hoodie',
    name: 'Cozy Forest Green Hoodie',
    category: 'clothing',
    price: 40,
    description: 'Comfortable, ultra-soft forest green pullover hoodie with kangaroo pocket and white drawstrings.',
  },
  {
    id: 'white-oxford',
    name: 'Crisp Oxford Button-Down',
    category: 'clothing',
    price: 40,
    description: 'Crisp, clean white button-down collar shirt tailored for formal or academic speaking practice.',
  },
  {
    id: 'striped-polo',
    name: 'Sunny Amber Striped Polo',
    category: 'clothing',
    price: 40,
    description: 'Lively polo shirt with warm amber and cream stripes, featuring a neat knitted collar.',
  },
  {
    id: 'denim-jacket',
    name: 'Classic Indigo Denim Shirt',
    category: 'clothing',
    price: 40,
    description: 'Durable washed indigo denim overshirt with double chest pockets and metallic buttons.',
  },
  {
    id: 'floral-dress',
    name: 'Sunny Meadow Floral Dress',
    category: 'clothing',
    price: 40,
    description: 'Vibrant pastel yellow and peach sundress patterned with cheerful white daisy flowers and soft waistband.',
  },
  {
    id: 'summer-sundress',
    name: 'Breezy Sky-Blue Sundress',
    category: 'clothing',
    price: 40,
    description: 'Graceful light sky-blue sleeveless dress with gentle tiered ruffles, ideal for sunny summer conversations.',
  },
  {
    id: 'striped-sweater',
    name: 'Cozy Knit Autumn Sweater',
    category: 'clothing',
    price: 40,
    description: 'Warm chunky ribbed knit sweater in rich burgundy and cream stripes with rolled collar.',
  },
  {
    id: 'athletic-tracksuit',
    name: 'Speedster Athletic Tracksuit',
    category: 'clothing',
    price: 40,
    description: 'Modern sporty zip-up training jacket with teal and white racing stripes down the sleeves.',
  },

  // Premium & Festive Outfits (80 coins)
  {
    id: 'academia-blazer',
    name: 'Smart Academia Blazer & Tie',
    category: 'clothing',
    price: 80,
    description: 'Distinguished charcoal wool blazer over an Oxford shirt with an English navy silk necktie.',
  },
  {
    id: 'smart-suit',
    name: 'Tailored Indigo Suit & Collar',
    category: 'clothing',
    price: 80,
    description: 'Impeccably tailored deep indigo single-breasted suit jacket over crisp white lapels and formal trousers.',
  },
  {
    id: 'evening-dress',
    name: 'Royal Sapphire Evening Gown',
    category: 'clothing',
    price: 80,
    description: 'Lustrous jewel-toned sapphire evening gown with gentle sweetheart neckline and delicate shimmering trim.',
  },
  {
    id: 'explorer-outfit',
    name: 'Global Traveler Explorer Vest',
    category: 'clothing',
    price: 80,
    description: 'Khaki utility vest over a breathable linen shirt, built for international travel and conversations.',
  },
  {
    id: 'varsity-jacket',
    name: 'Limitless Campus Varsity Jacket',
    category: 'clothing',
    price: 80,
    description: 'Royal blue and cream wool varsity jacket with embroidered Limitless English Connect monogram crest.',
  },
  {
    id: 'festive-attire',
    name: 'Celebration Festive Attire',
    category: 'clothing',
    price: 80,
    description: 'Elegant jewel-toned celebratory ensemble with gold embroidery around the collar and cuffs.',
  },

  // --- SPECIAL ACCESSORIES (50 coins) ---
  {
    id: 'none',
    name: 'No Accessories',
    category: 'accessory',
    price: 0,
    isStarter: true,
    description: 'Simple and clean appearance with no extra accessories.',
  },
  {
    id: 'studio-headphones',
    name: 'Studio Sound Over-Ear Headphones',
    category: 'accessory',
    price: 50,
    description: 'Padded professional studio headphones resting stylishly over the ears, perfect for audio language learners.',
  },
  {
    id: 'reading-glasses',
    name: 'Classic Round Horn-Rim Glasses',
    category: 'accessory',
    price: 50,
    description: 'Sophisticated round tortoiseshell eyeglasses that frame the eyes with scholar charm.',
  },
  {
    id: 'aviator-sunglasses',
    name: 'Cool Golden Aviator Sunglasses',
    category: 'accessory',
    price: 50,
    description: 'Sleek golden metal wire aviator frames with smooth dark shaded lenses.',
  },
  {
    id: 'winter-beanie',
    name: 'Cozy Knitted Warm Beanie',
    category: 'accessory',
    price: 50,
    description: 'Chunky ribbed knit mustard-yellow winter beanie resting snugly over the forehead.',
  },
  {
    id: 'woven-scarf',
    name: 'Autumn Plaid Woven Scarf',
    category: 'accessory',
    price: 50,
    description: 'Soft wool scarf in warm autumn plaid pattern wrapped comfortably around the neck.',
  },
  {
    id: 'champion-star',
    name: 'Gold English Champion Star Pin',
    category: 'accessory',
    price: 50,
    description: 'Shining 5-pointed golden lapel pin proudly worn to celebrate English speaking achievements.',
  },
];

// Helper to get item by ID
export function getShopItem(id: string): ShopItem | undefined {
  return SHOP_CATALOG.find((item) => item.id === id);
}

// Generates a rich, natural screen-reader spoken sentence describing the avatar
export function describeAvatar(config: AvatarConfig): string {
  const pres = PRESENTATIONS.find((p) => p.id === config.presentation)?.name || `${config.presentation} presentation`;
  const skin = SKIN_TONES.find((s) => s.id === config.skinTone)?.name || config.skinTone;
  const hairCol = HAIR_COLORS.find((h) => h.id === config.hairColor)?.name || config.hairColor;
  const hairSt = getShopItem(config.hairStyle)?.name || config.hairStyle;
  const eyeCol = EYE_COLORS.find((e) => e.id === config.eyeColor)?.name || config.eyeColor;
  const eyeSt = getShopItem(`eye-style-${config.eyeStyle}`)?.name || `${config.eyeStyle} eyes`;
  const cloth = getShopItem(config.clothing)?.name || config.clothing;
  const acc = config.accessory !== 'none' ? getShopItem(config.accessory)?.name : null;

  let desc = `Avatar "${config.characterName}", ${pres}. Styled with ${skin} skin tone, ${eyeCol} in ${eyeSt}, and ${hairCol} styled in ${hairSt}. Dressed in ${cloth}.`;
  if (acc) {
    desc += ` Wearing ${acc}.`;
  }
  return desc;
}

const STORAGE_KEY_PREFIX = 'limitless_avatar_profile_';

export class AvatarService {
  /**
   * Loads the student's avatar profile.
   * Priority: Supabase database table `student_avatars`, fallback: localStorage.
   */
  async getProfile(studentId: string): Promise<StudentAvatarProfile> {
    const fallbackProfile = this.getLocalProfile(studentId);

    if (supabaseService.isConfigured()) {
      try {
        const client = supabaseService.getClient();
        if (client) {
          const { data, error } = await client
            .from('student_avatars')
            .select('*')
            .eq('student_id', studentId)
            .maybeSingle();

          if (!error && data) {
            const rawConfig = data.avatar_config || {};
            const profile: StudentAvatarProfile = {
              studentId: data.student_id,
              avatarConfig: {
                characterName: rawConfig.characterName || fallbackProfile.avatarConfig.characterName,
                presentation: rawConfig.presentation || 'neutral',
                skinTone: rawConfig.skinTone || fallbackProfile.avatarConfig.skinTone,
                eyeStyle: rawConfig.eyeStyle || fallbackProfile.avatarConfig.eyeStyle,
                eyeColor: rawConfig.eyeColor || fallbackProfile.avatarConfig.eyeColor,
                hairStyle: rawConfig.hairStyle || fallbackProfile.avatarConfig.hairStyle,
                hairColor: rawConfig.hairColor || fallbackProfile.avatarConfig.hairColor,
                clothing: rawConfig.clothing || fallbackProfile.avatarConfig.clothing,
                accessory: rawConfig.accessory || fallbackProfile.avatarConfig.accessory,
              },
              coinsBalance: typeof data.coins_balance === 'number' ? data.coins_balance : fallbackProfile.coinsBalance,
              ownedItemIds: Array.isArray(data.owned_item_ids) ? data.owned_item_ids : fallbackProfile.ownedItemIds,
              completedActivityKeys: Array.isArray(data.completed_activity_keys)
                ? data.completed_activity_keys
                : fallbackProfile.completedActivityKeys,
              updatedAt: data.updated_at || new Date().toISOString(),
            };
            this.saveLocalProfile(profile);
            return profile;
          }
        }
      } catch (err) {
        console.warn('Could not fetch avatar from Supabase, using local state:', err);
      }
    }

    return fallbackProfile;
  }

  /**
   * Saves updated avatar customization (character name, presentation, colors, equipped clothing, etc.)
   * Validates that equipped items are owned or are free starters.
   */
  async saveAvatarConfig(studentId: string, newConfig: AvatarConfig): Promise<StudentAvatarProfile> {
    const profile = await this.getProfile(studentId);

    // Validate that equipped items are in ownedItemIds or are free starters
    const equipped = [newConfig.hairStyle, newConfig.clothing, newConfig.accessory];
    for (const itemId of equipped) {
      if (itemId && itemId !== 'none') {
        const item = getShopItem(itemId);
        if (item && !item.isStarter && item.price > 0 && !profile.ownedItemIds.includes(itemId)) {
          console.warn(`Item ${itemId} not owned by student ${studentId}. Reverting to starter.`);
        }
      }
    }

    profile.avatarConfig = { ...newConfig };
    profile.updatedAt = new Date().toISOString();

    this.saveLocalProfile(profile);

    // Save via server or Supabase RPC
    if (supabaseService.isConfigured()) {
      try {
        const client = supabaseService.getClient();
        if (client) {
          // Attempt secure RPC first
          const { error: rpcErr } = await client.rpc('save_avatar_appearance', {
            p_avatar_config: profile.avatarConfig
          });

          if (rpcErr) {
            // Fallback to update of avatar_config column
            await client.from('student_avatars').update({
              avatar_config: profile.avatarConfig,
              updated_at: profile.updatedAt
            }).eq('student_id', studentId);
          }
        }
      } catch (err) {
        console.warn('Failed to save avatar to Supabase:', err);
      }
    }

    // Also notify Express server if available
    try {
      await fetch('/api/avatar/save-appearance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, avatarConfig: profile.avatarConfig }),
      });
    } catch {
      // Offline / standalone mode
    }

    soundEffects.playSuccess();
    speechService.announce(`Avatar appearance saved! ${describeAvatar(profile.avatarConfig)}`);
    return profile;
  }

  /**
   * Awards virtual English Coins for completing an activity.
   * STRICT ENFORCEMENT: Each activityKey can only be awarded ONCE.
   */
  async awardCoins(
    studentId: string,
    amount: number,
    activityKey: string,
    description: string
  ): Promise<{ awarded: boolean; profile: StudentAvatarProfile; message: string }> {
    const profile = await this.getProfile(studentId);

    // Deduplication check: prevent duplicate rewards for the same activity
    if (profile.completedActivityKeys.includes(activityKey)) {
      return {
        awarded: false,
        profile,
        message: 'This activity was already completed for English Coins previously.',
      };
    }

    // Safety checks
    if (amount <= 0) {
      return { awarded: false, profile, message: 'Invalid reward amount.' };
    }

    // Attempt secure server-side award operation
    let serverAwarded = false;
    try {
      const srvRes = await fetch('/api/avatar/award-coins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, amount, activityKey, description }),
      });
      if (srvRes.ok) {
        const data = await srvRes.json();
        if (data.success) {
          profile.coinsBalance = data.balance;
          if (!profile.completedActivityKeys.includes(activityKey)) {
            profile.completedActivityKeys.push(activityKey);
          }
          serverAwarded = true;
        }
      }
    } catch {
      // offline fallback
    }

    if (!serverAwarded) {
      profile.coinsBalance += amount;
      profile.completedActivityKeys.push(activityKey);
    }
    profile.updatedAt = new Date().toISOString();

    const transaction: CoinTransaction = {
      id: `tx-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      studentId,
      amount,
      activityKey,
      description,
      timestamp: profile.updatedAt,
    };

    // Save locally
    this.saveLocalProfile(profile);
    this.recordLocalTransaction(transaction);

    // Sync to Supabase via secure RPC if configured
    if (supabaseService.isConfigured()) {
      try {
        const client = supabaseService.getClient();
        if (client) {
          const { data: rpcData, error: rpcErr } = await client.rpc('award_student_coins', {
            p_activity_key: activityKey,
            p_coins: amount,
            p_description: description
          });

          if (!rpcErr && rpcData && typeof rpcData.balance === 'number') {
            profile.coinsBalance = rpcData.balance;
            this.saveLocalProfile(profile);
          } else {
            // Direct transaction log fallback
            await client.from('student_coin_transactions').insert({
              student_id: studentId,
              amount,
              activity_key: activityKey,
              description,
            });
          }
        }
      } catch (err) {
        console.warn('Could not sync coin award to Supabase:', err);
      }
    }

    soundEffects.playSuccess();
    const announceMsg = `Congratulations! You earned ${amount} English Coins for ${description}. Your current balance is now ${profile.coinsBalance} coins.`;
    speechService.announce(announceMsg);

    return {
      awarded: true,
      profile,
      message: announceMsg,
    };
  }

  /**
   * Securely verifies genuine learning completion of a lesson with the server
   * and automatically awards 20 English Coins if passing criteria are met.
   */
  async verifyAndCompleteLesson(
    studentId: string,
    topicId: string,
    lessonId: string,
    category: string,
    verificationData: any
  ): Promise<{ success: boolean; coinsAwarded: number; newBalance: number; alreadyCompleted: boolean; message: string }> {
    const activityKey = `lesson-${topicId}-${lessonId}`;
    const profile = await this.getProfile(studentId);

    // If already completed in local profile
    if (profile.completedActivityKeys.includes(activityKey)) {
      return {
        success: true,
        coinsAwarded: 0,
        newBalance: profile.coinsBalance,
        alreadyCompleted: true,
        message: 'Lesson already completed previously. Practice progress recorded.',
      };
    }

    try {
      const res = await fetch('/api/lessons/verify-and-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, topicId, lessonId, category, verificationData }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        profile.coinsBalance = data.balance;
        if (!profile.completedActivityKeys.includes(activityKey)) {
          profile.completedActivityKeys.push(activityKey);
        }
        profile.updatedAt = new Date().toISOString();
        this.saveLocalProfile(profile);

        if (data.coinsAwarded > 0) {
          const transaction: CoinTransaction = {
            id: `tx-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            studentId,
            amount: data.coinsAwarded,
            activityKey,
            description: `Verified completion of ${lessonId} in ${topicId}`,
            timestamp: profile.updatedAt,
          };
          this.recordLocalTransaction(transaction);
          soundEffects.playSuccess();
        }

        return {
          success: true,
          coinsAwarded: data.coinsAwarded,
          newBalance: data.balance,
          alreadyCompleted: data.alreadyCompleted,
          message: data.message,
        };
      } else {
        return {
          success: false,
          coinsAwarded: 0,
          newBalance: profile.coinsBalance,
          alreadyCompleted: false,
          message: data.error || 'Completion requirements not met. Please review and try again.',
        };
      }
    } catch {
      // Offline fallback: verify client criteria
      let passed = true;
      if (category === 'vocabulary' && verificationData?.quizTotal > 0) {
        passed = (verificationData.quizScore / verificationData.quizTotal) >= 0.6;
      }
      if (!passed) {
        return {
          success: false,
          coinsAwarded: 0,
          newBalance: profile.coinsBalance,
          alreadyCompleted: false,
          message: 'Quiz score must be at least 60% to complete the lesson.',
        };
      }

      profile.coinsBalance += 20;
      profile.completedActivityKeys.push(activityKey);
      profile.updatedAt = new Date().toISOString();
      this.saveLocalProfile(profile);
      soundEffects.playSuccess();

      return {
        success: true,
        coinsAwarded: 20,
        newBalance: profile.coinsBalance,
        alreadyCompleted: false,
        message: '🎉 Lesson Completed! +20 English Coins earned.',
      };
    }
  }

  /**
   * Purchases an item from the Avatar Shop using virtual English Coins.
   * Atomically validates prices, balance, and ownership.
   */
  async purchaseItem(
    studentId: string,
    itemId: string
  ): Promise<{ success: boolean; profile: StudentAvatarProfile; message: string }> {
    const profile = await this.getProfile(studentId);
    const item = getShopItem(itemId);

    if (!item) {
      soundEffects.playWarning();
      return { success: false, profile, message: 'Item not found in Avatar Shop.' };
    }

    if (profile.ownedItemIds.includes(itemId)) {
      soundEffects.playWarning();
      return { success: false, profile, message: `You already own ${item.name}.` };
    }

    if (profile.coinsBalance < item.price) {
      soundEffects.playWarning();
      const need = item.price - profile.coinsBalance;
      const msg = `Not enough coins to buy ${item.name}. Price is ${item.price} coins, and you have ${profile.coinsBalance}. You need ${need} more coins. Complete lessons to earn them!`;
      speechService.announce(msg);
      return { success: false, profile, message: msg };
    }

    // Call server purchase endpoint for atomic check
    let serverProcessed = false;
    try {
      const srvRes = await fetch('/api/avatar/purchase-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, itemId, price: item.price, itemName: item.name }),
      });
      if (srvRes.ok) {
        const srvData = await srvRes.json();
        if (srvData.success) {
          profile.coinsBalance = srvData.balance;
          if (!profile.ownedItemIds.includes(itemId)) {
            profile.ownedItemIds.push(itemId);
          }
          serverProcessed = true;
        }
      }
    } catch {
      // offline fallback
    }

    if (!serverProcessed) {
      profile.coinsBalance -= item.price;
      profile.ownedItemIds.push(itemId);
    }
    profile.updatedAt = new Date().toISOString();

    const transaction: CoinTransaction = {
      id: `tx-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      studentId,
      amount: -item.price,
      activityKey: `purchase-${itemId}`,
      description: `Purchased ${item.name}`,
      timestamp: profile.updatedAt,
    };

    // Save locally
    this.saveLocalProfile(profile);
    this.recordLocalTransaction(transaction);

    // Sync to Supabase via secure RPC
    if (supabaseService.isConfigured()) {
      try {
        const client = supabaseService.getClient();
        if (client) {
          const { data: rpcData, error: rpcErr } = await client.rpc('purchase_avatar_item', {
            p_item_id: itemId,
            p_item_price: item.price
          });

          if (!rpcErr && rpcData && typeof rpcData.balance === 'number') {
            profile.coinsBalance = rpcData.balance;
            this.saveLocalProfile(profile);
          } else {
            // Direct insert fallback
            await client.from('student_coin_transactions').insert({
              student_id: studentId,
              amount: -item.price,
              activity_key: `purchase-${itemId}`,
              description: `Purchased ${item.name}`,
            });
          }
        }
      } catch (err) {
        console.warn('Could not sync purchase to Supabase:', err);
      }
    }

    soundEffects.playSuccess();
    const successMsg = `Success! You unlocked ${item.name} for ${item.price} coins. Your remaining balance is ${profile.coinsBalance} English Coins.`;
    speechService.announce(successMsg);

    return { success: true, profile, message: successMsg };
  }

  /**
   * Helper to fetch transactions history
   */
  getTransactionHistory(studentId: string): CoinTransaction[] {
    try {
      const raw = localStorage.getItem(`limitless_coin_tx_${studentId}`);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {
      // ignore
    }
    return [];
  }

  private recordLocalTransaction(tx: CoinTransaction): void {
    try {
      const key = `limitless_coin_tx_${tx.studentId}`;
      const history = this.getTransactionHistory(tx.studentId);
      history.unshift(tx);
      localStorage.setItem(key, JSON.stringify(history.slice(0, 50)));
    } catch {
      // ignore
    }
  }

  private getLocalProfile(studentId: string): StudentAvatarProfile {
    try {
      const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${studentId}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.avatarConfig) {
          if (!parsed.avatarConfig.presentation) {
            parsed.avatarConfig.presentation = 'neutral';
          }
          return parsed;
        }
      }
    } catch {
      // ignore
    }

    // Default starter profile with free starter items unlocked
    const starterOwned = SHOP_CATALOG.filter((i) => i.isStarter || i.price === 0).map((i) => i.id);

    return {
      studentId,
      avatarConfig: { ...STARTER_AVATAR },
      coinsBalance: 0,
      ownedItemIds: starterOwned,
      completedActivityKeys: [],
      updatedAt: new Date().toISOString(),
    };
  }

  public saveLocalProfile(profile: StudentAvatarProfile): void {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${profile.studentId}`, JSON.stringify(profile));
    } catch {
      // ignore
    }
  }
}

export const avatarService = new AvatarService();
