// src/services/gameService.ts
import { API_URL } from "../utils/constants";
import { HitResponse } from "../types/game";

export const gameService = {
  async hitBoss(
    userId: string,
    damage: number,
  ): Promise<HitResponse> {
    try {
      const response = await fetch(`${API_URL}/hit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, damage }),
      });

      // Добавляем проверку статуса ответа
      if (!response.ok) {
        console.warn(
          `Server returned ${response.status}: ${response.statusText}`,
        );
        // Возвращаем fallback-данные вместо ошибки
        return this.getFallbackHitResponse(damage);
      }

      // Проверяем Content-Type перед парсингом JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.warn("Server did not return JSON, using fallback");
        return this.getFallbackHitResponse(damage);
      }

      return await response.json();
    } catch (error) {
      console.error("Hit error:", error);
      // Fallback для оффлайн/хакатона — чтобы игра работала без бэка
      return this.getFallbackHitResponse(damage);
    }
  },

  // Fallback-ответ для офлайн-режима (чтобы игра работала даже без сервера)
  getFallbackHitResponse(damage: number): HitResponse {
    return {
      success: true,
      damage: damage,
      bossHp: Math.max(0, 10000 - damage),
      bossDefeated: damage >= 10000,
      goldEarned: 10,
      xpGained: 10,
    };
  },

  async getLeaderboard() {
    try {
      const response = await fetch(`${API_URL}/leaderboard`);
      if (!response.ok) return [];
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json"))
        return [];
      return await response.json();
    } catch (error) {
      console.error("Leaderboard error:", error);
      return [];
    }
  },
};
