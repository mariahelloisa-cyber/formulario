import { Link, useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const NAV = [
  { to: '/admin', icon: 'ti-layout-dashboard', label: 'Painel' },
  { to: '/admin/colaboradores', icon: 'ti-users', label: 'Colaboradores' },
  { to: '/admin/feedbacks', icon: 'ti-messages', label: 'Feedbacks' },
]

export default function AdminLayout({ children }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  async function logout() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav style={{
        background: '#fff',
        borderBottom: '1px solid rgba(0,0,0,0.09)',
        display: 'flex', alignItems: 'center',
        padding: '0 1.5rem', height: 56,
        gap: '1rem', position: 'sticky', top: 0, zIndex: 100,
        boxShadow: '0 1px 8px rgba(140,20,120,0.06)'
      }}>
        {/* Logo */}
        <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <img src="/logo.png" alt="La Educação" style={{ height: 36, width: 'auto' }} />
        </Link>

        <div style={{ width: 1, height: 28, background: 'rgba(0,0,0,0.1)', margin: '0 4px' }} />

        {/* Nav links */}
        <div style={{ display: 'flex', gap: 2 }}>
          {NAV.map(n => {
            const active = pathname === n.to || (n.to !== '/admin' && pathname.startsWith(n.to))
            return (
              <Link key={n.to} to={n.to} style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '0 13px', height: 56,
                fontSize: 13, fontWeight: active ? 600 : 400,
                color: active ? '#C80064' : '#666',
                borderBottom: active ? '2px solid #C80064' : '2px solid transparent',
                transition: 'all 0.15s',
              }}>
                <i className={`ti ${n.icon}`} style={{ fontSize: 15 }} />
                {n.label}
              </Link>
            )
          })}
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 12, color: '#999' }}>
            <i className="ti ti-shield-check" style={{ fontSize: 13, marginRight: 4, color: '#3C8CC8' }} />
            Admin
          </span>
          <button className="btn btn-sm btn-outline-pink" onClick={logout}>
            <i className="ti ti-logout" style={{ fontSize: 13 }} /> Sair
          </button>
        </div>
      </nav>

      <main style={{ flex: 1, padding: '1.75rem 1.5rem', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        {children}
      </main>

      <footer style={{ textAlign: 'center', padding: '1rem', fontSize: 11, color: '#bbb', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        © {new Date().getFullYear()} La Educação · Sistema de Avaliação
      </footer>
    </div>
  )
}
