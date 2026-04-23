import { useEffect, useState, useCallback } from "react";
import { api } from "../services/api";
import { bossWebSocket } from "../services/websocket";
import { BossState } from "../types/boss";
import { BattleResponse } from "../types/battle";

export const useBoss = (telegramId: number) => {
  const [boss, setBoss] = useState<BossState | null>(null);
  const [loading, setLoading] = useState(true);
  const [isHitting, setIsHitting] = useState(false);
  const [lastDamage, setLastDamage] = useState<{
    value: number;
    isCritical: boolean;
    x: number;
    y: number;
  } | null>(null);

  // Загрузка начального состояния босса
  const loadBoss = useCallback(async () => {
    try {
      const data = await api.getCurrentBoss();
      setBoss({
        name: data.boss_name,
        currentHp: data.current_hp,
        maxHp: data.max_hp,
      });
    } catch (error) {
      console.error("Failed to load boss:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Удар по боссу
  const hit = useCallback(
    async (x: number, y: number): Promise<BattleResponse | null> => {
      if (isHitting || !telegramId) return null;

      setIsHitting(true);

      try {
        const result = await api.tapBoss(telegramId);
        const damageValue =
          typeof (result as any).damage_dealt === "number"
            ? (result as any).damage_dealt
            : typeof (result as any).damage === "number"
              ? (result as any).damage
              : 0;
        const nextBossHp =
          typeof (result as any).boss_hp_remaining === "number"
            ? (result as any).boss_hp_remaining
            : typeof (result as any).boss_current_hp === "number"
              ? (result as any).boss_current_hp
              : null;

        // Показываем цифру урона в месте касания
        setLastDamage({
          value: damageValue,
          isCritical: result.is_critical,
          x,
          y,
        });

        // Автоматически скрываем цифру урона через 500ms
        setTimeout(() => setLastDamage(null), 500);

        // Оптимистичное обновление HP босса
        setBoss((prev) =>
          prev
            ? {
                ...prev,
                currentHp:
                  typeof nextBossHp === "number" ? nextBossHp : prev.currentHp,
              }
            : null,
        );

        return result;
      } catch (error) {
        console.error("Failed to hit boss:", error);
        return null;
      } finally {
        setIsHitting(false);
      }
    },
    [telegramId, isHitting],
  );

  // Подписка на WebSocket обновления
  useEffect(() => {
    // Подключаемся к WebSocket
    bossWebSocket.connect();

    // Обработчик обновления босса от сервера
    const handleBossUpdate = (data: any) => {
      if (data.type === "boss_update") {
        setBoss({
          name: data.boss_name,
          currentHp: data.current_hp,
          maxHp: data.max_hp,
        });
      }
    };

    // Подписываемся на событие
    bossWebSocket.on("boss_update", handleBossUpdate);

    // Загружаем начальное состояние
    loadBoss();

    // Очистка при размонтировании
    return () => {
      bossWebSocket.off("boss_update", handleBossUpdate);
    };
  }, [loadBoss]);

  return {
    boss, // текущее состояние босса
    loading, // идёт ли загрузка
    hit, // функция для удара (принимает x, y)
    lastDamage, // последний урон (для анимации)
    isHitting, // запрет на спам кликами
  };
};
