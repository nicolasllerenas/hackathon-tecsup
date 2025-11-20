// API Endpoints - ConnectU
import { apiClient } from './axios';
import type {
  AuthResponse,
  OnboardingResponse,
  User,
  UserProfile,
  MatchCandidate,
  Match,
  MatchRequestResponse,
  MatchResponseAction,
  Message,
  Session,
  SessionCreateResponse,
  SessionCompleteResponse,
  FeedResource,
  GamificationData,
  LeaderboardEntry,
  PointTransaction,
  Notification,
  Grade,
  AvailabilitySchedule,
  ApiResponse,
} from './types';

// ============================================
// AUTH ENDPOINTS
// ============================================

export const authAPI = {
  // Enviar código de verificación
  sendVerificationCode: (email: string) => 
    apiClient.post<ApiResponse>('/auth/send-verification', { email }),

  // Verificar código y crear usuario
  verifyCode: (email: string, code: string) =>
    apiClient.post<AuthResponse>('/auth/verify', { email, code }),

  // Completar onboarding
  completeOnboarding: (data: {
    firstName: string;
    lastName: string;
    career: string;
    semester: number;
    university: string;
    careerInterests: string[];
    futureRoles?: string[];
    industryPreference?: string[];
    skillsToLearn?: string[];
    weaknesses?: string[];
    strengths?: string[];
    studyStyle?: string;
    availableTimes?: AvailabilitySchedule;
  }) => apiClient.post<OnboardingResponse>('/auth/onboarding', data),

  // Logout (si se implementa)
  logout: () => apiClient.post('/auth/logout'),
};

// ============================================
// USER ENDPOINTS
// ============================================

export const userAPI = {
  // Obtener perfil propio
  getMyProfile: () => 
    apiClient.get<{ user: User; profile: UserProfile; stats: any }>('/users/me'),

  // Actualizar perfil
  updateProfile: (data: Partial<{
    bio: string;
    careerInterests: string[];
    availableTimes: AvailabilitySchedule;
  }>) => apiClient.patch<ApiResponse<{ user: User }>>('/users/me', data),

  // Subir foto de perfil
  uploadProfileImage: (imageFile: FormData) =>
    apiClient.post<ApiResponse<{ imageUrl: string }>>('/users/me/profile-image', imageFile, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // Ver perfil de otro usuario
  getUserProfile: (userId: string) =>
    apiClient.get<User>(`/users/${userId}`),

  // Agregar calificaciones
  addGrades: (grades: Grade[]) =>
    apiClient.post<ApiResponse<{ gradesAdded: number; gpa: number; riskScore: number }>>('/users/me/grades', { grades }),
};

// ============================================
// MATCHING ENDPOINTS
// ============================================

export const matchingAPI = {
  // Obtener candidatos sugeridos
  getCandidates: (limit = 20, offset = 0) =>
    apiClient.get<{ candidates: MatchCandidate[]; pagination: any }>('/matches/candidates', {
      params: { limit, offset },
    }),

  // Enviar solicitud de match (swipe right)
  requestMatch: (candidateId: string, message?: string) =>
    apiClient.post<MatchRequestResponse>('/matches/request', { candidateId, message }),

  // Rechazar candidato (swipe left)
  skipCandidate: (candidateId: string, reason?: string) =>
    apiClient.post<ApiResponse>('/matches/skip', { candidateId, reason }),

  // Ver mis matches
  getMyMatches: (status: string = 'all', role: string = 'all') =>
    apiClient.get<{ matches: Match[]; counts: any }>('/matches/my-matches', {
      params: { status, role },
    }),

  // Responder solicitud de match (para mentores)
  respondToMatch: (matchId: string, action: 'accept' | 'reject', message?: string) =>
    apiClient.post<MatchResponseAction>(`/matches/${matchId}/respond`, { action, message }),
};

// ============================================
// CHAT ENDPOINTS
// ============================================

export const chatAPI = {
  // Obtener mensajes de un match
  getMessages: (matchId: string, limit = 50, before?: string) =>
    apiClient.get<{ messages: Message[]; pagination: any }>(`/matches/${matchId}/messages`, {
      params: { limit, before },
    }),

  // Enviar mensaje
  sendMessage: (matchId: string, content: string, messageType = 'text') =>
    apiClient.post<ApiResponse<{ message: Message }>>(`/matches/${matchId}/messages`, {
      content,
      messageType,
    }),

  // Marcar mensajes como leídos
  markMessagesAsRead: (matchId: string, messageIds: string[]) =>
    apiClient.post<ApiResponse>(`/matches/${matchId}/messages/read`, { messageIds }),
};

// ============================================
// SESSION ENDPOINTS
// ============================================

export const sessionAPI = {
  // Crear sesión
  createSession: (data: {
    matchId: string;
    scheduledAt: string;
    duration: number;
    title: string;
    description?: string;
    createGoogleCalendarEvent?: boolean;
  }) => apiClient.post<SessionCreateResponse>('/sessions', data),

  // Ver sesiones
  getSessions: (status: string = 'upcoming', limit = 10, matchId?: string) =>
    apiClient.get<{ sessions: Session[]; stats: any }>('/sessions', {
      params: { status, limit, matchId },
    }),

  // Completar sesión
  completeSession: (sessionId: string, data: {
    rating: number;
    feedback?: string;
    topicsCovered?: string[];
    wasHelpful?: boolean;
  }) => apiClient.post<SessionCompleteResponse>(`/sessions/${sessionId}/complete`, data),

  // Cancelar sesión
  cancelSession: (sessionId: string, reason?: string) =>
    apiClient.post<ApiResponse<{ session: Session }>>(`/sessions/${sessionId}/cancel`, { reason }),

  // Reprogramar sesión
  rescheduleSession: (sessionId: string, newScheduledAt: string) =>
    apiClient.post<ApiResponse<{ session: Session }>>(`/sessions/${sessionId}/reschedule`, { newScheduledAt }),
};

// ============================================
// FEED ENDPOINTS
// ============================================

export const feedAPI = {
  // Obtener feed de recursos
  getResources: (limit = 20, offset = 0, tags?: string, contentType?: string) =>
    apiClient.get<{ resources: FeedResource[]; pagination: any }>('/feed', {
      params: { limit, offset, tags, contentType },
    }),

  // Crear recurso
  createResource: (data: FormData) =>
    apiClient.post<ApiResponse<{ resource: FeedResource; pointsEarned: number }>>('/feed/resources', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // Dar like a recurso
  likeResource: (resourceId: string) =>
    apiClient.post<ApiResponse<{ liked: boolean; totalLikes: number }>>(`/feed/resources/${resourceId}/like`),

  // Quitar like
  unlikeResource: (resourceId: string) =>
    apiClient.delete<ApiResponse<{ liked: boolean; totalLikes: number }>>(`/feed/resources/${resourceId}/like`),
};

// ============================================
// GAMIFICATION ENDPOINTS
// ============================================

export const gamificationAPI = {
  // Ver mi progreso y recompensas
  getMyProgress: () =>
    apiClient.get<GamificationData>('/gamification/me'),

  // Ver leaderboard
  getLeaderboard: (timeframe = 'monthly', limit = 50, category = 'points') =>
    apiClient.get<{ leaderboard: LeaderboardEntry[]; myRank: number; totalParticipants: number }>('/gamification/leaderboard', {
      params: { timeframe, limit, category },
    }),

  // Descargar certificado
  downloadCertificate: (certificateType: string) =>
    apiClient.get(`/gamification/certificates/${certificateType}`, {
      responseType: 'blob',
    }),

  // Ver historial de puntos
  getPointsHistory: (limit = 50) =>
    apiClient.get<{ transactions: PointTransaction[]; totalPoints: number; totalEarned: number; totalSpent: number }>('/gamification/points/history', {
      params: { limit },
    }),
};

// ============================================
// NOTIFICATION ENDPOINTS
// ============================================

export const notificationAPI = {
  // Obtener notificaciones
  getNotifications: (limit = 20, unreadOnly = false) =>
    apiClient.get<{ notifications: Notification[]; unreadCount: number }>('/notifications', {
      params: { limit, unreadOnly },
    }),

  // Marcar notificación como leída
  markAsRead: (notificationId: string) =>
    apiClient.post<ApiResponse>(`/notifications/${notificationId}/read`),

  // Marcar todas como leídas
  markAllAsRead: () =>
    apiClient.post<ApiResponse<{ markedAsRead: number }>>('/notifications/read-all'),

  // Eliminar notificación
  deleteNotification: (notificationId: string) =>
    apiClient.delete<ApiResponse>(`/notifications/${notificationId}`),
};

// Export all APIs
export default {
  auth: authAPI,
  user: userAPI,
  matching: matchingAPI,
  chat: chatAPI,
  session: sessionAPI,
  feed: feedAPI,
  gamification: gamificationAPI,
  notification: notificationAPI,
};
