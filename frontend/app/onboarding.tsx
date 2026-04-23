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

export default function OnboardingScreen() {
  const { fontRegular, fontBold, fontSemiBold } = useTheme();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const scale = Math.min(width / 369, height / 800);
  const cardTop = Math.max(18, 119 * scale);
  const sidePadding = Math.max(12, 16 * scale);
  const bottomOffset = Math.max(16, insets.bottom + 12);
  const actionSize = Math.max(46, 52 * scale);

  return (
    <ScreenWrapper title="" hideHeaderBottomBorder>
      <ImageBackground
        source={require("../assets/images/onboarding-1.png")}
        resizeMode="cover"
        style={styles.background}
      >
        {/* Первый градиент (верхний тёмный) - ограничиваем высоту */}
        <LinearGradient
          colors={["#141318", "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[StyleSheet.absoluteFill, { height: height * 0.5 }]}
        />

        {/* Второй градиент (нижний тёмный) - ограничиваем высоту */}
        <LinearGradient
          colors={["transparent", "#141318"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[
            StyleSheet.absoluteFill,
            { top: height * 0.5, height: height * 0.8 },
          ]}
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
            Скорей! Банку грозит опасность!
            {"\n\n"}
            <Text
              style={[
                styles.infoBossName,
                fontBold,
                { fontSize: Math.max(14, 16 * scale) },
              ]}
            >
              Леший Хаоса
            </Text>
            <Text
              style={[
                styles.infoText,
                fontSemiBold,
                { fontSize: Math.max(14, 16 * scale) },
              ]}
            >
              {" "}
              решил, что MTБанк — его личная берлога!
              {"\n\n"}
              Нам нужна твоя помощь!
            </Text>
          </Text>
        </View>

        <OnboardingActions
          sidePadding={sidePadding}
          bottomOffset={bottomOffset}
          actionSize={actionSize}
          onBack={() => router.back()}
          onNext={() => router.push("/onboarding-2")}
          nextLabel="Далее"
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
