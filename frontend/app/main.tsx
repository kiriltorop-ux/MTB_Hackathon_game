import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image as ExpoImage } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBoss } from "../src/hooks/useBoss";
import { useUser } from "../src/hooks/useUser";
import { DamageNumber } from "../src/components/DamageNumber";

export default function MainScreen() {
  const insets = useSafeAreaInsets();
  const telegramId = 1;
  const { boss, loading: bossLoading, hit, lastDamage, isHitting } = useBoss(telegramId);
  const { loading: userLoading, refreshUser } = useUser(telegramId);

  const hpRatio =
    boss && boss.maxHp > 0
      ? Math.max(0, Math.min(1, boss.currentHp / boss.maxHp))
      : 0;

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
        source={require("../assets/images/class-select-bg.png")}
        style={styles.bg}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["rgba(18,17,12,0.6)", "rgba(18,17,12,0.85)"]}
          style={StyleSheet.absoluteFill}
        />

        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <ExpoImage source={require("../assets/icons/logo.svg")} style={styles.logo} contentFit="contain" />
          <View style={styles.headerRow}>
            <Pressable onPress={() => router.back()} style={styles.iconBtn}>
              <Ionicons name="close" size={24} color="#fff" />
            </Pressable>
            <Text style={styles.headerTitle}>Главная</Text>
            <View style={styles.iconRow}>
              <Ionicons name="help-circle-outline" size={24} color="#fff" />
              <Ionicons name="volume-high" size={24} color="#fff" />
            </View>
          </View>
        </View>

        <View style={styles.hpWrap}>
          <View style={styles.hpTrack}>
            <LinearGradient
              colors={["#EC3753", "#4A41CA", "#619999"]}
              style={[styles.hpFill, { width: `${Math.round(hpRatio * 100)}%` }]}
            />
          </View>
          <View style={styles.hpTexts}>
            <Text style={styles.hpText}>{boss?.name ?? "Леший"}</Text>
            <Text style={styles.hpText}>
              {boss
                ? `${boss.currentHp.toLocaleString("ru-RU")} / ${boss.maxHp.toLocaleString("ru-RU")}`
                : "0 / 0"}
            </Text>
          </View>
        </View>

        <View style={styles.bossWrap}>
          {userLoading || bossLoading ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <TouchableWithoutFeedback onPressIn={onBossHit}>
              <View style={styles.bossHitArea}>
                <Image
                  source={require("../assets/images/boss.jpg")}
                  style={styles.boss}
                  resizeMode="contain"
                />
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

        <View style={[styles.bottomNav, { paddingBottom: insets.bottom + 6 }]}>
          <Pressable style={styles.navItem} onPress={() => router.push("/leaderboard")}>
            <Text style={styles.navEmoji}>🌰</Text>
            <Text style={styles.navText}>Топ</Text>
          </Pressable>
          <Pressable style={styles.navItem}>
            <Text style={styles.navEmoji}>⚔️</Text>
            <Text style={styles.navText}>Баттл</Text>
          </Pressable>
          <Pressable style={styles.navItem} onPress={() => router.push("/rewards")}>
            <Text style={styles.navEmoji}>🏆</Text>
            <Text style={styles.navText}>Задания</Text>
          </Pressable>
          <Pressable style={styles.navItem} onPress={() => router.push("/leaderboard")}>
            <Text style={styles.navEmoji}>🧭</Text>
            <Text style={styles.navText}>Друзья</Text>
          </Pressable>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#12110c" },
  bg: { flex: 1 },
  header: { paddingHorizontal: 14 },
  logo: { width: 132, height: 22, marginBottom: 8 },
  headerRow: { flexDirection: "row", alignItems: "center" },
  iconBtn: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  headerTitle: { flex: 1, textAlign: "center", color: "#fff", fontSize: 33 / 1.6, fontFamily: "PPNeueMachina-Regular" },
  iconRow: { flexDirection: "row", gap: 12, width: 56 },
  hpWrap: { marginTop: 14, paddingHorizontal: 16 },
  hpTrack: { height: 16, borderWidth: 1, borderColor: "rgba(92,137,162,0.86)", borderRadius: 12, overflow: "hidden", backgroundColor: "rgba(0,0,0,0.2)" },
  hpFill: { width: "82%", height: "100%" },
  hpTexts: { flexDirection: "row", justifyContent: "space-between", marginTop: 4 },
  hpText: { color: "#fff", fontFamily: "PPNeueMachina-Regular", fontSize: 16 },
  bossWrap: { flex: 1, alignItems: "center", justifyContent: "center" },
  bossHitArea: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  boss: { width: "92%", height: "72%" },
  bottomNav: { borderTopLeftRadius: 16, borderTopRightRadius: 16, backgroundColor: "#18171c", flexDirection: "row", justifyContent: "space-around", alignItems: "center", paddingTop: 8 },
  navItem: { alignItems: "center", justifyContent: "center", width: 74, height: 66 },
  navEmoji: { fontSize: 30 / 1.1 },
  navText: { color: "#CCE0FF", fontFamily: "PPNeueMachina-Regular", fontSize: 15 },
});
