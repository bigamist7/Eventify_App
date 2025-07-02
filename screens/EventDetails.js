// screens/EventDetails.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert
} from "react-native";
import firebase from "../firebaseConfig"; // ✅ usa o default, não import { firebase }
import { useRoute, useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { useColorScheme } from "react-native";
import { createGlobalStyles, colors } from "../styles/globalStyles";

export default function EventDetails() {
  const { user } = useAuth();
  const route = useRoute();
  const navigation = useNavigation();
  const eventId = route.params?.eventId;

  const theme = useColorScheme() ?? "light";
  const globalStyles = createGlobalStyles(theme);

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isParticipating, setIsParticipating] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (!eventId) {
      console.warn("❌ Nenhum ID de evento fornecido.");
      setLoading(false);
      return;
    }

    const loadEvent = async () => {
      try {
        const doc = await firebase.firestore().collection("events").doc(eventId).get();
        if (doc.exists) {
          const eventData = { id: doc.id, ...doc.data() };
          setEvent(eventData);
        } else {
          console.warn("⚠️ Evento não encontrado na Firestore.");
        }

        const userDoc = await firebase.firestore().collection("users").doc(user.uid).get();
        const data = userDoc.data() || {};
        setIsParticipating(Array.isArray(data.participations) && data.participations.includes(eventId));
        setIsFavorite(Array.isArray(data.favorites) && data.favorites.includes(eventId));

      } catch (error) {
        console.log("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, []);

  const toggleParticipation = async () => {
    const userRef = firebase.firestore().collection("users").doc(user.uid);
    const eventRef = firebase.firestore().collection("events").doc(eventId);

    try {
      if (isParticipating) {
        await userRef.update({
          participations: firebase.firestore.FieldValue.arrayRemove(eventId)
        });
        await eventRef.update({
          participants: firebase.firestore.FieldValue.arrayRemove(user.uid)
        });
        setIsParticipating(false);
      } else {
        await userRef.update({
  participations: firebase.firestore.FieldValue.arrayUnion(eventId)
});

        await eventRef.update({
          participants: firebase.firestore.FieldValue.arrayUnion(user.uid)
        });
        setIsParticipating(true);
      }
    } catch (err) {
      Alert.alert("Erro", err.message);
    }
  };

  const toggleFavorite = async () => {
  const userRef = firebase.firestore().collection("users").doc(user.uid);

  try {
    if (isFavorite) {
      await userRef.update({
        favorites: firebase.firestore.FieldValue.arrayRemove(eventId)
      });
      setIsFavorite(false);
    } else {
      await userRef.update({
        favorites: firebase.firestore.FieldValue.arrayUnion(eventId)
      });
      setIsFavorite(true);
    }
  } catch (err) {
    Alert.alert("Erro", err.message);
  }
};

  if (loading) {
    return (
      <View style={globalStyles.container}>
        <ActivityIndicator size="large" color={colors[theme].primary} />
      </View>
    );
  }

  if (!event) {
    return (
      <View style={globalStyles.container}>
        <Text style={globalStyles.title}>Evento não encontrado.</Text>
        <TouchableOpacity
          style={[globalStyles.button, { marginTop: 16 }]}
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate("Home");
            }
          }}
        >
          <Text style={globalStyles.buttonText}>← Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[globalStyles.container, { paddingTop: 24 }]}>
      <Image source={{ uri: event.imageUrl }} style={styles.image} />
      <Text style={globalStyles.title}>{event.title}</Text>
      <Text style={styles.info}>{event.description}</Text>
      <Text style={styles.info}>
        🕒{" "}
        {event.datetime?.toDate
          ? event.datetime.toDate().toLocaleString("pt-PT", {
              dateStyle: "short",
              timeStyle: "short"
            })
          : "Data inválida"}
      </Text>
      <Text style={styles.info}>📍 Local: {event.location}</Text>

      <TouchableOpacity
        style={[
          globalStyles.button,
          {
            marginTop: 12,
            backgroundColor: isParticipating ? "#bbb" : colors[theme].primary
          }
        ]}
        onPress={toggleParticipation}
      >
        <Text style={globalStyles.buttonText}>
          {isParticipating ? "Cancelar participação" : "Participar"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          globalStyles.button,
          {
            marginTop: 12,
            backgroundColor: isFavorite ? "#bbb" : colors[theme].secondary
          }
        ]}
        onPress={toggleFavorite}
      >
        <Text style={globalStyles.buttonText}>
          {isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          globalStyles.button,
          {
            marginTop: 12,
            backgroundColor: isFavorite ? "#bbb" : colors[theme].secondary
          }
        ]}
        onPress={()=>navigation.goBack()}
      >
        <Text style={globalStyles.buttonText}>
          Voltar
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginBottom: 16
  },
  info: {
    fontSize: 16,
    marginBottom: 8,
    color: "#444" // ← cor sólida sem depender do objeto colors externo
  }
});
