import { ConvexHttpClient } from "convex/browser";
import type {
  FunctionArgs,
  FunctionReference,
  FunctionReturnType,
} from "convex/server";
import { api } from "../../convex/_generated/api";

/**
 * Convex client for background jobs (Inngest).
 * Video mutations are invoked server-side with explicit clerkId/videoId args.
 */
let jobClient: ConvexHttpClient | null = null;

export function getConvexJobClient(): ConvexHttpClient {
  if (!jobClient) {
    const url = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!url) {
      throw new Error(
        "NEXT_PUBLIC_CONVEX_URL is missing. Required for background video jobs."
      );
    }
    jobClient = new ConvexHttpClient(url);
  }
  return jobClient;
}

export async function jobQuery<Query extends FunctionReference<"query">>(
  query: Query,
  args: FunctionArgs<Query>
): Promise<FunctionReturnType<Query>> {
  return getConvexJobClient().query(query, args);
}

export async function jobMutation<Mutation extends FunctionReference<"mutation">>(
  mutation: Mutation,
  args: FunctionArgs<Mutation>
): Promise<FunctionReturnType<Mutation>> {
  return getConvexJobClient().mutation(mutation, args);
}

export { api };
