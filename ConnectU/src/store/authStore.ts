// Auth Store - ConnectU
import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { authAPI, userAPI } from '../api/endpoints';
import { STORAGE_KEYS } from '../utils/constants';
import type { User, UserProfile, AvailabilitySchedule } from '../api/types';

interface AuthState {
  // State
  user: User | null;
  profile: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  sendVerificationCode: (email: string) => Promise<void>;
  verifyCode: (email: string, code: string) => Promise<void>;
  completeOnboarding: (data: OnboardingData) => Promise<void>;
  loadUser: () => Promise<void>;
  updateProfile: (data: Partial<ProfileUpdateData>) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

interface OnboardingData {
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
}

interface ProfileUpdateData {
  bio?: string;
  careerInterests?: string[];
  availableTimes?: AvailabilitySchedule;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // Initial state
  user: null,
  profile: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  // Send verification code to email
  sendVerificationCode: async (email: string) => {
    set({ isLoading: true, error: null });
    try {
      await authAPI.sendVerificationCode(email);
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Error al enviar código',
        isLoading: false,
      });
      throw error;
    }
  },

  // Verify code and login/register
  verifyCode: async (email: string, code: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.verifyCode(email, code);
      const { token, user } = response.data;

      // Save token and user data
      await SecureStore.setItemAsync(STORAGE_KEYS.AUTH_TOKEN, token);
      await SecureStore.setItemAsync(STORAGE_KEYS.USER_DATA, JSON.stringify(user));

      set({
        token,
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Error al verificar código',
        isLoading: false,
      });
      throw error;
    }
  },

  // Complete onboarding
  completeOnboarding: async (data: OnboardingData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.completeOnboarding(data);
      const { user, profile } = response.data;

      // Update stored user data
      await SecureStore.setItemAsync(STORAGE_KEYS.USER_DATA, JSON.stringify(user));

      set({
        user,
        profile,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Error al completar onboarding',
        isLoading: false,
      });
      throw error;
    }
  },

  // Load user from storage on app start
  loadUser: async () => {
    set({ isLoading: true });
    try {
      const token = await SecureStore.getItemAsync(STORAGE_KEYS.AUTH_TOKEN);
      const userDataStr = await SecureStore.getItemAsync(STORAGE_KEYS.USER_DATA);

      if (token && userDataStr) {
        const userData = JSON.parse(userDataStr);

        // Fetch fresh user data from API
        try {
          const response = await userAPI.getMyProfile();
          set({
            token,
            user: response.data.user,
            profile: response.data.profile,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          // If API call fails, use stored data
          set({
            token,
            user: userData,
            isAuthenticated: true,
            isLoading: false,
          });
        }
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Error loading user:', error);
      set({ isLoading: false });
    }
  },

  // Update user profile
  updateProfile: async (data: ProfileUpdateData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await userAPI.updateProfile(data);
      
      // Fetch updated profile
      const profileResponse = await userAPI.getMyProfile();
      
      set({
        user: profileResponse.data.user,
        profile: profileResponse.data.profile,
        isLoading: false,
      });

      // Update stored data
      await SecureStore.setItemAsync(
        STORAGE_KEYS.USER_DATA,
        JSON.stringify(profileResponse.data.user)
      );
    } catch (error: any) {
      set({
        error: error.message || 'Error al actualizar perfil',
        isLoading: false,
      });
      throw error;
    }
  },

  // Logout
  logout: async () => {
    try {
      // Call logout API if implemented
      await authAPI.logout().catch(() => {});
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear local data
      await SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN);
      await SecureStore.deleteItemAsync(STORAGE_KEYS.USER_DATA);

      set({
        user: null,
        profile: null,
        token: null,
        isAuthenticated: false,
        error: null,
      });
    }
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));
