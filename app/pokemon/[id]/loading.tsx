export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-300 border-t-blue-500" />
        <p className="text-zinc-500">Loading Pokemon...</p>
      </div>
    </div>
  );
}
