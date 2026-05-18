import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { uploadBufferToConvex } from "@/lib/storage-upload";
import { ensureConvexUser } from "@/lib/ensure-convex-user";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await ensureConvexUser(userId);

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const contentType = file.type || "image/jpeg";

    const { storageId, url } = await uploadBufferToConvex(buffer, contentType);

    return NextResponse.json({
      productImageUrl: url,
      productStorageId: storageId,
    });
  } catch (error) {
    console.error("Upload error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to upload product image";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
