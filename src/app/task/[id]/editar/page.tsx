import { TaskForm } from "@/components/task-form";
import { getById } from "@/server/db/tasks";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditTaskPage({ params }: Props) {
  const { id } = await params;
  const task = getById(id);
  if (!task) notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Edit task
      </h1>
      <TaskForm mode="edit" task={task} />
    </main>
  );
}
