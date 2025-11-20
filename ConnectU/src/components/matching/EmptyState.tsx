import React from "react";
import { View, Text } from "react-native";
import Button from "../ui/Button";

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-6">
      <Text className="text-6xl mb-4">{icon}</Text>
      <Text className="text-2xl font-bold text-gray-900 mb-2 text-center">
        {title}
      </Text>
      <Text className="text-gray-600 text-center mb-6">{description}</Text>
      {actionLabel && onAction && (
        <Button title={actionLabel} onPress={onAction} />
      )}
    </View>
  );
}
