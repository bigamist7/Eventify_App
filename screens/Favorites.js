import React, { useState, useCallback } from "react";
import { View, FlatList, Text, ActivityIndicator } from "react-native";
import firebase from "../firebaseConfig"; // usar default import para firebase v8
import { useAuth } from "../context/AuthContext";
import EventCard from "../components/EventCard";
import { useColorScheme } from "react-native";
import { createGlobalStyles, colors } from "../styles/globalStyles";
import { useFocusEffect } from "@react-navigation/native";

export default function Favorites({ navigation }) {
  const theme = useColorScheme() ?? "light";
  const globalStyles = createGlobalStyles(theme);

  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const userDoc = await firebase.firestore().collection("users").doc(user.uid).get();
      const favIds = userDoc.data()?.favorites || [];

      const favSnapshots = await Promise.all(
        favIds.map((id) => firebase.firestore().collection("events").doc(id).get())
      );

      const favData = favSnapshots
        .filter((doc) => doc.exists)
        .map((doc) => ({ id: doc.id, ...doc.data() }));

      setFavorites(favData);
    } catch (err) {
      console.log("Erro ao carregar favoritos:", err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  return (
    <View style={[globalStyles.container, { paddingTop: 48 }]}>
      <Text style={globalStyles.title}>⭐ Eventos Favoritos</Text>

      {loading ? (
        <ActivityIndicator size="large" color={colors[theme].primary} style={{ marginTop: 24 }} />
      ) : (
        <FlatList
          data={favorites}
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
                marginTop: 16,
                color: colors[theme].textLight
              }}
            >
              Sem favoritos ainda.
            </Text>
          }
        />
      )}
    </View>
  );
}
