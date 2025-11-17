import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TouchableOpacityProps,
} from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
}

export default function Button({
  title,
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  icon,
  className,
  ...props
}: ButtonProps) {
  const baseClasses = "rounded-xl flex-row items-center justify-center";

  const variantClasses = {
    primary: "bg-primary-500",
    secondary: "bg-secondary-500",
    outline: "bg-transparent border-2 border-primary-500",
    danger: "bg-danger-500",
  };

  const sizeClasses = {
    sm: "px-4 py-2",
    md: "px-6 py-3",
    lg: "px-8 py-4",
  };

  const textColorClasses = {
    primary: "text-white",
    secondary: "text-white",
    outline: "text-primary-500",
    danger: "text-white",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const disabledClasses = disabled || loading ? "opacity-50" : "";

  return (
    <TouchableOpacity
      className={`${baseClasses} ${variantClasses[variant]} ${
        sizeClasses[size]
      } ${disabledClasses} ${className || ""}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "outline" ? "#0284c7" : "#ffffff"}
        />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text
            className={`font-semibold ${textColorClasses[variant]} ${
              textSizeClasses[size]
            } ${icon ? "ml-2" : ""}`}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}
