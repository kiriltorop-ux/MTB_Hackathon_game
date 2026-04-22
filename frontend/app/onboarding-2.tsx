import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScreenWrapper } from "@/src/components/ScreenWrapper";
import { OnboardingActions } from "@/src/components/OnboardingActions";
import { useTheme } from "@/src/context/ThemeContext";

export default function OnboardingSecondScreen() {
  const { fontRegular, fontBold, fontSemiBold } = useTheme();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const scale = Math.min(width / 369, height / 800);
  const sidePadding = Math.max(12, 16 * scale);
  const cardTop = Math.max(18, 119 * scale);
  const bottomOffset = Math.max(16, insets.bottom + 12);
  const actionSize = Math.max(46, 52 * scale);

  return (
    <ScreenWrapper title="" hideHeaderBottomBorder>
      <ImageBackground
        source={require("../assets/images/onboarding-2.png")}
        resizeMode="cover"
        style={styles.background}
      >
        <LinearGradient
          colors={["#141318", "rgba(20, 19, 24, 0)"]}
          locations={[0.050898, 0.17864]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <LinearGradient
          colors={["#141318", "rgba(20, 19, 24, 0)"]}
          locations={[0.15475, 0.48995]}
          start={{ x: 0.5, y: 1 }}
          end={{ x: 0.5, y: 0 }}
          style={StyleSheet.absoluteFill}
        />

        <View
          style={[
            styles.infoCard,
            { marginTop: cardTop, marginHorizontal: sidePadding },
          ]}
        >
          <Text
            style={[
              styles.infoText,
              fontSemiBold,
              { fontSize: Math.max(14, 16 * scale) },
            ]}
          >
            Выбирай класс и врывайся в битву вместе с друзьями.
            {"\n\n"}В зависимости от класса за каждый удар получаешь{" "}
            <Text
              style={[
                styles.infoBossName,
                fontBold,
                { fontSize: Math.max(14, 16 * scale) },
              ]}
            >
              реальный профит
            </Text>
            .{"\n\n"}
            Ну что, покажем ему, кто тут босс?
          </Text>
        </View>

        <OnboardingActions
          sidePadding={sidePadding}
          bottomOffset={bottomOffset}
          actionSize={actionSize}
          onBack={() => router.back()}
          onNext={() => router.push("/class-select")}
          nextLabel="Выбрать Класс"
          nextFontSize={Math.max(18, 20 * scale)}
          fontRegular={fontRegular}
        />
      </ImageBackground>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  infoCard: {
    marginTop: 119,
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#175ACA",
    backgroundColor: "#11418D",
  },
  infoText: {
    color: "#EDF3FD",
    fontSize: 16,
    lineHeight: 23,
  },
  infoBossName: {
    color: "#FFFFFF",
    fontSize: 16,
    lineHeight: 22,
  },
});
