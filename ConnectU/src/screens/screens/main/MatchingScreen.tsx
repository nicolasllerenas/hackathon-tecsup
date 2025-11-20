import React, { useEffect, useState } from "react";
import { View, Text, Alert, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  runOnJS,
  interpolate,
} from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { useMatchStore } from "../../../store/matchStore";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import Button from "../../../components/ui/Button";
import Avatar from "../../../components/ui/Avatar";
import Badge from "../../../components/ui/Badge";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

export default function MatchingScreen() {
  const { candidates, isLoading, fetchCandidates, swipeRight, swipeLeft } =
    useMatchStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMatchModal, setShowMatchModal] = useState(false);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const currentCandidate = candidates[currentIndex];
  const hasMoreCandidates = currentIndex < candidates.length - 1;

  const handleSwipe = async (direction: "left" | "right") => {
    if (!currentCandidate) return;

    try {
      if (direction === "right") {
        await swipeRight(currentCandidate.id);
        setShowMatchModal(true);
        setTimeout(() => {
          setShowMatchModal(false);
          setCurrentIndex((prev) => prev + 1);
        }, 2000);
      } else {
        await swipeLeft(currentCandidate.id);
        setCurrentIndex((prev) => prev + 1);
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo procesar el swipe");
    }
  };

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startX = translateX.value;
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      translateX.value = ctx.startX + event.translationX;
      translateY.value = ctx.startY + event.translationY;
    },
    onEnd: (event) => {
      const shouldSwipeRight = translateX.value > SWIPE_THRESHOLD;
      const shouldSwipeLeft = translateX.value < -SWIPE_THRESHOLD;

      if (shouldSwipeRight) {
        translateX.value = withSpring(SCREEN_WIDTH * 1.5);
        runOnJS(handleSwipe)("right");
      } else if (shouldSwipeLeft) {
        translateX.value = withSpring(-SCREEN_WIDTH * 1.5);
        runOnJS(handleSwipe)("left");
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    },
  });

  const cardStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      [-30, 0, 30]
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
      ],
    };
  });

  const likeStyle = useAnimatedStyle(() => {
    const opacity = interpolate(translateX.value, [0, SWIPE_THRESHOLD], [0, 1]);

    return { opacity };
  });

  const nopeStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [-SWIPE_THRESHOLD, 0],
      [1, 0]
    );

    return { opacity };
  });

  if (isLoading) {
    return <LoadingSpinner message="Buscando matches perfectos..." />;
  }

  if (!currentCandidate || !hasMoreCandidates) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center px-6">
        <Text className="text-6xl mb-4">🎉</Text>
        <Text className="text-2xl font-bold text-gray-900 mb-2 text-center">
          ¡Revisaste todos los perfiles!
        </Text>
        <Text className="text-gray-600 text-center mb-6">
          Vuelve mañana para ver nuevos candidatos
        </Text>
        <Button
          title="Refrescar"
          onPress={() => {
            setCurrentIndex(0);
            fetchCandidates();
          }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-6 py-4">
        <Text className="text-2xl font-bold text-gray-900">Descubre</Text>
        <Text className="text-gray-600">
          {candidates.length - currentIndex} perfiles disponibles
        </Text>
      </View>

      {/* Card Stack */}
      <View className="flex-1 items-center justify-center px-6">
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={[cardStyle]} className="w-full max-w-sm">
            {/* Like Indicator */}
            <Animated.View
              style={[likeStyle]}
              className="absolute top-12 right-12 bg-success-500 px-6 py-3 rounded-2xl rotate-12 z-10"
            >
              <Text className="text-white text-2xl font-bold">ME GUSTA</Text>
            </Animated.View>

            {/* Nope Indicator */}
            <Animated.View
              style={[nopeStyle]}
              className="absolute top-12 left-12 bg-danger-500 px-6 py-3 rounded-2xl -rotate-12 z-10"
            >
              <Text className="text-white text-2xl font-bold">NO INTERESA</Text>
            </Animated.View>

            {/* Card Content */}
            <View className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              {/* Image/Avatar Section */}
              <View className="h-80 bg-gradient-to-br from-primary-400 to-primary-600 items-center justify-center">
                <Avatar
                  imageUrl={currentCandidate.user.profileImage}
                  name={currentCandidate.user.firstName}
                  size="xl"
                />
              </View>

              {/* Info Section */}
              <View className="p-6">
                {/* Name & Score */}
                <View className="flex-row items-center justify-between mb-4">
                  <View className="flex-1">
                    <Text className="text-2xl font-bold text-gray-900">
                      {currentCandidate.user.firstName},{" "}
                      {currentCandidate.user.semester}° ciclo
                    </Text>
                    <Text className="text-gray-600 text-base">
                      {currentCandidate.user.career}
                    </Text>
                  </View>
                  <View className="bg-primary-100 px-4 py-2 rounded-full">
                    <Text className="text-primary-700 font-bold text-lg">
                      {currentCandidate.compatibilityScore}% ⭐
                    </Text>
                  </View>
                </View>

                {/* Bio */}
                {currentCandidate.user.bio && (
                  <Text className="text-gray-700 mb-4">
                    {currentCandidate.user.bio}
                  </Text>
                )}

                {/* Common Interests */}
                {currentCandidate.commonInterests.length > 0 && (
                  <View className="mb-4">
                    <Text className="text-gray-500 text-sm mb-2">
                      Intereses en común
                    </Text>
                    <View className="flex-row flex-wrap">
                      {currentCandidate.commonInterests.map(
                        (interest, index) => (
                          <Badge
                            key={index}
                            label={interest}
                            variant="primary"
                            className="mr-2 mb-2"
                          />
                        )
                      )}
                    </View>
                  </View>
                )}

                {/* Match Reasons */}
                <View className="bg-gray-50 rounded-xl p-4">
                  <Text className="text-gray-700 font-semibold mb-2">
                    Por qué es tu match:
                  </Text>
                  {currentCandidate.matchReasons
                    .slice(0, 3)
                    .map((reason, index) => (
                      <View key={index} className="flex-row items-start mb-2">
                        <Ionicons
                          name="checkmark-circle"
                          size={20}
                          color="#10b981"
                        />
                        <Text className="text-gray-700 ml-2 flex-1">
                          {reason}
                        </Text>
                      </View>
                    ))}
                </View>

                {/* Mentor Stats */}
                {currentCandidate.mentorStats && (
                  <View className="flex-row mt-4 space-x-3">
                    <View className="flex-1 bg-success-50 rounded-xl p-3">
                      <Text className="text-success-700 font-bold text-lg">
                        {currentCandidate.mentorStats.successRate}%
                      </Text>
                      <Text className="text-gray-600 text-xs">
                        Tasa de éxito
                      </Text>
                    </View>
                    <View className="flex-1 bg-warning-50 rounded-xl p-3">
                      <Text className="text-warning-700 font-bold text-lg">
                        {currentCandidate.mentorStats.avgRating.toFixed(1)} ⭐
                      </Text>
                      <Text className="text-gray-600 text-xs">
                        Rating promedio
                      </Text>
                    </View>
                    <View className="flex-1 bg-primary-50 rounded-xl p-3">
                      <Text className="text-primary-700 font-bold text-lg">
                        {currentCandidate.mentorStats.totalSessions}
                      </Text>
                      <Text className="text-gray-600 text-xs">Sesiones</Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          </Animated.View>
        </PanGestureHandler>

        {/* Action Buttons */}
        <View className="flex-row items-center justify-center mt-6 space-x-6">
          <Button
            title=""
            onPress={() => {
              translateX.value = withSpring(-SCREEN_WIDTH * 1.5);
              handleSwipe("left");
            }}
            variant="outline"
            className="w-16 h-16 rounded-full border-danger-500"
            icon={<Ionicons name="close" size={32} color="#ef4444" />}
          />

          <Button
            title=""
            onPress={() => {
              translateX.value = withSpring(SCREEN_WIDTH * 1.5);
              handleSwipe("right");
            }}
            variant="primary"
            className="w-20 h-20 rounded-full"
            icon={<Ionicons name="heart" size={36} color="#ffffff" />}
          />
        </View>
      </View>

      {/* Match Modal */}
      {showMatchModal && (
        <View className="absolute inset-0 bg-black/80 items-center justify-center">
          <View className="bg-white rounded-3xl p-8 mx-6 items-center">
            <Text className="text-6xl mb-4">🎉</Text>
            <Text className="text-2xl font-bold text-gray-900 mb-2">
              ¡Es un Match!
            </Text>
            <Text className="text-gray-600 text-center mb-6">
              Tú y {currentCandidate.user.firstName} pueden conectar ahora
            </Text>
            <Avatar
              imageUrl={currentCandidate.user.profileImage}
              name={currentCandidate.user.firstName}
              size="xl"
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
