import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@workspace/auth/server";
import { getSupabaseAdminClient } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const { user } = await getServerSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const table = searchParams.get("table");
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "25", 10)));
  const search = searchParams.get("search")?.trim() || "";
  const sortBy = searchParams.get("sortBy")?.trim();
  const sortOrder = searchParams.get("sortOrder") === "asc" ? true : false;

  if (!table) {
    return NextResponse.json({ error: "Missing table parameter" }, { status: 400 });
  }

  try {
    const supabase = getSupabaseAdminClient() as any;
    const fromIndex = (page - 1) * limit;
    const toIndex = fromIndex + limit - 1;

    let query = supabase.from(table).select("*", { count: "exact" });

    if (sortBy) {
      query = query.order(sortBy, { ascending: sortOrder });
    }

    query = query.range(fromIndex, toIndex);

    const { data, count, error } = await query;
    if (error) throw error;

    let rows = data || [];
    // If client-side search query is provided
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter((row: any) =>
        Object.values(row).some((val) =>
          val !== null && val !== undefined && String(val).toLowerCase().includes(q)
        )
      );
    }

    return NextResponse.json({
      success: true,
      rows,
      totalCount: count ?? rows.length,
      page,
      limit,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error querying table rows";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { user } = await getServerSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { table, data } = await req.json();
    if (!table || !data || typeof data !== "object") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient() as any;
    const { data: inserted, error } = await supabase.from(table).insert(data).select();
    if (error) throw error;

    return NextResponse.json({ success: true, row: inserted?.[0] });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error inserting row";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const { user } = await getServerSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { table, pkField, pkValue, data } = await req.json();
    if (!table || !pkField || pkValue === undefined || !data) {
      return NextResponse.json({ error: "Missing required update fields" }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient() as any;
    // Exclude primary key from update payload to prevent postgres PK mutation errors
    const { [pkField]: _ignored, ...updatePayload } = data;
    const matchVal =
      !isNaN(Number(pkValue)) && (pkField === "chat_id" || typeof pkValue === "number")
        ? Number(pkValue)
        : pkValue;

    const { data: updated, error } = await supabase
      .from(table)
      .update(updatePayload)
      .match({ [pkField]: matchVal })
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, row: updated?.[0] });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error updating row";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { user } = await getServerSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { table, pkField, pks } = await req.json();
    if (!table || !pkField || !Array.isArray(pks) || pks.length === 0) {
      return NextResponse.json({ error: "Missing delete parameters" }, { status: 400 });
    }

    const validPks = pks.filter((p: any) => p !== undefined && p !== null && String(p).trim() !== "");
    if (validPks.length === 0) {
      return NextResponse.json({ error: "Danh sách khóa chính xóa không hợp lệ" }, { status: 400 });
    }

    const formattedPks = pkField === "chat_id" ? validPks.map(Number) : validPks;
    const supabase = getSupabaseAdminClient() as any;
    const { error } = await supabase.from(table).delete().in(pkField, formattedPks);
    if (error) throw error;

    return NextResponse.json({ success: true, count: validPks.length });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error deleting rows";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
