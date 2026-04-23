import { useEffect, useState } from "react";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBoss } from "../src/hooks/useBoss";
import { useUser } from "../src/hooks/useUser";
import { BattleFooter } from "../src/components/widgets/BattleFooter";
import { BattleHeader } from "../src/components/widgets/BattleHeader";
import { BattleLeftPanel } from "../src/components/widgets/BattleLeftPanel";
import { BossStage } from "../src/components/widgets/BossStage";

const FIGMA_W = 369;
const NAV_BATTLE_ICON = require("../assets/icons/nav-battle.png");

export default function MainScreen() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const telegramId = 1;
  const {
    boss,
    loading: bossLoading,
    hit,
    lastDamage,
    isHitting,
  } = useBoss(telegramId);
  const { user, loading: userLoading, refreshUser } = useUser(telegramId);
  const [isSoundOn, setIsSoundOn] = useState(true);

  // Screen scale relative to Figma width (369).
  const u = width / FIGMA_W;
  const [displayHp, setDisplayHp] = useState({ current: 0, max: 0 });

  const currentHpValue =
    typeof boss?.currentHp === "number" && Number.isFinite(boss.currentHp)
      ? boss.currentHp
      : 0;
  const maxHpValue =
    typeof boss?.maxHp === "number" && Number.isFinite(boss.maxHp)
      ? boss.maxHp
      : 0;
  const hpRatio =
    maxHpValue > 0 ? Math.max(0, Math.min(1, currentHpValue / maxHpValue)) : 0;

  useEffect(() => {
    if (maxHpValue > 0) {
      setDisplayHp({
        current: Math.max(0, currentHpValue),
        max: maxHpValue,
      });
    }
  }, [currentHpValue, maxHpValue]);

  // Keeps tap-to-hit behavior from previous implementation.
  const onBossHit = async (event: any) => {
    if (bossLoading || isHitting) return;
    const { locationX, locationY } = event.nativeEvent;
    const result = await hit(locationX, locationY);
    if (result?.success) {
      refreshUser();
    }
  };

  return (
    <View style={styles.screen}>
      <ImageBackground
        source={require("../assets/images/index-bg.png")}
        style={styles.bg}
        resizeMode="contain"
      >
        <LinearGradient
          colors={[
            "rgba(17,16,22,0.88)",
            "rgba(17,16,22,0.35)",
            "rgba(17,16,22,0.92)",
          ]}
          locations={[0, 0.27, 1]}
          style={StyleSheet.absoluteFill}
        />
        <LinearGradient
          colors={["rgba(17,16,22,0.95)", "rgba(17,16,22,0)"]}
          locations={[0, 1]}
          style={styles.topShade}
        />

        <BattleHeader
          u={u}
          isSoundOn={isSoundOn}
          onExit={() => router.back()}
          onSoundToggle={() => setIsSoundOn((prev) => !prev)}
        />

        {/* HP panel: tweak margins and texts from this block */}
        <View
          style={[
            styles.hpWrap,
            { marginTop: 10 * u, paddingHorizontal: 16 * u },
          ]}
        >
          <View style={styles.hpRightStat}>
            <Text style={[styles.hpBossName, { fontSize: 16 * u }]}>Леший</Text>
          </View>
          <View style={styles.hpTrack}>
            <LinearGradient
              colors={["#EC3753", "#4A41CA", "#619999"]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={[
                styles.hpFill,
                {
                  width: `${Math.round(
                    (displayHp.max > 0
                      ? Math.max(
                          0,
                          Math.min(1, displayHp.current / displayHp.max),
                        )
                      : hpRatio) * 100,
                  )}%`,
                },
              ]}
            />
          </View>
          <View style={styles.hpTopRow}>
            <View style={styles.hpLeftStat}>
              <Image
                source={NAV_BATTLE_ICON}
                style={[styles.swordIcon, { width: 24 * u, height: 24 * u }]}
              />
              <Text style={[styles.hpText, { fontSize: 20 * u }]}>
                {(user?.total_damage ?? 0).toLocaleString("ru-RU")}
              </Text>
            </View>
            <Text style={[styles.hpBossValue, { fontSize: 16 * u }]}>
              {`${(displayHp.max > 0
                ? displayHp.current
                : currentHpValue
              ).toLocaleString("ru-RU")} / ${(
                displayHp.max || maxHpValue
              ).toLocaleString("ru-RU")}`}
            </Text>
          </View>
        </View>

        <BossStage
          loading={userLoading || bossLoading}
          onBossHit={onBossHit}
          lastDamage={lastDamage}
        />
        <BattleLeftPanel u={u} user={user ?? null} />
        <BattleFooter bottomInset={insets.bottom} u={u} />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#12110c", position: "relative" },
  bg: { flex: 1 },
  topShade: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 230,
  },
  hpWrap: { position: "relative", zIndex: 2, elevation: 2 },
  hpTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  hpLeftStat: {
    gap: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  swordIcon: {},
  hpText: {
    color: "#fff",
    fontFamily: "PPNeueMachina-Regular",
    lineHeight: 24,
  },
  hpRightStat: { alignItems: "flex-end", marginBottom: 6 },
  hpBossName: {
    color: "#fff",
    fontFamily: "PPNeueMachina-Regular",
  },
  hpBossValue: {
    color: "#fff",
    fontFamily: "PPNeueMachina-Regular",
  },
  hpTrack: {
    height: 16,
    borderWidth: 1,
    borderColor: "rgba(92,137,162,0.86)",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  hpFill: { height: "100%", borderRadius: 12 },
});
