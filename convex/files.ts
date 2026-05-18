import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const getStorageUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

/** Read file bytes from Convex storage (for reliable server-side download). */
export const readStorageBytes = action({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    const blob = await ctx.storage.get(args.storageId);
    if (!blob) {
      return null;
    }
    const arrayBuffer = await blob.arrayBuffer();
    const bytes = Buffer.from(arrayBuffer);
    return {
      base64: bytes.toString("base64"),
      contentType: blob.type || "video/mp4",
      byteLength: bytes.length,
    };
  },
});
