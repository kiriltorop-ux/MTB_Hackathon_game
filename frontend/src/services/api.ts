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

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP ${response.status}`);
      }

      return await response.json();
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
  ): Promise<{ nickname: string }> {
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
    return this.request(
      `/leaderboard/friends?telegram_id=${telegramId}`,
    );
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
    { id: number; name: string; description: string }[]
  > {
    return this.request("/roles");
  }

  async selectRole(
    telegramId: number,
    role: string,
  ): Promise<{ success: boolean; role: string }> {
    return this.request("/roles/select", {
      method: "POST",
      body: JSON.stringify({ telegram_id: telegramId, role }),
    });
  }
}

export const api = new ApiService();
