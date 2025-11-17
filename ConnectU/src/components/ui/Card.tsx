import React from "react";
import { View, ViewProps } from "react-native";

interface CardProps extends ViewProps {
  variant?: "default" | "elevated" | "outlined";
}

export default function Card({
  children,
  variant = "default",
  className,
  ...props
}: CardProps) {
  const variantClasses = {
    default: "bg-white rounded-2xl p-4",
    elevated: "bg-white rounded-2xl p-4 shadow-lg",
    outlined: "bg-white rounded-2xl p-4 border border-gray-200",
  };

  return (
    <View
      className={`${variantClasses[variant]} ${className || ""}`}
      {...props}
    >
      {children}
    </View>
  );
}
