// Constants - ConnectU

// ============================================
// API CONFIGURATION
// ============================================

// TODO: Cambiar esto a tu URL de producción cuando la tengas
export const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api'  // Development
  : 'https://api.connectu.pe/api';  // Production

export const WS_BASE_URL = __DEV__
  ? 'ws://localhost:3000'
  : 'wss://api.connectu.pe';

// ============================================
// STORAGE KEYS
// ============================================

export const STORAGE_KEYS = {
  AUTH_TOKEN: '@connectu:auth_token',
  USER_DATA: '@connectu:user_data',
  ONBOARDING_STEP: '@connectu:onboarding_step',
  THEME: '@connectu:theme',
} as const;

// ============================================
// APP CONFIGURATION
// ============================================

export const APP_CONFIG = {
  NAME: 'ConnectU',
  VERSION: '1.0.0',
  SUPPORT_EMAIL: 'soporte@connectu.pe',
  PRIVACY_URL: 'https://connectu.pe/privacy',
  TERMS_URL: 'https://connectu.pe/terms',
} as const;

// ============================================
// UNIVERSITIES
// ============================================

export const UNIVERSITIES = [
  'UTEC',
  'PUCP',
  'Universidad de Lima',
  'UPC',
  'Universidad del Pacífico',
  'UNMSM',
  'UNI',
  'ESAN',
  'Universidad San Martín de Porres',
  'Universidad Ricardo Palma',
] as const;

// ============================================
// CAREERS
// ============================================

export const CAREERS = [
  'Computer Science',
  'Ingeniería de Sistemas',
  'Ingeniería de Software',
  'Ciencia de Datos',
  'Ingeniería Industrial',
  'Ingeniería Electrónica',
  'Ingeniería Civil',
  'Ingeniería Mecánica',
  'Administración',
  'Economía',
  'Derecho',
  'Psicología',
  'Comunicaciones',
  'Diseño Gráfico',
  'Marketing',
  'Contabilidad',
] as const;

// ============================================
// CAREER INTERESTS
// ============================================

export const CAREER_INTERESTS = [
  'Ciberseguridad',
  'Desarrollo Web',
  'Desarrollo Mobile',
  'DevOps',
  'Cloud Computing',
  'Inteligencia Artificial',
  'Machine Learning',
  'Data Science',
  'Blockchain',
  'IoT',
  'Game Development',
  'UI/UX Design',
  'Product Management',
  'Consultoría',
  'Fintech',
  'Emprendimiento',
] as const;

// ============================================
// FUTURE ROLES
// ============================================

export const FUTURE_ROLES = [
  'Software Engineer',
  'Security Engineer',
  'DevOps Engineer',
  'Data Scientist',
  'ML Engineer',
  'Product Manager',
  'UX Designer',
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'Cloud Architect',
  'Cybersecurity Analyst',
  'Consultor',
  'Entrepreneur',
  'Project Manager',
] as const;

// ============================================
// INDUSTRIES
// ============================================

export const INDUSTRIES = [
  'Tech',
  'Fintech',
  'E-commerce',
  'Healthcare',
  'Education',
  'Gaming',
  'Retail',
  'Banking',
  'Consulting',
  'Startups',
  'Government',
  'NGO',
] as const;

// ============================================
// STUDY STYLES
// ============================================

export const STUDY_STYLES = [
  { value: 'visual', label: 'Visual', icon: '👁️', description: 'Aprendo mejor con diagramas y videos' },
  { value: 'practical', label: 'Práctico', icon: '🛠️', description: 'Aprendo haciendo y experimentando' },
  { value: 'theoretical', label: 'Teórico', icon: '📚', description: 'Me gusta leer y analizar conceptos' },
  { value: 'collaborative', label: 'Colaborativo', icon: '👥', description: 'Aprendo mejor en grupo' },
] as const;

// ============================================
// SKILLS TO LEARN
// ============================================

export const SKILLS_TO_LEARN = [
  'Pentesting',
  'Docker',
  'Kubernetes',
  'AWS',
  'Azure',
  'Python',
  'JavaScript',
  'React',
  'Node.js',
  'SQL',
  'NoSQL',
  'Git',
  'Linux',
  'Networking',
  'Algorithms',
  'System Design',
  'Agile',
  'Scrum',
] as const;

// ============================================
// TIME SLOTS
// ============================================

export const TIME_SLOTS = [
  '07:00-08:00',
  '08:00-09:00',
  '09:00-10:00',
  '10:00-11:00',
  '11:00-12:00',
  '12:00-13:00',
  '13:00-14:00',
  '14:00-15:00',
  '15:00-16:00',
  '16:00-17:00',
  '17:00-18:00',
  '18:00-19:00',
  '19:00-20:00',
  '20:00-21:00',
  '21:00-22:00',
] as const;

export const DAYS_OF_WEEK = [
  { key: 'monday', label: 'Lunes' },
  { key: 'tuesday', label: 'Martes' },
  { key: 'wednesday', label: 'Miércoles' },
  { key: 'thursday', label: 'Jueves' },
  { key: 'friday', label: 'Viernes' },
  { key: 'saturday', label: 'Sábado' },
  { key: 'sunday', label: 'Domingo' },
] as const;

// ============================================
// GAMIFICATION
// ============================================

export const POINTS = {
  FIRST_MATCH: 50,
  COMPLETE_SESSION: 100,
  RECEIVE_5_STAR_RATING: 50,
  MENTEE_PASSES_COURSE: 500,
  CREATE_RESOURCE: 20,
  RESOURCE_GETS_10_LIKES: 30,
  DAILY_LOGIN: 10,
} as const;

export const LEVELS = [
  { level: 1, pointsRequired: 0, name: 'Novato' },
  { level: 2, pointsRequired: 500, name: 'Aprendiz' },
  { level: 3, pointsRequired: 1500, name: 'Mentor Junior' },
  { level: 4, pointsRequired: 3000, name: 'Mentor Senior' },
  { level: 5, pointsRequired: 5000, name: 'Experto' },
  { level: 6, pointsRequired: 10000, name: 'Maestro' },
] as const;

// ============================================
// VALIDATION
// ============================================

export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 6,
  MAX_BIO_LENGTH: 300,
  MAX_MESSAGE_LENGTH: 1000,
  MIN_SESSION_DURATION: 30,
  MAX_SESSION_DURATION: 180,
  MAX_PROFILE_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
} as const;

// ============================================
// UI CONSTANTS
// ============================================

export const ANIMATION_DURATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
} as const;

export const SWIPE_THRESHOLD = 0.3; // 30% of screen width

export const NOTIFICATION_TYPES = {
  NEW_MATCH: 'new_match',
  NEW_MESSAGE: 'new_message',
  SESSION_REMINDER: 'session_reminder',
  BADGE_UNLOCKED: 'badge_unlocked',
  LEVEL_UP: 'level_up',
  SESSION_COMPLETED: 'session_completed',
} as const;

// ============================================
// REGEX PATTERNS
// ============================================

export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  UNIVERSITY_EMAIL: /@(utec|pucp|ulima|upc|up)\.edu\.pe$/i,
  PHONE: /^9\d{8}$/,
} as const;

// ============================================
// ERROR MESSAGES
// ============================================

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Verifica tu internet.',
  UNAUTHORIZED: 'Sesión expirada. Por favor inicia sesión nuevamente.',
  SERVER_ERROR: 'Error del servidor. Intenta nuevamente más tarde.',
  INVALID_CODE: 'Código inválido o expirado.',
  EMAIL_NOT_FOUND: 'Email no encontrado.',
  INVALID_EMAIL: 'Email inválido. Usa tu correo universitario.',
} as const;

// ============================================
// SUCCESS MESSAGES
// ============================================

export const SUCCESS_MESSAGES = {
  CODE_SENT: 'Código enviado exitosamente.',
  PROFILE_UPDATED: 'Perfil actualizado exitosamente.',
  MATCH_REQUESTED: 'Solicitud de match enviada.',
  MATCH_ACCEPTED: 'Match aceptado exitosamente.',
  MESSAGE_SENT: 'Mensaje enviado.',
  SESSION_CREATED: 'Sesión agendada exitosamente.',
} as const;
