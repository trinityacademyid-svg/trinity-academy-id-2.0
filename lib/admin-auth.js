import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect('/admin')
  }

  const { data: isAdmin, error } = await supabase.rpc('is_admin')

  if (error) {
    console.error('Failed to verify admin user:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    })
    redirect('/admin')
  }

  if (!isAdmin) {
    redirect('/admin')
  }

  return {
    user,
    adminUser: {
      user_id: user.id,
      active: true,
    },
  }
}
