import React from "react";
import { View, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Button from "../../components/ui/Button";
import type { AuthScreenProps } from "../../types/navigation";

export default function WelcomeScreen({
  navigation,
}: AuthScreenProps<"Welcome">) {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <LinearGradient colors={["#0284c7", "#0369a1"]} className="flex-1">
        <View className="flex-1 justify-between px-6 py-12">
          {/* Header */}
          <View className="items-center mt-12">
            <View className="w-24 h-24 bg-white rounded-full items-center justify-center mb-6">
              <Text className="text-4xl">🎓</Text>
            </View>
            <Text className="text-white text-4xl font-bold text-center mb-3">
              Yachay
            </Text>
            <Text className="text-blue-100 text-lg text-center">
              Tu brújula académica
            </Text>
          </View>

          {/* Features */}
          <View className="space-y-6">
            <FeatureItem
              icon="🤝"
              title="Conecta con mentores"
              description="Encuentra estudiantes que comparten tus intereses"
            />
            <FeatureItem
              icon="📚"
              title="Mejora académicamente"
              description="Recibe ayuda personalizada en tus cursos"
            />
            <FeatureItem
              icon="🎯"
              title="Alcanza tus metas"
              description="Descubre tu verdadero camino profesional"
            />
          </View>

          {/* CTA */}
          <View>
            <Button
              title="Comenzar"
              onPress={() => navigation.navigate("EmailVerification")}
              className="mb-4"
              size="lg"
            />
            <Text className="text-blue-100 text-center text-sm">
              Solo con email institucional
            </Text>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <View className="flex-row items-start">
      <Text className="text-3xl mr-4">{icon}</Text>
      <View className="flex-1">
        <Text className="text-white text-lg font-semibold mb-1">{title}</Text>
        <Text className="text-blue-100 text-base">{description}</Text>
      </View>
    </View>
  );
}
