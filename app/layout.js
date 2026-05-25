import './globals.css'
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google'
import { headers } from 'next/headers'
import ConditionalLayout from '../components/ConditionalLayout'
import {
  SITE_FALLBACKS,
  buildWhatsAppUrl,
  getSiteContent,
  getSiteValue,
} from '@/lib/site-content'

const playfair = Playfair_Display({
  weight: ['700', '900'],
  style: ['italic', 'normal'],
  subsets: ['latin'],
  variable: '--font-playfair',
})

const jakarta = Plus_Jakarta_Sans({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-jakarta',
})

export const metadata = {
  title: 'Trinity Academy – Les Privat & Online di Ambon',
  description: 'Platform pendidikan dan bimbingan belajar terpercaya di Ambon, Maluku.',
}

export default async function RootLayout({ children }) {
  const headerStore = await headers()
  const pathname = headerStore.get('x-pathname') ?? ''
  const isAdmin = pathname.startsWith('/admin')
  const content = isAdmin ? {} : await getSiteContent()
  const contact = {
    waUrl: buildWhatsAppUrl(
      getSiteValue(content, 'wa_number'),
      'Hallo Trinity Academy, saya ingin konsultasi.',
    ),
    registerUrl: buildWhatsAppUrl(
      getSiteValue(content, 'wa_number'),
      'Hallo Trinity Academy, saya ingin mendaftar.',
    ),
    email: getSiteValue(content, 'email', SITE_FALLBACKS.email),
    address: getSiteValue(content, 'address', SITE_FALLBACKS.address),
    officeHours: getSiteValue(content, 'office_hours', SITE_FALLBACKS.office_hours),
  }

  return (
    <html lang="id" className={`${playfair.variable} ${jakarta.variable}`}>
      <body className="font-[family-name:var(--font-jakarta)]">
        <ConditionalLayout contact={contact}>{children}</ConditionalLayout>
      </body>
    </html>
  )
}
