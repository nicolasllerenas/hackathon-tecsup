import React from "react";
import { View, Text } from "react-native";

interface BadgeProps {
  label: string;
  variant?: "primary" | "success" | "warning" | "danger" | "gray";
  size?: "sm" | "md";
}

export default function Badge({
  label,
  variant = "primary",
  size = "md",
}: BadgeProps) {
  const variantClasses = {
    primary: "bg-primary-100 text-primary-700",
    success: "bg-success-100 text-success-700",
    warning: "bg-warning-100 text-warning-700",
    danger: "bg-danger-100 text-danger-700",
    gray: "bg-gray-100 text-gray-700",
  };

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm",
  };

  return (
    <View
      className={`rounded-full ${variantClasses[variant].split(" ")[0]} ${
        sizeClasses[size].split(" ")[0]
      } ${sizeClasses[size].split(" ")[1]}`}
    >
      <Text
        className={`font-medium ${variantClasses[variant].split(" ")[1]} ${
          sizeClasses[size].split(" ")[2]
        }`}
      >
        {label}
      </Text>
    </View>
  );
}
