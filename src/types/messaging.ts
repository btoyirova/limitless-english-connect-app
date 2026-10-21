export type UserAvailabilityStatus = 'available' | 'busy' | 'offline';

export interface DirectMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'student' | 'teacher';
  receiverId: string;
  receiverName: string;
  text?: string;
  audioUrl?: string; // Audio URI or Supabase Storage URL
  durationSeconds?: number;
  isRead: boolean;
  createdAt: string;
}

export interface StudentPresenceProfile {
  studentId: string;
  studentName: string;
  avatarColor: string;
  ageGroup: 'child' | 'adult';
  visionPreference: string;
  status: UserAvailabilityStatus;
  isDiscoverable: boolean;
  allowIncomingMessages: boolean;
  lastActiveAt: string;
}

export interface CommunityGroupChat {
  id: string;
  name: string;
  topicId?: string;
  description: string;
  category: 'beginner' | 'topic' | 'speaking' | 'announcements';
  createdById: string;
  createdByName: string;
  memberIds: string[];
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CommunityGroupMessage {
  id: string;
  groupId: string;
  senderId: string;
  senderName: string;
  senderRole: 'student' | 'teacher';
  senderAvatarColor: string;
  text?: string;
  audioUrl?: string;
  durationSeconds?: number;
  isAnnouncement?: boolean;
  createdAt: string;
}

export interface BlockedUserRecord {
  id: string;
  blockerId: string;
  blockedId: string;
  createdAt: string;
}
