import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { useAuthStore } from '../../../store/authStore';
import type { AuthScreenProps } from '../../../types/navigation';

export default function EmailVerificationScreen({ 
  navigation 
}: AuthScreenProps<'EmailVerification'>) {
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);

  const codeInputs = useRef<Array<TextInput | null>>([]);

  const { sendVerificationCode, verifyCode } = useAuthStore();

  const handleSendCode = async () => {
    if (!email.endsWith(".edu.pe")) {
      Alert.alert("Error", "Usa tu email institucional (.edu.pe)");
      return;
    }

    setLoading(true);
    try {
      await sendVerificationCode(email);
      setStep("code");
      Alert.alert("✅ Código enviado", `Revisa tu correo ${email}`, [
        { text: "OK" },
      ]);
    } catch (error) {
      Alert.alert("Error", "No se pudo enviar el código");
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (value: string, index: number) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus siguiente input
    if (value && index < 5) {
      codeInputs.current[index + 1]?.focus();
    }

    // Auto-submit cuando completa
    if (index === 5 && value) {
      handleVerifyCode(newCode.join(""));
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !code[index] && index > 0) {
      codeInputs.current[index - 1]?.focus();
    }
  };

  const handleVerifyCode = async (codeString: string) => {
    if (codeString.length !== 6) return;

    setLoading(true);
    try {
      await verifyCode(email, codeString);
      // El store maneja la navegación automáticamente
      navigation.navigate("OnboardingStep1");
    } catch (error) {
      Alert.alert("Error", "Código inválido. Intenta nuevamente.");
      setCode(["", "", "", "", "", ""]);
      codeInputs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView className="flex-1">
          <View className="px-6 pt-4">
            {/* Back Button */}
            {step === "code" && (
              <TouchableOpacity
                onPress={() => setStep("email")}
                className="mb-6"
              >
                <Ionicons name="arrow-back" size={24} color="#111827" />
              </TouchableOpacity>
            )}

            {/* Header */}
            <View className="mb-8">
              <Text className="text-3xl font-bold text-gray-900 mb-2">
                {step === "email" ? "Bienvenido" : "Verifica tu código"}
              </Text>
              <Text className="text-gray-600 text-base">
                {step === "email"
                  ? "Ingresa tu email institucional para continuar"
                  : `Enviamos un código de 6 dígitos a ${email}`}
              </Text>
            </View>

            {/* Email Step */}
            {step === "email" && (
              <>
                <Input
                  label="Email institucional"
                  placeholder="ejemplo@utec.edu.pe"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  icon="mail-outline"
                />

                <Text className="text-gray-500 text-sm mb-6">
                  Solo aceptamos emails institucionales terminados en .edu.pe
                </Text>

                <Button
                  title="Enviar código"
                  onPress={handleSendCode}
                  loading={loading}
                  disabled={!email || loading}
                  size="lg"
                />
              </>
            )}

            {/* Code Step */}
            {step === "code" && (
              <>
                <View className="flex-row justify-between mb-8">
                  {code.map((digit, index) => (
                    <TextInput
                      key={index}
                      ref={(ref) => (codeInputs.current[index] = ref)}
                      className="w-12 h-14 bg-gray-50 border-2 border-gray-200 rounded-xl text-center text-2xl font-bold text-gray-900"
                      value={digit}
                      onChangeText={(value) => handleCodeChange(value, index)}
                      onKeyPress={({ nativeEvent }) =>
                        handleKeyPress(nativeEvent.key, index)
                      }
                      keyboardType="number-pad"
                      maxLength={1}
                      selectTextOnFocus
                    />
                  ))}
                </View>

                <TouchableOpacity
                  onPress={handleSendCode}
                  className="items-center mb-6"
                >
                  <Text className="text-primary-500 font-medium">
                    Reenviar código
                  </Text>
                </TouchableOpacity>

                <Button
                  title="Verificar"
                  onPress={() => handleVerifyCode(code.join(""))}
                  loading={loading}
                  disabled={code.join("").length !== 6 || loading}
                  size="lg"
                />
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}