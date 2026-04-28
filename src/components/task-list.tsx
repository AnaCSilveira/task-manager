"use client";

import { trpc } from "@/trpc/client";
import type { Task } from "@/server/db/tasks";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const PAGE_SIZE = 10;

type ListPage = { items: Task[]; nextCursor?: string };

type Banner = { type: "success" | "error"; message: string };

export function TaskList({ initialPage }: { initialPage: ListPage }) {
  const [banner, setBanner] = useState<Banner | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const utils = trpc.useUtils();

  const listQuery = trpc.task.list.useInfiniteQuery(
    { limit: PAGE_SIZE },
    {
      getNextPageParam: (last) => last.nextCursor,
      initialData: {
        pages: [initialPage],
        pageParams: [undefined],
      },
    },
  );

  const deleteMutation = trpc.task.delete.useMutation({
    onSuccess: () => {
      setBanner({ type: "success", message: "Task deleted successfully." });
      void utils.task.list.invalidate();
    },
    onError: (err) => {
      setBanner({
        type: "error",
        message: err.message || "Could not delete the task.",
      });
    },
  });

  const fetchNext = listQuery.fetchNextPage;
  const hasNext = listQuery.hasNextPage;
  const fetchingNext = listQuery.isFetchingNextPage;

  const onIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [e] = entries;
      if (e?.isIntersecting && hasNext && !fetchingNext) {
        void fetchNext();
      }
    },
    [fetchNext, hasNext, fetchingNext],
  );

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(onIntersect, { rootMargin: "120px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, [onIntersect]);

  const tasks = listQuery.data?.pages.flatMap((p) => p.items) ?? [];
  const listLoading = listQuery.isPending && !listQuery.data;

  return (
    <div className="space-y-4">
      {banner && (
        <div
          role="status"
          className={
            banner.type === "success"
              ? "rounded-md border border-emerald-600/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-800 dark:text-emerald-200"
              : "rounded-md border border-red-600/40 bg-red-500/10 px-3 py-2 text-sm text-red-800 dark:text-red-200"
          }
        >
          {banner.message}
        </div>
      )}

      {listLoading ? (
        <p className="text-sm text-zinc-500">Loading tasks…</p>
      ) : tasks.length === 0 ? (
        <p className="text-sm text-zinc-500">
          No tasks yet.{" "}
          <Link href="/task/new" className="underline">
            Create the first one
          </Link>
          .
        </p>
      ) : (
        <ul className="space-y-3">
          {tasks.map((t) => (
            <li
              key={t.id}
              className="flex flex-col gap-2 rounded-lg border border-zinc-200 bg-zinc-50/80 p-4 dark:border-zinc-700 dark:bg-zinc-900/40 sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="min-w-0 flex-1 space-y-1">
                <h2 className="font-medium text-zinc-900 dark:text-zinc-100">
                  {t.titulo}
                </h2>
                {t.descricao ? (
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {t.descricao}
                  </p>
                ) : null}
                <p className="text-xs text-zinc-400">
                  Created{" "}
                  {t.dataCriacao.toLocaleString("en-US", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Link
                  href={`/task/${t.id}/editar`}
                  className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-100 dark:border-zinc-600 dark:hover:bg-zinc-800"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  disabled={deleteMutation.isPending}
                  className="rounded-md bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700 disabled:opacity-50"
                  onClick={() => deleteMutation.mutate({ id: t.id })}
                >
                  {deleteMutation.isPending ? "Deleting…" : "Delete"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div ref={sentinelRef} className="h-4" aria-hidden />

      {fetchingNext ? (
        <p className="text-center text-sm text-zinc-500">Loading more…</p>
      ) : null}

      {!hasNext && tasks.length > 0 ? (
        <p className="text-center text-xs text-zinc-400">End of list</p>
      ) : null}
    </div>
  );
}
