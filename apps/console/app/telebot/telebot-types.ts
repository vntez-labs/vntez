export interface TelegramSubscriber {
  chat_id: number | string;
  username?: string;
  first_name?: string;
  last_name?: string;
  joined_at: string;
  status: "active" | "blocked" | "pending";
  tags?: string[];
}

export interface WebhookStatus {
  url: string;
  has_custom_certificate: boolean;
  pending_update_count: number;
  last_error_date?: number;
  last_error_message?: string;
  max_connections: number;
  ip_address?: string;
}

export interface BroadcastPayload {
  message: string;
  parse_mode?: "HTML" | "Markdown" | "MarkdownV2";
  target_group?: "all" | "active" | "admin";
}
