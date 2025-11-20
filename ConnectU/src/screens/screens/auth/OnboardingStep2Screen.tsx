import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Button from "../../../components/ui/Button";
import type { AuthScreenProps } from "../../../types/navigation";

const CAREER_INTERESTS = [
  { id: "ciberseguridad", label: "Ciberseguridad", icon: "🛡️" },
  { id: "ia", label: "Inteligencia Artificial", icon: "🤖" },
  { id: "mobile", label: "Desarrollo Mobile", icon: "📱" },
  { id: "cloud", label: "Cloud & DevOps", icon: "☁️" },
  { id: "game", label: "Game Development", icon: "🎮" },
  { id: "fintech", label: "Fintech", icon: "💰" },
  { id: "data", label: "Data Science", icon: "📊" },
  { id: "web", label: "Desarrollo Web", icon: "🌐" },
];

export default function OnboardingStep2Screen({
  navigation,
  route,
}: AuthScreenProps<"OnboardingStep2">) {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const toggleInterest = (id: string) => {
    if (selectedInterests.includes(id)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== id));
    } else {
      setSelectedInterests([...selectedInterests, id]);
    }
  };

  const handleNext = () => {
    navigation.navigate("OnboardingStep3", {
      userData: {
        ...route.params.userData,
        careerInterests: selectedInterests,
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6">
        {/* Progress Bar */}
        <View className="flex-row mb-8 mt-4">
          <View className="flex-1 h-1 bg-primary-500 rounded-full" />
          <View className="flex-1 h-1 bg-primary-500 rounded-full ml-2" />
          <View className="flex-1 h-1 bg-gray-200 rounded-full ml-2" />
          <View className="flex-1 h-1 bg-gray-200 rounded-full ml-2" />
        </View>

        {/* Back Button */}
        <TouchableOpacity onPress={() => navigation.goBack()} className="mb-6">
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>

        {/* Header */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            ¿Qué te apasiona?
          </Text>
          <Text className="text-gray-600 text-base">
            Paso 2 de 4 • Selecciona tus intereses profesionales
          </Text>
        </View>

        {/* Interests Grid */}
        <View className="flex-row flex-wrap mb-6">
          {CAREER_INTERESTS.map((interest) => {
            const isSelected = selectedInterests.includes(interest.id);
            return (
              <TouchableOpacity
                key={interest.id}
                onPress={() => toggleInterest(interest.id)}
                className={`w-[48%] mr-[4%] mb-4 p-4 rounded-2xl border-2 ${
                  isSelected
                    ? "bg-primary-50 border-primary-500"
                    : "bg-white border-gray-200"
                }`}
              >
                <Text className="text-3xl mb-2">{interest.icon}</Text>
                <Text
                  className={`font-semibold ${
                    isSelected ? "text-primary-700" : "text-gray-900"
                  }`}
                >
                  {interest.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text className="text-gray-500 text-sm text-center mb-6">
          Selecciona al menos 2 intereses
        </Text>
      </ScrollView>

      {/* Bottom Button */}
      <View className="px-6 pb-6 pt-4 border-t border-gray-200">
        <Button
          title="Siguiente"
          onPress={handleNext}
          disabled={selectedInterests.length < 2}
          size="lg"
        />
      </View>
    </SafeAreaView>
  );
}
