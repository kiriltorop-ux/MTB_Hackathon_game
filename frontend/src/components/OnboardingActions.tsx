import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Pressable, StyleProp, StyleSheet, Text, TextStyle, View } from "react-native";

interface OnboardingActionsProps {
  sidePadding: number;
  bottomOffset: number;
  actionSize: number;
  onBack: () => void;
  onNext: () => void;
  nextLabel: string;
  nextFontSize: number;
  fontRegular: StyleProp<TextStyle>;
  nextDisabled?: boolean;
}

export const OnboardingActions: React.FC<OnboardingActionsProps> = ({
  sidePadding,
  bottomOffset,
  actionSize,
  onBack,
  onNext,
  nextLabel,
  nextFontSize,
  fontRegular,
  nextDisabled = false,
}) => {
  return (
    <View
      style={[
        styles.actionsRow,
        { marginHorizontal: sidePadding, marginBottom: bottomOffset },
      ]}
    >
      <Pressable
        style={[styles.backButton, { width: actionSize, height: actionSize }]}
        onPress={onBack}
      >
        <LinearGradient
          colors={["rgba(27,116,253,0.2)", "rgba(246,53,76,0.2)"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.backButtonGradient}
        >
          <Text style={[styles.actionArrow, fontRegular, { opacity: 0.5 }]}>‹</Text>
        </LinearGradient>
      </Pressable>

      <Pressable
        style={[styles.nextButton, { height: actionSize }]}
        onPress={onNext}
        disabled={nextDisabled}
      >
        <LinearGradient
          colors={
            nextDisabled
              ? ["rgba(27,116,253,0.35)", "rgba(246,53,76,0.35)"]
              : ["#1B74FD", "#F6354C"]
          }
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.nextButtonGradient}
        >
          <Text
            style={[
              styles.nextButtonText,
              fontRegular,
              { fontSize: nextFontSize },
              nextDisabled && styles.disabledText,
            ]}
          >
            {nextLabel}
          </Text>
          <Text
            style={[styles.nextArrow, fontRegular, nextDisabled && styles.disabledText]}
          >
            ›
          </Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  actionsRow: {
    marginTop: "auto",
    marginHorizontal: 16,
    marginBottom: 22,
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
  backButton: {
    width: 52,
    height: 52,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 21,
  },
  backButtonGradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  actionArrow: {
    color: "#D9E5FF",
    fontSize: 28,
    lineHeight: 28,
  },
  nextButton: {
    flex: 1,
    height: 52,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 21,
  },
  nextButtonGradient: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
    lineHeight: 28,
  },
  nextArrow: {
    color: "#FFFFFF",
    fontSize: 28,
    lineHeight: 28,
  },
  disabledText: {
    color: "rgba(255,255,255,0.52)",
  },
});
