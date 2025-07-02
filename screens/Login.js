// screens/Login.js
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
import { signIn } from "../services/firebaseAuth";
import { useAuth } from "../context/AuthContext";
import { useColorScheme } from "react-native"; // para detectar o modo escuro
import { createGlobalStyles, colors } from "../styles/globalStyles";

export default function Login({ navigation }) {
  const theme = useColorScheme() ?? "light"; // define o tema atual
  const globalStyles = createGlobalStyles(theme); // cria os estilos com base no tema

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user } = useAuth();

  const handleLogin = async () => {
    try {
      await signIn(email, password);
    } catch (error) {
      Alert.alert("Erro no Login", error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={globalStyles.container}
    >
      <Text style={globalStyles.title}>Bem-vindo de volta 👋</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor={colors[theme].textLight}
        value={email}
        onChangeText={setEmail}
        style={globalStyles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor={colors[theme].textLight}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={globalStyles.input}
      />

      <TouchableOpacity style={globalStyles.button} onPress={handleLogin}>
        <Text style={globalStyles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
        <Text style={globalStyles.linkText}>
          Ainda não tens conta?{" "}
          <Text style={globalStyles.linkHighlight}>Regista-te aqui</Text>
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("ResetPassword")}>
        <Text style={globalStyles.linkText}>
          Esqueceste a palavra-passe?{" "}
          <Text style={globalStyles.linkHighlight}>Recuperar</Text>
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}