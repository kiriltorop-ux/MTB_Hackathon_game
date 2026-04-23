import { useTheme } from "@/src/context/ThemeContext";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

type ClassId = "tech" | "athlete" | "traveler" | "gourmet";

type CardClassProps = {
  index: number;
  ownClass: {
    id: ClassId;
    label: string;
    image: any;
    inactiveImage: any;
    stripStart: string;
    stripEnd: string;
  };
  selectedClass: ClassId | null;
  setSelectedClass: (id: ClassId) => void;
};

export const CardClass = ({
  index,
  ownClass,
  selectedClass,
  setSelectedClass,
}: CardClassProps) => {
  const isOtherSelected =
    selectedClass !== null && selectedClass !== ownClass.id;
  const isDimmed = isOtherSelected;
  const activeImageStyle =
    ownClass.id === "tech"
      ? styles.classImageTech
      : ownClass.id === "athlete"
      ? styles.classImageAthlete
      : ownClass.id === "traveler"
      ? styles.classImageTraveler
      : styles.classImageGourmet;
  const inactiveImageStyle =
    ownClass.id === "tech"
      ? styles.classImageTechInactive
      : ownClass.id === "athlete"
      ? styles.classImageAthleteInactive
      : ownClass.id === "traveler"
      ? styles.classImageTravelerInactive
      : styles.classImageGourmetInactive;
  const imageStyle = isDimmed ? inactiveImageStyle : activeImageStyle;
  const stripPadStyle =
    ownClass.id === "athlete" ? styles.stripPadAthlete : styles.stripPadDefault;

  const { fontRegular } = useTheme();
  const rowIndex = Math.floor(index / 2);

  return (
    <Pressable
      onPress={() => setSelectedClass(ownClass.id)}
      style={[
        styles.cardPressable,
        // Верхний ряд выше по touch/рисованию, чтобы зоны нажатия не перекрывались нижним
        rowIndex === 0 ? styles.topRowCard : styles.bottomRowCard,
      ]}
    >
      <View style={styles.cardInner}>
        <LinearGradient
          colors={["#4A41CA", "#6A5ACD", "#4A41CA"]}
          locations={[0, 0.5, 1]}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          style={styles.cardGradient}
        />
        <View style={styles.cardColorOverlay} />
        {isOtherSelected && <View style={styles.dimmingOverlay} />}
      </View>

      <Image
        source={isOtherSelected ? ownClass.inactiveImage : ownClass.image}
        contentFit="contain"
        style={[styles.classImage, imageStyle]}
      />

      <LinearGradient
        colors={
          isDimmed
            ? ["#1E4273", "#1E4273"]
            : [ownClass.stripStart, ownClass.stripEnd]
        }
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.cardLabelStrip}
      >
        <View style={[styles.stripRow, stripPadStyle]}>
          <Text style={[styles.cardLabel, fontRegular]} numberOfLines={1}>
            {ownClass.label}
          </Text>
          <Ionicons
            name="help-circle-outline"
            size={18}
            color="#FFFFFF"
            style={styles.stripIcon}
          />
        </View>
      </LinearGradient>
    </Pressable>
  );
};

const INNER_CARD_W = 165;
const INNER_CARD_H = 182;
const INNER_MT = 10;
const LABEL_H = 44;
const CARD_H = 213;
const INNER_BOTTOM_Y = INNER_MT + INNER_CARD_H; // 192
const INACTIVE_IMAGE_SCALE = 0.62;

const buildInactiveFrame = (activeWidth: number, activeHeight: number) => {
  const width = Math.round(activeWidth * INACTIVE_IMAGE_SCALE);
  const height = Math.round(activeHeight * INACTIVE_IMAGE_SCALE);
  return {
    width,
    height,
    left: Math.round((INNER_CARD_W - width) / 2),
    top: INNER_BOTTOM_Y - height,
  };
};

const TECH_INACTIVE = buildInactiveFrame(210, 312);
const ATHLETE_INACTIVE = buildInactiveFrame(208, 285);
const TRAVELER_INACTIVE = buildInactiveFrame(208, 310);
const GOURMET_INACTIVE = buildInactiveFrame(212, 314);

const styles = StyleSheet.create({
  cardPressable: {
    position: "relative",
    overflow: "visible",
    width: INNER_CARD_W,
    height: CARD_H,
  },
  topRowCard: {
    zIndex: 20,
  },
  bottomRowCard: {
    zIndex: 10,
  },
  cardInner: {
    position: "relative",
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "#181A33",
    borderWidth: 2,
    borderColor: "#435164",
    zIndex: 3,
    width: INNER_CARD_W,
    height: INNER_CARD_H,
    marginTop: INNER_MT,
  },
  cardGradient: {
    position: "absolute",
    width: "120%",
    height: "40%",
    opacity: 0.03,
    transform: [{ rotate: "31deg" }],
    left: -INNER_CARD_W * 0.5,
    top: -INNER_CARD_H * 0.5,
  },
  cardColorOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#273548",
    opacity: 0.68,
    zIndex: 1,
  },
  classImage: {
    position: "absolute",
    zIndex: 3,
  },
  classImageTech: {
    left: -23,
    top: INNER_BOTTOM_Y - 312, // -120
    width: 210,
    height: 312,
  },
  classImageTechInactive: {
    left: TECH_INACTIVE.left,
    top: TECH_INACTIVE.top,
    width: TECH_INACTIVE.width,
    height: TECH_INACTIVE.height,
  },
  classImageAthlete: {
    left: -22,
    top: INNER_BOTTOM_Y - 310, // -118
    width: 208,
    height: 310,
  },
  classImageAthleteInactive: {
    left: ATHLETE_INACTIVE.left,
    top: ATHLETE_INACTIVE.top,
    width: ATHLETE_INACTIVE.width,
    height: ATHLETE_INACTIVE.height,
  },
  classImageTraveler: {
    left: -22,
    top: INNER_BOTTOM_Y - 310, // -118
    width: 208,
    height: 310,
  },
  classImageTravelerInactive: {
    left: TRAVELER_INACTIVE.left,
    top: TRAVELER_INACTIVE.top,
    width: TRAVELER_INACTIVE.width,
    height: TRAVELER_INACTIVE.height,
  },
  classImageGourmet: {
    left: -24,
    top: INNER_BOTTOM_Y - 314, // -122
    width: 212,
    height: 314,
  },
  classImageGourmetInactive: {
    left: GOURMET_INACTIVE.left,
    top: GOURMET_INACTIVE.top,
    width: GOURMET_INACTIVE.width,
    height: GOURMET_INACTIVE.height,
  },
  dimmingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(11, 18, 30, 0.52)",
    zIndex: 8,
  },
  classDimOverlay: {
    position: "absolute",
    left: 0,
    top: INNER_MT,
    height: CARD_H,
    width: INNER_CARD_W,
    borderRadius: 15,
    backgroundColor: "rgba(17, 22, 35, 0.35)",
    zIndex: 7,
  },
  cardLabelStrip: {
    position: "absolute",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    height: LABEL_H,
    width: INNER_CARD_W * (164 / 165),
    left: 0.5,
    top: INNER_CARD_H,
    zIndex: 2,
  },
  stripRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 6,
    paddingBottom: 0,
  },
  stripPadDefault: {
    gap: 4,
    paddingLeft: 30,
    paddingRight: 19,
  },
  stripPadAthlete: {
    gap: 10,
    paddingLeft: 17,
    paddingRight: 16,
  },
  stripIcon: {
    flexShrink: 0,
    marginTop: 3,
  },
  dimmedLabelStrip: {
    opacity: 1,
  },
  cardLabel: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 16,
    lineHeight: 20,
    includeFontPadding: false,
    marginTop: 2,
  },
});
