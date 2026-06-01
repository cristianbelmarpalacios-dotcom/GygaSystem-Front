import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import { BRAND } from "@/constants/brand";
import type { NavSection } from "@/config/navigation";

const HELP_LINKS = [
  { label: "Centro de ayuda", href: "/admin/ayuda" },
  { label: "Seguimiento de compra", href: "/carrito" },
  { label: "Ver catálogo", href: "/#catalogo" },
  { label: "Armador de PC 3D", href: "/arma-tu-pc-3d" },
] as const;

const COMPANY_LINKS = [
  { label: "Quiénes somos", href: "/" },
  { label: "Términos y condiciones", href: "/" },
  { label: "Políticas de privacidad", href: "/" },
  { label: "Contacto", href: "/" },
] as const;

const PAYMENT_LABELS = [
  "Webpay",
  "Mercado Pago",
  "Transferencia",
  "Tarjetas débito/crédito",
] as const;

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className="h-4 w-1 shrink-0 rounded-full bg-brand-light"
        aria-hidden
      />
      <h3 className="text-sm font-bold tracking-wide text-white">{children}</h3>
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-sm text-white/85 transition-colors hover:text-white"
    >
      {children}
    </Link>
  );
}

export default function SiteFooter({ navSections }: { navSections: NavSection[] }) {
  const shopSections = navSections.slice(0, 3);

  return (
    <footer className="mt-auto bg-gradient-to-b from-brand to-brand-dark text-white">
      <div className="mx-auto max-w-page px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <FooterHeading>Ayuda</FooterHeading>
            <ul className="mt-4 space-y-2.5">
              {HELP_LINKS.map((item) => (
                <li key={item.href}>
                  <FooterLink href={item.href}>{item.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <FooterHeading>Nosotros</FooterHeading>
            <ul className="mt-4 space-y-2.5">
              {COMPANY_LINKS.map((item) => (
                <li key={item.label}>
                  <FooterLink href={item.href}>{item.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <FooterHeading>Tienda</FooterHeading>
            <div className="mt-4 grid gap-6 sm:grid-cols-2">
              {shopSections.map((section) => (
                <div key={section.id}>
                  <p className="text-xs font-semibold uppercase tracking-wider text-white/70">
                    {section.label}
                  </p>
                  <ul className="mt-2 space-y-2">
                    {section.items.slice(0, 5).map((item) => (
                      <li key={item.href}>
                        <FooterLink href={item.href}>{item.label}</FooterLink>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="my-10 border-t border-white/15" />

        <div>
          <FooterHeading>Medios de pago</FooterHeading>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {PAYMENT_LABELS.map((label) => (
              <span
                key={label}
                className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-white/90 backdrop-blur-sm"
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="my-10 border-t border-white/15" />

        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <BrandLogo
              variant="vertical"
              className="rounded-xl bg-white/95 p-2 ring-1 ring-white/20"
            />
            <div>
              <p className="text-sm font-bold text-white">{BRAND.name}</p>
              <p className="mt-1 max-w-sm text-xs leading-relaxed text-white/75">
                Componentes, PCs armados y periféricos en Chile. Compra segura con
                información protegida en cada pedido.
              </p>
            </div>
          </div>

          <div className="space-y-3 text-sm text-white/85 lg:text-right">
            <p className="font-medium text-white">Santiago, Chile</p>
            <p className="text-white/75">Lun–Vie 10:00 – 19:00 · Sáb 10:00 – 14:00</p>
            <p className="text-xs text-white/60">
              © {new Date().getFullYear()} {BRAND.name}. Todos los derechos reservados.
            </p>
            <p className="text-xs text-white/60">
              <Link href="/admin/login" className="font-semibold text-white hover:text-brand-light">
                Admin GIGASYSTEM
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
