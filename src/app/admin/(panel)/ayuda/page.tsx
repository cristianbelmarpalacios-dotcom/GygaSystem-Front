"use client";

import Link from "next/link";
import { ADMIN_HELP_SECTIONS } from "@/constants/admin-help";

export default function AdminAyudaPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Ayuda del backoffice</h1>
        <p className="mt-1 max-w-2xl text-sm text-neutral-600 leading-relaxed">
          Glosario de campos y conceptos. Si algo no está claro, empieza por{" "}
          <a href="#general" className="font-semibold text-brand hover:text-brand-dark">
            Conceptos generales
          </a>{" "}
          y{" "}
          <a href="#tipos" className="font-semibold text-brand hover:text-brand-dark">
            Tipos de producto
          </a>
          .
        </p>
      </div>

      <nav
        aria-label="Índice de ayuda"
        className="rounded-2xl border border-brand/20 bg-brand/5 p-4 md:p-5"
      >
        <p className="text-xs font-bold uppercase tracking-wider text-brand-dark">
          Ir a sección
        </p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {ADMIN_HELP_SECTIONS.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="inline-block rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-neutral-800 shadow-sm ring-1 ring-black/5 hover:ring-brand/30"
              >
                {s.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
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
      </div>

      <div className="space-y-10">
        {ADMIN_HELP_SECTIONS.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="scroll-mt-24 rounded-2xl border border-black/5 bg-white p-6 shadow-sm md:p-8"
          >
            <h2 className="text-lg font-bold text-neutral-900">{section.title}</h2>
            {section.intro ? (
              <p className="mt-2 text-sm text-neutral-600 leading-relaxed">{section.intro}</p>
            ) : null}
            <dl className="mt-5 divide-y divide-black/5">
              {section.items.map((item) => (
                <div key={item.term} className="py-4 first:pt-0 last:pb-0">
                  <dt className="text-sm font-bold text-brand-dark">{item.term}</dt>
                  <dd className="mt-1 text-sm text-neutral-700 leading-relaxed">
                    {item.definition}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
    </div>
  );
}
