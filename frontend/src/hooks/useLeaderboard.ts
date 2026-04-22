import { useEffect, useState, useCallback } from "react";
import { api } from "../services/api";
import { LeaderboardItem } from "../types/leaderboard";

export const useLeaderboard = (telegramId?: number) => {
  const [globalLeaderboard, setGlobalLeaderboard] = useState<
    LeaderboardItem[]
  >([]);
  const [friendsLeaderboard, setFriendsLeaderboard] = useState<
    LeaderboardItem[]
  >([]);
  const [loading, setLoading] = useState(true);

  const loadLeaderboards = useCallback(async () => {
    setLoading(true);
    try {
      const [global, friends] = await Promise.all([
        api.getGlobalLeaderboard(),
        telegramId
          ? api.getFriendsLeaderboard(telegramId)
          : Promise.resolve([]),
      ]);
      setGlobalLeaderboard(global);
      setFriendsLeaderboard(friends);
    } catch (error) {
      console.error("Failed to load leaderboards:", error);
    } finally {
      setLoading(false);
    }
  }, [telegramId]);

  useEffect(() => {
    loadLeaderboards();
  }, [loadLeaderboards]);

  return {
    globalLeaderboard,
    friendsLeaderboard,
    loading,
    refresh: loadLeaderboards,
  };
};
