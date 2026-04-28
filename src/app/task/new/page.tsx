import { TaskForm } from "@/components/task-form";

export default function NewTaskPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        New task
      </h1>
      <TaskForm mode="create" />
    </main>
  );
}
