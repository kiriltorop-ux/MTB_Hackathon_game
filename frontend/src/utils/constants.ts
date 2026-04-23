export const CLIENT_CONFIG = {
  ANIMATION: {
    HIT_SHAKE_DURATION: 40,
    HIT_SCALE_DURATION: 60,
    GLOW_DURATION: 50,
    DAMAGE_NUMBER_DURATION: 500,
    CRITICAL_TEXT_DURATION: 500,
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
