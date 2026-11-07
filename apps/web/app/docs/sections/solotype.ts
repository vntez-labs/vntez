import { IconKeyboard, IconTrophy } from "@tabler/icons-react";
import type { DocSection } from "../types";
import { buildUniversalCodeSubtabs } from "../code-samples-generator";

export const solotypeScoreSection: DocSection = {
  id: "solotype-submit-score",
  appId: "solotype",
  title: "1. Nộp Kết Quả & Phân Tích Tốc Độ Gõ",
  category: "SoloType Typing Engine",
  badge: "Typing Analytics",
  icon: IconKeyboard,
  desc: "Nộp kết quả bài kiểm tra tốc độ gõ phím 10 ngón. Hệ thống tự động tính toán Words Per Minute (WPM), Characters Per Minute (CPM), tỉ lệ gõ sai theo từng phím/ngón tay và độ chính xác phần trăm.",
  endpoint: {
    method: "POST",
    path: "https://solotype.vntez.cloud/api/solotype/scores",
  },
  params: [
    {
      name: "wpm",
      in: "body",
      type: "number",
      required: true,
      description: "Tốc độ gõ thực tế (Words Per Minute).",
      example: "112.5",
    },
    {
      name: "accuracy",
      in: "body",
      type: "number",
      required: true,
      description: "Độ chính xác tính theo phần trăm (0 - 100).",
      example: "98.4",
    },
    {
      name: "language_mode",
      in: "body",
      type: "string",
      required: true,
      description: "Chế độ ngôn ngữ: 'vi_telex', 'vi_vni', 'typescript', 'rust' hoặc 'python'.",
      example: "vi_telex",
    },
    {
      name: "duration_seconds",
      in: "body",
      type: "number",
      required: true,
      description: "Thời gian bài thi tính theo giây (15, 30, 60, 120).",
      example: "60",
    },
  ],
  responses: [
    {
      status: 201,
      description: "Kết quả bài gõ đã được ghi nhận và phân tích thành công.",
      json: JSON.stringify(
        {
          success: true,
          score_id: "scr_8912301",
          rank: 14,
          percentile: "Top 2.5%",
          analytics: {
            cpm: 562,
            error_count: 3,
            most_missed_keys: ["ô", "ê", "ơ"],
            consistency_score: "96.2%",
          },
        },
        null,
        2
      ),
    },
  ],
  subtabs: buildUniversalCodeSubtabs({
    method: "POST",
    url: "https://solotype.vntez.cloud/api/solotype/scores",
    body: {
      wpm: 112.5,
      accuracy: 98.4,
      language_mode: "vi_telex",
      duration_seconds: 60,
    },
  }),
};

export const solotypeLeaderboardSection: DocSection = {
  id: "solotype-leaderboard",
  appId: "solotype",
  title: "2. Bảng Xếp Hạng Trực Tuyến (Live Leaderboard)",
  category: "SoloType Typing Engine",
  badge: "Global Leaderboard",
  icon: IconTrophy,
  desc: "Truy xuất danh sách bảng xếp hạng cao thủ gõ phím theo ngày, tuần, tháng hoặc toàn thời gian, hỗ trợ lọc theo ngôn ngữ lập trình hoặc bộ gõ tiếng Việt.",
  endpoint: {
    method: "GET",
    path: "https://solotype.vntez.cloud/api/solotype/leaderboard",
  },
  params: [
    {
      name: "language_mode",
      in: "query",
      type: "string",
      required: false,
      description: "Lọc theo ngôn ngữ: 'vi_telex', 'vi_vni', 'typescript'...",
      example: "vi_telex",
    },
    {
      name: "period",
      in: "query",
      type: "string",
      required: false,
      description: "Khung thời gian xếp hạng: 'daily', 'weekly', 'all_time'.",
      example: "weekly",
    },
  ],
  responses: [
    {
      status: 200,
      description: "Danh sách bảng xếp hạng người dùng dẫn đầu.",
      json: JSON.stringify(
        {
          success: true,
          period: "weekly",
          language: "vi_telex",
          top_users: [
            { rank: 1, user_name: "hnamhocit", wpm: 138.2, accuracy: 99.1 },
            { rank: 2, user_name: "speed_demon", wpm: 131.0, accuracy: 97.8 },
            { rank: 3, user_name: "viet_coder", wpm: 125.4, accuracy: 98.9 },
          ],
        },
        null,
        2
      ),
    },
  ],
  subtabs: buildUniversalCodeSubtabs({
    method: "GET",
    url: "https://solotype.vntez.cloud/api/solotype/leaderboard?language_mode=vi_telex&period=weekly",
  }),
};
