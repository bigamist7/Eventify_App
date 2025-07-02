// screens/Signup.js
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
import { signUp } from "../services/firebaseAuth";
import { useColorScheme } from "react-native";
import { createGlobalStyles, colors } from "../styles/globalStyles";

export default function Signup({ navigation }) {
  const theme = useColorScheme() ?? "light";
  const globalStyles = createGlobalStyles(theme);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    try {
      await signUp(email, password);
      Alert.alert("Sucesso!", "Conta criada. Já podes iniciar sessão.");
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Erro no registo", error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={globalStyles.container}
    >
      <Text style={globalStyles.title}>Criar Conta 📝</Text>
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
      <TouchableOpacity
        style={[globalStyles.button, { backgroundColor: colors[theme].secondary }]}
        onPress={handleSignUp}
      >
        <Text style={globalStyles.buttonText}>Registar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={globalStyles.linkText}>
          Já tens conta?{" "}
          <Text style={globalStyles.linkHighlight}>Faz login aqui</Text>
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}