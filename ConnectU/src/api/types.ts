// API Types - ConnectU
// Modelos de datos que coinciden con el backend

// ============================================
// AUTH & USER TYPES
// ============================================

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  career: string;
  semester: number;
  university: string;
  profileImage?: string;
  bio?: string;
  onboardingCompleted: boolean;
}

export interface UserProfile {
  careerInterests: string[];
  futureRoles?: string[];
  industryPreference?: string[];
  skillsToLearn?: string[];
  strengths?: string[];
  weaknesses?: string[];
  studyStyle?: 'visual' | 'practical' | 'theoretical' | 'collaborative';
  gpa?: number;
  riskScore: number;
  riskType?: string;
  riskFactors: RiskFactor[];
  level: number;
  points: number;
  badges: string[];
  availableTimes?: AvailabilitySchedule;
}

export interface RiskFactor {
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  suggestion: string;
}

export interface UserStats {
  mentorshipsAsmentee: number;
  mentorshipsAsMentor: number;
  sessionsCompleted: number;
  avgRating: number;
}

export interface AvailabilitySchedule {
  monday: string[];
  tuesday: string[];
  wednesday: string[];
  thursday: string[];
  friday: string[];
  saturday: string[];
  sunday: string[];
}

export interface Grade {
  courseName: string;
  grade: number;
  semester: string;
  status: 'approved' | 'in_progress' | 'failed';
}

// ============================================
// MATCHING TYPES
// ============================================

export interface MatchCandidate {
  id: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    career: string;
    semester: number;
    profileImage?: string;
    bio?: string;
  };
  compatibilityScore: number;
  matchType: 'MENTOR' | 'PEER' | 'VOCATIONAL_BRIDGE';
  matchReasons: string[];
  commonInterests: string[];
  mentorStats?: {
    successRate: number;
    avgRating: number;
    totalSessions: number;
  };
}

export interface Match {
  id: string;
  status: 'pending' | 'accepted' | 'active' | 'completed' | 'rejected';
  matchType: 'MENTOR' | 'PEER' | 'VOCATIONAL_BRIDGE';
  compatibilityScore: number;
  createdAt: string;
  acceptedAt?: string;
  otherUser: {
    id: string;
    firstName: string;
    lastName: string;
    profileImage?: string;
    career: string;
    semester: number;
  };
  lastMessage?: {
    content: string;
    sentAt: string;
    isRead: boolean;
  };
  upcomingSession?: {
    id: string;
    scheduledAt: string;
    duration: number;
  };
  stats?: {
    totalSessions: number;
    totalMessages: number;
  };
}

// ============================================
// CHAT TYPES
// ============================================

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  content: string;
  messageType: 'text' | 'calendar_invite' | 'resource' | 'system';
  metadata?: any;
  createdAt: string;
  isRead: boolean;
}

export interface ChatTypingEvent {
  matchId: string;
  userId: string;
}

// ============================================
// SESSION TYPES
// ============================================

export interface Session {
  id: string;
  matchId: string;
  scheduledAt: string;
  duration: number;
  title: string;
  description?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  googleCalendarEventId?: string;
  calendarLink?: string;
  meetingLink?: string;
  createdAt: string;
  completedAt?: string;
  cancelledAt?: string;
  rating?: number;
  feedback?: string;
  match?: {
    id: string;
    otherUser: {
      id: string;
      firstName: string;
      profileImage?: string;
    };
  };
}

// ============================================
// FEED & RESOURCES TYPES
// ============================================

export interface FeedResource {
  id: string;
  author: {
    id: string;
    firstName: string;
    profileImage?: string;
  };
  title: string;
  contentType: 'tip' | 'video' | 'guide' | 'success_story';
  content: string;
  mediaUrl?: string;
  tags: string[];
  likes: number;
  views: number;
  isLiked: boolean;
  createdAt: string;
}

// ============================================
// GAMIFICATION TYPES
// ============================================

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: string;
}

export interface GamificationData {
  level: number;
  currentPoints: number;
  pointsToNextLevel: number;
  badges: Badge[];
  stats: {
    totalSessions: number;
    hoursVolunteered: number;
    menteesHelped: number;
    successRate: number;
  };
  rewards: {
    certificatesAvailable: Certificate[];
    nextReward?: {
      level: number;
      description: string;
      pointsNeeded: number;
    };
  };
}

export interface Certificate {
  type: string;
  hours: number;
  downloadUrl: string;
}

export interface LeaderboardEntry {
  rank: number;
  user: {
    id: string;
    firstName: string;
    profileImage?: string;
    level: number;
  };
  points: number;
  sessions: number;
  successRate: number;
  isCurrentUser?: boolean;
}

export interface PointTransaction {
  id: string;
  points: number;
  action: string;
  description: string;
  referenceId?: string;
  createdAt: string;
}

// ============================================
// NOTIFICATION TYPES
// ============================================

export interface Notification {
  id: string;
  type: 'new_match' | 'new_message' | 'session_reminder' | 'badge_unlocked' | 'level_up' | 'session_completed';
  title: string;
  body: string;
  data?: any;
  isRead: boolean;
  createdAt: string;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

// Auth responses
export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface OnboardingResponse {
  success: boolean;
  user: User;
  profile: UserProfile;
}

// Match responses
export interface MatchRequestResponse {
  success: boolean;
  match: Match;
  message: string;
}

export interface MatchResponseAction {
  success: boolean;
  match: Match;
  pointsEarned?: number;
  message: string;
}

// Session responses
export interface SessionCreateResponse {
  success: boolean;
  session: Session;
  emailsSent: string[];
}

export interface SessionCompleteResponse {
  success: boolean;
  session: Session;
  pointsEarned: number;
  newLevel?: number;
  badgesUnlocked: Badge[];
}
