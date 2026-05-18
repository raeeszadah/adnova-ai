"use client";

import { useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";

export function AdminApiLogsClient() {
  const [apiType, setApiType] = useState("");
  const [status, setStatus] = useState("");
  const logs = useQuery(api.admin.apiLogs.listApiLogs, {
    apiType: apiType || undefined,
    status: status || undefined,
    limit: 100,
  });

  return (
    <div className="space-y-6 page-enter">
      <div>
        <h1 className="font-headline text-2xl font-extrabold sm:text-3xl">API logs</h1>
        <p className="text-muted-foreground mt-1">Gemini, HeyGen, Remotion, and more</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <select
          value={apiType}
          onChange={(e) => setApiType(e.target.value)}
          className="rounded-xl border border-border bg-foreground/5 px-4 py-2 text-sm"
        >
          <option value="">All types</option>
          <option value="HEYGEN">HEYGEN</option>
          <option value="REMOTION">REMOTION</option>
          <option value="GEMINI">GEMINI</option>
          <option value="HEYGEN_MOCK">HEYGEN_MOCK</option>
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-xl border border-border bg-foreground/5 px-4 py-2 text-sm"
        >
          <option value="">All statuses</option>
          <option value="SUCCESS">SUCCESS</option>
          <option value="FAILED">FAILED</option>
        </select>
      </div>

      {logs === undefined ? (
        <Skeleton className="h-64 rounded-2xl" />
      ) : (
        <div className="footer-glass rounded-2xl border border-border overflow-hidden">
          <div className="overflow-x-auto max-h-[32rem] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-card/95 backdrop-blur">
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="p-3 font-bold">Type</th>
                  <th className="p-3 font-bold">Status</th>
                  <th className="p-3 font-bold">Time</th>
                  <th className="p-3 font-bold">Duration</th>
                  <th className="p-3 font-bold">Message</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log._id} className="border-b border-border/40">
                    <td className="p-3 font-mono text-xs">{log.apiType}</td>
                    <td className="p-3">
                      <span
                        className={
                          log.status === "FAILED"
                            ? "text-destructive font-bold"
                            : "text-primary font-bold"
                        }
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="p-3 text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(log._creationTime).toLocaleString()}
                    </td>
                    <td className="p-3">{log.processingTime}ms</td>
                    <td className="p-3 text-xs text-muted-foreground max-w-xs truncate">
                      {log.message ?? "—"}
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
