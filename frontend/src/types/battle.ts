export interface TapBossRequest {
  telegram_id: number;
}

// Ответ от POST /battle/tap
export interface BattleResponse {
  success: boolean;
  damage_dealt: number;
  is_critical: boolean;
  gold_earned: number;
  experience_gained: number;
  boss_hp_remaining: number;
  is_boss_defeated: boolean;
}
