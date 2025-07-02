// components/EventCard.js
import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { colors } from "../styles/globalStyles";
import { useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function EventCard({ item, onPress }) {
  const theme = useColorScheme() ?? "light";

  return (
    <TouchableOpacity style={styles(theme).card} onPress={onPress} activeOpacity={0.85}>
      {item.imageUrl && (
        <Image source={{ uri: item.imageUrl }} style={styles(theme).image} />
      )}
      <View style={styles(theme).info}>
        <Text style={styles(theme).title}>{item.title}</Text>

        <View style={styles(theme).row}>
          <Ionicons name="calendar" size={16} color={colors[theme].textLight} />
          <Text style={styles(theme).meta}>
            {"  "}
            {item.datetime?.toDate
              ? item.datetime.toDate().toLocaleString("pt-PT", {
                  dateStyle: "short",
                  timeStyle: "short"
                })
              : "Data inválida"}
          </Text>
        </View>

        {item.location && (
          <View style={styles(theme).row}>
            <Ionicons name="location-sharp" size={16} color={colors[theme].textLight} />
            <Text style={styles(theme).meta}>{"  "}{item.location}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = (theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors[theme].backgroundSecondary,
      borderRadius: 12,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 2,
      marginBottom: 10 // 👈 espaçamento vertical mais compacto
    },
    image: {
      width: "100%",
      height: 140
    },
    info: {
      padding: 12
    },
    title: {
      fontSize: 18,
      fontWeight: "600",
      color: colors[theme].text,
      marginBottom: 6
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 4
    },
    meta: {
      fontSize: 14,
      color: colors[theme].textLight
    }
  });
