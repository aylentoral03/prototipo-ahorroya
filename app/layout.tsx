import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { APP_NAME } from '@/lib/ahorria-config'
import './globals.css'

export const metadata: Metadata = {
  title: `${APP_NAME} — Ahorrá sin complicarte`,
  description: 'Organizá tus gastos, armá metas de ahorro y aprendé finanzas a tu ritmo. Prototipo argentino con datos ficticios.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f8f8f3',
  width: 'device-width',
  initialScale: 1,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es-AR" data-scroll-behavior="smooth">
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
