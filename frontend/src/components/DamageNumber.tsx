import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";

interface DamageNumberProps {
  value: number;
  x: number;
  y: number;
}

export const DamageNumber: React.FC<DamageNumberProps> = ({
  value,
  x,
  y,
}) => {
  const opacity = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -40,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const isCritical = value > 150;

  return (
    <Animated.Text
      style={[
        styles.damageText,
        {
          left: x - 20,
          top: y - 30,
          opacity,
          transform: [{ translateY }],
          fontSize: isCritical ? 28 : 20,
          color: isCritical ? "#ffaa00" : "#ff4444",
          fontWeight: isCritical ? "bold" : "normal",
        },
      ]}
    >
      -{value}!
    </Animated.Text>
  );
};

const styles = StyleSheet.create({
  damageText: {
    position: "absolute",
    fontWeight: "bold",
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
