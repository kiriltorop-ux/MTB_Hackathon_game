import { Platform } from "react-native";

export const Colors = {
  text: "#fff",
  background: "#EEF3FF",
  tint: "#1B74FD",
  icon: "#4A5E8B",
  tabIconDefault: "#7C8FB9",
  tabIconSelected: "#1B74FD",
  overlay: "rgba(9, 20, 43, 0.55)",
  card: "#FFFFFF",
  border: "#D4E0FB",
  iconBg: "rgba(27, 116, 253, 0.10)",
  sideButtonBg: "rgba(9, 20, 43, 0.7)",
  statsBarBg: "rgba(27, 116, 253, 0.08)",
  hint: "#49608B",
  clanBonusBg: "rgba(27, 116, 253, 0.12)",
  buttonBg: "#1B74FD",
  brandGradientStart: "#1B74FD",
  brandGradientEnd: "#F6354C",
  heroBackground: "#12110C",
  heroCardBackground: "#11418D",
  heroCardBorder: "#175ACA",
};

export const createTextStyles = () => ({
  light: {
    fontFamily: "PPNeueMachina-Light",
    color: Colors.text,
  },
  regular: {
    fontFamily: "PPNeueMachina-Regular",
    color: Colors.text,
  },
  bold: {
    fontFamily: "PPNeueMachina-Bold",
    color: Colors.text,
  },
  semibold: {
    fontFamily: "PPNeueMachina-Regular",
    color: Colors.text,
  },
  extraBold: {
    fontFamily: "PPNeueMachina-Bold",
    color: Colors.text,
  },
});

export const Fonts = Platform.select({
  ios: {
    light: { fontFamily: "PPNeueMachina-Light" },
    regular: { fontFamily: "PPNeueMachina-Regular" },
    bold: { fontFamily: "PPNeueMachina-Bold" },
    semiBold: { fontFamily: "PPNeueMachina-Regular" },
    extraBold: { fontFamily: "PPNeueMachina-Bold" },
  },
  default: {
    light: { fontFamily: "PPNeueMachina-Light" },
    regular: { fontFamily: "PPNeueMachina-Regular" },
    bold: { fontFamily: "PPNeueMachina-Bold" },
    semiBold: { fontFamily: "PPNeueMachina-Regular" },
    extraBold: { fontFamily: "PPNeueMachina-Bold" },
  },
  web: {
    light: { fontFamily: "PPNeueMachina-Light" },
    regular: { fontFamily: "PPNeueMachina-Regular" },
    bold: { fontFamily: "PPNeueMachina-Bold" },
    semiBold: { fontFamily: "PPNeueMachina-Regular" },
    extraBold: { fontFamily: "PPNeueMachina-Bold" },
  },
});
