import React from "react";
import { StyleSheet, View } from "react-native";
import { Header } from "../Header";
import { BrandLogo } from "../BrandLogo";

type BattleHeaderProps = {
  u: number;
  isSoundOn: boolean;
  onExit: () => void;
  onSoundToggle: () => void;
};

export function BattleHeader({
  u,
  isSoundOn,
  onExit,
  onSoundToggle,
}: BattleHeaderProps) {
  return (
    <View style={styles.root}>
      <View style={[styles.logoRow, { paddingHorizontal: 16 * u }]}>
        <BrandLogo size={24 * u} minSize={20} />
      </View>
      <Header
        title=""
        onExit={onExit}
        onSoundToggle={onSoundToggle}
        isSoundOn={isSoundOn}
        hideBottomBorder
        containerStyle={[styles.headerContainer, { paddingHorizontal: 8 * u }]}
        helpIcon
        stretchContainer
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    zIndex: 20,
    width: "100%",
  },
  logoRow: {
    paddingTop: 8,
    marginTop: 32,
  },
  headerContainer: {
    paddingTop: 2,
    paddingBottom: 4,
    width: "100%",
  },
});
