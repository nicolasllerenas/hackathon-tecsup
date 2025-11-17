import React from "react";
import { View, Image, Text } from "react-native";

interface AvatarProps {
  imageUrl?: string;
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function Avatar({ imageUrl, name, size = "md" }: AvatarProps) {
  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
    xl: "text-3xl",
  };

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <View
      className={`${sizeClasses[size]} rounded-full overflow-hidden bg-primary-100 items-center justify-center`}
    >
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          className="w-full h-full"
          resizeMode="cover"
        />
      ) : (
        <Text className={`${textSizeClasses[size]} font-bold text-primary-600`}>
          {getInitials(name)}
        </Text>
      )}
    </View>
  );
}
