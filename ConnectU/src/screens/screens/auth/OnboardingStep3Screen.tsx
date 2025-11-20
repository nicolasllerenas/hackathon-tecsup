import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";
import type { AuthScreenProps } from "../../../types/navigation";

const COMMON_COURSES = [
  "Cálculo 1",
  "Cálculo 2",
  "Cálculo 3",
  "Física 1",
  "Física 2",
  "Programación 1",
  "Programación 2",
  "Estructuras de Datos",
  "Algoritmos",
  "Base de Datos",
  "Redes",
  "Matemática Discreta",
  "Estadística",
];

export default function OnboardingStep3Screen({
  navigation,
  route,
}: AuthScreenProps<"OnboardingStep3">) {
  const [weaknesses, setWeaknesses] = useState<string[]>([]);
  const [strengths, setStrengths] = useState<string[]>([]);

  const toggleCourse = (course: string, type: "weakness" | "strength") => {
    if (type === "weakness") {
      if (weaknesses.includes(course)) {
        setWeaknesses(weaknesses.filter((c) => c !== course));
      } else {
        setWeaknesses([...weaknesses, course]);
        // Remove from strengths if exists
        setStrengths(strengths.filter((c) => c !== course));
      }
    } else {
      if (strengths.includes(course)) {
        setStrengths(strengths.filter((c) => c !== course));
      } else {
        setStrengths([...strengths, course]);
        // Remove from weaknesses if exists
        setWeaknesses(weaknesses.filter((c) => c !== course));
      }
    }
  };

  const handleNext = () => {
    navigation.navigate("OnboardingStep4", {
      userData: {
        ...route.params.userData,
        weaknesses,
        strengths,
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
          <View className="flex-1 h-1 bg-primary-500 rounded-full ml-2" />
          <View className="flex-1 h-1 bg-gray-200 rounded-full ml-2" />
        </View>

        {/* Back Button */}
        <TouchableOpacity onPress={() => navigation.goBack()} className="mb-6">
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>

        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            ¿Dónde necesitas ayuda?
          </Text>
          <Text className="text-gray-600 text-base">
            Paso 3 de 4 • Identifica tus cursos difíciles y fáciles
          </Text>
        </View>

        {/* Weaknesses Section */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Cursos que me cuestan más 😰
          </Text>
          <View className="flex-row flex-wrap">
            {COMMON_COURSES.map((course) => {
              const isSelected = weaknesses.includes(course);
              return (
                <TouchableOpacity
                  key={`weak-${course}`}
                  onPress={() => toggleCourse(course, "weakness")}
                  className={`mr-2 mb-2 px-4 py-2 rounded-full border ${
                    isSelected
                      ? "bg-danger-50 border-danger-500"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <Text
                    className={`font-medium ${
                      isSelected ? "text-danger-700" : "text-gray-700"
                    }`}
                  >
                    {course}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Strengths Section */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Cursos donde destaco 🌟
          </Text>
          <View className="flex-row flex-wrap">
            {COMMON_COURSES.map((course) => {
              const isSelected = strengths.includes(course);
              return (
                <TouchableOpacity
                  key={`strong-${course}`}
                  onPress={() => toggleCourse(course, "strength")}
                  className={`mr-2 mb-2 px-4 py-2 rounded-full border ${
                    isSelected
                      ? "bg-success-50 border-success-500"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <Text
                    className={`font-medium ${
                      isSelected ? "text-success-700" : "text-gray-700"
                    }`}
                  >
                    {course}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <Text className="text-gray-500 text-sm text-center mb-6">
          Selecciona al menos 1 curso de cada categoría
        </Text>
      </ScrollView>

      {/* Bottom Button */}
      <View className="px-6 pb-6 pt-4 border-t border-gray-200">
        <Button
          title="Siguiente"
          onPress={handleNext}
          disabled={weaknesses.length === 0 || strengths.length === 0}
          size="lg"
        />
      </View>
    </SafeAreaView>
  );
}
