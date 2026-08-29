export function PageIntroSkeleton() {
  return (
    <div className="page-container animate-pulse py-16 md:py-24">
      <div className="h-12 w-72 rounded-[10px] bg-surface-strong" />
      <div className="mt-5 h-5 w-full max-w-lg rounded bg-surface-strong" />
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index}>
            <div className="aspect-[16/10] rounded-[14px] bg-surface-strong" />
            <div className="mt-4 h-6 w-3/4 rounded bg-surface-strong" />
          </div>
        ))}
      </div>
    </div>
  );
}
