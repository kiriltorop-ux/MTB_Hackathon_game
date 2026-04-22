import React from "react";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { Colors } from "@/src/constants/theme";

interface BrandLogoProps {
  size?: number;
  minSize?: number;
  style?: StyleProp<TextStyle>;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 28,
  minSize = 24,
  style,
}) => {
  const flattened = (StyleSheet.flatten(style) || {}) as TextStyle;
  const textSize = Math.max(
    minSize,
    typeof flattened.fontSize === "number" ? flattened.fontSize : size,
  );
  const lineHeight =
    typeof flattened.lineHeight === "number" ? flattened.lineHeight : textSize;
  const containerStyle = style as StyleProp<ViewStyle>;

  return (
    <View style={[styles.row, containerStyle]}>
      <Text style={[styles.mt, { fontSize: textSize, lineHeight }]}>MT</Text>
      <MaskedView
        style={[{ height: lineHeight, width: textSize * 3.45 }]}
        maskElement={
          <View style={styles.maskContainer}>
            <Text
              style={[styles.battleMask, { fontSize: textSize, lineHeight }]}
            >
              Battle
            </Text>
          </View>
        }
      >
        <LinearGradient
          colors={["#1B74FD", "#F6354C"]}
          start={{ x: 0.274, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
        />
      </MaskedView>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  mt: {
    color: Colors.text,
    fontFamily: "PPNeueMachina-Bold",
    includeFontPadding: false,
  },
  maskContainer: {
    flex: 1,
    justifyContent: "center",
  },
  battleMask: {
    color: "#FFFFFF",
    fontFamily: "PPNeueMachina-Bold",
    includeFontPadding: false,
  },
});
