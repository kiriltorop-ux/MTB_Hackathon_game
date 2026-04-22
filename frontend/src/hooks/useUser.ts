import { useEffect, useState, useCallback } from "react";
import { api } from "../services/api";
import { UserProfile } from "../types/user";

export const useUser = (telegramId: number) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUser = useCallback(async () => {
    if (!telegramId) return;

    setLoading(true);
    setError(null);

    try {
      const data = await api.getMe(telegramId);
      setUser(data);
    } catch (err: any) {
      setError(err.message || "Failed to load user");
    } finally {
      setLoading(false);
    }
  }, [telegramId]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const refreshUser = useCallback(() => {
    loadUser();
  }, [loadUser]);

  return { user, loading, error, refreshUser };
};
