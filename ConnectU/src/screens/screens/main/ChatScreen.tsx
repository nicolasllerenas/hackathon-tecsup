import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { chatAPI } from "../../api/endpoints";
import Avatar from "../../components/ui/Avatar";
import Button from "../../components/ui/Button";
import type { Message } from "../../api/types";
import type { MainStackScreenProps } from "../../types/navigation";
import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export default function ChatScreen({
  route,
  navigation,
}: MainStackScreenProps<"Chat">) {
  const { matchId, otherUser } = route.params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadMessages();

    // Poll for new messages every 3 seconds
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, [matchId]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const response = await chatAPI.getMessages(matchId);
      setMessages(response.data.messages.reverse());

      // Mark as read
      const unreadIds = response.data.messages
        .filter((m) => !m.isRead && m.senderId !== "current-user-id")
        .map((m) => m.id);

      if (unreadIds.length > 0) {
        await chatAPI.markAsRead(matchId, unreadIds);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    const messageContent = newMessage.trim();
    setNewMessage("");
    setSending(true);

    try {
      const response = await chatAPI.sendMessage(matchId, messageContent);
      setMessages((prev) => [...prev, response.data.data!.message]);

      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      Alert.alert("Error", "No se pudo enviar el mensaje");
      setNewMessage(messageContent);
    } finally {
      setSending(false);
    }
  };

  const handleScheduleSession = () => {
    Alert.alert("Agendar sesión", "¿Quieres agendar una sesión de mentoría?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Agendar",
        onPress: () => navigation.navigate("Sessions"),
      },
    ]);
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMyMessage = item.senderId === "current-user-id"; // Replace with actual user ID
    const messageDate = new Date(item.createdAt);
    const isToday = messageDate.toDateString() === new Date().toDateString();

    return (
      <View className={`mb-3 ${isMyMessage ? "items-end" : "items-start"}`}>
        <View
          className={`max-w-[75%] px-4 py-3 rounded-2xl ${
            isMyMessage
              ? "bg-primary-500 rounded-br-sm"
              : "bg-gray-200 rounded-bl-sm"
          }`}
        >
          {item.messageType === "calendar_invite" ? (
            <View>
              <View className="flex-row items-center mb-2">
                <Ionicons
                  name="calendar"
                  size={16}
                  color={isMyMessage ? "#ffffff" : "#374151"}
                />
                <Text
                  className={`ml-2 font-semibold ${
                    isMyMessage ? "text-white" : "text-gray-900"
                  }`}
                >
                  Invitación de sesión
                </Text>
              </View>
              <Text className={isMyMessage ? "text-white" : "text-gray-900"}>
                {item.content}
              </Text>
              {item.metadata && (
                <Text
                  className={`text-sm mt-1 ${
                    isMyMessage ? "text-blue-100" : "text-gray-600"
                  }`}
                >
                  {format(
                    new Date(item.metadata.scheduledAt),
                    "dd/MM/yyyy 'a las' HH:mm",
                    { locale: es }
                  )}
                </Text>
              )}
            </View>
          ) : (
            <Text className={isMyMessage ? "text-white" : "text-gray-900"}>
              {item.content}
            </Text>
          )}
        </View>

        <Text className="text-xs text-gray-500 mt-1 px-1">
          {isToday
            ? format(messageDate, "HH:mm")
            : format(messageDate, "dd/MM HH:mm")}
        </Text>
      </View>
    );
  };

  const renderDateSeparator = (date: Date) => {
    const isToday = date.toDateString() === new Date().toDateString();
    const isYesterday =
      new Date(date).toDateString() ===
      new Date(Date.now() - 86400000).toDateString();

    let label = format(date, "dd MMMM yyyy", { locale: es });
    if (isToday) label = "Hoy";
    if (isYesterday) label = "Ayer";

    return (
      <View className="items-center my-4">
        <View className="bg-gray-200 px-4 py-2 rounded-full">
          <Text className="text-gray-600 text-xs font-medium">{label}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={90}
      >
        {/* Header Actions */}
        <View className="px-4 py-3 border-b border-gray-200 bg-white">
          <TouchableOpacity
            onPress={handleScheduleSession}
            className="flex-row items-center justify-center bg-primary-50 py-3 rounded-xl"
          >
            <Ionicons name="calendar-outline" size={20} color="#0284c7" />
            <Text className="text-primary-600 font-semibold ml-2">
              Agendar sesión de mentoría
            </Text>
          </TouchableOpacity>
        </View>

        {/* Messages List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerClassName="px-4 py-4"
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-12">
              <Text className="text-4xl mb-3">💬</Text>
              <Text className="text-gray-600 text-center">
                Comienza la conversación con {otherUser.firstName}
              </Text>
            </View>
          }
        />

        {/* Input Area */}
        <View className="px-4 py-3 border-t border-gray-200 bg-white">
          <View className="flex-row items-center">
            <View className="flex-1 bg-gray-100 rounded-full px-4 py-2 mr-2">
              <TextInput
                value={newMessage}
                onChangeText={setNewMessage}
                placeholder="Escribe un mensaje..."
                placeholderTextColor="#9ca3af"
                multiline
                maxLength={500}
                className="text-gray-900 max-h-24"
              />
            </View>

            <TouchableOpacity
              onPress={handleSend}
              disabled={!newMessage.trim() || sending}
              className={`w-12 h-12 rounded-full items-center justify-center ${
                newMessage.trim() ? "bg-primary-500" : "bg-gray-300"
              }`}
            >
              <Ionicons name="send" size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
