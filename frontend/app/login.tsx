import { router } from "expo-router";
import { ScreenWrapper } from "@/src/components/ScreenWrapper";
import { LinearGradient } from "expo-linear-gradient";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BrandLogo } from "@/src/components/BrandLogo";

export default function LoginScreen() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const scale = Math.min(width / 369, height / 800);
  const sidePadding = Math.max(12, 16 * scale);
  const bottomOffset = Math.max(16, insets.bottom + 12);
  const heroTopOffset = insets.top + Math.max(52, 64 * scale);

  return (
    <ScreenWrapper title="" hideHeaderBottomBorder>
      <View style={styles.screen}>
        <ImageBackground
          source={require("../assets/images/login-bg.png")}
          resizeMode="cover"
          style={styles.backgroundImage}
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

          <View style={[styles.heroContent, { marginTop: heroTopOffset }]}>
            <View
              style={[
                styles.logo,
                {
                  height: Math.max(40, 51 * scale),
                },
              ]}
            >
              <BrandLogo size={42 * scale} minSize={67} />
            </View>
            <Text
              style={[styles.subtitle, { fontSize: Math.max(16, 20 * scale) }]}
            >
              Защити свои ценности!
            </Text>
          </View>

          <View
            style={[
              styles.bottomContent,
              { paddingHorizontal: sidePadding, paddingBottom: bottomOffset },
            ]}
          >
            <Text
              style={[
                styles.description,
                { fontSize: Math.max(14, 16 * scale) },
              ]}
            >
              Вступай в команду белок-героев и дай отпор лесному гиганту!
            </Text>

            <Pressable
              style={styles.enterButton}
              onPress={() => router.push("/onboarding")}
            >
              <LinearGradient
                colors={["#1B74FD", "#F6354C"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.enterButtonGradient}
              >
                <Text
                  style={[
                    styles.enterButtonText,
                    { fontSize: Math.max(18, 24 * scale) },
                  ]}
                >
                  ВОЙТИ В ИГРУ
                </Text>
              </LinearGradient>
            </Pressable>
          </View>
        </ImageBackground>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  heroContent: {
    alignItems: "center",
    marginTop: 12,
  },
  logo: {
    marginTop: 4,
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
  },
  subtitle: {
    marginTop: 8,
    color: "#fff",
    fontFamily: "PPNeueMachina-Bold",
    fontSize: 40 / 2,
    lineHeight: 24,
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.55)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  bottomContent: {
    marginTop: "auto",
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 20,
  },
  description: {
    color: "#fff",
    textAlign: "center",
    fontFamily: "PPNeueMachina-Regular",
    fontSize: 16,
    lineHeight: 21,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 7,
  },
  enterButton: {
    borderRadius: 8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    marginBottom: 30,
  },
  enterButtonGradient: {
    minHeight: 52,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  enterButtonText: {
    color: "#fff",
    fontFamily: "PPNeueMachina-Bold",
    fontSize: 36 / 1.5,
    lineHeight: 30,
    letterSpacing: 0.48,
    textTransform: "uppercase",
  },
});
