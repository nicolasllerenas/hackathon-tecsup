import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../types/navigation";

// Screens
import WelcomeScreen from "../screens/screens/auth/WelcomeScreen";
import EmailVerificationScreen from "../screens/screens/auth/EmailVerificationScreen";
import OnboardingStep1Screen from "../screens/screens/auth/OnboardingStep1Screen";
import OnboardingStep2Screen from "../screens/screens/auth/OnboardingStep2Screen";
import OnboardingStep3Screen from "../screens/screens/auth/OnboardingStep3Screen";
import OnboardingStep4Screen from "../screens/screens/auth/OnboardingStep4Screen";

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen
        name="EmailVerification"
        component={EmailVerificationScreen}
      />
      <Stack.Screen name="OnboardingStep1" component={OnboardingStep1Screen} />
      <Stack.Screen name="OnboardingStep2" component={OnboardingStep2Screen} />
      <Stack.Screen name="OnboardingStep3" component={OnboardingStep3Screen} />
      <Stack.Screen name="OnboardingStep4" component={OnboardingStep4Screen} />
    </Stack.Navigator>
  );
}
