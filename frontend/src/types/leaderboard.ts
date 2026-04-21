// Элемент рейтинга (ответ от сервера)
export interface LeaderboardItem {
  telegram_id: number;
  nickname: string;
  total_damage: number;
  rank: number;
}

// Для клиентского использования
export interface UserStats {
  userId: number;
  nickname: string;
  totalDamage: number;
  rank: number;
}
