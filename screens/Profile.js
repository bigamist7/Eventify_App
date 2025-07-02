import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { useColorScheme } from "react-native";
import { createGlobalStyles, colors } from "../styles/globalStyles";
import { useFocusEffect } from "@react-navigation/native";
import firebase from "../firebaseConfig";
import EventCard from "../components/EventCard";

export default function Profile({ navigation }) {
  const theme = useColorScheme() ?? "light";
  const globalStyles = createGlobalStyles(theme);
  const { user, logout } = useAuth();

  const [createdEvents, setCreatedEvents] = useState([]);
  const [participatingEvents, setParticipatingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      console.log("🔑 UID do utilizador:", user.uid);

      // Buscar eventos criados
      const createdSnap = await firebase
        .firestore()
        .collection("events")
        .where("createdBy", "==", user.uid)
        //.orderBy("datetime", "desc") // Descomenta apenas se tiveres índice no Firestore
        .get();

      const created = createdSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      console.log("📌 Eventos criados encontrados:", created.length);

      // Buscar participações do utilizador
      const userDoc = await firebase
        .firestore()
        .collection("users")
        .doc(user.uid)
        .get();

      const participations = userDoc.data()?.participations || [];
      console.log("👥 Participações (IDs):", participations);

      const participationSnaps = await Promise.all(
        participations.map((id) =>
          firebase.firestore().collection("events").doc(id).get()
        )
      );

      const participating = participationSnaps
        .filter((doc) => doc.exists)
        .map((doc) => ({ id: doc.id, ...doc.data() }));

      console.log("✅ Eventos participados encontrados:", participating.length);

      setCreatedEvents(created);
      setParticipatingEvents(participating);
    } catch (err) {
      console.log("❌ Erro ao carregar dados do perfil:", err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadProfileData();
    }, [])
  );

  return (
    <View style={[globalStyles.container, { paddingTop: 48 }]}>
      <Text style={globalStyles.title}>👤 O meu perfil</Text>
      <Text style={{ fontSize: 16, marginBottom: 12, color: colors[theme].text }}>
        Email: {user?.email}
      </Text>
      <Text style={{ fontSize: 14, color: colors[theme].textLight, marginBottom: 24 }}>
        UID: {user?.uid}
      </Text>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={colors[theme].primary}
          style={{ marginVertical: 24 }}
        />
      ) : (
        <>
          <Text style={[globalStyles.title, { fontSize: 20, marginTop: 16 }]}>
            📌 Criados por mim
          </Text>
          <FlatList
            data={createdEvents}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <EventCard
                item={item}
                onPress={() =>
                  navigation.navigate("EventDetails", { eventId: item.id })
                }
              />
            )}
            ListEmptyComponent={
              <Text
                style={{
                  textAlign: "center",
                  marginTop: 12,
                  color: colors[theme].textLight
                }}
              >
                Nenhum evento criado.
              </Text>
            }
            scrollEnabled={false}
          />

          <Text style={[globalStyles.title, { fontSize: 20, marginTop: 24 }]}>
            ✅ A participar
          </Text>
          <FlatList
            data={participatingEvents}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <EventCard
                item={item}
                onPress={() =>
                  navigation.navigate("EventDetails", { eventId: item.id })
                }
              />
            )}
            ListEmptyComponent={
              <Text
                style={{
                  textAlign: "center",
                  marginTop: 12,
                  color: colors[theme].textLight
                }}
              >
                Ainda não estás inscrito em nenhum evento.
              </Text>
            }
            scrollEnabled={false}
          />
        </>
      )}

      <TouchableOpacity
        style={[
          globalStyles.button,
          { backgroundColor: colors[theme].danger, marginTop: 24 }
        ]}
        onPress={logout}
      >
        <Text style={globalStyles.buttonText}>Terminar Sessão</Text>
      </TouchableOpacity>
    </View>
  );
}
