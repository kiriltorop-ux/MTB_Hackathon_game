import { StyleSheet, View, useWindowDimensions } from "react-native";
import { CardClass } from "./CardClass";

type ClassId = "tech" | "athlete" | "traveler" | "gourmet";

type CardsProps = {
  classes: {
    id: ClassId;
    label: string;
    image: any;
    inactiveImage: any;
    stripStart: string;
    stripEnd: string;
  }[];
  selectedClass: ClassId | null;
  setSelectedClass: (id: ClassId) => void;
};

const FIGMA_FRAME_W = 369;
const PAD_H_FIGMA = 15;
const GAP_FIGMA = 9;
const GAP_ROW_FIGMA = 35;
const GAP_TO_FOOTER = 28;

export const Cards = ({
  classes,
  selectedClass,
  setSelectedClass,
}: CardsProps) => {
  const { width } = useWindowDimensions();
  const u = width / FIGMA_FRAME_W;

  const paddingH = PAD_H_FIGMA * u;
  const gap = GAP_FIGMA * u;
  const gapRow = GAP_ROW_FIGMA * u;

  return (
    <View style={[styles.root, { paddingBottom: GAP_TO_FOOTER }]}>
      <View
        style={[
          styles.grid,
          {
            paddingHorizontal: paddingH,
            columnGap: gap,
            rowGap: gapRow,
          },
        ]}
      >
        {classes.map((item, index) => (
          <CardClass
            key={item.id}
            index={index}
            ownClass={item}
            selectedClass={selectedClass}
            setSelectedClass={setSelectedClass}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "flex-end",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
});
