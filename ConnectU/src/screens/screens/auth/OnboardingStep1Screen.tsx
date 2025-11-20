import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import type { AuthScreenProps } from "../../../types/navigation";

export default function OnboardingStep1Screen({
  navigation,
}: AuthScreenProps<"OnboardingStep1">) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    career: "",
    semester: "",
    university: "UTEC",
  });

  const handleNext = () => {
    navigation.navigate("OnboardingStep2", { userData: formData });
  };

  const isValid =
    formData.firstName &&
    formData.lastName &&
    formData.career &&
    formData.semester;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6">
        {/* Progress Bar */}
        <View className="flex-row mb-8 mt-4">
          <View className="flex-1 h-1 bg-primary-500 rounded-full" />
          <View className="flex-1 h-1 bg-gray-200 rounded-full ml-2" />
          <View className="flex-1 h-1 bg-gray-200 rounded-full ml-2" />
          <View className="flex-1 h-1 bg-gray-200 rounded-full ml-2" />
        </View>

        {/* Header */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            ¿Quién eres?
          </Text>
          <Text className="text-gray-600 text-base">
            Paso 1 de 4 • Cuéntanos sobre ti
          </Text>
        </View>

        {/* Form */}
        <Input
          label="Nombre"
          placeholder="Miguel"
          value={formData.firstName}
          onChangeText={(text) => setFormData({ ...formData, firstName: text })}
          icon="person-outline"
        />

        <Input
          label="Apellido"
          placeholder="Sanchez"
          value={formData.lastName}
          onChangeText={(text) => setFormData({ ...formData, lastName: text })}
          icon="person-outline"
        />

        <Input
          label="Carrera"
          placeholder="Computer Science"
          value={formData.career}
          onChangeText={(text) => setFormData({ ...formData, career: text })}
          icon="school-outline"
        />

        <Input
          label="Ciclo actual"
          placeholder="3"
          value={formData.semester}
          onChangeText={(text) => setFormData({ ...formData, semester: text })}
          keyboardType="number-pad"
          icon="calendar-outline"
        />

        <Input
          label="Universidad"
          value={formData.university}
          editable={false}
          icon="business-outline"
          className="bg-gray-100"
        />
      </ScrollView>

      {/* Bottom Button */}
      <View className="px-6 pb-6 pt-4 border-t border-gray-200">
        <Button
          title="Siguiente"
          onPress={handleNext}
          disabled={!isValid}
          size="lg"
        />
      </View>
    </SafeAreaView>
  );
}
