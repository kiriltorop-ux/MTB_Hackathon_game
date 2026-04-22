import { Platform } from "react-native";

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: "#0a7ea4",
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: "#0a7ea4",
    overlay: "rgba(0,0,0,0.5)",
    card: "#f8f8f8",
    border: "#e1e1e1",
    iconBg: "rgba(0,0,0,0.05)",
    sideButtonBg: "rgba(0,0,0,0.7)",
    statsBarBg: "rgba(0,0,0,0.05)",
    hint: "#666",
    clanBonusBg: "rgba(10,126,164,0.1)",
    buttonBg: "#0a7ea4",
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: "#ffd700",
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: "#ffd700",
    overlay: "rgba(0,0,0,0.85)",
    card: "#1c1c1e",
    border: "#2c2c2e",
    iconBg: "rgba(255,255,255,0.1)",
    sideButtonBg: "rgba(0,0,0,0.7)",
    statsBarBg: "rgba(255,255,255,0.1)",
    hint: "#aaa",
    clanBonusBg: "rgba(255,215,0,0.1)",
    buttonBg: "#4a4a8a",
  },
};

export const createTextStyles = (isDark: boolean) => ({
  light: {
    fontFamily: "PPNeueMachina-Light",
    color: isDark ? Colors.dark.text : Colors.light.text,
  },
  regular: {
    fontFamily: "PPNeueMachina-Regular",
    color: isDark ? Colors.dark.text : Colors.light.text,
  },
  bold: {
    fontFamily: "PPNeueMachina-Bold",
    color: isDark ? Colors.dark.text : Colors.light.text,
  },
});

export const Fonts = Platform.select({
  ios: {
    light: { fontFamily: "PPNeueMachina-Light" },
    regular: { fontFamily: "PPNeueMachina-Regular" },
    bold: { fontFamily: "PPNeueMachina-Bold" },
  },
  default: {
    light: { fontFamily: "PPNeueMachina-Light" },
    regular: { fontFamily: "PPNeueMachina-Regular" },
    bold: { fontFamily: "PPNeueMachina-Bold" },
  },
  web: {
    light: { fontFamily: "PPNeueMachina-Light" },
    regular: { fontFamily: "PPNeueMachina-Regular" },
    bold: { fontFamily: "PPNeueMachina-Bold" },
  },
});
