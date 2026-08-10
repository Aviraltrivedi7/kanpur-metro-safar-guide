export default function Loading() {
  return (
    <div className="container-page py-10" role="status" aria-label="Loading">
      <div className="h-8 w-48 animate-pulse rounded-md bg-card" />
      <div className="mt-2 h-4 w-72 animate-pulse rounded-md bg-card" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card h-28 animate-pulse" />
        ))}
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
