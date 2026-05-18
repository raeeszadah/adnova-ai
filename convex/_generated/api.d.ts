/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as admin_apiLogs from "../admin/apiLogs.js";
import type * as admin_overview from "../admin/overview.js";
import type * as admin_users from "../admin/users.js";
import type * as admin_videos from "../admin/videos.js";
import type * as apiLogs from "../apiLogs.js";
import type * as constants from "../constants.js";
import type * as files from "../files.js";
import type * as lib_requireAdmin from "../lib/requireAdmin.js";
import type * as lib_roles from "../lib/roles.js";
import type * as payments from "../payments.js";
import type * as users from "../users.js";
import type * as videos from "../videos.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "admin/apiLogs": typeof admin_apiLogs;
  "admin/overview": typeof admin_overview;
  "admin/users": typeof admin_users;
  "admin/videos": typeof admin_videos;
  apiLogs: typeof apiLogs;
  constants: typeof constants;
  files: typeof files;
  "lib/requireAdmin": typeof lib_requireAdmin;
  "lib/roles": typeof lib_roles;
  payments: typeof payments;
  users: typeof users;
  videos: typeof videos;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
