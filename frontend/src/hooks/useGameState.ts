import { useGameStore } from "../stores/gameStore";
import { gameService } from "../services/gameService";
import { GAME_CONFIG } from "../utils/constants";

export const useGameState = () => {
  const {
    bossHp,
    maxBossHp,
    playerDamage,
    playerLevel,
    playerXp,
    weaponIntegrity,
    gold,
    addDamage,
    addXp,
    degradeWeapon,
    addGold,
    setBossHp,
    resetGame,
  } = useGameStore();

  const calculateDamage = () => {
    let damage = GAME_CONFIG.BASE_DAMAGE;

    // Бонус от уровня
    damage += (playerLevel - 1) * 10;

    // Бонус от целостности оружия
    damage *= weaponIntegrity / 100;

    // Критический удар
    const isCritical = Math.random() < GAME_CONFIG.CRITICAL_CHANCE;
    if (isCritical) {
      damage *= GAME_CONFIG.CRITICAL_MULTIPLIER;
    }

    return Math.floor(damage);
  };

  const handleHit = async (userId: string) => {
    const damage = calculateDamage();

    // Обновляем локальное состояние
    addDamage(damage);
    addXp(GAME_CONFIG.XP_PER_HIT);
    degradeWeapon();
    addGold(GAME_CONFIG.GOLD_PER_HIT);

    const newBossHp = Math.max(0, bossHp - damage);
    setBossHp(newBossHp);

    // Отправляем на сервер (не ждём критично)
    try {
      const response = await gameService.hitBoss(userId, damage);
      if (response.bossDefeated) {
        resetGame();
      }
    } catch (error) {
      // Игнорируем ошибки бэка — игра продолжает работать
      console.log("Backend not available, continuing offline");
    }

    return { damage, isBossDead: newBossHp <= 0 };
  };

  return {
    bossHp,
    maxBossHp,
    playerDamage,
    playerLevel,
    playerXp,
    weaponIntegrity,
    gold,
    handleHit,
  };
};
