// screens/Home.js
import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import firebase from "../firebaseConfig";
import { useColorScheme } from "react-native";
import { createGlobalStyles, colors } from "../styles/globalStyles";
import EventCard from "../components/EventCard";
import SearchBar from "../components/SearchBar";

export default function Home() {
  const theme = useColorScheme() ?? "light";
  const globalStyles = createGlobalStyles(theme);
  const flatListRef = useRef(null);

  const { logout } = useAuth();
  const navigation = useNavigation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchEvents = async (query = "") => {
    try {
      setLoading(true);
      let ref = firebase.firestore().collection("events");

      if (query.trim()) {
        const start = query.trim().toLowerCase();
        const end = start + "\uf8ff";

        ref = ref
          .orderBy("title_lowercase")
          .startAt(start)
          .endAt(end);
      } else {
        ref = ref.orderBy("datetime");
      }

      const snapshot = await ref.get();
      const eventsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setEvents(eventsData);
    } catch (error) {
      console.log("Erro ao buscar eventos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Atualiza os eventos sempre que o ecrã voltar a ser focado
  useFocusEffect(
    useCallback(() => {
      fetchEvents();
    }, [])
  );

  // Atualiza ao escrever na SearchBar
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      fetchEvents(search);
    }, 300);
    return () => clearTimeout(timeout);
  }, [search]);

  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
  };

  return (
    <View style={[globalStyles.container, { paddingTop: 48 }]}>
      <Text style={globalStyles.title}>📅 Eventos Locais</Text>

      <SearchBar value={search} onChangeText={setSearch} />

      <TouchableOpacity
        style={[globalStyles.button, { marginBottom: 16 }]}
        onPress={() => navigation.navigate("CreateEvent")}
      >
        <Text style={globalStyles.buttonText}>+ Criar Evento</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={colors[theme].primary}
          style={{ marginTop: 24 }}
        />
      ) : (
        <FlatList
          ref={flatListRef}
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EventCard
              item={item}
              onPress={() =>
                navigation.navigate("EventDetails", { eventId: item.id })
              }
            />
          )}
          contentContainerStyle={{ paddingBottom: 24 }}
          ListEmptyComponent={
            <Text
              style={{
                textAlign: "center",
                marginTop: 16,
                color: colors[theme].textLight
              }}
            >
              Nenhum evento encontrado.
            </Text>
          }
        />
      )}

      <TouchableOpacity
        style={[
          globalStyles.button,
          { backgroundColor: colors[theme].info, marginTop: 12 }
        ]}
        onPress={scrollToTop}
      >
        <Text style={globalStyles.buttonText}>↑ Voltar ao topo</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          globalStyles.button,
          { backgroundColor: colors[theme].danger, marginTop: 12 }
        ]}
        onPress={logout}
      >
        <Text style={globalStyles.buttonText}>Terminar Sessão</Text>
      </TouchableOpacity>
    </View>
  );
}
