import { create } from "zustand";
import type { TelegramSubscriber, WebhookStatus } from "./telebot-types";

const TELEBOT_API_URL = process.env.NEXT_PUBLIC_TELEBOT_API_URL || "https://telebot.hnamhocit.workers.dev";

interface TelebotState {
  subscribers: TelegramSubscriber[];
  webhook: WebhookStatus | null;
  botInfo: { id?: number; username?: string; first_name?: string } | null;
  isLoading: boolean;
  searchQuery: string;

  // Broadcast modal
  isBroadcastOpen: boolean;
  broadcastText: string;
  isSendingBroadcast: boolean;
  broadcastResult: string | null;

  // Actions
  fetchData: () => Promise<void>;
  setSearchQuery: (q: string) => void;
  openBroadcastModal: () => void;
  closeBroadcastModal: () => void;
  setBroadcastText: (text: string) => void;
  sendBroadcast: () => Promise<void>;
  toggleBlockSubscriber: (chatId: number | string) => void;
}

export const useTelebotStore = create<TelebotState>((set, get) => ({
  subscribers: [],
  webhook: null,
  botInfo: null,
  isLoading: true,
  searchQuery: "",

  isBroadcastOpen: false,
  broadcastText: "",
  isSendingBroadcast: false,
  broadcastResult: null,

  fetchData: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch(`${TELEBOT_API_URL}/api/webhook`);
      if (res.ok) {
        const data = await res.json();
        if (data.webhook_info) {
          set({
            webhook: data.webhook_info,
            botInfo: data.bot || null,
          });
        }
      }
    } catch (err) {
      console.warn("Telebot worker connection error:", err);
    } finally {
      set({ isLoading: false });
    }
  },

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  openBroadcastModal: () => set({ isBroadcastOpen: true, broadcastText: "", broadcastResult: null }),
  closeBroadcastModal: () => set({ isBroadcastOpen: false }),
  setBroadcastText: (broadcastText) => set({ broadcastText }),

  sendBroadcast: async () => {
    const { broadcastText, subscribers } = get();
    if (!broadcastText.trim()) return;

    set({ isSendingBroadcast: true, broadcastResult: null });

    const activeChatIds = subscribers
      .filter((s) => s.status === "active")
      .map((s) => s.chat_id);

    try {
      const res = await fetch(`${TELEBOT_API_URL}/api/broadcast`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_ids: activeChatIds.length > 0 ? activeChatIds : [9114027704],
          text: broadcastText,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gửi broadcast thất bại");

      set({
        isSendingBroadcast: false,
        broadcastResult: `Đã gửi thành công thông báo qua Telegram!`,
      });
    } catch (err: unknown) {
      set({
        isSendingBroadcast: false,
        broadcastResult: err instanceof Error ? err.message : "Lỗi khi gửi thông báo",
      });
    }
  },

  toggleBlockSubscriber: (chatId) => {
    const updated = get().subscribers.map((s) => {
      if (s.chat_id === chatId) {
        return {
          ...s,
          status: (s.status === "active" ? "blocked" : "active") as "active" | "blocked",
        };
      }
      return s;
    });
    set({ subscribers: updated });
  },
}));
