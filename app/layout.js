import './globals.css'
import ConditionalLayout from '../components/ConditionalLayout'

export const metadata = {
  title: 'Trinity Academy – Les Privat & Online di Ambon',
  description: 'Platform pendidikan dan bimbingan belajar terpercaya di Ambon, Maluku.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  )
}