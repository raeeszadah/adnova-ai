import fs from "fs/promises";
import { fetchMutation, fetchQuery } from "./convex-server";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

export async function uploadFileToConvex(
  filePath: string,
  contentType: string
): Promise<{ storageId: Id<"_storage">; url: string }> {
  const uploadUrl = await fetchMutation(api.files.generateUploadUrl, {});

  const fileBuffer = await fs.readFile(filePath);
  const uploadRes = await fetch(uploadUrl, {
    method: "POST",
    headers: { "Content-Type": contentType },
    body: new Uint8Array(fileBuffer),
  });

  if (!uploadRes.ok) {
    throw new Error(`Convex storage upload failed: ${uploadRes.status}`);
  }

  const { storageId } = (await uploadRes.json()) as {
    storageId: Id<"_storage">;
  };

  const url = await fetchQuery(api.files.getStorageUrl, { storageId });
  if (!url) {
    throw new Error("Failed to resolve storage URL");
  }

  return { storageId, url };
}

export async function uploadBufferToConvex(
  buffer: Buffer,
  contentType: string
): Promise<{ storageId: Id<"_storage">; url: string }> {
  const uploadUrl = await fetchMutation(api.files.generateUploadUrl, {});

  const uploadRes = await fetch(uploadUrl, {
    method: "POST",
    headers: { "Content-Type": contentType },
    body: new Uint8Array(buffer),
  });

  if (!uploadRes.ok) {
    throw new Error(`Convex storage upload failed: ${uploadRes.status}`);
  }

  const { storageId } = (await uploadRes.json()) as {
    storageId: Id<"_storage">;
  };

  const url = await fetchQuery(api.files.getStorageUrl, { storageId });
  if (!url) {
    throw new Error("Failed to resolve storage URL");
  }

  return { storageId, url };
}
