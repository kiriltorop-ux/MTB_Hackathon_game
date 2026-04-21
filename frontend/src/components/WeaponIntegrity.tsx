import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface WeaponIntegrityProps {
  integrity: number;
}

export const WeaponIntegrity: React.FC<WeaponIntegrityProps> = ({
  integrity,
}) => {
  const getColor = () => {
    if (integrity > 70) return "#44ff44";
    if (integrity > 30) return "#ffaa00";
    return "#ff4444";
  };

  return (
    <View style={styles.container}>
      <Ionicons name="hammer" size={24} color={getColor()} />
      <View style={styles.percentContainer}>
        <Text style={[styles.percent, { color: getColor() }]}>
          {integrity.toFixed(0)}%
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 4,
  },
  percentContainer: {
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  percent: {
    fontSize: 12,
    fontWeight: "bold",
  },
});
