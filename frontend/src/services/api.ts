import {
  UserProfile,
  UserInitRequest,
  SetNicknameRequest,
} from "../types/user";
import { BossCurrentResponse } from "../types/boss";
import { BattleResponse } from "../types/battle";
import { LeaderboardItem } from "../types/leaderboard";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000";

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : null;

      if (!response.ok) {
        throw new Error(data?.detail || text || `HTTP ${response.status}`);
      }

      return data as T;
    } catch (error) {
      console.error(`API Error ${endpoint}:`, error);
      throw error;
    }
  }

  // ============ Пользователи ============
  async initUser(data: UserInitRequest): Promise<UserProfile> {
    return this.request("/users/init", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getMe(telegramId: number): Promise<UserProfile> {
    return this.request(`/users/me?telegram_id=${telegramId}`);
  }

  async setNickname(
    data: SetNicknameRequest,
  ): Promise<{ message: string; nickname: string }> {
    return this.request("/users/set-nickname", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // ============ Босс ============
  async getCurrentBoss(): Promise<BossCurrentResponse> {
    return this.request("/boss/current");
  }

  // ============ Битва ============
  async tapBoss(telegramId: number): Promise<BattleResponse> {
    return this.request("/battle/tap", {
      method: "POST",
      body: JSON.stringify({ telegram_id: telegramId }),
    });
  }

  // ============ Рейтинг ============
  async getGlobalLeaderboard(): Promise<LeaderboardItem[]> {
    return this.request("/leaderboard/global");
  }

  async getFriendsLeaderboard(
    telegramId: number,
  ): Promise<LeaderboardItem[]> {
    return this.request(`/leaderboard/friends?telegram_id=${telegramId}`);
  }

  // ============ Друзья ============
  async addFriend(
    telegramId: number,
    friendNickname: string,
  ): Promise<{ success: boolean; friend: any }> {
    return this.request("/friends/add", {
      method: "POST",
      body: JSON.stringify({
        telegram_id: telegramId,
        friend_nickname: friendNickname,
      }),
    });
  }

  async getFriends(telegramId: number): Promise<any[]> {
    return this.request(`/friends/list?telegram_id=${telegramId}`);
  }

  // ============ Роли ============
  async getRoles(): Promise<
    { name: string; description: string; id?: number; code?: string }[]
  > {
    return this.request("/roles");
  }

  async selectRole(
    telegramId: number,
    role: string,
  ): Promise<{ success?: boolean; role: string; message?: string }> {
    return this.request("/roles/select", {
      method: "POST",
      body: JSON.stringify({ telegram_id: telegramId, role }),
    });
  }

  // ============ Daily Quest ============
  async getDailyQuest(telegramId: number): Promise<{
    quest_type: string;
    question?: string | null;
    options?: string[] | null;
    is_completed: boolean;
  }> {
    return this.request(`/daily-quest?telegram_id=${telegramId}`);
  }

  async completeAthleteQuest(telegramId: number): Promise<{
    message: string;
    is_completed: boolean;
    damage_boost_active: boolean;
  }> {
    return this.request("/daily-quest/complete-athlete", {
      method: "POST",
      body: JSON.stringify({
        telegram_id: telegramId,
        photo_attached: true,
      }),
    });
  }

  async completeAnswerQuest(
    telegramId: number,
    answer: string,
  ): Promise<{
    message: string;
    is_completed: boolean;
    damage_boost_active: boolean;
  }> {
    return this.request("/daily-quest/complete-answer", {
      method: "POST",
      body: JSON.stringify({
        telegram_id: telegramId,
        answer,
      }),
    });
  }

  // ============ Achievements ============
  async getAchievements(telegramId: number): Promise<{
    achievements: any[];
    achievement_damage_bonus: number;
    coins: number;
  }> {
    return this.request(`/achievements?telegram_id=${telegramId}`);
  }

  // ============ Мини-игры: random ============
  async getRandomMiniGame(telegramId: number): Promise<any> {
    return this.request("/mini-games/random", {
      method: "POST",
      body: JSON.stringify({ telegram_id: telegramId }),
    });
  }

  // ============ Memory ============
  async startMemoryGame(telegramId: number): Promise<any> {
    return this.request("/mini-games/memory/start", {
      method: "POST",
      body: JSON.stringify({ telegram_id: telegramId }),
    });
  }

  async flipMemoryCard(telegramId: number, index: number): Promise<any> {
    return this.request("/mini-games/memory/flip", {
      method: "POST",
      body: JSON.stringify({ telegram_id: telegramId, index }),
    });
  }

  // ============ Rhythm ============
  async startRhythmGame(telegramId: number): Promise<any> {
    return this.request("/mini-games/rhythm/start", {
      method: "POST",
      body: JSON.stringify({ telegram_id: telegramId }),
    });
  }

  async finishRhythmGame(
    telegramId: number,
    hits: { note_index: number; hit_at_sec: number }[],
  ): Promise<any> {
    return this.request("/mini-games/rhythm/finish", {
      method: "POST",
      body: JSON.stringify({ telegram_id: telegramId, hits }),
    });
  }

  // ============ Class mini-games ============
  async startClassGame(telegramId: number): Promise<any> {
    return this.request("/mini-games/class/start", {
      method: "POST",
      body: JSON.stringify({ telegram_id: telegramId }),
    });
  }

  async finishAthleteGame(
    telegramId: number,
    selectedExercises: string[],
  ): Promise<any> {
    return this.request("/mini-games/class/finish-athlete", {
      method: "POST",
      body: JSON.stringify({
        telegram_id: telegramId,
        selected_exercises: selectedExercises,
      }),
    });
  }

  async finishGourmetGame(
    telegramId: number,
    distribution: Record<string, string>,
  ): Promise<any> {
    return this.request("/mini-games/class/finish-gourmet", {
      method: "POST",
      body: JSON.stringify({
        telegram_id: telegramId,
        distribution,
      }),
    });
  }

  async finishStylistGame(
    telegramId: number,
    assignments: Record<string, string>,
    finishedInTime: boolean,
  ): Promise<any> {
    return this.request("/mini-games/class/finish-stylist", {
      method: "POST",
      body: JSON.stringify({
        telegram_id: telegramId,
        assignments,
        finished_in_time: finishedInTime,
      }),
    });
  }

  async finishTravelerGame(
    telegramId: number,
    route: string[],
    completedInSeconds: number,
  ): Promise<any> {
    return this.request("/mini-games/class/finish-traveler", {
      method: "POST",
      body: JSON.stringify({
        telegram_id: telegramId,
        route,
        completed_in_seconds: completedInSeconds,
      }),
    });
  }
}

export const api = new ApiService();