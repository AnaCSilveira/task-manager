export type Task = {
  id: string;
  titulo: string;
  descricao: string | null;
  dataCriacao: Date;
};

const tasks: Task[] = [];

function sortedCopy(): Task[] {
  return [...tasks].sort(
    (a, b) => b.dataCriacao.getTime() - a.dataCriacao.getTime(),
  );
}

export function listPaged(
  limit: number,
  cursor?: string,
): {
  items: Task[];
  nextCursor?: string;
} {
  const all = sortedCopy();
  let start = 0;
  if (cursor) {
    const idx = all.findIndex((t) => t.id === cursor);
    start = idx >= 0 ? idx + 1 : 0;
  }
  const items = all.slice(start, start + limit);
  const nextStart = start + items.length;
  const hasMore = nextStart < all.length;
  const nextCursor =
    hasMore && items.length > 0 ? items[items.length - 1]!.id : undefined;
  return { items, nextCursor };
}

export function getById(id: string): Task | undefined {
  return tasks.find((t) => t.id === id);
}

export function createTask(input: {
  titulo: string;
  descricao?: string | null;
}): Task {
  const task: Task = {
    id: crypto.randomUUID(),
    titulo: input.titulo,
    descricao:
      input.descricao == null || input.descricao === ""
        ? null
        : input.descricao,
    dataCriacao: new Date(),
  };
  tasks.push(task);
  return task;
}

export function updateTask(
  id: string,
  input: { titulo: string; descricao?: string | null },
): Task | null {
  const task = tasks.find((t) => t.id === id);
  if (!task) return null;
  task.titulo = input.titulo;
  task.descricao =
    input.descricao == null || input.descricao === "" ? null : input.descricao;
  return task;
}

export function deleteTask(id: string): boolean {
  const i = tasks.findIndex((t) => t.id === id);
  if (i === -1) return false;
  tasks.splice(i, 1);
  return true;
}
