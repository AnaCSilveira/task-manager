import { TaskList } from "@/components/task-list";
import { api } from "@/trpc/server";

const PAGE_SIZE = 10;

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const initialPage = await api.task.list({ limit: PAGE_SIZE });

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Your tasks
      </h1>
      <TaskList initialPage={initialPage} />
    </main>
  );
}
