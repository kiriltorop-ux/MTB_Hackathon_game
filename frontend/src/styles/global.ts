import { StyleSheet } from "react-native";

export const createGlobalStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    text: {
      color: theme.text,
      fontFamily: "PPNeueMachina-Regular",
    },
    title: {
      color: theme.text,
      fontFamily: "PPNeueMachina-Bold",
      fontSize: 24,
    },
    card: {
      backgroundColor: theme.card,
      borderRadius: 12,
      padding: 16,
      margin: 8,
      borderWidth: 1,
      borderColor: theme.border,
    },
  });
