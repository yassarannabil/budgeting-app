import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from './supabaseClient'

export function withAuth(Component) {
  return function ProtectedComponent(props) {
    const router = useRouter()

    useEffect(() => {
      const checkSession = async () => {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          router.push('/auth')
        }
      }
      checkSession()
    }, [router])

    return <Component {...props} />
  }
}
