import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getColaboradorBySlug, enviarFeedback } from '../lib/supabase'
import { StarPicker, LABELS } from '../components/Stars'

function initials(nome) {
  return nome.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
}

export default function Avaliacao() {
  const { slug } = useParams()
  const [colab, setColab] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const [nomeAvaliador, setNomeAvaliador] = useState('')
  const [nomePolo, setNomePolo] = useState('')
  const [nota, setNota] = useState(0)
  const [comentario, setComentario] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [erros, setErros] = useState({})

  useEffect(() => {
    getColaboradorBySlug(slug)
      .then(setColab)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [slug])

  function validate() {
    const e = {}
    if (!nomeAvaliador.trim()) e.nome = 'Informe seu nome.'
    if (!nomePolo.trim()) e.polo = 'Informe o nome do polo.'
    if (!nota) e.nota = 'Selecione uma nota de 1 a 5 estrelas.'
    return e
  }

  async function submit(e) {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) { setErros(e2); return }
    setErros({})
    setEnviando(true)
    try {
      await enviarFeedback({
        colaboradorId: colab.id,
        nota,
        comentario: comentario.trim(),
        nomeAvaliador: nomeAvaliador.trim(),
        nomePolo: nomePolo.trim(),
      })
      setEnviado(true)
    } catch (err) {
      setErros({ geral: 'Ocorreu um erro ao enviar. Tente novamente.' })
    } finally {
      setEnviando(false)
    }
  }

  // ─── Loading ────────────────────────────────────────────────
  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span className="spin spin-dark" />
    </div>
  )

  // ─── Not found ──────────────────────────────────────────────
  if (notFound) return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '2rem', textAlign: 'center',
      background: 'linear-gradient(150deg, #fce8f2 0%, #f5f6fa 60%, #e6f2fb 100%)'
    }}>
      <div>
        <img src="/logo.png" alt="La Educação" style={{ height: 70, marginBottom: 24 }} />
        <i className="ti ti-user-off" style={{ fontSize: 48, color: '#ddd', display: 'block', marginBottom: 16 }} />
        <h2 style={{ fontWeight: 700, marginBottom: 8, color: '#1a1a2e' }}>Link não encontrado</h2>
        <p style={{ color: '#888', fontSize: 14 }}>O link que você acessou não existe ou foi desativado.</p>
      </div>
    </div>
  )

  // ─── Sucesso ────────────────────────────────────────────────
  if (enviado) return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '2rem',
      background: 'linear-gradient(150deg, #fce8f2 0%, #f5f6fa 60%, #e6f2fb 100%)'
    }}>
      <div style={{ textAlign: 'center', maxWidth: 420 }}>
        <img src="/logo.png" alt="La Educação" style={{ height: 72, marginBottom: 24 }} />
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'linear-gradient(135deg, #C80064, #3C8CC8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px', fontSize: 32
        }}>✓</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10, color: '#1a1a2e' }}>
          Avaliação enviada!
        </h2>
        <p style={{ color: '#666', lineHeight: 1.65, fontSize: 14 }}>
          Obrigado, <strong>{nomeAvaliador}</strong>! Seu feedback sobre{' '}
          <strong>{colab.nome}</strong> foi registrado com sucesso.
        </p>
        <p style={{ color: '#aaa', fontSize: 13, marginTop: 10 }}>
          Sua opinião é muito importante para a La Educação.
        </p>
        <button
          className="btn btn-primary"
          style={{ marginTop: 24 }}
          onClick={() => { setNota(0); setComentario(''); setNomeAvaliador(''); setNomePolo(''); setEnviado(false) }}
        >
          <i className="ti ti-refresh" /> Avaliar novamente
        </button>
      </div>
    </div>
  )

  // ─── Formulário ─────────────────────────────────────────────
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(150deg, #fce8f2 0%, #f5f6fa 45%, #e6f2fb 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem 1rem',
    }}>
      <div style={{ width: '100%', maxWidth: 540 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <img src="/logo.png" alt="La Educação" style={{ height: 72, width: 'auto' }} />
        </div>

        <div className="card" style={{ padding: '2rem', boxShadow: '0 4px 28px rgba(140,20,120,0.10)' }}>

          {/* Colaborador */}
          <div style={{
            textAlign: 'center', marginBottom: '1.75rem',
            paddingBottom: '1.5rem', borderBottom: '1px solid rgba(0,0,0,0.07)'
          }}>
            <div style={{
              width: 68, height: 68, borderRadius: '50%',
              background: 'linear-gradient(135deg, #C80064, #8C1478, #3C8CC8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24, fontWeight: 700, color: '#fff', margin: '0 auto 12px',
              boxShadow: '0 3px 12px rgba(200,0,100,0.25)'
            }}>
              {initials(colab.nome)}
            </div>
            <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 3, color: '#1a1a2e' }}>
              {colab.nome}
            </h1>
            <div style={{ fontSize: 13, color: '#888' }}>{colab.cargo}</div>
            {colab.mensagem && (
              <div style={{
                marginTop: 12, fontSize: 13, color: '#555', lineHeight: 1.6,
                background: '#F5F6FA', borderRadius: 8, padding: '10px 14px',
                borderLeft: '3px solid #C80064'
              }}>
                {colab.mensagem}
              </div>
            )}
          </div>

          <form onSubmit={submit}>

            {/* Identificação — obrigatória */}
            <div style={{
              background: 'linear-gradient(135deg, #fce8f2, #e6f2fb)',
              borderRadius: 10, padding: '1rem 1.1rem',
              marginBottom: '1.25rem',
              border: '1px solid rgba(200,0,100,0.12)'
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#C80064', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 5 }}>
                <i className="ti ti-id-badge" style={{ fontSize: 14 }} />
                IDENTIFICAÇÃO <span style={{ fontSize: 10, fontWeight: 400, color: '#aaa', marginLeft: 4 }}>(obrigatório)</span>
              </div>

              <div className="form-grid-2" style={{ gap: '0.75rem' }}>
                <div>
                  <label className="label">Seu nome / responsável</label>
                  <input
                    value={nomeAvaliador}
                    onChange={e => setNomeAvaliador(e.target.value)}
                    placeholder="Ex: João Silva"
                    style={erros.nome ? { borderColor: '#C80064' } : {}}
                  />
                  {erros.nome && <span style={{ fontSize: 11, color: '#C80064' }}>{erros.nome}</span>}
                </div>
                <div>
                  <label className="label">Nome fantasia do polo</label>
                  <input
                    value={nomePolo}
                    onChange={e => setNomePolo(e.target.value)}
                    placeholder="Ex: Polo Centro SP"
                    style={erros.polo ? { borderColor: '#C80064' } : {}}
                  />
                  {erros.polo && <span style={{ fontSize: 11, color: '#C80064' }}>{erros.polo}</span>}
                </div>
              </div>
            </div>

            {/* Nota */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: 14, marginBottom: 14, textAlign: 'center', color: '#1a1a2e' }}>
                Como você avalia o atendimento?
              </label>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <StarPicker value={nota} onChange={n => { setNota(n); setErros(e => ({ ...e, nota: '' })) }} />
              </div>
              {nota > 0 && (
                <div style={{
                  textAlign: 'center', marginTop: 10, fontSize: 14, fontWeight: 600,
                  color: nota >= 4 ? '#1D9E75' : nota === 3 ? '#BA7517' : '#C80064'
                }}>
                  {LABELS[nota]}
                </div>
              )}
              {erros.nota && (
                <div style={{ textAlign: 'center', fontSize: 12, color: '#C80064', marginTop: 6 }}>
                  {erros.nota}
                </div>
              )}
            </div>

            {/* Comentário */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label className="label">Comentário <span style={{ color: '#bbb', fontWeight: 400 }}>(opcional)</span></label>
              <textarea
                value={comentario}
                onChange={e => setComentario(e.target.value)}
                rows={4}
                placeholder="Compartilhe sua experiência, sugestões, elogios ou críticas construtivas..."
                style={{ resize: 'vertical' }}
              />
            </div>

            {erros.geral && (
              <div style={{
                background: '#FCE8F2', color: '#A0004E', borderRadius: 8,
                padding: '10px 14px', fontSize: 13, marginBottom: '1rem',
                display: 'flex', alignItems: 'center', gap: 7,
                border: '1px solid #F5B8D8'
              }}>
                <i className="ti ti-alert-circle" />{erros.geral}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={enviando}
              style={{ height: 44, fontSize: 14 }}
            >
              {enviando
                ? <><span className="spin" /> Enviando...</>
                : <><i className="ti ti-send" /> Enviar avaliação</>
              }
            </button>

            <p style={{ textAlign: 'center', fontSize: 11, color: '#bbb', marginTop: 12, lineHeight: 1.5 }}>
              <i className="ti ti-lock" style={{ fontSize: 11, marginRight: 4 }} />
              Sua resposta vai diretamente ao gestor da La Educação
            </p>
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: 11, color: '#ccc' }}>
          © {new Date().getFullYear()} La Educação · Todos os direitos reservados
        </div>
      </div>
    </div>
  )
}
