import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function PrivateRoute({ children }) {
  const [state, setState] = useState('loading') // 'loading' | 'auth' | 'unauth'

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setState(data.session ? 'auth' : 'unauth')
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setState(session ? 'auth' : 'unauth')
    })
    return () => subscription.unsubscribe()
  }, [])

  if (state === 'loading') return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, color: '#aaa', fontSize: 13 }}>
      <span className="spin spin-dark" /> Verificando acesso...
    </div>
  )
  if (state === 'unauth') return <Navigate to="/login" replace />
  return children
}