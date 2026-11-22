export default function Loading() {
  return (
    <div className="container-x animate-pulse pt-10 md:pt-14" aria-busy="true">
      <div className="h-6 w-40 rounded-full bg-raised" />
      <div className="mt-5 h-12 w-3/4 max-w-xl rounded-xl bg-raised" />
      <div className="mt-4 h-4 w-1/2 max-w-md rounded bg-raised" />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card overflow-hidden">
            <div className="aspect-[2/1] bg-raised" />
            <div className="space-y-3 p-5">
              <div className="h-4 w-1/2 rounded bg-raised" />
              <div className="h-3 w-3/4 rounded bg-raised" />
              <div className="h-9 rounded-full bg-raised" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
