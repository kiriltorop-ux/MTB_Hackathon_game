import { useMemo, useState } from "react";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  BackHandler,
  ImageBackground,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScreenWrapper } from "@/src/components/ScreenWrapper";
import { OnboardingActions } from "@/src/components/OnboardingActions";
import { BrandLogo } from "@/src/components/BrandLogo";
import { useTheme } from "@/src/context/ThemeContext";
import { Cards } from "@/src/components/Classes/Cards";

type ClassId = "tech" | "athlete" | "traveler" | "gourmet";

const CLASSES: {
  id: ClassId;
  label: string;
  image: any;
  inactiveImage: any;
  stripStart: string;
  stripEnd: string;
}[] = [
  {
    id: "tech",
    label: "Стилист",
    image: require("../assets/images/class-tech.png"),
    inactiveImage: require("../assets/images/class-tech-inactive.png"),
    stripStart: "#551054",
    stripEnd: "#BB23B9",
  },
  {
    id: "athlete",
    label: "Атлет",
    image: require("../assets/images/class-athlete.png"),
    inactiveImage: require("../assets/images/class-athlete-inactive.png"),
    stripStart: "#105055",
    stripEnd: "#23B0BB",
  },
  {
    id: "traveler",
    label: "Турист",
    image: require("../assets/images/class-traveler.png"),
    inactiveImage: require("../assets/images/class-traveler-inactive.png"),
    stripStart: "#553210",
    stripEnd: "#BB6E23",
  },
  {
    id: "gourmet",
    label: "Гурман",
    image: require("../assets/images/class-gourmet.png"),
    inactiveImage: require("../assets/images/class-gourmet-inactive.png"),
    stripStart: "#4572A0",
    stripEnd: "#19293A",
  },
];

export default function ClassSelectScreen() {
  const { fontRegular } = useTheme();
  const [selectedClass, setSelectedClass] = useState<ClassId | null>(null);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const scale = Math.min(width / 369, 1.15);
  const sidePadding = Math.max(12, 16 * scale);
  const bottomOffset = Math.max(16, insets.bottom + 12);
  const actionSize = Math.max(46, 52 * scale);

  const handleExit = () => {
    if (Platform.OS === "android") {
      BackHandler.exitApp();
      return;
    }
    router.back();
  };

  const logoOverlayLayout = useMemo(
    () =>
      StyleSheet.create({
        padded: {
          paddingTop: insets.top + 8,
          paddingHorizontal: 15,
        },
      }),
    [insets.top],
  );

  return (
    <ScreenWrapper title="" showHeader={false}>
      <ImageBackground
        source={require("../assets/images/class-select-bg.png")}
        style={styles.screen}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["rgba(4, 6, 12, 0.78)", "rgba(4, 6, 12, 0)"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.topBgShade}
          pointerEvents="none"
        />
        <View style={[styles.logoOverlay, logoOverlayLayout.padded]}>
          <BrandLogo size={24} minSize={24} style={styles.brandLogo} />
          <View style={styles.headerControlsRow}>
            <Pressable onPress={handleExit} style={styles.iconButton}>
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </Pressable>
            <Text style={[styles.headerTitle, fontRegular]}>
              Выберите Класс
            </Text>
            <Pressable
              onPress={() => setIsSoundOn((v) => !v)}
              style={styles.iconButton}
            >
              <Ionicons
                name={isSoundOn ? "volume-high" : "volume-mute"}
                size={24}
                color="#FFFFFF"
              />
            </Pressable>
          </View>
        </View>

        <Cards
          classes={CLASSES}
          selectedClass={selectedClass}
          setSelectedClass={setSelectedClass}
        />

        <OnboardingActions
          sidePadding={sidePadding}
          bottomOffset={bottomOffset}
          actionSize={actionSize}
          onBack={() => router.back()}
          onNext={() => selectedClass && router.push("/")}
          nextDisabled={!selectedClass}
          nextLabel={"В Бой"}
          nextFontSize={Math.max(18, 20 * scale)}
          fontRegular={fontRegular}
        />
      </ImageBackground>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  topBgShade: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 280,
    zIndex: 2,
  },
  logoOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 30,
    alignItems: "center",
  },
  brandLogo: {
    alignSelf: "flex-start",
    fontSize: 24,
    lineHeight: 24,
    marginBottom: 8,
    marginLeft: 15,
  },
  headerControlsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 2,
  },
  iconButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.5,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 20,
    lineHeight: 20,
  },
});
