import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { sessionsAPI } from '../../api/endpoints';
import Avatar from '../../components/ui/Avatar';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import type { Session } from '../../api/types';
import { format, isPast, isFuture } from 'date-fns';
import { es } from 'date-fns/locale';

type TabType = 'upcoming' | 'completed';

export default function SessionsScreen({ navigation }: any) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<TabType>("upcoming");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadSessions();
  }, [activeTab]);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const response = await sessionsAPI.getSessions(activeTab);
      setSessions(response.data.sessions);
      setStats(response.data.stats);
    } catch (error) {
      console.error("Error loading sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSessions();
    setRefreshing(false);
  };

  const handleCancelSession = (sessionId: string) => {
    Alert.alert(
      "Cancelar sesión",
      "¿Estás seguro? El otro participante será notificado.",
      [
        { text: "No", style: "cancel" },
        {
          text: "Sí, cancelar",
          style: "destructive",
          onPress: async () => {
            try {
              await sessionsAPI.cancelSession(sessionId, "Motivo personal");
              Alert.alert("✅ Sesión cancelada");
              loadSessions();
            } catch (error) {
              Alert.alert("Error", "No se pudo cancelar la sesión");
            }
          },
        },
      ]
    );
  };

  const handleCompleteSession = (sessionId: string) => {
    Alert.alert("Completar sesión", "¿Cómo estuvo la sesión?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Calificar",
        onPress: () => {
          // Navigate to rating screen (implement later)
          Alert.alert("Feature coming soon");
        },
      },
    ]);
  };

  if (loading && sessions.length === 0) {
    return <LoadingSpinner message="Cargando sesiones..." />;
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-6 py-4 bg-white border-b border-gray-200">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mb-4">
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>

        <Text className="text-2xl font-bold text-gray-900 mb-4">
          Mis Sesiones
        </Text>

        {/* Stats */}
        {stats && (
          <View className="flex-row space-x-3 mb-4">
            <View className="flex-1 bg-primary-50 rounded-xl p-3">
              <Text className="text-primary-700 font-bold text-lg">
                {stats.upcoming}
              </Text>
              <Text className="text-gray-600 text-xs">Próximas</Text>
            </View>
            <View className="flex-1 bg-success-50 rounded-xl p-3">
              <Text className="text-success-700 font-bold text-lg">
                {stats.completed}
              </Text>
              <Text className="text-gray-600 text-xs">Completadas</Text>
            </View>
            <View className="flex-1 bg-warning-50 rounded-xl p-3">
              <Text className="text-warning-700 font-bold text-lg">
                {stats.totalHours}h
              </Text>
              <Text className="text-gray-600 text-xs">Total</Text>
            </View>
          </View>
        )}

        {/* Tabs */}
        <View className="flex-row bg-gray-100 rounded-xl p-1">
          <TouchableOpacity
            onPress={() => setActiveTab("upcoming")}
            className={`flex-1 py-2 rounded-lg ${
              activeTab === "upcoming" ? "bg-white shadow-sm" : ""
            }`}
          >
            <Text
              className={`text-center font-semibold ${
                activeTab === "upcoming" ? "text-primary-600" : "text-gray-600"
              }`}
            >
              Próximas
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab("completed")}
            className={`flex-1 py-2 rounded-lg ${
              activeTab === "completed" ? "bg-white shadow-sm" : ""
            }`}
          >
            <Text
              className={`text-center font-semibold ${
                activeTab === "completed" ? "text-primary-600" : "text-gray-600"
              }`}
            >
              Completadas
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
        {sessions.length === 0 ? (
          <View className="flex-1 items-center justify-center px-6 py-12">
            <Text className="text-6xl mb-4">
              {activeTab === "upcoming" ? "📅" : "✅"}
            </Text>
            <Text className="text-xl font-bold text-gray-900 mb-2 text-center">
              {activeTab === "upcoming"
                ? "No tienes sesiones programadas"
                : "No has completado sesiones aún"}
            </Text>
            <Text className="text-gray-600 text-center">
              {activeTab === "upcoming"
                ? "Agenda una sesión con tus matches"
                : "Tus sesiones completadas aparecerán aquí"}
            </Text>
          </View>
        ) : (
          <View className="px-6 py-4 space-y-3">
            {sessions.map((session) => {
              const sessionDate = new Date(session.scheduledAt);
              const isUpcoming = isFuture(sessionDate);
              const match = session.match; // Assuming match data is included

              return (
                <Card key={session.id} className="bg-white">
                  {/* Header */}
                  <View className="flex-row items-center mb-4">
                    <Avatar
                      imageUrl={match?.otherUser?.profileImage}
                      name={match?.otherUser?.firstName || "Usuario"}
                      size="md"
                    />
                    <View className="flex-1 ml-3">
                      <Text className="text-gray-900 font-bold text-base">
                        {session.title}
                      </Text>
                      <Text className="text-gray-600 text-sm">
                        con {match?.otherUser?.firstName}
                      </Text>
                    </View>
                    {session.status === "completed" && session.rating && (
                      <View className="flex-row items-center">
                        <Ionicons name="star" size={16} color="#f59e0b" />
                        <Text className="text-warning-600 font-bold ml-1">
                          {session.rating}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Date & Time */}
                  <View className="flex-row items-center mb-3">
                    <View className="flex-1 flex-row items-center">
                      <Ionicons
                        name="calendar-outline"
                        size={18}
                        color="#6b7280"
                      />
                      <Text className="text-gray-700 ml-2">
                        {format(sessionDate, "EEEE, dd 'de' MMMM", {
                          locale: es,
                        })}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row items-center mb-4">
                    <View className="flex-1 flex-row items-center">
                      <Ionicons name="time-outline" size={18} color="#6b7280" />
                      <Text className="text-gray-700 ml-2">
                        {format(sessionDate, "HH:mm")} ({session.duration} min)
                      </Text>
                    </View>
                  </View>

                  {/* Description */}
                  {session.description && (
                    <View className="bg-gray-50 rounded-xl p-3 mb-4">
                      <Text className="text-gray-700 text-sm">
                        {session.description}
                      </Text>
                    </View>
                  )}

                  {/* Feedback (if completed) */}
                  {session.status === "completed" && session.feedback && (
                    <View className="border-t border-gray-100 pt-3 mb-3">
                      <Text className="text-gray-500 text-xs mb-2">
                        Feedback:
                      </Text>
                      <Text className="text-gray-700 text-sm italic">
                        "{session.feedback}"
                      </Text>
                    </View>
                  )}

                  {/* Actions */}
                  {activeTab === "upcoming" && (
                    <View className="flex-row space-x-2">
                      <Button
                        title="Cancelar"
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onPress={() => handleCancelSession(session.id)}
                      />
                      {session.calendarLink && (
                        <Button
                          title="Ver en calendario"
                          variant="primary"
                          size="sm"
                          className="flex-1"
                          onPress={() => {
                            // Open calendar link
                            Alert.alert("Abriendo calendario...");
                          }}
                        />
                      )}
                    </View>
                  )}

                  {activeTab === "completed" && !session.rating && (
                    <Button
                      title="Calificar sesión"
                      variant="primary"
                      size="sm"
                      onPress={() => handleCompleteSession(session.id)}
                    />
                  )}

                  {/* Status Badge */}
                  <View className="absolute top-4 right-4">
                    <Badge
                      label={
                        session.status === "scheduled"
                          ? "Programada"
                          : session.status === "completed"
                          ? "Completada"
                          : "Cancelada"
                      }
                      variant={
                        session.status === "scheduled"
                          ? "primary"
                          : session.status === "completed"
                          ? "success"
                          : "gray"
                      }
                      size="sm"
                    />
                  </View>
                </Card>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}