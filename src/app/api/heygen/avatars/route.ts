import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { listHeyGenAvatars } from "@/lib/heygen";

export const runtime = "nodejs";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const avatars = await listHeyGenAvatars();
    return NextResponse.json({ avatars });
  } catch (error) {
    console.error("HeyGen avatars error:", error);
    return NextResponse.json(
      { error: "Failed to load avatars" },
      { status: 500 }
    );
  }
}
