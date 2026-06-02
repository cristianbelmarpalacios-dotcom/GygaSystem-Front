"use client";

import Link from "next/link";
import { ADMIN_HELP_SECTIONS } from "@/constants/admin-help";
import AdminAlert from "@/components/admin/ui/AdminAlert";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import AdminPanel from "@/components/admin/ui/AdminPanel";

export default function AdminAyudaPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Soporte"
        title="Ayuda del backoffice"
        description={
          <>
            Glosario de campos y conceptos. Si algo no está claro, empieza por{" "}
            <a href="#general" className="font-semibold text-brand hover:text-brand-dark">
              Conceptos generales
            </a>{" "}
            y{" "}
            <a href="#tipos" className="font-semibold text-brand hover:text-brand-dark">
              Tipos de producto
            </a>
            .
          </>
        }
      />

      <AdminPanel title="Ir a sección" className="border-brand/15 bg-gradient-to-br from-brand/5 to-white">
        <ul className="flex flex-wrap gap-2">
          {ADMIN_HELP_SECTIONS.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="inline-block rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-neutral-800 shadow-sm ring-1 ring-black/5 transition-all hover:ring-brand/30"
              >
                {s.title}
              </a>
            </li>
          ))}
        </ul>
      </AdminPanel>

      <AdminAlert variant="warn">
        <p className="font-bold">¿Puedo crear mis propios tipos de producto?</p>
        <p className="mt-1 leading-relaxed">
          <strong>No desde el admin.</strong> Los tipos (Componente PC, Periférico, PC armado,
          Accesorio) son valores fijos del sistema. Para organizar como tú quieras —por ejemplo
          «Monitores» o «Cables HDMI»— crea{" "}
          <Link href="/admin/categorias" className="font-semibold underline">
            categorías
          </Link>{" "}
          y asígnalas a cada producto.
        </p>
      </AdminAlert>

      <div className="space-y-6">
        {ADMIN_HELP_SECTIONS.map((section) => (
          <AdminPanel
            key={section.id}
            title={section.title}
            className="scroll-mt-24"
          >
            <section id={section.id}>
              {section.intro ? (
                <p className="mb-5 text-sm leading-relaxed text-neutral-600">{section.intro}</p>
              ) : null}
              <dl className="divide-y divide-neutral-100">
                {section.items.map((item) => (
                  <div key={item.term} className="py-4 first:pt-0 last:pb-0">
                    <dt className="text-sm font-bold text-brand-dark">{item.term}</dt>
                    <dd className="mt-1 text-sm leading-relaxed text-neutral-700">
                      {item.definition}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          </AdminPanel>
        ))}
      </div>
    </div>
  );
}
