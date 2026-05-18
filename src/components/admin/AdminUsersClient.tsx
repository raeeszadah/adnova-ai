"use client";

import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";

export function AdminUsersClient() {
  const [search, setSearch] = useState("");
  const users = useQuery(api.admin.users.listUsers, {
    search: search || undefined,
    limit: 100,
  });

  const setCredits = useMutation(api.admin.users.adminSetCredits);
  const adjustCredits = useMutation(api.admin.users.adminAdjustCredits);
  const setPlan = useMutation(api.admin.users.adminSetPlan);
  const setSuspended = useMutation(api.admin.users.adminSetSuspended);

  const [msg, setMsg] = useState<string | null>(null);

  const act = async (fn: () => Promise<unknown>, label: string) => {
    try {
      await fn();
      setMsg(label);
      setTimeout(() => setMsg(null), 3000);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Action failed");
    }
  };

  return (
    <div className="space-y-6 page-enter">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline text-3xl font-extrabold">User management</h1>
          <p className="text-muted-foreground mt-1">Search, credits, plans, suspension</p>
        </div>
        <input
          type="search"
          placeholder="Search email or name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-xl border border-border bg-foreground/5 px-4 py-2.5 text-sm w-full sm:w-72 focus:border-primary focus:outline-none"
        />
      </div>

      {msg ? (
        <p className="text-sm text-primary bg-primary/10 border border-primary/30 rounded-xl px-4 py-2">
          {msg}
        </p>
      ) : null}

      {users === undefined ? (
        <Skeleton className="h-64 rounded-2xl" />
      ) : (
        <div className="footer-glass rounded-2xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="p-4 font-bold">User</th>
                  <th className="p-4 font-bold">Credits</th>
                  <th className="p-4 font-bold">Plan</th>
                  <th className="p-4 font-bold">Videos</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b border-border/50 hover:bg-foreground/[0.02]">
                    <td className="p-4">
                      <p className="font-semibold">{u.name ?? "—"}</p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                      {u.role === "admin" ? (
                        <span className="text-[10px] uppercase text-secondary font-bold">Admin</span>
                      ) : null}
                    </td>
                    <td className="p-4 font-bold text-primary">{u.credits}</td>
                    <td className="p-4">{u.plan ?? "FREE"}</td>
                    <td className="p-4">{u.videoCount}</td>
                    <td className="p-4">
                      {u.suspended ? (
                        <span className="text-destructive text-xs font-bold">Suspended</span>
                      ) : (
                        <span className="text-primary text-xs font-bold">Active</span>
                      )}
                    </td>
                    <td className="p-4">
                      {u.role === "admin" ? (
                        <span className="text-xs text-muted-foreground">—</span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          <button
                            type="button"
                            className="px-2 py-1 rounded-lg border border-border text-xs hover:bg-primary/10"
                            onClick={() =>
                              act(
                                () => adjustCredits({ userId: u._id, delta: 5 }),
                                "Added 5 credits"
                              )
                            }
                          >
                            +5
                          </button>
                          <button
                            type="button"
                            className="px-2 py-1 rounded-lg border border-border text-xs hover:bg-primary/10"
                            onClick={() =>
                              act(
                                () => setCredits({ userId: u._id, credits: 2 }),
                                "Set to 2 credits"
                              )
                            }
                          >
                            Reset 2
                          </button>
                          <button
                            type="button"
                            className="px-2 py-1 rounded-lg border border-border text-xs hover:bg-foreground/10"
                            onClick={() =>
                              act(
                                () =>
                                  setPlan({
                                    userId: u._id,
                                    plan: u.plan === "PRO" ? "FREE" : "PRO",
                                  }),
                                "Plan toggled"
                              )
                            }
                          >
                            Toggle plan
                          </button>
                          <button
                            type="button"
                            className="px-2 py-1 rounded-lg border border-destructive/30 text-xs text-destructive hover:bg-destructive/10"
                            onClick={() =>
                              act(
                                () =>
                                  setSuspended({
                                    userId: u._id,
                                    suspended: !u.suspended,
                                  }),
                                u.suspended ? "Unsuspended" : "Suspended"
                              )
                            }
                          >
                            {u.suspended ? "Unsuspend" : "Suspend"}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
