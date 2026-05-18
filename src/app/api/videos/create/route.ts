import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { fetchMutation } from "@/lib/convex-server";
import { api } from "../../../../../convex/_generated/api";
import { ensureConvexUser } from "@/lib/ensure-convex-user";
import type { Id } from "../../../../../convex/_generated/dataModel";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await ensureConvexUser(userId);

    const { title, description, productImageUrl, productStorageId, avatarId, voiceId } =
      await req.json();

    if (!title || !description || !productImageUrl) {
      return NextResponse.json(
        { error: "Missing title, description, or product image" },
        { status: 400 }
      );
    }

    const videoId = await fetchMutation(api.videos.create, {
      clerkId: userId,
      title,
      description,
      productImageUrl,
      productStorageId: productStorageId as Id<"_storage"> | undefined,
      avatarId: avatarId || undefined,
      voiceId: voiceId || undefined,
    });

    return NextResponse.json({ videoId });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create video";
    console.error("Create video error:", error);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
