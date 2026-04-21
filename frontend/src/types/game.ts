export interface GameState {
  bossHp: number;
  maxBossHp: number;
  playerDamage: number;
  playerLevel: number;
  playerXp: number;
  weaponIntegrity: number;
  gold: number;
}

export interface UserStats {
  userId: string;
  totalDamage: number;
  rank: number;
}

export interface HitResponse {
  success: boolean;
  damage: number;
  bossHp: number;
  bossDefeated: boolean;
  goldEarned: number;
  xpGained: number;
}
