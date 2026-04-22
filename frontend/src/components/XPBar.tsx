import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface XPBarProps {
  currentXp: number;
  maxXp: number;
  level: number;
}

export const XPBar: React.FC<XPBarProps> = ({
  currentXp,
  maxXp,
  level,
}) => {
  const percentage = (currentXp / maxXp) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>✨ Уровень {level}</Text>
        <Text style={styles.xpText}>
          {currentXp}/{maxXp} XP
        </Text>
      </View>
      <View style={styles.barBg}>
        <LinearGradient
          colors={["#4a90e2", "#357abd"]}
          style={[styles.barFill, { width: `${percentage}%` }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 140,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  label: {
    color: "#aaddff",
    fontSize: 10,
    fontWeight: "bold",
  },
  xpText: {
    color: "#aaddff",
    fontSize: 9,
  },
  barBg: {
    width: "100%",
    height: 8,
    backgroundColor: "#2a2a4a",
    borderRadius: 4,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 4,
  },
});
