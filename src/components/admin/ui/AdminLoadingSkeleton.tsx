export default function AdminLoadingSkeleton({
  rows = 4,
}: {
  rows?: number;
}) {
  return (
    <div className="space-y-3 p-6">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-10 animate-pulse rounded-lg bg-neutral-100"
          style={{ width: `${88 - i * 8}%` }}
        />
      ))}
    </div>
  );
}
