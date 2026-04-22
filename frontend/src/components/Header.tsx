// components/GameHeader.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

interface GameHeaderProps {
  title: string;
  onExit: () => void;
  onSoundToggle: () => void;
  isSoundOn: boolean;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  title,
  onExit,
  onSoundToggle,
  isSoundOn,
}) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: theme.card,
          borderBottomColor: theme.border,
        },
      ]}
    >
      <TouchableOpacity onPress={onExit} style={styles.iconButton}>
        <Ionicons name="close" size={24} color={theme.text} />
      </TouchableOpacity>

      <Text
        style={[styles.title, { color: theme.text }]}
        numberOfLines={1}
      >
        {title}
      </Text>

      <TouchableOpacity
        onPress={onSoundToggle}
        style={styles.iconButton}
      >
        <Ionicons
          name={isSoundOn ? "volume-high" : "volume-mute"}
          size={24}
          color={theme.text}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  iconButton: {
    padding: 8,
    width: 44,
    alignItems: "center",
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
});
