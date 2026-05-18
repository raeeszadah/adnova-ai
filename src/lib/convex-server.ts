import { auth } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import {
  fetchAction as convexFetchAction,
  fetchMutation as convexFetchMutation,
  fetchQuery as convexFetchQuery,
} from "convex/nextjs";
import type {
  FunctionArgs,
  FunctionReference,
  FunctionReturnType,
} from "convex/server";

const CONVEX_JWT_TEMPLATE =
  process.env.CLERK_CONVEX_JWT_TEMPLATE ?? "convex";

let httpClient: ConvexHttpClient | null = null;

function getHttpClient(): ConvexHttpClient {
  if (!httpClient) {
    const url = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!url) {
      throw new Error(
        "NEXT_PUBLIC_CONVEX_URL is missing. Add it to .env and restart the dev server."
      );
    }
    httpClient = new ConvexHttpClient(url);
  }
  return httpClient;
}

async function getConvexToken(): Promise<string | undefined> {
  const { getToken, userId } = await auth();
  if (!userId) {
    return undefined;
  }

  try {
    const token = await getToken({ template: CONVEX_JWT_TEMPLATE });
    return token ?? undefined;
  } catch (error) {
    const status =
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      typeof (error as { status: unknown }).status === "number"
        ? (error as { status: number }).status
        : undefined;

    if (status === 404) {
      return undefined;
    }
    throw error;
  }
}

/** Server-side Convex calls: Clerk JWT when available, else trusted HTTP client (public mutations). */
export async function fetchQuery<Query extends FunctionReference<"query">>(
  query: Query,
  args: FunctionArgs<Query>
): Promise<FunctionReturnType<Query>> {
  const token = await getConvexToken();
  if (token) {
    return convexFetchQuery(query, args, { token });
  }
  return getHttpClient().query(query, args);
}

export async function fetchMutation<
  Mutation extends FunctionReference<"mutation">,
>(
  mutation: Mutation,
  args: FunctionArgs<Mutation>
): Promise<FunctionReturnType<Mutation>> {
  const token = await getConvexToken();
  if (token) {
    return convexFetchMutation(mutation, args, { token });
  }
  return getHttpClient().mutation(mutation, args);
}

export async function fetchAction<Action extends FunctionReference<"action">>(
  action: Action,
  args: FunctionArgs<Action>
): Promise<FunctionReturnType<Action>> {
  const token = await getConvexToken();
  if (token) {
    return convexFetchAction(action, args, { token });
  }
  return getHttpClient().action(action, args);
}
