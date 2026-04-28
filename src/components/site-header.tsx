import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-zinc-200 bg-white/80 dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="font-semibold text-zinc-900 dark:text-zinc-100">
          Tasks
        </Link>
        <nav className="flex gap-3 text-sm">
          <Link href="/" className="text-zinc-600 hover:underline dark:text-zinc-400">
            List
          </Link>
          <Link
            href="/task/new"
            className="rounded-md bg-zinc-900 px-3 py-1 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            New task
          </Link>
        </nav>
      </div>
    </header>
  );
}
