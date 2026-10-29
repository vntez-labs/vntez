import { NextResponse } from "next/server";
import { getServerSession } from "@workspace/auth/server";
import {
  getAllClientRequests,
  createClientRequest,
  updateClientRequest,
  deleteClientRequest,
  approveClientRequest,
} from "@/lib/client-requests";

// 1. GET /api/client-requests - Lấy danh sách Deal đối tác & yêu cầu cấp Client
export async function GET(req: Request) {
  const { user } = await getServerSession();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get("status"); // 'all' | 'pending' | 'approved' | 'rejected'
    const userOnly = searchParams.get("userOnly") === "true";

    const { records, isUsingSupabase } = await getAllClientRequests();

    let filtered = records;

    if (userOnly) {
      filtered = filtered.filter(
        (r) =>
          r.user_id === user.sub ||
          r.applicant_email.toLowerCase() === user.email.toLowerCase()
      );
    }

    if (statusFilter && statusFilter !== "all") {
      filtered = filtered.filter((r) => r.status === statusFilter);
    }

    const pendingCount = records.filter((r) => r.status === "pending").length;
    const approvedCount = records.filter((r) => r.status === "approved").length;
    const rejectedCount = records.filter((r) => r.status === "rejected").length;

    return NextResponse.json({
      success: true,
      requests: filtered,
      total: records.length,
      counts: {
        all: records.length,
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount,
      },
      isUsingSupabase,
    });
  } catch (err) {
    console.error("GET /api/client-requests error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}

// 2. POST /api/client-requests - Tạo hồ sơ đề xuất Client mới (Nộp Deal đối tác)
export async function POST(req: Request) {
  const { user } = await getServerSession();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      project_name,
      project_idea,
      applicant_name,
      applicant_email,
      applicant_phone,
      identity_proof,
      project_website,
      requested_redirect_uris,
      deal_type,
    } = body;

    const isSuperAdmin =
      user.email === "hnamhocit@gmail.com" ||
      user.email.endsWith("@vntez.com") ||
      user.email.includes("admin");

    const finalProjectName = project_name?.trim();
    if (!finalProjectName) {
      return NextResponse.json(
        { success: false, error: "Tên dự án không được để trống" },
        { status: 400 }
      );
    }

    // Admin bypass: project_idea is optional
    const finalProjectIdea = project_idea?.trim() || "";

    // Parse URIs
    let parsedUris: string[] = [];
    if (Array.isArray(requested_redirect_uris)) {
      parsedUris = requested_redirect_uris
        .map((u) => String(u).trim())
        .filter(Boolean);
    } else if (typeof requested_redirect_uris === "string") {
      parsedUris = requested_redirect_uris
        .split(/[\n,]+/)
        .map((u) => u.trim())
        .filter(Boolean);
    }

    if (parsedUris.length === 0) {
      parsedUris = ["http://localhost:3000/auth/callback"];
    }

    const record = await createClientRequest({
      user_id: user.sub,
      applicant_name: applicant_name?.trim() || user.name || "Administrator",
      applicant_email: applicant_email?.trim() || user.email,
      applicant_phone: applicant_phone?.trim() || null,
      identity_proof: identity_proof?.trim() || null,
      project_name: finalProjectName,
      project_idea: finalProjectIdea,
      project_website: project_website?.trim() || null,
      requested_redirect_uris: parsedUris,
      deal_type: deal_type || (isSuperAdmin ? "enterprise" : "partner"),
    });

    // If auto_approve is requested (Admin Bypass)
    if (body.auto_approve) {
      const approved = await approveClientRequest(
        record.id,
        "Khởi tạo và phê duyệt trực tiếp bởi Quản trị viên (Admin Bypass)"
      );
      return NextResponse.json({
        success: true,
        message: `Đã khởi tạo và cấp phát Client ID "${approved.client_id}" thành công vào Supabase!`,
        request: approved.record,
        client_id: approved.client_id,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Đã tạo yêu cầu ứng dụng thành công.",
      request: record,
    });
  } catch (err) {
    console.error("POST /api/client-requests error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}

// 3. PUT /api/client-requests - Chỉnh sửa thông tin Deal
export async function PUT(req: Request) {
  const { user } = await getServerSession();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Thiếu id yêu cầu cần cập nhật" },
        { status: 400 }
      );
    }

    const updated = await updateClientRequest(id, updates);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Không tìm thấy hồ sơ để cập nhật" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Cập nhật hồ sơ yêu cầu thành công",
      request: updated,
    });
  } catch (err) {
    console.error("PUT /api/client-requests error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}

// 4. DELETE /api/client-requests - Xóa Deal
export async function DELETE(req: Request) {
  const { user } = await getServerSession();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    let id = searchParams.get("id");

    if (!id) {
      try {
        const body = await req.json();
        id = body.id;
      } catch {
        // Ignore
      }
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Thiếu id hồ sơ cần xóa" },
        { status: 400 }
      );
    }

    await deleteClientRequest(id);

    return NextResponse.json({
      success: true,
      message: "Đã xóa yêu cầu thành công",
    });
  } catch (err) {
    console.error("DELETE /api/client-requests error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
