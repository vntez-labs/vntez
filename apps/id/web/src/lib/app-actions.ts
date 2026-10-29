"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type SystemApp = {
  id: string;
  name: string;
  url: string;
  icon_url: string | null;
  is_pinned: boolean;
  dock_order: number;
  grid_col: number | null;
  grid_row: number | null;
  created_at?: string;
};

export type UserApp = {
  id: string;
  user_id?: string;
  name: string;
  url: string;
  icon_url: string | null;
  is_pinned: boolean;
  dock_order: number;
  grid_col: number | null;
  grid_row: number | null;
  created_at?: string;
};

export async function addUserApp(payload: {
  name: string;
  url: string;
  icon_url?: string | null;
  is_pinned?: boolean;
  dock_order?: number;
  grid_col?: number | null;
  grid_row?: number | null;
}): Promise<UserApp> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Bạn cần đăng nhập để thêm ứng dụng.");
  }

  const { data, error } = await supabase
    .from("user_apps")
    .insert({
      user_id: user.id,
      name: payload.name.trim(),
      url: payload.url.trim(),
      icon_url: payload.icon_url?.trim() || null,
      is_pinned: payload.is_pinned ?? false,
      dock_order: payload.dock_order ?? 0,
      grid_col: payload.grid_col ?? 0,
      grid_row: payload.grid_row ?? 0,
    })
    .select(
      "id, user_id, name, url, icon_url, is_pinned, dock_order, grid_col, grid_row, created_at",
    )
    .single();

  if (error) {
    console.error("Lỗi khi thêm ứng dụng:", error);
    throw new Error(error.message);
  }

  revalidatePath("/");
  return data;
}

export async function deleteUserApp(id: string): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Bạn cần đăng nhập để xóa ứng dụng.");
  }

  const { error } = await supabase
    .from("user_apps")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Lỗi khi xóa ứng dụng:", error);
    throw new Error(error.message);
  }

  revalidatePath("/");
  return true;
}

export async function updateUserApp(
  id: string,
  payload: {
    name?: string;
    url?: string;
    icon_url?: string | null;
    is_pinned?: boolean;
    dock_order?: number;
    grid_col?: number | null;
    grid_row?: number | null;
  },
): Promise<UserApp> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Bạn cần đăng nhập để cập nhật ứng dụng.");
  }

  const updates: Record<string, unknown> = {};
  if (payload.name !== undefined) updates.name = payload.name.trim();
  if (payload.url !== undefined) updates.url = payload.url.trim();
  if (payload.icon_url !== undefined) {
    updates.icon_url = payload.icon_url?.trim() || null;
  }
  if (payload.is_pinned !== undefined) updates.is_pinned = payload.is_pinned;
  if (payload.dock_order !== undefined) updates.dock_order = payload.dock_order;
  if (payload.grid_col !== undefined) updates.grid_col = payload.grid_col;
  if (payload.grid_row !== undefined) updates.grid_row = payload.grid_row;

  const { data, error } = await supabase
    .from("user_apps")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id)
    .select(
      "id, user_id, name, url, icon_url, is_pinned, dock_order, grid_col, grid_row, created_at",
    )
    .single();

  if (error) {
    console.error("Lỗi khi cập nhật ứng dụng:", error);
    throw new Error(error.message);
  }

  revalidatePath("/");
  return data;
}
