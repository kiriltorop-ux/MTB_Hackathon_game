import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface BossHealthBarProps {
  currentHp: number;
  maxHp: number;
}

export const BossHealthBar: React.FC<BossHealthBarProps> = ({
  currentHp,
  maxHp,
}) => {
  const percentage = (currentHp / maxHp) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${percentage}%` }]} />
      </View>
      <Text style={styles.hpText}>
        🩸 {currentHp} / {maxHp}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "60%",
  },
  barBg: {
    width: "100%",
    height: 12,
    backgroundColor: "#4a0000",
    borderRadius: 6,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    backgroundColor: "#ff3333",
    borderRadius: 6,
  },
  hpText: {
    color: "#fff",
    fontSize: 12,
    marginTop: 4,
    fontWeight: "bold",
  },
});
