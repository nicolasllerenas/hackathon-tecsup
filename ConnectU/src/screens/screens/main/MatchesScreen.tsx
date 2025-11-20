import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useMatchStore } from "../../store/matchStore";
import Avatar from "../../components/ui/Avatar";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

type TabType = "active" | "pending";

export default function MatchesScreen() {
  const navigation = useNavigation<any>();
  const { matches, fetchMatches, isLoading } = useMatchStore();
  const [activeTab, setActiveTab] = useState<TabType>("active");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchMatches();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMatches();
    setRefreshing(false);
  };

  const activeMatches = matches.filter(
    (m) => m.status === "active" || m.status === "accepted"
  );
  const pendingMatches = matches.filter((m) => m.status === "pending");

  const displayedMatches =
    activeTab === "active" ? activeMatches : pendingMatches;

  if (isLoading && matches.length === 0) {
    return <LoadingSpinner message="Cargando matches..." />;
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-6 py-4 bg-white border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900 mb-4">
          Mis Matches
        </Text>

        {/* Tabs */}
        <View className="flex-row bg-gray-100 rounded-xl p-1">
          <TouchableOpacity
            onPress={() => setActiveTab("active")}
            className={`flex-1 py-2 rounded-lg ${
              activeTab === "active" ? "bg-white shadow-sm" : ""
            }`}
          >
            <Text
              className={`text-center font-semibold ${
                activeTab === "active" ? "text-primary-600" : "text-gray-600"
              }`}
            >
              Activos ({activeMatches.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab("pending")}
            className={`flex-1 py-2 rounded-lg ${
              activeTab === "pending" ? "bg-white shadow-sm" : ""
            }`}
          >
            <Text
              className={`text-center font-semibold ${
                activeTab === "pending" ? "text-primary-600" : "text-gray-600"
              }`}
            >
              Pendientes ({pendingMatches.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {displayedMatches.length === 0 ? (
          <View className="flex-1 items-center justify-center px-6 py-12">
            <Text className="text-6xl mb-4">
              {activeTab === "active" ? "💬" : "⏳"}
            </Text>
            <Text className="text-xl font-bold text-gray-900 mb-2 text-center">
              {activeTab === "active"
                ? "No tienes matches activos"
                : "No tienes solicitudes pendientes"}
            </Text>
            <Text className="text-gray-600 text-center">
              {activeTab === "active"
                ? "Ve a Descubrir para hacer nuevos matches"
                : "Tus solicitudes aparecerán aquí"}
            </Text>
          </View>
        ) : (
          <View className="px-6 py-4 space-y-3">
            {displayedMatches.map((match) => (
              <TouchableOpacity
                key={match.id}
                onPress={() =>
                  navigation.navigate("Chat", {
                    matchId: match.id,
                    otherUser: match.otherUser,
                  })
                }
              >
                <Card className="bg-white">
                  <View className="flex-row items-center">
                    <Avatar
                      imageUrl={match.otherUser.profileImage}
                      name={match.otherUser.firstName}
                      size="lg"
                    />

                    <View className="flex-1 ml-4">
                      <View className="flex-row items-center mb-1">
                        <Text className="text-gray-900 font-bold text-lg">
                          {match.otherUser.firstName}
                        </Text>
                        <Badge
                          label={`${match.compatibilityScore}%`}
                          variant="primary"
                          size="sm"
                          className="ml-2"
                        />
                      </View>

                      <Text className="text-gray-600 text-sm mb-2">
                        {match.otherUser.career} • {match.otherUser.semester}°
                        ciclo
                      </Text>

                      {match.lastMessage && (
                        <View className="flex-row items-center">
                          <Text
                            className="text-gray-500 text-sm flex-1"
                            numberOfLines={1}
                          >
                            {match.lastMessage.content}
                          </Text>
                          {!match.lastMessage.isRead && (
                            <View className="w-2 h-2 bg-primary-500 rounded-full ml-2" />
                          )}
                        </View>
                      )}

                      {match.upcomingSession && (
                        <View className="flex-row items-center mt-2 bg-primary-50 px-3 py-2 rounded-lg">
                          <Ionicons
                            name="calendar-outline"
                            size={16}
                            color="#0284c7"
                          />
                          <Text className="text-primary-700 text-sm ml-2">
                            Sesión:{" "}
                            {new Date(
                              match.upcomingSession.scheduledAt
                            ).toLocaleDateString("es-ES")}
                          </Text>
                        </View>
                      )}
                    </View>

                    <Ionicons
                      name="chevron-forward"
                      size={24}
                      color="#9ca3af"
                    />
                  </View>

                  {/* Stats */}
                  <View className="flex-row mt-4 pt-4 border-t border-gray-100">
                    <View className="flex-1 items-center">
                      <Text className="text-gray-500 text-xs mb-1">
                        Mensajes
                      </Text>
                      <Text className="text-gray-900 font-bold">
                        {match.stats.totalMessages}
                      </Text>
                    </View>
                    <View className="flex-1 items-center border-l border-gray-100">
                      <Text className="text-gray-500 text-xs mb-1">
                        Sesiones
                      </Text>
                      <Text className="text-gray-900 font-bold">
                        {match.stats.totalSessions}
                      </Text>
                    </View>
                    <View className="flex-1 items-center border-l border-gray-100">
                      <Text className="text-gray-500 text-xs mb-1">Match</Text>
                      <Text className="text-gray-900 font-bold">
                        {formatDistanceToNow(new Date(match.createdAt), {
                          addSuffix: true,
                          locale: es,
                        })}
                      </Text>
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
