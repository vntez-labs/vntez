import type { User } from "@supabase/supabase-js";
import { getSupabaseAdminClient } from "@/lib/supabase";

export async function listRootIamUsers(supabase = getSupabaseAdminClient()) {
  const users: User[] = [];
  const perPage = 100;
  for (let page = 1; ; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
    if (error) throw error;
    users.push(...data.users);
    if (data.users.length < perPage || (data.total > 0 && users.length >= data.total)) return users;
  }
}

export async function listRootUserRoles(supabase = getSupabaseAdminClient()) {
  const roles = new Map<string, string[]>();
  const pageSize = 500;
  for (let offset = 0; ; offset += pageSize) {
    const { data, error } = await supabase
      .from("iam_user_roles")
      .select("user_id, role_id")
      .is("app_id", null)
      .order("user_id")
      .order("role_id")
      .range(offset, offset + pageSize - 1);
    if (error) throw error;
    for (const { user_id, role_id } of data) {
      const userRoles = roles.get(user_id) || [];
      userRoles.push(role_id);
      roles.set(user_id, userRoles);
    }
    if (data.length < pageSize) return roles;
  }
}
