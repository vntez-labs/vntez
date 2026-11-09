import { create } from "zustand";
import { api } from "@workspace/ui/lib/api-client";
import { toast } from "@workspace/ui/components/toaster";
import type { TelegramSubscriber, WebhookStatus } from "./telebot-types";

const TELEBOT_API_URL = process.env.NEXT_PUBLIC_TELEBOT_API_URL || "https://telebot.hnamhocit.workers.dev";

interface TelebotState {
  subscribers: TelegramSubscriber[];
  webhook: WebhookStatus | null;
  botInfo: { id?: number; username?: string; first_name?: string } | null;
  isLoading: boolean;
  searchQuery: string;

  // Modals
  isBroadcastOpen: boolean;
  broadcastText: string;
  isSendingBroadcast: boolean;
  broadcastResult: string | null;
  isAddModalOpen: boolean;

  // Actions
  fetchData: () => Promise<void>;
  fetchSubscribers: () => Promise<void>;
  setSearchQuery: (q: string) => void;
  openBroadcastModal: () => void;
  closeBroadcastModal: () => void;
  openAddModal: () => void;
  closeAddModal: () => void;
  setBroadcastText: (text: string) => void;
  sendBroadcast: () => Promise<void>;
  deleteSubscriber: (chatId: number | string) => Promise<void>;
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
  isAddModalOpen: false,

  fetchSubscribers: async () => {
    try {
      const res = await api.get<{ success: boolean; subscribers: TelegramSubscriber[] }>(
        "/api/telebot/subscribers"
      );
      if (res.success && Array.isArray(res.subscribers)) {
        set({ subscribers: res.subscribers });
      }
    } catch (err) {
      console.warn("Lỗi tải danh sách subscribers:", err);
    }
  },

  fetchData: async () => {
    set({ isLoading: true });
    try {
      await Promise.all([
        // 1. Fetch webhook status from Cloudflare worker
        api
          .get<{
            webhook_info?: WebhookStatus;
            bot?: { id?: number; username?: string; first_name?: string };
          }>(`${TELEBOT_API_URL}/api/webhook`)
          .then((data) => {
            if (data.webhook_info) {
              set({
                webhook: data.webhook_info,
                botInfo: data.bot || null,
              });
            }
          })
          .catch((err) => console.warn("Telebot worker connection error:", err)),

        // 2. Fetch subscribers from database API
        get().fetchSubscribers(),
      ]);
    } finally {
      set({ isLoading: false });
    }
  },

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  openBroadcastModal: () => set({ isBroadcastOpen: true, broadcastText: "", broadcastResult: null }),
  closeBroadcastModal: () => set({ isBroadcastOpen: false }),
  openAddModal: () => set({ isAddModalOpen: true }),
  closeAddModal: () => set({ isAddModalOpen: false }),
  setBroadcastText: (broadcastText) => set({ broadcastText }),

  sendBroadcast: async () => {
    const { broadcastText, subscribers } = get();
    if (!broadcastText.trim()) return;

    set({ isSendingBroadcast: true, broadcastResult: null });

    const activeChatIds = subscribers
      .filter((s) => s.status === "active")
      .map((s) => s.chat_id);

    try {
      await api.post(`${TELEBOT_API_URL}/api/broadcast`, {
        chat_ids: activeChatIds.length > 0 ? activeChatIds : [9114027704],
        text: broadcastText,
      });

      set({
        isSendingBroadcast: false,
        broadcastResult: `Đã gửi thành công thông báo qua Telegram!`,
      });
      toast.success("Đã gửi thành công thông báo qua Telegram!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi khi gửi thông báo";
      set({
        isSendingBroadcast: false,
        broadcastResult: msg,
      });
      toast.error(msg);
    }
  },

  deleteSubscriber: async (chatId) => {
    try {
      await api.delete(`/api/telebot/subscribers?chat_id=${chatId}`);
      toast.success("Đã xóa subscriber khỏi cơ sở dữ liệu");
      await get().fetchSubscribers();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Không thể xóa subscriber";
      toast.error(msg);
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
