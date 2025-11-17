import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";

// Auth Stack
export type AuthStackParamList = {
  Welcome: undefined;
  EmailVerification: undefined;
  OnboardingStep1: undefined;
  OnboardingStep2: { userData: any };
  OnboardingStep3: { userData: any };
  OnboardingStep4: { userData: any };
};

export type AuthScreenProps<T extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, T>;

// Main Tab
export type MainTabParamList = {
  Home: undefined;
  Matching: undefined;
  Matches: undefined;
  Profile: undefined;
};

export type MainTabScreenProps<T extends keyof MainTabParamList> =
  BottomTabScreenProps<MainTabParamList, T>;

// Main Stack (incluye tabs + modals)
export type MainStackParamList = {
  MainTabs: undefined;
  Chat: { matchId: string; otherUser: any };
  Sessions: undefined;
};

export type MainStackScreenProps<T extends keyof MainStackParamList> =
  NativeStackScreenProps<MainStackParamList, T>;
