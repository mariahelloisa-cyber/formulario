import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  async function submit(e) {
  e.preventDefault()
  setErro('')
  setLoading(true)

  try {
  const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
  if (error) throw error
  navigate('/admin')
} catch (err) {
  setErro('E-mail ou senha incorretos. Tente novamente.')
} finally {
  setLoading(false)
}
  }
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(150deg, #fce8f2 0%, #f5f6fa 40%, #e6f2fb 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem',
    }}>
      <div style={{ width: '100%', maxWidth: 400 }}>

        {/* Logo centralizada */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img src="/logo.png" alt="La Educação" style={{ height: 100, width: 'auto', marginBottom: 8 }} />
          <div style={{ fontSize: 12, color: '#999', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>
            Sistema de Avaliação
          </div>
        </div>

        <div className="card" style={{ padding: '2rem', boxShadow: '0 4px 24px rgba(140,20,120,0.08)' }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, color: '#1a1a2e' }}>
            Acesso ao painel
          </h1>
          <p style={{ fontSize: 13, color: '#888', marginBottom: '1.75rem' }}>
            Entre com suas credenciais de administrador
          </p>

          <form onSubmit={submit}>
            <div className="form-group">
              <label className="label">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="label">Senha</label>
              <input
                type="password"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {erro && (
              <div style={{
                background: '#FCE8F2', color: '#A0004E',
                borderRadius: 8, padding: '10px 14px',
                fontSize: 13, marginBottom: '1rem',
                display: 'flex', alignItems: 'center', gap: 7,
                border: '1px solid #F5B8D8'
              }}>
                <i className="ti ti-alert-circle" style={{ flexShrink: 0 }} />
                {erro}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={loading}
              style={{ height: 42, fontSize: 14, marginTop: 4 }}
            >
              {loading
                ? <><span className="spin" /> Entrando...</>
                : <><i className="ti ti-login" /> Entrar</>
              }
            </button>
          </form>

          <div style={{
            marginTop: '1.5rem', padding: '12px 14px',
            background: '#F5F6FA', borderRadius: 8,
            fontSize: 12, color: '#888', lineHeight: 1.6
          }}>
            <i className="ti ti-info-circle" style={{ marginRight: 5, color: '#3C8CC8' }} />
            O acesso é restrito a administradores da La Educação. Para criar sua conta, fale com o suporte.
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: 11, color: '#ccc' }}>
          © {new Date().getFullYear()} La Educação · Todos os direitos reservados
        </div>
      </div>
    </div>
  )
}
