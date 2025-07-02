// styles/globalStyles.js
import { StyleSheet } from "react-native";

export const colors = {
  light: {
    primary: "#4F46E5", // Indigo
    secondary: "#F59E0B", // Amber
    danger: "#d32f2f",
    info: "#3B82F6", // Azul para ações neutras
    background: "#F9FAFB",
    backgroundSecondary: "#FFFFFF",
    text: "#111827",
    textLight: "#6B7280",
    white: "#FFFFFF"
  },
  dark: {
    primary: "#6366F1",
    secondary: "#FBBF24",
    danger: "#EF4444",
    info: "#60A5FA",
    background: "#1F2937",
    backgroundSecondary: "#111827",
    text: "#F3F4F6",
    textLight: "#9CA3AF",
    white: "#1e1e1e"
  }
};

export const createGlobalStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      padding: 24,
      backgroundColor: colors[theme].background
    },
    title: {
      fontSize: 24,
      fontWeight: "600",
      marginBottom: 24,
      textAlign: "center",
      color: colors[theme].text
    },
    input: {
      borderWidth: 1,
      borderColor: colors[theme].textLight,
      borderRadius: 10,
      paddingVertical: 14,
      paddingHorizontal: 16,
      marginBottom: 16,
      backgroundColor: colors[theme].white,
      color: colors[theme].text,
      fontSize: 16
    },
    button: {
      backgroundColor: colors[theme].primary,
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderRadius: 12,
      alignItems: "center",
      marginTop: 8,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 3
    },
    buttonText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 16
    },
    linkText: {
      color: colors[theme].textLight,
      textAlign: "center",
      marginTop: 16,
      fontSize: 15
    },
    linkHighlight: {
      color: colors[theme].primary,
      fontWeight: "bold"
    },
    card: {
      backgroundColor: colors[theme].backgroundSecondary,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 2
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors[theme].text,
      marginBottom: 6
    },
    cardText: {
      fontSize: 14,
      color: colors[theme].textLight
    }
  });
