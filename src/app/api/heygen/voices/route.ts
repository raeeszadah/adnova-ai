import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { listHeyGenVoices } from "@/lib/heygen";

export const runtime = "nodejs";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const voices = await listHeyGenVoices();
    return NextResponse.json({ voices });
  } catch (error) {
    console.error("HeyGen voices error:", error);
    return NextResponse.json(
      { error: "Failed to load voices" },
      { status: 500 }
    );
  }
}
