import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../../store/authStore';
import { useMatchStore } from '../../../store/matchStore';
import Avatar from '../../../components/ui/Avatar';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import type { MainTabScreenProps } from '../../../types/navigation';

export default function HomeScreen({ navigation }: MainTabScreenProps<'Home'>) {
  const { user, profile } = useAuthStore();
  const { matches, fetchMatches } = useMatchStore();
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    fetchMatches();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMatches();
    setRefreshing(false);
  };

  const getRiskBadge = (score: number) => {
    if (score >= 70) return { label: "Alto", variant: "danger" as const };
    if (score >= 40) return { label: "Medio", variant: "warning" as const };
    return { label: "Bajo", variant: "success" as const };
  };

  const riskBadge = profile ? getRiskBadge(profile.riskScore) : null;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View className="bg-primary-500 px-6 pt-4 pb-8">
          <View className="flex-row items-center justify-between mb-6">
            <View>
              <Text className="text-white text-2xl font-bold">
                Hola, {user?.firstName}! 👋
              </Text>
              <Text className="text-blue-100 text-base mt-1">
                {user?.career} • {user?.semester}° ciclo
              </Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
              <Avatar
                imageUrl={user?.profileImage}
                name={`${user?.firstName} ${user?.lastName}`}
                size="lg"
              />
            </TouchableOpacity>
          </View>

          {/* Risk Score Card */}
          {profile && riskBadge && (
            <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-white text-sm mb-1">
                    Riesgo académico
                  </Text>
                  <Text className="text-white text-3xl font-bold">
                    {profile.riskScore}%
                  </Text>
                </View>
                <Badge label={riskBadge.label} variant={riskBadge.variant} />
              </View>

              {profile.riskFactors.length > 0 && (
                <View className="mt-4 pt-4 border-t border-white/20">
                  <Text className="text-blue-100 text-sm mb-2">
                    Principal factor:
                  </Text>
                  <Text className="text-white text-base">
                    {profile.riskFactors[0].description}
                  </Text>
                </View>
              )}
            </Card>
          )}
        </View>

        {/* Quick Actions */}
        <View className="px-6 -mt-4 mb-6">
          <View className="flex-row space-x-3">
            <TouchableOpacity
              onPress={() => navigation.navigate("Matching")}
              className="flex-1 bg-white rounded-2xl p-4 shadow-sm flex-row items-center"
            >
              <View className="w-10 h-10 bg-primary-100 rounded-full items-center justify-center mr-3">
                <Ionicons name="people" size={20} color="#0284c7" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-semibold text-sm">
                  Buscar mentor
                </Text>
                <Text className="text-gray-500 text-xs">
                  {matches.length} disponibles
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("Matches")}
              className="flex-1 bg-white rounded-2xl p-4 shadow-sm flex-row items-center"
            >
              <View className="w-10 h-10 bg-success-100 rounded-full items-center justify-center mr-3">
                <Ionicons name="chatbubbles" size={20} color="#10b981" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-semibold text-sm">
                  Mis matches
                </Text>
                <Text className="text-gray-500 text-xs">
                  {matches.filter((m) => m.status === "active").length} activos
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Section */}
        <View className="px-6 mb-6">
          <Text className="text-gray-900 text-xl font-bold mb-4">
            Tu progreso
          </Text>

          <View className="flex-row space-x-3 mb-3">
            <Card className="flex-1 bg-white">
              <Text className="text-gray-500 text-sm mb-1">Nivel</Text>
              <Text className="text-gray-900 text-2xl font-bold">
                {profile?.level || 1}
              </Text>
            </Card>

            <Card className="flex-1 bg-white">
              <Text className="text-gray-500 text-sm mb-1">Puntos</Text>
              <Text className="text-gray-900 text-2xl font-bold">
                {profile?.points || 0}
              </Text>
            </Card>

            <Card className="flex-1 bg-white">
              <Text className="text-gray-500 text-sm mb-1">Badges</Text>
              <Text className="text-gray-900 text-2xl font-bold">
                {profile?.badges.length || 0}
              </Text>
            </Card>
          </View>
        </View>

        {/* Active Matches Preview */}
        {matches.filter((m) => m.status === "active").length > 0 && (
          <View className="px-6 mb-6">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-gray-900 text-xl font-bold">
                Conexiones activas
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Matches")}>
                <Text className="text-primary-500 font-medium">Ver todas</Text>
              </TouchableOpacity>
            </View>

            {matches
              .filter((m) => m.status === "active")
              .slice(0, 3)
              .map((match) => (
                <Card key={match.id} className="bg-white mb-3">
                  <View className="flex-row items-center">
                    <Avatar
                      imageUrl={match.otherUser.profileImage}
                      name={match.otherUser.firstName}
                      size="md"
                    />
                    <View className="flex-1 ml-3">
                      <Text className="text-gray-900 font-semibold text-base">
                        {match.otherUser.firstName}
                      </Text>
                      <Text className="text-gray-500 text-sm">
                        {match.otherUser.career} • {match.otherUser.semester}°
                        ciclo
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("Chat", {
                          matchId: match.id,
                          otherUser: match.otherUser,
                        })
                      }
                    >
                      <Ionicons
                        name="chatbubble-outline"
                        size={24}
                        color="#0284c7"
                      />
                    </TouchableOpacity>
                  </View>
                </Card>
              ))}
          </View>
        )}

        {/* Interests Section */}
        {profile?.careerInterests && profile.careerInterests.length > 0 && (
          <View className="px-6 mb-6">
            <Text className="text-gray-900 text-xl font-bold mb-4">
              Tus intereses
            </Text>
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
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
                    