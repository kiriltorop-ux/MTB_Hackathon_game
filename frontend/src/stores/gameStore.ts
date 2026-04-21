import { create } from "zustand";
import { GAME_CONFIG } from "../utils/constants";
import { GameState } from "../types/game";

interface GameStore extends GameState {
  setBossHp: (hp: number) => void;
  addDamage: (damage: number) => void;
  addXp: (xp: number) => void;
  degradeWeapon: () => void;
  addGold: (amount: number) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  bossHp: GAME_CONFIG.BOSS_MAX_HP,
  maxBossHp: GAME_CONFIG.BOSS_MAX_HP,
  playerDamage: 0,
  playerLevel: 1,
  playerXp: 0,
  weaponIntegrity: 100,
  gold: 0,

  setBossHp: (hp) => set({ bossHp: Math.max(0, hp) }),

  addDamage: (damage) =>
    set((state) => ({
      playerDamage: state.playerDamage + damage,
    })),

  addXp: (xp) =>
    set((state) => {
      let newXp = state.playerXp + xp;
      let newLevel = state.playerLevel;
      let newXpRemaining = newXp;

      while (newXpRemaining >= GAME_CONFIG.XP_PER_LEVEL) {
        newLevel++;
        newXpRemaining -= GAME_CONFIG.XP_PER_LEVEL;
      }

      return {
        playerXp: newXpRemaining,
        playerLevel: newLevel,
      };
    }),

  degradeWeapon: () =>
    set((state) => ({
      weaponIntegrity: Math.max(
        0,
        state.weaponIntegrity - GAME_CONFIG.WEAPON_DEGRADE_PER_HIT,
      ),
    })),

  addGold: (amount) =>
    set((state) => ({
      gold: state.gold + amount,
    })),

  resetGame: () =>
    set({
      bossHp: GAME_CONFIG.BOSS_MAX_HP,
      playerDamage: 0,
      playerLevel: 1,
      playerXp: 0,
      weaponIntegrity: 100,
      gold: 0,
    }),
}));
