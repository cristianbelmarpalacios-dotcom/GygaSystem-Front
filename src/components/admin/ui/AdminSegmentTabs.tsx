import { adminSegmentTabs } from "@/lib/admin/design";

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
    <nav className={adminSegmentTabs.nav} aria-label="Secciones">
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onChange(t.id)}
          aria-current={active === t.id ? "page" : undefined}
          className={`${adminSegmentTabs.tab} ${
            active === t.id
              ? adminSegmentTabs.tabActive
              : adminSegmentTabs.tabInactive
          }`}
        >
          {t.label}
        </button>
      ))}
    </nav>
  );
}
