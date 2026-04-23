import { Fonts } from "@/src/constants/theme";
import { UserProfile } from "@/src/types/user";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

const LEFT_ENERGY_ICON = require("../../../assets/icons/left-energy.png");
const LEFT_ADD_ICON = require("../../../assets/icons/left-add.png");

type BattleLeftPanelProps = {
  u: number;
  user: UserProfile | null;
};

export function BattleLeftPanel({ u, user }: BattleLeftPanelProps) {
  const selectedClassImage =
    user?.role === "tech"
      ? require("../../../assets/images/class-tech.png")
      : user?.role === "athlete"
      ? require("../../../assets/images/class-athlete.png")
      : user?.role === "traveler"
      ? require("../../../assets/images/class-traveler.png")
      : require("../../../assets/images/class-gourmet.png");
  const clicksLeft = user?.clicks_left ?? 0;
  const dailyClickLimit = 5;

  return (
    <View style={[styles.leftActionsWrap, { left: 16 * u }]}>
      <Text style={[styles.levelText, { fontSize: 16 * u, top: 448 * u }]}>
        {(user?.level ?? 0).toLocaleString("ru-RU")} LVL
      </Text>

      <View style={[styles.profileCard, { top: 494 * u }]}>
        <Image
          source={selectedClassImage}
          style={styles.profileIcon}
          resizeMode="contain"
        />
      </View>

      <View style={[styles.energyCard, { top: 536 * u }]}>
        <View style={styles.energyTopWrap}>
          <Image
            source={LEFT_ENERGY_ICON}
            style={styles.energyIcon}
            resizeMode="cover"
          />
        </View>
        <Text style={styles.energyValue}>
          <Text style={styles.energyValueMain}>
            {clicksLeft.toLocaleString("ru-RU")}
          </Text>
          <Text style={styles.energySlashMain}>/{dailyClickLimit}</Text>
        </Text>
      </View>

      <View style={[styles.addCard, { top: 626 * u }]}>
        <View style={styles.cardBottom}>
          <Image source={LEFT_ADD_ICON} style={styles.addIcon} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  leftActionsWrap: {
    position: "absolute",
    width: 60,
    top: 0,
    zIndex: 25,
  },
  levelText: {
    position: "absolute",
    width: 55,
    textAlign: "right",
    color: "#fff",
    fontFamily: Fonts.regular.fontFamily,
    textTransform: "capitalize",
  },
  profileCard: {
    position: "absolute",
    width: 65,
    height: 42,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
    backgroundColor: "rgba(213,62,102,0.5)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible",
  },
  profileIcon: {
    position: "absolute",
    bottom: 0,
    width: 120,
    height: 120,
  },
  cardBottom: {
    height: 54,
    width: 65,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(74,65,202,0.5)",
  },
  energyCard: {
    position: "absolute",
    width: 65,
    gap: 6,
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
    backgroundColor: "rgba(74,65,202,0.5)",
    backdropFilter: "blur(2px)",
  },
  energyIcon: {
    position: "absolute",
    width: 62,
    height: 42,
    transform: [{ rotate: "-10deg" }],
  },
  energyTopWrap: {
    position: "relative",
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },
  energyValue: {
    color: "#fff",
    fontFamily: Fonts.bold.fontFamily,
    fontSize: 24,
    flexDirection: "row",
    letterSpacing: 3.36,
  },
  energyValueMain: {
    fontSize: 24,
  },
  energySlashMain: {
    fontSize: 16,
    letterSpacing: 2.24,
  },
  addCard: {
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 12,
    position: "absolute",
    width: 60,
    gap: 2,
  },
  addIcon: {
    width: 32,
    height: 32,
  },
});
