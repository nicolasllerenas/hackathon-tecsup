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
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuthStore } from '../../store/authStore';
import type { AuthScreenProps } from '../../types/navigation';

export default function EmailVerificationScreen({ 
  navigation 
}: AuthScreenProps<'EmailVerification'>) {
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  
  const codeInputs = useRef<Array<TextInput | null>>([]);
  
  const { sendVerificationCode, verifyCode } = useAuthStore();

  const handleSendCode = async () => {
    if (!email.endsWith('.edu.pe')) {
      Alert.alert('Error', 'Usa tu email institucional (.edu.pe)');
      return;
    }

    setLoading(true);
    try {
      await sendVerificationCode(email);
      setStep('code');
      Alert.alert(
        '✅ Código enviado',
        `Revisa tu correo ${email}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo enviar el código');
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
      handle