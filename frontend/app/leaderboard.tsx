import { useState } from "react";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image as ExpoImage } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Mode = "friends" | "world";

const podiumData = [
  { place: 1, name: "Голубь", value: 500, image: require("../assets/images/class-tech.png") },
  { place: 2, name: "Голубь", value: 500, image: require("../assets/images/class-gourmet.png") },
  { place: 3, name: "Голубь", value: 500, image: require("../assets/images/class-athlete.png") },
];

const listData = [
  { place: 4, name: "Голубь", value: 500, image: require("../assets/images/class-athlete.png") },
  { place: 5, name: "Голубь", value: 500, image: require("../assets/images/class-traveler.png") },
  { place: 6, name: "Голубь", value: 500, image: require("../assets/images/class-athlete.png") },
  { place: 7, name: "Голубь", value: 500, image: require("../assets/images/class-tech.png") },
  { place: 8, name: "Голубь", value: 500, image: require("../assets/images/class-gourmet.png") },
];

export default function LeaderboardScreen() {
  const [mode, setMode] = useState<Mode>("friends");
  const [isSoundOn, setIsSoundOn] = useState(true);
  const insets = useSafeAreaInsets();
  const isFriends = mode === "friends";

  return (
    <View style={styles.screen}>
      <ImageBackground
        source={require("../assets/images/class-select-bg.png")}
        style={styles.bg}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["rgba(18,17,12,0.7)", "rgba(18,17,12,0.9)"]}
          style={StyleSheet.absoluteFill}
        />

        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <ExpoImage source={require("../assets/icons/logo.svg")} style={styles.logo} contentFit="contain" />
          <View style={styles.headerRow}>
            <Pressable onPress={() => router.back()} style={styles.iconBtn}>
              <Ionicons name="close" size={24} color="#fff" />
            </Pressable>
            <Text style={styles.headerTitle}>Рейтинг</Text>
            <Pressable onPress={() => setIsSoundOn(!isSoundOn)} style={styles.iconBtn}>
              <Ionicons name={isSoundOn ? "volume-high" : "volume-mute"} size={24} color="#fff" />
            </Pressable>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.modeRow}>
            <Pressable
              style={[styles.modeBtn, mode === "world" && styles.modeBtnActive]}
              onPress={() => setMode("world")}
            >
              <Ionicons name="globe-outline" size={24} color="#66B2FF" />
            </Pressable>
            <Pressable
              style={[styles.modeBtn, mode === "friends" && styles.modeBtnActive]}
              onPress={() => setMode("friends")}
            >
              <Ionicons name="people-outline" size={24} color="#66B2FF" />
            </Pressable>
          </View>

          <View style={styles.podiumRow}>
            {podiumData.map((item) => (
              <LinearGradient
                key={item.place}
                colors={
                  isFriends ? ["#EC3753", "#861F2F"] : ["#21367D", "#3C62E3"]
                }
                style={styles.podiumCard}
              >
                <Text style={styles.placeTop}>{item.place}</Text>
                <Image source={item.image} style={styles.podiumImage} resizeMode="contain" />
                <Text style={styles.podiumName}>{item.name}</Text>
                <Text style={styles.podiumValue}>⚔ {item.value}</Text>
              </LinearGradient>
            ))}
          </View>

          <View style={styles.list}>
            {listData.map((row) => (
              <LinearGradient
                key={row.place}
                colors={
                  isFriends ? ["#EC3753", "#861F2F"] : ["#21367D", "#3C62E3"]
                }
                style={styles.listCard}
              >
                <Text style={styles.listPlaceLeft}>{row.place}</Text>
                <Image source={row.image} style={styles.listAvatarLeft} resizeMode="contain" />
                <View style={styles.listTextWrap}>
                  <Text style={styles.listName}>{row.name}</Text>
                  <Text style={styles.listValue}>⚔ {row.value}</Text>
                </View>
                <Text style={styles.listPlaceRight}>{row.place}</Text>
              </LinearGradient>
            ))}
          </View>

          <Pressable style={styles.backBar} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={20} color="#fff" />
            <Text style={styles.backBarText}>НАЗАД</Text>
          </Pressable>
        </ScrollView>
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
  content: { paddingHorizontal: 12, paddingBottom: 18, gap: 10 },
  modeRow: { flexDirection: "row", justifyContent: "flex-end", gap: 8 },
  modeBtn: { width: 54, height: 52, borderRadius: 8, borderWidth: 1, borderColor: "#AA3252", backgroundColor: "rgba(17,54,102,0.32)", alignItems: "center", justifyContent: "center" },
  modeBtnActive: { borderWidth: 3 },
  podiumRow: { flexDirection: "row", gap: 6 },
  podiumCard: { flex: 1, minHeight: 142, borderRadius: 9, padding: 6, overflow: "hidden" },
  placeTop: { position: "absolute", left: 8, top: -8, color: "#D0D0D0", fontSize: 64, fontFamily: "PPNeueMachina-Bold", opacity: 0.9 },
  podiumImage: { width: "100%", height: 92, marginTop: 10 },
  podiumName: { color: "#fff", fontFamily: "PPNeueMachina-Regular", fontSize: 28 / 1.7, marginTop: -4 },
  podiumValue: { color: "#fff", fontFamily: "PPNeueMachina-Regular", fontSize: 17 },
  list: { gap: 8, marginTop: 4 },
  listCard: { borderRadius: 9, minHeight: 62, flexDirection: "row", alignItems: "center", paddingHorizontal: 8 },
  listPlaceLeft: { color: "#CDCDCD", fontSize: 58 / 1.3, fontFamily: "PPNeueMachina-Bold", width: 30 },
  listAvatarLeft: { width: 50, height: 56, marginLeft: 4 },
  listTextWrap: { flex: 1, marginLeft: 6 },
  listName: { color: "#fff", fontSize: 36 / 1.7, fontFamily: "PPNeueMachina-Bold" },
  listValue: { color: "#E5E5E5", fontSize: 14, fontFamily: "PPNeueMachina-Regular", marginTop: -2 },
  listPlaceRight: { color: "#CDCDCD", fontSize: 58 / 1.3, fontFamily: "PPNeueMachina-Bold", width: 32, textAlign: "right" },
  backBar: { marginTop: 6, height: 52, borderRadius: 8, borderWidth: 1, borderColor: "#AA3252", backgroundColor: "rgba(17,54,102,0.32)", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 },
  backBarText: { color: "#fff", fontSize: 16, fontFamily: "PPNeueMachina-Regular" },
});
