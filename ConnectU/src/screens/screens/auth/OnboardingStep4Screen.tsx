import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Button from "../../../components/ui/Button";
import { useAuthStore } from "../../../store/authStore";
import type { AuthScreenProps } from "../../../types/navigation";

const DAYS = [
  { id: "monday", label: "Lunes" },
  { id: "tuesday", label: "Martes" },
  { id: "wednesday", label: "Miércoles" },
  { id: "thursday", label: "Jueves" },
  { id: "friday", label: "Viernes" },
  { id: "saturday", label: "Sábado" },
  { id: "sunday", label: "Domingo" },
];

const TIME_SLOTS = [
  { id: "morning", label: "Mañanas", time: "08:00-12:00", icon: "🌅" },
  { id: "afternoon", label: "Tardes", time: "14:00-18:00", icon: "☀️" },
  { id: "evening", label: "Noches", time: "18:00-22:00", icon: "🌙" },
];

const STUDY_STYLES = [
  { id: "visual", label: "Visual", icon: "📺", desc: "Videos y diagramas" },
  {
    id: "practical",
    label: "Práctico",
    icon: "💻",
    desc: "Haciendo ejercicios",
  },
  {
    id: "theoretical",
    label: "Teórico",
    icon: "📖",
    desc: "Leyendo y tomando notas",
  },
  { id: "collaborative", label: "Colaborativo", icon: "👥", desc: "En grupo" },
];

export default function OnboardingStep4Screen({
  navigation,
  route,
}: AuthScreenProps<"OnboardingStep4">) {
  const [availability, setAvailability] = useState<Record<string, string[]>>({
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  });
  const [studyStyle, setStudyStyle] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const completeOnboarding = useAuthStore((state) => state.completeOnboarding);

  const toggleTimeSlot = (day: string, slot: string) => {
    const daySlots = availability[day] || [];
    if (daySlots.includes(slot)) {
      setAvailability({
        ...availability,
        [day]: daySlots.filter((s) => s !== slot),
      });
    } else {
      setAvailability({
        ...availability,
        [day]: [...daySlots, slot],
      });
    }
  };

  const handleComplete = async () => {
    // Convert to API format
    const availableTimes: Record<string, string[]> = {};
    Object.entries(availability).forEach(([day, slots]) => {
      availableTimes[day] = slots
        .map((slot) => {
          const timeSlot = TIME_SLOTS.find((t) => t.id === slot);
          return timeSlot?.time || "";
        })
        .filter(Boolean);
    });

    const onboardingData = {
      ...route.params.userData,
      studyStyle,
      availableTimes,
      futureRoles: route.params.userData.careerInterests.map(
        (interest: string) => `${interest} Specialist`
      ),
      industryPreference: ["Tech", "Startup"],
      skillsToLearn: route.params.userData.careerInterests,
    };

    setLoading(true);
    try {
      await completeOnboarding(onboardingData);
      // Navigation handled by AppNavigator
    } catch (error) {
      Alert.alert("Error", "No se pudo completar el registro");
    } finally {
      setLoading(false);
    }
  };

  const hasAvailability = Object.values(availability).some(
    (slots) => slots.length > 0
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6">
        {/* Progress Bar */}
        <View className="flex-row mb-8 mt-4">
          <View className="flex-1 h-1 bg-primary-500 rounded-full" />
          <View className="flex-1 h-1 bg-primary-500 rounded-full ml-2" />
          <View className="flex-1 h-1 bg-primary-500 rounded-full ml-2" />
          <View className="flex-1 h-1 bg-primary-500 rounded-full ml-2" />
        </View>

        {/* Back Button */}
        <TouchableOpacity onPress={() => navigation.goBack()} className="mb-6">
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>

        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            Tu estilo de estudio
          </Text>
          <Text className="text-gray-600 text-base">
            Paso 4 de 4 • Últimos detalles
          </Text>
        </View>

        {/* Study Style */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            ¿Cómo aprendes mejor?
          </Text>
          {STUDY_STYLES.map((style) => {
            const isSelected = studyStyle === style.id;
            return (
              <TouchableOpacity
                key={style.id}
                onPress={() => setStudyStyle(style.id)}
                className={`mb-3 p-4 rounded-2xl border-2 flex-row items-center ${
                  isSelected
                    ? "bg-primary-50 border-primary-500"
                    : "bg-white border-gray-200"
                }`}
              >
                <Text className="text-3xl mr-3">{style.icon}</Text>
                <View className="flex-1">
                  <Text
                    className={`font-semibold text-base ${
                      isSelected ? "text-primary-700" : "text-gray-900"
                    }`}
                  >
                    {style.label}
                  </Text>
                  <Text className="text-gray-600 text-sm">{style.desc}</Text>
                </View>
                {isSelected && (
                  <Ionicons name="checkmark-circle" size={24} color="#0284c7" />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Availability */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            ¿Cuándo puedes estudiar?
          </Text>
          {DAYS.map((day) => (
            <View key={day.id} className="mb-4">
              <Text className="text-gray-700 font-medium mb-2">
                {day.label}
              </Text>
              <View className="flex-row">
                {TIME_SLOTS.map((slot) => {
                  const isSelected = availability[day.id]?.includes(slot.id);
                  return (
                    <TouchableOpacity
                      key={slot.id}
                      onPress={() => toggleTimeSlot(day.id, slot.id)}
                      className={`flex-1 mr-2 p-3 rounded-xl border ${
                        isSelected
                          ? "bg-primary-50 border-primary-500"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <Text className="text-center text-lg mb-1">
                        {slot.icon}
                      </Text>
                      <Text
                        className={`text-center text-xs font-medium ${
                          isSelected ? "text-primary-700" : "text-gray-700"
                        }`}
                      >
                        {slot.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View className="px-6 pb-6 pt-4 border-t border-gray-200">
        <Button
          title="Completar registro"
          onPress={handleComplete}
          disabled={!studyStyle || !hasAvailability || loading}
          loading={loading}
          size="lg"
        />
      </View>
    </SafeAreaView>
  );
}
