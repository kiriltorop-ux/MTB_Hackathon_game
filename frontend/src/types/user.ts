// Ответ от GET /users/me и POST /users/init
export interface UserProfile {
  telegram_id: number;
  nickname: string;
  level: number;
  experience: number;
  gold: number;
  total_damage: number;
  clicks_left: number;
  daily_click_limit: number;
  role: string | null;
}

// Запрос на инициализацию
export interface UserInitRequest {
  telegram_id: number;
  nickname?: string;
}

// Запрос на смену ника
export interface SetNicknameRequest {
  telegram_id: number;
  nickname: string;
}
