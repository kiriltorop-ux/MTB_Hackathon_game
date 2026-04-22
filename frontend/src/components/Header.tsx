import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  BackHandler,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";

interface HeaderProps {
  title: string;
  onExit: () => void;
  onSoundToggle: () => void;
  isSoundOn: boolean;
  hideBottomBorder?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  onExit,
  onSoundToggle,
  isSoundOn,
  hideBottomBorder = true,
}) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const handleExit = () => {
    if (Platform.OS === "android") {
      BackHandler.exitApp();
      return;
    }
    onExit();
  };

  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: "transparent",
          borderBottomColor: theme.border,
          borderBottomWidth: hideBottomBorder ? 0 : StyleSheet.hairlineWidth,
          paddingTop: insets.top + 8,
        },
      ]}
    >
      <TouchableOpacity onPress={handleExit} style={styles.iconButton}>
        <Ionicons name="close" size={24} color={theme.text} />
      </TouchableOpacity>

      <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
        {title}
      </Text>

      <TouchableOpacity onPress={onSoundToggle} style={styles.iconButton}>
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
    backgroundColor: "transparent",
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
