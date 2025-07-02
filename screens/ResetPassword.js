// screens/ResetPassword.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { firebase } from "../firebaseConfig";
import { useColorScheme } from "react-native";
import { createGlobalStyles, colors } from "../styles/globalStyles";

export default function ResetPassword({ navigation }) {
  const theme = useColorScheme() ?? "light";
  const globalStyles = createGlobalStyles(theme);

  const [email, setEmail] = useState("");

  const handleReset = async () => {
    if (!email) {
      Alert.alert("Erro", "Insere um e-mail válido.");
      return;
    }

    try {
      await firebase.auth().sendPasswordResetEmail(email);
      Alert.alert("Sucesso", "Email de recuperação enviado.");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Erro", error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={globalStyles.container}
    >
      <Text style={globalStyles.title}>🔐 Recuperar Palavra-passe</Text>
      <TextInput
        placeholder="Insere o teu e-mail"
        placeholderTextColor={colors[theme].textLight}
        value={email}
        onChangeText={setEmail}
        style={globalStyles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TouchableOpacity style={globalStyles.button} onPress={handleReset}>
        <Text style={globalStyles.buttonText}>Enviar Instruções</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}