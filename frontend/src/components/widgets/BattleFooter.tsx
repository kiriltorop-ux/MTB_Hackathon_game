import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";

const FRIENDS_ICON = require("../../../assets/icons/nav-friends.png");
const NAV_TOP_ICON = require("../../../assets/icons/nav-top.png");
const NAV_BATTLE_ICON = require("../../../assets/icons/nav-battle.png");
const NAV_TASKS_ICON = require("../../../assets/icons/nav-tasks.png");

const NAV_ITEMS = [
  { key: "top", icon: NAV_TOP_ICON, title: "Топ", route: "/leaderboard" },
  { key: "battle", icon: NAV_BATTLE_ICON, title: "Баттл", route: null },
  { key: "rewards", icon: NAV_TASKS_ICON, title: "Задания", route: "/rewards" },
  {
    key: "friends",
    icon: FRIENDS_ICON,
    title: "Друзья",
    route: "/leaderboard",
  },
] as const;

type BattleFooterProps = {
  bottomInset: number;
  u: number;
};

export function BattleFooter({ bottomInset, u }: BattleFooterProps) {
  return (
    <View
      style={[styles.bottomNavWrap, { paddingBottom: bottomInset + 6 * u }]}
    >
      {/* Tweak footer block geometry here */}
      <View style={styles.bottomNav}>
        {NAV_ITEMS.map((item) => (
          <Pressable
            key={item.key}
            style={styles.navItem}
            onPress={() => {
              if (item.route) {
                router.push(item.route as never);
              }
            }}
          >
            <Image
              source={item.icon}
              style={styles.navIcon}
              resizeMode="contain"
            />
            <Text
              style={[
                styles.navText,
                item.key === "battle" && styles.navTextActive,
              ]}
            >
              {item.title}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNavWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  bottomNav: {
    minHeight: 80,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: "#18171c",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingTop: 8,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    width: 66,
    height: 74,
  },
  navIcon: { width: 42, height: 42 },
  navText: {
    color: "#CCE0FF",
    fontFamily: "PPNeueMachina-Regular",
    fontSize: 16,
  },
  navTextActive: {
    color: "#FAFCFF",
  },
});
