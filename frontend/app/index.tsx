import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  StatusBar,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { BossHealthBar } from "../src/components/BossHealthBar";
import { XPBar } from "../src/components/XPBar";
import { DamageNumber } from "../src/components/DamageNumber";
import { useUser } from "../src/hooks/useUser";
import { useBoss } from "../src/hooks/useBoss";
import { CLIENT_CONFIG } from "../src/utils/constants";
import { useTheme } from "../src/context/ThemeContext";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function GameScreen() {
  const { theme } = useTheme();

  const telegramId = 1;

  const { user, loading: userLoading, refreshUser } = useUser(telegramId);
  const {
    boss,
    loading: bossLoading,
    hit,
    lastDamage,
    isHitting,
  } = useBoss(telegramId);

  const [showShop, setShowShop] = useState(false);
  const [showClan, setShowClan] = useState(false);
  const [showWeapons, setShowWeapons] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // Анимации
  const bossShake = useSharedValue(0);
  const bossScale = useSharedValue(1);
  const bossGlow = useSharedValue(0);

  const onBossHit = async (event: any) => {
    if (bossLoading || isHitting) return;

    const { locationX, locationY } = event.nativeEvent;

    bossShake.value = withSequence(
      withTiming(-10, {
        duration: CLIENT_CONFIG.ANIMATION.HIT_SHAKE_DURATION,
      }),
      withTiming(8, {
        duration: CLIENT_CONFIG.ANIMATION.HIT_SHAKE_DURATION,
      }),
      withTiming(-5, {
        duration: CLIENT_CONFIG.ANIMATION.HIT_SHAKE_DURATION,
      }),
      withTiming(5, {
        duration: CLIENT_CONFIG.ANIMATION.HIT_SHAKE_DURATION,
      }),
      withTiming(0, {
        duration: CLIENT_CONFIG.ANIMATION.HIT_SHAKE_DURATION,
      }),
    );

    bossScale.value = withSequence(
      withTiming(0.95, {
        duration: CLIENT_CONFIG.ANIMATION.HIT_SCALE_DURATION,
      }),
      withTiming(1, {
        duration: CLIENT_CONFIG.ANIMATION.HIT_SCALE_DURATION,
      }),
    );

    bossGlow.value = withSequence(
      withTiming(1, {
        duration: CLIENT_CONFIG.ANIMATION.GLOW_DURATION,
      }),
      withTiming(0, { duration: 200 }),
    );

    const result = await hit(locationX, locationY);

    if (result?.success) {
      refreshUser();
    }
  };

  const bossAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: bossShake.value }, { scale: bossScale.value }],
  }));

  const bossGlowStyle = useAnimatedStyle(() => ({
    shadowOpacity: bossGlow.value * 0.8,
    shadowRadius: bossGlow.value * 20,
    shadowColor: "#ff4444",
  }));

  const ModalWithPadding = ({ visible, onClose, title, children }: any) => (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={[styles.modalOverlay, { backgroundColor: theme.overlay }]}>
        <View
          style={[
            styles.modalContent,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <Text style={[styles.modalTitle, { color: theme.tint }]}>
            {title}
          </Text>
          <TouchableOpacity style={styles.modalClose} onPress={onClose}>
            <Ionicons name="close" size={24} color={theme.text} />
          </TouchableOpacity>
          <ScrollView
            style={styles.modalScroll}
            contentContainerStyle={styles.modalScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  if (userLoading || bossLoading) {
    return (
      <LinearGradient colors={["#f0f0f0", "#e0e0e0"]} style={styles.container}>
        <ActivityIndicator size="large" color={theme.tint} />
        <Text style={[styles.loadingText, { color: theme.text }]}>
          Загрузка...
        </Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#f5f5f5", "#e8e8e8"]} style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* ===== ВЕРХНЯЯ ПАНЕЛЬ ===== */}
      <SafeAreaView style={styles.topBar} edges={["top", "left", "right"]}>
        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: theme.iconBg }]}
          onPress={() => router.back()}
        >
          <Ionicons name="close" size={28} color={theme.text} />
        </TouchableOpacity>

        <BossHealthBar
          currentHp={boss?.currentHp ?? 0}
          maxHp={boss?.maxHp ?? 10000}
        />

        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: theme.iconBg }]}
          onPress={() => setShowMenu(true)}
        >
          <Ionicons name="menu" size={28} color={theme.text} />
        </TouchableOpacity>
      </SafeAreaView>

      {/* ===== РАСТЯГИВАЮЩИЙСЯ КОНТЕЙНЕР ===== */}
      <View style={styles.mainContent}>
        {/* Левая панель */}
        <View style={styles.leftPanel}>
          <TouchableOpacity
            style={[styles.sideButton, { backgroundColor: theme.sideButtonBg }]}
            onPress={() => setShowShop(true)}
          >
            <Ionicons name="storefront" size={28} color="#ffd700" />
            <Text style={styles.sideButtonText}>Магазин</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.sideButton, { backgroundColor: theme.sideButtonBg }]}
            onPress={() => setShowClan(true)}
          >
            <Ionicons name="people" size={28} color="#ffd700" />
            <Text style={styles.sideButtonText}>Клан</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.sideButton, { backgroundColor: theme.sideButtonBg }]}
            onPress={() => setShowWeapons(true)}
          >
            <Ionicons name="hammer" size={28} color="#ffd700" />
            <Text style={styles.sideButtonText}>Оружие</Text>
          </TouchableOpacity>
        </View>

        {/* Босс */}
        <TouchableWithoutFeedback onPress={onBossHit}>
          <Animated.View
            style={[styles.bossContainer, bossAnimatedStyle, bossGlowStyle]}
          >
            <Image
              source={CLIENT_CONFIG.UI.DEFAULT_BOSS_IMAGE}
              style={styles.bossImage}
              resizeMode="contain"
              accessibilityLabel="Босс игры — нажми для удара"
            />
            <Text style={[styles.bossName, { color: theme.text }]}>
              <MaterialIcons name="girl" size={16} color={theme.text} />
              {boss?.name ?? "Босс"}
              <MaterialIcons name="girl" size={16} color={theme.text} />
            </Text>

            {lastDamage && (
              <DamageNumber
                value={lastDamage.value}
                x={lastDamage.x}
                y={lastDamage.y}
                isCritical={lastDamage.isCritical}
              />
            )}
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>

      {/* ===== НИЖНЯЯ ПАНЕЛЬ ===== */}
      <SafeAreaView
        style={styles.bottomSection}
        edges={["bottom", "left", "right"]}
      >
        <View style={styles.bottomPanel}>
          <View style={styles.bottomLeft}>
            <XPBar
              currentXp={user?.experience ?? 0}
              maxXp={100}
              level={user?.level ?? 1}
            />
          </View>
          {/* Кнопка переключения темы */}
          <TouchableOpacity style={styles.themeButton}>
            <Ionicons name="moon" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>

        <View style={[styles.statsBar, { backgroundColor: theme.statsBarBg }]}>
          <View style={styles.statItem}>
            <Ionicons name="cash" size={20} color="#ffd700" />
            <Text style={[styles.statText, { color: theme.text }]}>
              {user?.gold ?? 0}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="flash" size={20} color="#ff4444" />
            <Text style={[styles.statText, { color: theme.text }]}>
              {user?.total_damage ?? 0}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="star" size={20} color="#44ff44" />
            <Text style={[styles.statText, { color: theme.text }]}>
              Ур. {user?.level ?? 1}
            </Text>
          </View>
        </View>

        <Text style={[styles.hint, { color: theme.hint }]}>
          👆 Нажми на босса, чтобы ударить!
        </Text>
      </SafeAreaView>

      {/* ===== МОДАЛЬНЫЕ ОКНА ===== */}
      <ModalWithPadding
        visible={showShop}
        onClose={() => setShowShop(false)}
        title="🛒 Магазин"
      >
        <Text style={[styles.modalText, { color: theme.text }]}>
          💊 Зелье восстановления оружия — 100 золота
        </Text>
        <Text style={[styles.modalText, { color: theme.text }]}>
          ⚡ Усиление урона +10 — 500 золота
        </Text>
        <Text style={[styles.modalText, { color: theme.text }]}>
          ⭐ Критический шанс +5% — 1000 золота
        </Text>
        <Text style={[styles.modalText, { color: theme.text }]}>
          🔨 Новое оружие — 2000 золота
        </Text>
      </ModalWithPadding>

      <ModalWithPadding
        visible={showClan}
        onClose={() => setShowClan(false)}
        title="⚔️ Клан"
      >
        <Text style={[styles.modalText, { color: theme.text }]}>
          🏠 Вы ещё не в клане
        </Text>
        <Text style={[styles.modalText, { color: theme.text }]}>
          Создайте или вступите в клан для бонусов!
        </Text>
        <View
          style={[styles.clanBonus, { backgroundColor: theme.clanBonusBg }]}
        >
          <Text style={styles.clanBonusText}>✨ Бонус клана: +15% к урону</Text>
        </View>
        <TouchableOpacity
          style={[styles.createClanButton, { backgroundColor: theme.buttonBg }]}
        >
          <Text style={styles.createClanButtonText}>➕ Создать клан</Text>
        </TouchableOpacity>
      </ModalWithPadding>

      <ModalWithPadding
        visible={showWeapons}
        onClose={() => setShowWeapons(false)}
        title="⚡ Энергия"
      >
        <View style={styles.weaponSlot}>
          <Ionicons name="hammer" size={40} color="#ffd700" />
          <Text style={[styles.weaponName, { color: theme.tint }]}>
            Ржавый меч
          </Text>
          <Text style={[styles.weaponStat, { color: theme.text }]}>
            Энергии не осталось;(
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.repairButton, { backgroundColor: theme.tint }]}
        >
          <Text style={styles.repairButtonText}>
            Посмотреть рекламу за энергию?
          </Text>
        </TouchableOpacity>
      </ModalWithPadding>

      <ModalWithPadding
        visible={showMenu}
        onClose={() => setShowMenu(false)}
        title="☰ Меню"
      >
        <TouchableOpacity
          style={[styles.menuItem, { borderBottomColor: theme.border }]}
        >
          <Text style={[styles.menuItemText, { color: theme.text }]}>
            🏆 Рейтинг
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.menuItem, { borderBottomColor: theme.border }]}
        >
          <Text style={[styles.menuItemText, { color: theme.text }]}>
            📊 Статистика
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.menuItem, { borderBottomColor: theme.border }]}
        >
          <Text style={[styles.menuItemText, { color: theme.text }]}>
            ⚙️ Настройки
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.menuItem, { borderBottomColor: theme.border }]}
        >
          <Text style={[styles.menuItemText, { color: theme.text }]}>
            ❓ Помощь
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.menuItem, { borderBottomColor: theme.border }]}
        >
          <Text style={[styles.menuItemText, { color: theme.text }]}>
            🚪 Выйти из аккаунта
          </Text>
        </TouchableOpacity>
      </ModalWithPadding>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingText: {
    marginTop: 16,
    textAlign: "center",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  iconButton: {
    padding: 8,
    borderRadius: 30,
  },
  mainContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  leftPanel: {
    position: "absolute",
    left: 12,
    top: "40%",
    gap: 16,
    zIndex: 10,
  },
  sideButton: {
    padding: 10,
    borderRadius: 25,
    alignItems: "center",
    width: 65,
    borderWidth: 1,
    borderColor: "#ffd700",
  },
  sideButtonText: {
    color: "#ffd700",
    fontSize: 10,
    marginTop: 4,
  },
  bossContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  bossImage: {
    width: SCREEN_WIDTH * 0.75,
    height: SCREEN_HEIGHT * 0.35,
  },
  bossName: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
  },
  bottomSection: {
    backgroundColor: "transparent",
  },
  bottomPanel: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  bottomLeft: {
    flex: 1,
    alignItems: "flex-start",
  },
  themeButton: {
    padding: 8,
    borderRadius: 30,
  },
  statsBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginHorizontal: 20,
    borderRadius: 30,
    marginBottom: 8,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  hint: {
    textAlign: "center",
    fontSize: 12,
    paddingBottom: 12,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    borderRadius: 20,
    padding: 24,
    width: SCREEN_WIDTH * 0.85,
    maxHeight: SCREEN_HEIGHT * 0.7,
    borderWidth: 1,
  },
  modalScroll: {
    maxHeight: SCREEN_HEIGHT * 0.5,
  },
  modalScrollContent: {
    paddingBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  modalClose: {
    position: "absolute",
    top: 12,
    right: 12,
    padding: 8,
    zIndex: 1,
  },
  modalText: {
    fontSize: 14,
    marginVertical: 8,
  },
  menuItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  menuItemText: {
    fontSize: 18,
  },
  clanBonus: {
    marginTop: 16,
    padding: 12,
    borderRadius: 10,
  },
  clanBonusText: {
    color: "#ffd700",
    textAlign: "center",
  },
  createClanButton: {
    padding: 12,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 16,
  },
  createClanButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  weaponSlot: {
    alignItems: "center",
    marginVertical: 16,
  },
  weaponName: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 8,
  },
  weaponStat: {
    fontSize: 14,
    marginTop: 4,
  },
  repairButton: {
    padding: 12,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 16,
  },
  repairButtonText: {
    color: "#1a1a2e",
    fontWeight: "bold",
  },
  criticalIndicator: {
    position: "absolute",
    top: -30,
    alignSelf: "center",
  },
  criticalText: {
    color: "#ffaa00",
    fontSize: 24,
    fontWeight: "bold",
    textShadowColor: "#000",
    textShadowOffset: { width: 2, height: 2 },
  },
});
