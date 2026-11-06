import { NextResponse } from "next/server";
import { incrementView } from "@/lib/blog-storage";

export async function POST(req: Request) {
  try {
    const { slug } = await req.json();
    if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });

    const views = await incrementView(slug);
    return NextResponse.json({ success: true, viewsCount: views });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
