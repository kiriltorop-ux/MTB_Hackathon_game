// Только клиентские константы (UI, анимации)
export const CLIENT_CONFIG = {
  ANIMATION: {
    HIT_SHAKE_DURATION: 40,
    HIT_SCALE_DURATION: 60,
    GLOW_DURATION: 50,
    DAMAGE_NUMBER_DURATION: 500,
    CRITICAL_TEXT_DURATION: 500,
  },
  UI: {
    DEFAULT_BOSS_IMAGE: require("../../assets/images/boss.jpg"),
    LEFT_PANEL_TOP_OFFSET: 0.4, // 40% от высоты экрана
    BOSS_IMAGE_WIDTH: 0.75,
    BOSS_IMAGE_HEIGHT: 0.35,
  },
} as const;

// Fallback для офлайн-режима (когда сервер недоступен)
export const FALLBACK_CONFIG = {
  BASE_DAMAGE: 100,
  XP_PER_LEVEL: 100,
  GOLD_PER_HIT: 10,
  CRITICAL_CHANCE: 0.1,
  CRITICAL_MULTIPLIER: 2,
  XP_PER_HIT: 10,
} as const;
