import { BossWebSocketMessage } from "../types/boss";

const WS_BASE_URL =
  process.env.EXPO_PUBLIC_WS_URL || "ws://localhost:8000";

type WebSocketEventCallback<T = any> = (data: T) => void;

class BossWebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private listeners: Map<string, Set<WebSocketEventCallback>> =
    new Map();
  private isConnecting = false;

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN || this.isConnecting) {
      return;
    }

    this.isConnecting = true;

    try {
      this.ws = new WebSocket(`${WS_BASE_URL}/boss/ws`);

      this.ws.onopen = () => {
        this.reconnectAttempts = 0;
        this.isConnecting = false;
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as BossWebSocketMessage;
          this.notifyListeners(data.type, data);
        } catch {
          // ignore invalid json
        }
      };

      this.ws.onerror = () => {
        // ignore
      };

      this.ws.onclose = () => {
        this.ws = null;
        this.isConnecting = false;
        this.attemptReconnect();
      };
    } catch {
      this.isConnecting = false;
      this.attemptReconnect();
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      setTimeout(() => {
        this.reconnectAttempts++;
        this.connect();
      }, this.reconnectDelay * Math.pow(2, this.reconnectAttempts));
    }
  }

  on(eventType: string, callback: WebSocketEventCallback) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(callback);
  }

  off(eventType: string, callback: WebSocketEventCallback) {
    this.listeners.get(eventType)?.delete(callback);
  }

  private notifyListeners(eventType: string, data: any) {
    this.listeners.get(eventType)?.forEach((callback) => {
      try {
        callback(data);
      } catch {
        // ignore
      }
    });
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const bossWebSocket = new BossWebSocketService();