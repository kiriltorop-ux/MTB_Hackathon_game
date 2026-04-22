import { useMemo, useState } from "react";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScreenWrapper } from "@/src/components/ScreenWrapper";
import { OnboardingActions } from "@/src/components/OnboardingActions";
import { BrandLogo } from "@/src/components/BrandLogo";
import { useTheme } from "@/src/context/ThemeContext";

type ClassId = "tech" | "athlete" | "traveler" | "gourmet";

const CLASSES: {
  id: ClassId;
  label: string;
  image: any;
  stripStart: string;
  stripEnd: string;
}[] = [
  {
    id: "tech",
    label: "Стилист",
    image: require("../assets/images/class-tech.png"),
    stripStart: "#551054",
    stripEnd: "#551054",
  },
  {
    id: "athlete",
    label: "Атлет",
    image: require("../assets/images/class-athlete.png"),
    stripStart: "#105055",
    stripEnd: "#23B0BB",
  },
  {
    id: "traveler",
    label: "Путешественник",
    image: require("../assets/images/class-traveler.png"),
    stripStart: "#553210",
    stripEnd: "#BB6E23",
  },
  {
    id: "gourmet",
    label: "Гурман",
    image: require("../assets/images/class-gourmet.png"),
    stripStart: "#4572A0",
    stripEnd: "#19293A",
  },
];

export default function ClassSelectScreen() {
  const { fontRegular } = useTheme();
  const [selectedClass, setSelectedClass] = useState<ClassId | null>(null);
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const metrics = useMemo(() => {
    const contentWidth = Math.min(width - 24, 369);
    const horizontalPadding = Math.max(12, (width - contentWidth) / 2);
    const gap = Math.max(8, Math.round(contentWidth * 0.026));
    const cardWidth = (contentWidth - gap) / 2;
    const imageOverflowTop = Math.max(56, Math.round(cardWidth * 0.45));
    const cardBodyHeight = Math.max(182, Math.round(cardWidth * 1.11));
    const cardLabelHeight = Math.max(42, Math.round(cardWidth * 0.265));
    const cardHeight = imageOverflowTop + cardBodyHeight;
    const actionSize = Math.max(46, Math.round(cardWidth * 0.32));
    const headerOffset = insets.top + 90;
    return {
      horizontalPadding,
      gap,
      cardWidth,
      cardHeight,
      imageOverflowTop,
      cardBodyHeight,
      cardLabelHeight,
      actionSize,
      bottomOffset: Math.max(14, insets.bottom + 10),
      headerOffset,
    };
  }, [insets.bottom, insets.top, width]);

  return (
    <ScreenWrapper title="Выберите Класс" showHeader hideHeaderBottomBorder>
      <ImageBackground
        source={require("../assets/images/class-select-bg.png")}
        style={styles.screen}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["rgba(18,17,12,0.7)", "rgba(18,17,12,0.92)"]}
          style={StyleSheet.absoluteFill}
        />

        <View
          style={[
            styles.logoOverlay,
            {
              paddingTop: insets.top + 8,
              paddingHorizontal: metrics.horizontalPadding,
            },
          ]}
        >
          <BrandLogo size={24} minSize={24} style={styles.brandLogo} />
        </View>

        <View
          style={[
            styles.grid,
            {
              paddingHorizontal: metrics.horizontalPadding,
              marginTop: metrics.headerOffset,
              columnGap: metrics.gap,
              rowGap: metrics.gap,
            },
          ]}
        >
          {CLASSES.map((item) => {
            const isActive = selectedClass === item.id;
            const isDimmed = selectedClass !== null && !isActive;

            return (
              <Pressable
                key={item.id}
                onPress={() => setSelectedClass(item.id)}
                style={[
                  styles.card,
                  {
                    width: metrics.cardWidth,
                    height: metrics.cardHeight,
                  },
                ]}
              >
                <View
                  style={[
                    styles.cardBody,
                    {
                      marginTop: metrics.imageOverflowTop,
                      height: metrics.cardBodyHeight,
                      borderColor: isActive ? "#F5B65A" : "#435164",
                      borderBottomLeftRadius: 0,
                      borderBottomRightRadius: 0,
                    },
                  ]}
                >
                  <LinearGradient
                    colors={["#2A3B5A", "#1A2940"]}
                    style={StyleSheet.absoluteFill}
                  />
                  {isDimmed && <View style={styles.dimmingOverlay} />}
                </View>
                <Image
                  source={item.image}
                  resizeMode="contain"
                  style={[
                    styles.classImage,
                    {
                      top: Math.max(0, metrics.imageOverflowTop - 76),
                      height: metrics.cardBodyHeight + 76,
                    },
                  ]}
                />
                {isDimmed && (
                  <View
                    style={[
                      styles.classDimOverlay,
                      {
                        top: metrics.imageOverflowTop,
                        height: metrics.cardBodyHeight,
                      },
                    ]}
                  />
                )}
                <LinearGradient
                  colors={
                    selectedClass !== null && !isActive
                      ? ["#1E4273", "#1E4273"]
                      : [item.stripStart, item.stripEnd]
                  }
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={[
                    styles.cardLabelStrip,
                    isDimmed && styles.dimmedLabelStrip,
                    {
                      top:
                        metrics.imageOverflowTop +
                        metrics.cardBodyHeight -
                        metrics.cardLabelHeight,
                      height: metrics.cardLabelHeight,
                    },
                  ]}
                >
                  <Text
                    style={[styles.cardLabel, fontRegular]}
                    numberOfLines={1}
                  >
                    {item.label}
                  </Text>
                </LinearGradient>
              </Pressable>
            );
          })}
        </View>

        <OnboardingActions
          sidePadding={metrics.horizontalPadding}
          bottomOffset={metrics.bottomOffset}
          actionSize={metrics.actionSize}
          onBack={() => router.back()}
          onNext={() => router.replace("/main")}
          nextLabel="В Бой"
          nextFontSize={38 / 2}
          fontRegular={fontRegular}
          nextDisabled={!selectedClass}
        />
      </ImageBackground>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
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
    fontSize: 24,
    lineHeight: 24,
    marginBottom: 2,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  card: {
    position: "relative",
    overflow: "visible",
  },
  cardBody: {
    borderRadius: 15,
    borderWidth: 2,
    overflow: "hidden",
    backgroundColor: "#181A33",
  },
  classImage: {
    position: "absolute",
    left: 0,
    right: 0,
    width: "100%",
    zIndex: 2,
  },
  dimmingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(17, 22, 35, 0.48)",
  },
  classDimOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    backgroundColor: "rgba(17, 22, 35, 0.35)",
    zIndex: 3,
  },
  cardLabelStrip: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    zIndex: 4,
    borderTopWidth: 0,
  },
  dimmedLabelStrip: {
    opacity: 1,
  },
  cardLabel: {
    color: "#FFFFFF",
    fontSize: 29 / 1.8,
    textAlign: "center",
  },
});
