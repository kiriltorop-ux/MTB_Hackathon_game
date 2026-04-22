// Ответ от GET /boss / current;
export interface BossCurrentResponse {
  boss_name: string;
  current_hp: number;
  max_hp: number;
}

// WebSocket обновление от сервера
export interface BossWebSocketMessage {
  type: "boss_update";
  boss_name: string;
  current_hp: number;
  max_hp: number;
}

// Состояние босса на клиенте
export interface BossState {
  name: string;
  currentHp: number;
  maxHp: number;
}
