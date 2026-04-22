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

const rewards = Array.from({ length: 6 }).map((_, i) => ({
  id: i + 1,
  title: "Голубь",
  text: "Выбирай класс и врывайся в битву вместе с друзьями.",
}));

export default function RewardsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.screen}>
      <ImageBackground
        source={require("../assets/images/class-select-bg.png")}
        style={styles.bg}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["rgba(18,17,12,0.65)", "rgba(18,17,12,0.9)"]}
          style={StyleSheet.absoluteFill}
        />

        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <ExpoImage source={require("../assets/icons/logo.svg")} style={styles.logo} contentFit="contain" />
          <View style={styles.headerRow}>
            <Pressable onPress={() => router.back()} style={styles.iconBtn}>
              <Ionicons name="close" size={24} color="#fff" />
            </Pressable>
            <Text style={styles.headerTitle}>Награды</Text>
            <View style={styles.iconBtn}>
              <Ionicons name="volume-high" size={24} color="#fff" />
            </View>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
          {rewards.map((item) => (
            <View key={item.id} style={styles.card}>
              <Image source={require("../assets/images/class-athlete.png")} style={styles.trophy} resizeMode="contain" />
              <Text style={styles.cardTitle}>{item.title}</Text>
              <View style={styles.progressTrack}>
                <LinearGradient
                  colors={["#D53E66", "#4A41CA", "#0BD3D3"]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={styles.progressFill}
                />
              </View>
              <Text style={styles.cardText}>{item.text}</Text>
            </View>
          ))}
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
  grid: { paddingHorizontal: 12, paddingTop: 10, paddingBottom: 24, flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: 14 },
  card: { width: "48.5%", borderRadius: 16, backgroundColor: "#181A33", padding: 12 },
  trophy: { width: "100%", height: 110, marginTop: -16, marginBottom: -8 },
  cardTitle: { color: "#fff", fontSize: 36 / 1.6, fontFamily: "PPNeueMachina-Bold" },
  progressTrack: { height: 3, backgroundColor: "#000", borderRadius: 10, marginTop: 4, overflow: "hidden", marginBottom: 8 },
  progressFill: { height: "100%", width: "72%" },
  cardText: { color: "#DDE6F8", fontFamily: "PPNeueMachina-Regular", fontSize: 15, lineHeight: 24 / 1.2 },
});
