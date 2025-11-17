import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { MainStackParamList } from "../types/navigation";
import MainTabNavigator from "./MainTabNavigator";
import ChatScreen from "../screens/main/ChatScreen";
import SessionsScreen from "../screens/sessions/SessionsScreen";

const Stack = createNativeStackNavigator<MainStackParamList>();

export default function MainNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainTabs"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={({ route }) => ({
          title: route.params.otherUser.firstName,
          headerBackTitle: "Atrás",
        })}
      />
      <Stack.Screen
        name="Sessions"
        component={SessionsScreen}
        options={{
          title: "Mis Sesiones",
          headerBackTitle: "Atrás",
        }}
      />
    </Stack.Navigator>
  );
}
