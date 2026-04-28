"use client";

import { trpc } from "@/trpc/client";
import type { Task } from "@/server/db/tasks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Mode = "create" | "edit";

export function TaskForm({ mode, task }: { mode: Mode; task?: Task }) {
  const router = useRouter();
  const utils = trpc.useUtils();

  const [titulo, setTitulo] = useState(task?.titulo ?? "");
  const [descricao, setDescricao] = useState(task?.descricao ?? "");
  const [clientError, setClientError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const createMutation = trpc.task.create.useMutation({
    onSuccess: () => {
      void utils.task.list.invalidate();
      router.push("/");
      router.refresh();
    },
    onError: (e) => {
      setServerError(e.message || "Failed to create task.");
    },
  });

  const updateMutation = trpc.task.update.useMutation({
    onSuccess: () => {
      void utils.task.list.invalidate();
      router.push("/");
      router.refresh();
    },
    onError: (e) => {
      setServerError(e.message || "Failed to update task.");
    },
  });

  const busy = createMutation.isPending || updateMutation.isPending;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setClientError(null);
    setServerError(null);

    const t = titulo.trim();
    if (!t) {
      setClientError("Please enter a title.");
      return;
    }

    if (mode === "create") {
      createMutation.mutate({
        titulo: t,
        descricao: descricao.trim() || undefined,
      });
    } else if (task) {
      updateMutation.mutate({
        id: task.id,
        titulo: t,
        descricao: descricao.trim() || undefined,
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-lg space-y-4">
      {clientError && (
        <p className="rounded-md border border-amber-600/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-900 dark:text-amber-100">
          {clientError}
        </p>
      )}
      {serverError && (
        <p className="rounded-md border border-red-600/40 bg-red-500/10 px-3 py-2 text-sm text-red-800 dark:text-red-200">
          {serverError}
        </p>
      )}

      <div className="space-y-1">
        <label htmlFor="titulo" className="text-sm font-medium">
          Title <span className="text-red-600">*</span>
        </label>
        <input
          id="titulo"
          name="titulo"
          required
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
          placeholder="e.g. Review documentation"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="descricao" className="text-sm font-medium">
          Description (optional)
        </label>
        <textarea
          id="descricao"
          name="descricao"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          rows={4}
          className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
          placeholder="Additional details…"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={busy}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {busy ? "Saving…" : mode === "create" ? "Create" : "Save"}
        </button>
        <Link
          href="/"
          className="rounded-md border border-zinc-300 px-4 py-2 text-sm hover:bg-zinc-50 dark:border-zinc-600 dark:hover:bg-zinc-800"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
