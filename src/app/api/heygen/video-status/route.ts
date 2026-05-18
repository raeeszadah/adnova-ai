import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { fetchHeyGenVideoStatus } from "@/lib/heygen";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const heygenVideoId = req.nextUrl.searchParams.get("heygenVideoId");
  if (!heygenVideoId) {
    return NextResponse.json(
      { error: "Missing heygenVideoId query parameter" },
      { status: 400 }
    );
  }

  try {
    const { status, videoUrl, error } =
      await fetchHeyGenVideoStatus(heygenVideoId);

    return NextResponse.json({
      status,
      videoUrl,
      error,
      heygenVideoId,
    });
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Failed to check HeyGen status";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
