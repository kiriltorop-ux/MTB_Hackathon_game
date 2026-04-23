import React from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { DamageNumber } from "../DamageNumber";

type BossStageProps = {
  loading: boolean;
  onBossHit: (event: any) => void;
  lastDamage: {
    value: number;
    isCritical: boolean;
    x: number;
    y: number;
  } | null;
};

export function BossStage({ loading, onBossHit, lastDamage }: BossStageProps) {
  return (
    <View style={styles.bossWrap}>
      {/* Tweak boss position here: width/height/marginTop */}
      <Image
        source={require("../../../assets/images/boss2.png")}
        style={styles.bossImage}
        resizeMode="contain"
      />
      {loading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      ) : (
        <TouchableWithoutFeedback onPressIn={onBossHit}>
          <View style={styles.bossHitArea}>
            {lastDamage && (
              <DamageNumber
                value={lastDamage.value}
                x={lastDamage.x}
                y={lastDamage.y}
                isCritical={lastDamage.isCritical}
              />
            )}
          </View>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bossWrap: {
    flex: 1,
    justifyContent: "center",
    position: "absolute",
    bottom: 90,
    left: 0,
    right: 10,
    top: 50,
    zIndex: 10,
    elevation: 10,
  },
  bossImage: {
    width: "100%",
    height: 586,
  },
  loaderWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  bossHitArea: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 30,
  },
});
