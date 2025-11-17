import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  TextInputProps,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  secureTextEntry?: boolean;
}

export default function Input({
  label,
  error,
  icon,
  secureTextEntry,
  className,
  ...props
}: InputProps) {
  const [isSecure, setIsSecure] = useState(secureTextEntry);

  return (
    <View className="mb-4">
      {label && (
        <Text className="text-gray-700 font-medium mb-2 text-base">
          {label}
        </Text>
      )}

      <View
        className={`flex-row items-center bg-gray-50 border ${
          error ? "border-danger-500" : "border-gray-200"
        } rounded-xl px-4`}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={error ? "#ef4444" : "#6b7280"}
            style={{ marginRight: 8 }}
          />
        )}

        <TextInput
          className={`flex-1 py-3 text-gray-900 text-base ${className || ""}`}
          placeholderTextColor="#9ca3af"
          secureTextEntry={isSecure}
          {...props}
        />

        {secureTextEntry && (
          <TouchableOpacity onPress={() => setIsSecure(!isSecure)}>
            <Ionicons
              name={isSecure ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#6b7280"
            />
          </TouchableOpacity>
        )}
      </View>

      {error && <Text className="text-danger-500 text-sm mt-1">{error}</Text>}
    </View>
  );
}
