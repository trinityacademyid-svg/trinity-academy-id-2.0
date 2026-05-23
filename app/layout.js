import './globals.css'
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google'
import ConditionalLayout from '../components/ConditionalLayout'

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

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${playfair.variable} ${jakarta.variable}`}>
      <body className="font-[family-name:var(--font-jakarta)]">
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  )
}