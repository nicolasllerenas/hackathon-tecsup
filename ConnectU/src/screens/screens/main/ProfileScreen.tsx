import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Share,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useAuthStore } from "../../store/authStore";
import { gamificationAPI, userAPI } from "../../api/endpoints";
import Avatar from "../../components/ui/Avatar";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

export default function ProfileScreen() {
  const { user, profile, logout, updateProfile } = useAuthStore();
  const [gamificationData, setGamificationData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadGamificationData();
  }, []);

  const loadGamificationData = async () => {
    try {
      setLoading(true);
      const response = await gamificationAPI.getMyProgress();
      setGamificationData(response.data);
    } catch (error) {
      console.error("Error loading gamification:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadGamificationData();
    setRefreshing(false);
  };

  const handleEditPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permiso necesario", "Necesitamos acceso a tus fotos");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      try {
        await userAPI.uploadProfileImage(result.assets[0].uri);
        Alert.alert("✅ Éxito", "Foto actualizada");
        // Reload user data
      } catch (error) {
        Alert.alert("Error", "No se pudo actualizar la foto");
      }
    }
  };

  const handleShareProfile = async () => {
    try {
      await Share.share({
        message: `¡Únete a ConnectU! Soy nivel ${profile?.level} y he ayudado a ${
          gamificationData?.stats.menteesHelped || 0
        } estudiantes. 🎓`,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleLogout = () => {
    Alert.alert("Cerrar sesión", "¿Estás seguro de que quieres salir?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Salir", style: "destructive", onPress: logout },
    ]);
  };

  if (loading) {
    return <LoadingSpinner message="Cargando perfil..." />;
  }

  const progressPercentage = gamificationData
    ? (gamificationData.currentPoints /
        (gamificationData.currentPoints + gamificationData.pointsToNextLevel)) *
      100
    : 0;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header with Gradient */}
        <View className="bg-primary-500 px-6 pt-6 pb-20">
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-white text-2xl font-bold">Mi Perfil</Text>
            <TouchableOpacity onPress={handleShareProfile}>
              <Ionicons name="share-outline" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>

          {/* Profile Image */}
          <View className="items-center">
            <View>
              <Avatar
                imageUrl={user?.profileImage}
                name={`${user?.firstName} ${user?.lastName}`}
                size="xl"
              />
              <TouchableOpacity
                onPress={handleEditPhoto}
                className="absolute bottom-0 right-0 bg-white w-10 h-10 rounded-full items-center justify-center shadow-lg"
              >
                <Ionicons name="camera" size={20} color="#0284c7" />
              </TouchableOpacity>
            </View>

            <Text className="text-white text-2xl font-bold mt-4">
              {user?.firstName} {user?.lastName}
            </Text>
            <Text className="text-blue-100 text-base">
              {user?.career} • {user?.semester}° ciclo
            </Text>
          </View>
        </View>

        {/* Level & Progress Card */}
        <View className="px-6 -mt-16 mb-6">
          <Card className="bg-white">
            <View className="flex-row items-center justify-between mb-4">
              <View>
                <Text className="text-gray-500 text-sm mb-1">Nivel actual</Text>
                <Text className="text-gray-900 text-3xl font-bold">
                  {gamificationData?.level || 1}
                </Text>
              </View>
              <View className="bg-primary-100 px-4 py-2 rounded-full">
                <Text className="text-primary-700 font-bold">
                  {gamificationData?.currentPoints || 0} pts
                </Text>
              </View>
            </View>

            {/* Progress Bar */}
            <View className="mb-2">
              <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <View
                  className="h-full bg-primary-500 rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                />
              </View>
            </View>
            <Text className="text-gray-500 text-sm text-center">
              {gamificationData?.pointsToNextLevel || 0} pts para nivel{" "}
              {(gamificationData?.level || 1) + 1}
            </Text>
          </Card>
        </View>

        {/* Stats Grid */}
        <View className="px-6 mb-6">
          <Text className="text-gray-900 text-xl font-bold mb-4">
            Mis estadísticas
          </Text>

          <View className="flex-row space-x-3 mb-3">
            <Card className="flex-1 bg-white items-center">
              <Ionicons name="people" size={32} color="#0284c7" />
              <Text className="text-gray-900 text-2xl font-bold mt-2">
                {gamificationData?.stats.menteesHelped || 0}
              </Text>
              <Text className="text-gray-500 text-sm">Mentees ayudados</Text>
            </Card>

            <Card className="flex-1 bg-white items-center">
              <Ionicons name="checkmark-circle" size={32} color="#10b981" />
              <Text className="text-gray-900 text-2xl font-bold mt-2">
                {gamificationData?.stats.totalSessions || 0}
              </Text>
              <Text className="text-gray-500 text-sm">Sesiones</Text>
            </Card>
          </View>

          <View className="flex-row space-x-3">
            <Card className="flex-1 bg-white items-center">
              <Ionicons name="time" size={32} color="#f59e0b" />
              <Text className="text-gray-900 text-2xl font-bold mt-2">
                {gamificationData?.stats.hoursVolunteered || 0}h
              </Text>
              <Text className="text-gray-500 text-sm">Voluntariado</Text>
            </Card>

            <Card className="flex-1 bg-white items-center">
              <Ionicons name="star" size={32} color="#8b5cf6" />
              <Text className="text-gray-900 text-2xl font-bold mt-2">
                {gamificationData?.stats.successRate || 0}%
              </Text>
              <Text className="text-gray-500 text-sm">Tasa de éxito</Text>
            </Card>
          </View>
        </View>

        {/* Badges */}
        {gamificationData?.badges && gamificationData.badges.length > 0 && (
          <View className="px-6 mb-6">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-gray-900 text-xl font-bold">
                Mis logros
              </Text>
              <Badge
                label={`${gamificationData.badges.length}`}
                variant="primary"
              />
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {gamificationData.badges.map((badge: any, index: number) => (
                <Card key={index} className="bg-white mr-3 w-32 items-center">
                  <View className="w-16 h-16 bg-primary-100 rounded-full items-center justify-center mb-3">
                    <Text className="text-3xl">{badge.icon || "🏆"}</Text>
                  </View>
                  <Text className="text-gray-900 font-semibold text-sm text-center">
                    {badge.name}
                  </Text>
                  <Text className="text-gray-500 text-xs text-center mt-1">
                    {badge.description}
                  </Text>
                </Card>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Interests */}
        {profile?.careerInterests && profile.careerInterests.length > 0 && (
          <View className="px-6 mb-6">
            <Text className="text-gray-900 text-xl font-bold mb-4">
              Mis intereses
            </Text>
            <Card className="bg-white">
              <View className="flex-row flex-wrap">
                {profile.careerInterests.map((interest, index) => (
                  <Badge
                    key={index}
                    label={interest}
                    variant="primary"
                    className="mr-2 mb-2"
                  />
                ))}
              </View>
            </Card>
          </View>
        )}

        {/* Rewards Section */}
        {gamificationData?.rewards?.certificatesAvailable?.length > 0 && (
          <View className="px-6 mb-6">
            <Text className="text-gray-900 text-xl font-bold mb-4">
              Recompensas disponibles
            </Text>
            {gamificationData.rewards.certificatesAvailable.map(
              (cert: any, index: number) => (
                <Card key={index} className="bg-white mb-3">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="text-gray-900 font-semibold text-base mb-1">
                        Certificado de Voluntariado
                      </Text>
                      <Text className="text-gray-600 text-sm">
                        {cert.hours} horas acumuladas
                      </Text>
                    </View>
                    <Button
                      title="Descargar"
                      size="sm"
                      onPress={() => Alert.alert("Descargando certificado...")}
                    />
                  </View>
                </Card>
              )
            )}
          </View>
        )}

        {/* Settings */}
        <View className="px-6 mb-6">
          <Text className="text-gray-900 text-xl font-bold mb-4">
            Configuración
          </Text>

          <Card className="bg-white">
            <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-gray-100">
              <View className="flex-row items-center">
                <Ionicons name="person-outline" size={24} color="#6b7280" />
                <Text className="text-gray-900 ml-3">Editar perfil</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#9ca3af" />
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-gray-100">
              <View className="flex-row items-center">
                <Ionicons
                  name="notifications-outline"
                  size={24}
                  color="#6b7280"
                />
                <Text className="text-gray-900 ml-3">Notificaciones</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#9ca3af" />
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-gray-100">
              <View className="flex-row items-center">
                <Ionicons
                  name="help-circle-outline"
                  size={24}
                  color="#6b7280"
                />
                <Text className="text-gray-900 ml-3">Ayuda y soporte</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#9ca3af" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleLogout}
              className="flex-row items-center justify-between py-4"
            >
              <View className="flex-row items-center">
                <Ionicons name="log-out-outline" size={24} color="#ef4444" />
                <Text className="text-danger-500 ml-3">Cerrar sesión</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#ef4444" />
            </TouchableOpacity>
          </Card>
        </View>

        {/* App Version */}
        <View className="px-6 pb-6 items-center">
          <Text className="text-gray-400 text-sm">ConnectU v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
