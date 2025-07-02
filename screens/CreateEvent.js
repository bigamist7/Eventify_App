// screens/CreateEvent.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  KeyboardAvoidingView,
  Image
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import firebase from "../firebaseConfig";
import { useAuth } from "../context/AuthContext";
import { useColorScheme } from "react-native";
import { createGlobalStyles, colors } from "../styles/globalStyles";
import { useNavigation } from "@react-navigation/native";

export default function CreateEvent() {
  const theme = useColorScheme() ?? "light";
  const globalStyles = createGlobalStyles(theme);
  const navigation = useNavigation();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [imageUrl, setImageUrl] = useState(""); // NOVO estado para imagem externa
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleCreate = async () => {
    if (!title || !description || !location) {
      Alert.alert("Campos em falta", "Preenche todos os campos.");
      return;
    }

    try {
      await firebase.firestore().collection("events").add({
        title,
        title_lowercase: title.trim().toLowerCase(),
        description,
        location,
        datetime: date,
        createdBy: user.uid,
        participants: [],
        imageUrl: imageUrl.trim() || null,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      Alert.alert("Sucesso", "Evento criado com sucesso!");
      navigation.goBack();
    } catch (err) {
      console.log("🔥 Erro ao criar evento:", err);
      setHasError(true);
      Alert.alert("Erro", err.message);
    }
  };

  if (hasError) {
    return (
      <View style={globalStyles.container}>
        <Text style={globalStyles.title}>Algo correu mal 😓</Text>
        <TouchableOpacity
          style={[globalStyles.button, { marginTop: 20 }]}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={globalStyles.buttonText}>← Voltar à Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={globalStyles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={globalStyles.title}>📌 Criar Evento</Text>

      <TextInput
        placeholder="Título"
        placeholderTextColor={colors[theme].textLight}
        value={title}
        onChangeText={setTitle}
        style={globalStyles.input}
      />

      <TextInput
        placeholder="Descrição"
        placeholderTextColor={colors[theme].textLight}
        value={description}
        onChangeText={setDescription}
        style={[globalStyles.input, { height: 80 }]}
        multiline
      />

      <TextInput
        placeholder="Localização"
        placeholderTextColor={colors[theme].textLight}
        value={location}
        onChangeText={setLocation}
        style={globalStyles.input}
      />

      <TextInput
        placeholder="URL da imagem (https://...)"
        placeholderTextColor={colors[theme].textLight}
        value={imageUrl}
        onChangeText={setImageUrl}
        style={globalStyles.input}
        autoCapitalize="none"
      />

      {/* Pré-visualização da imagem */}
      {!!imageUrl?.trim() && (
        <Image
          source={{ uri: imageUrl }}
          style={{
            width: "100%",
            height: 160,
            borderRadius: 10,
            marginBottom: 16,
            marginTop: 4
          }}
        />
      )}

      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={[globalStyles.input, { justifyContent: "center" }]}
      >
        <Text style={{ color: colors[theme].text }}>
          🗓️ {date.toLocaleDateString()} às {date.toLocaleTimeString()}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="datetime"
          display="default"
          onChange={(_, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      <TouchableOpacity
        style={[globalStyles.button, { marginTop: 16 }]}
        onPress={handleCreate}
      >
        <Text style={globalStyles.buttonText}>Criar Evento</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}
