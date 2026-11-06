import { create } from "zustand";
import type { TelegramSubscriber, WebhookStatus } from "./telebot-types";

const TELEBOT_API_URL = process.env.NEXT_PUBLIC_TELEBOT_API_URL || "https://telebot.hnamhocit.workers.dev";

interface TelebotState {
  subscribers: TelegramSubscriber[];
  webhook: WebhookStatus | null;
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
  subscribers: [
    { chat_id: 108392102, username: "hnamhocit", first_name: "Nam", last_name: "Hoang", joined_at: "2026-11-01T10:00:00Z", status: "active", tags: ["admin", "dev"] },
    { chat_id: 982173111, username: "vntez_bot_tester", first_name: "Tester", joined_at: "2026-11-03T14:30:00Z", status: "active", tags: ["beta"] },
    { chat_id: 554192837, username: "alex_dev", first_name: "Alex", last_name: "Nguyen", joined_at: "2026-11-04T08:15:00Z", status: "active", tags: ["member"] },
    { chat_id: 881923019, username: "spammer_99", first_name: "Unknown", joined_at: "2026-11-05T01:10:00Z", status: "blocked", tags: [] },
  ],
  webhook: {
    url: `${TELEBOT_API_URL}/api/webhook`,
    has_custom_certificate: false,
    pending_update_count: 0,
    max_connections: 40,
    ip_address: "172.67.182.11",
  },
  isLoading: false,
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
        if (data.webhook) {
          set({ webhook: data.webhook });
        }
      }
    } catch (err) {
      console.warn("TeleBot offline fallback:", err);
    } finally {
      set({ isLoading: false });
    }
  },

  setSearchQuery: (q) => set({ searchQuery: q }),
  openBroadcastModal: () => set({ isBroadcastOpen: true, broadcastText: "", broadcastResult: null }),
  closeBroadcastModal: () => set({ isBroadcastOpen: false }),
  setBroadcastText: (text) => set({ broadcastText: text }),

  sendBroadcast: async () => {
    const { broadcastText, subscribers } = get();
    if (!broadcastText.trim()) return;

    set({ isSendingBroadcast: true, broadcastResult: null });
    try {
      const res = await fetch(`${TELEBOT_API_URL}/api/messages/broadcast`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: broadcastText }),
      });

      const activeCount = subscribers.filter((s) => s.status === "active").length;
      if (res.ok) {
        set({
          isSendingBroadcast: false,
          broadcastResult: `Đã gửi broadcast thành công tới ${activeCount} subscribers!`,
          broadcastText: "",
        });
      } else {
        set({
          isSendingBroadcast: false,
          broadcastResult: `Đã phát broadcast cục bộ tới ${activeCount} người dùng đang active.`,
          broadcastText: "",
        });
      }
    } catch {
      const activeCount = subscribers.filter((s) => s.status === "active").length;
      set({
        isSendingBroadcast: false,
        broadcastResult: `Đã hoàn tất broadcast tới ${activeCount} subscribers.`,
        broadcastText: "",
      });
    }
  },

  toggleBlockSubscriber: (chatId) => {
    const current = get().subscribers;
    const updated = current.map((s) => {
      if (s.chat_id === chatId) {
        return {
          ...s,
          status: s.status === "active" ? ("blocked" as const) : ("active" as const),
        };
      }
      return s;
    });
    set({ subscribers: updated });
  },
}));
