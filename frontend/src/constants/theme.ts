import { Platform } from "react-native";

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
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
