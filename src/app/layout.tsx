import type { Metadata, Viewport } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'
import { BRAND, BRAND_LOGOS } from '@/constants/brand'
import AppShell from '@/components/AppShell'
import Providers from '@/components/Providers'
import { fetchCategoryTree } from '@/lib/catalog/fetch'
import { buildStoreNav } from '@/lib/catalog/nav'
import { MAIN_NAV } from '@/config/navigation'

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gigasystem.cl',
  ),
  title: {
    default: `${BRAND.name} · Componentes, PCs armados y periféricos`,
    template: `%s · ${BRAND.name}`,
  },
  description:
    'Compra componentes, PCs ya armados y periféricos. Arma tu PC con las piezas que prefieres o elige un equipo potente listo para usar.',
  keywords: [
    'GIGASYSTEM',
    'componentes PC',
    'PC armado',
    'armar PC Chile',
    'periféricos gamer',
    'tienda hardware',
  ],
  openGraph: {
    title: `${BRAND.name} · Tu tienda de PC en Chile`,
    description:
      'Busca, compara y compra componentes o equipos completos. Arma a medida o lleva un PC potente ya ensamblado.',
    siteName: BRAND.name,
    locale: 'es_CL',
    type: 'website',
  },
  icons: {
    icon: BRAND_LOGOS.mark,
    apple: BRAND_LOGOS.mark,
  },
}

export const viewport: Viewport = {
  themeColor: BRAND.primary,
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let storeNav = MAIN_NAV
  try {
    const tree = await fetchCategoryTree()
    if (tree.length > 0) storeNav = buildStoreNav(tree)
  } catch {
    /* API no disponible: menú estático de respaldo */
  }

  return (
    <html lang="es" className={montserrat.variable}>
      <body className={`${montserrat.className} antialiased`}>
        <Providers>
          <AppShell storeNav={storeNav}>{children}</AppShell>
        </Providers>
      </body>
    </html>
  )
}

