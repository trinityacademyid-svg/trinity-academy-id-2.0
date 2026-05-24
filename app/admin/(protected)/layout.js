import AdminShell from '@/components/AdminShell'
import { requireAdmin } from '@/lib/admin-auth'

export default async function ProtectedAdminLayout({ children }) {
  await requireAdmin()

  return <AdminShell>{children}</AdminShell>
}
