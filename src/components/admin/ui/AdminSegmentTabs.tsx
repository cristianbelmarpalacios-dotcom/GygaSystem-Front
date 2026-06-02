type Tab<T extends string> = { id: T; label: string };

type Props<T extends string> = {
  tabs: readonly Tab<T>[];
  active: T;
  onChange: (id: T) => void;
};

export default function AdminSegmentTabs<T extends string>({
  tabs,
  active,
  onChange,
}: Props<T>) {
  return (
    <nav className="flex flex-wrap gap-1 rounded-xl bg-neutral-100/80 p-1">
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onChange(t.id)}
          className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
            active === t.id
              ? "bg-white text-brand-dark shadow-sm"
              : "text-neutral-600 hover:text-neutral-900"
          }`}
        >
          {t.label}
        </button>
      ))}
    </nav>
  );
}
