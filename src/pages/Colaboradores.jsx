import { useEffect, useState } from 'react'
import { getColaboradores, criarColaborador, editarColaborador, deletarColaborador, getEstatisticas } from '../lib/supabase'
import { useToast } from '../components/Toast'
import ColaboradorModal from '../components/ColaboradorModal'

export default function Colaboradores() {
  const toast = useToast()
  const [colabs, setColabs] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [saving, setSaving] = useState(false)

  async function load() {
    setLoading(true)
    try {
      const [cs, es] = await Promise.all([getColaboradores(), getEstatisticas()])
      setColabs(cs)
      const m = {}; es.forEach(e => { m[e.id] = e }); setStats(m)
    } catch (e) { toast(e.message, 'error') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  async function handleSave(form) {
    setSaving(true)
    try {
      if (modal?.id) {
        await editarColaborador(modal.id, form)
        toast('Colaborador atualizado!')
      } else {
        await criarColaborador(form)
        toast('Colaborador cadastrado!')
      }
      setModal(null); load()
    } catch (e) { toast(e.message || 'Erro ao salvar. Verifique se o link já existe.', 'error') }
    finally { setSaving(false) }
  }

  async function handleDelete(c) {
    if (!confirm(`Remover ${c.nome}? Os feedbacks serão mantidos.`)) return
    try { await deletarColaborador(c.id); toast('Removido.'); load() }
    catch (e) { toast(e.message, 'error') }
  }

  function copyLink(slug) {
    navigator.clipboard.writeText(`https://formulario-3f9.pages.dev//avaliacao/${slug}`).catch(() => {})
    toast(`Link copiado: /avaliacao/${slug}`)
  }

  const initials = n => n.split(' ').slice(0, 2).map(x => x[0]).join('').toUpperCase()

  const notaColor = m => m >= 4.5 ? '#1D9E75' : m >= 3.5 ? '#3C8CC8' : m >= 2.5 ? '#BA7517' : '#C80064'

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14, flexShrink: 0,
            background: 'linear-gradient(135deg, #C80064, #8C1478, #3C8CC8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: '#fff',
          }}>
            <i className="ti ti-users" />
          </div>
          <div>
            <h1 style={{ fontSize: 21, fontWeight: 700, color: '#1a1a2e' }}>Colaboradores</h1>
            <p style={{ color: '#999', fontSize: 13, marginTop: 2 }}>Gerencie os colaboradores e seus links de avaliação</p>
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => setModal('new')}>
          <i className="ti ti-plus" /> Novo colaborador
        </button>
      </div>

      {loading
        ? <div className="page-loading"><span className="spin spin-dark" /> Carregando...</div>
        : colabs.length === 0
          ? <div className="empty card" style={{ padding: '3rem' }}>
            <i className="ti ti-users" style={{ fontSize: 44 }} />
            <div style={{ fontWeight: 600, marginTop: 8, color: '#666' }}>Nenhum colaborador cadastrado</div>
            <div style={{ fontSize: 13, color: '#bbb', marginTop: 4 }}>Clique em "Novo colaborador" para começar</div>
          </div>
          : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(275px, 1fr))', gap: '1rem' }}>
            {colabs.map(c => {
              const s = stats[c.id] || { media: 0, total: 0 }
              return (
                <div key={c.id} className="card" style={{
                  display: 'flex', flexDirection: 'column',
                  borderTop: '3px solid transparent',
                  borderImage: 'linear-gradient(90deg, #C80064, #3C8CC8) 1',
                }}>
                  {/* Avatar + info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
                      background: 'linear-gradient(135deg, #C80064, #8C1478, #3C8CC8)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 16, fontWeight: 700, color: '#fff',
                      boxShadow: '0 2px 10px rgba(200,0,100,0.2)'
                    }}>
                      {initials(c.nome)}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 15, color: '#1a1a2e', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.nome}</div>
                      <div style={{ fontSize: 12, color: '#888' }}>{c.cargo}</div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                    <div style={{
                      flex: 1, background: '#F5F6FA', borderRadius: 8, padding: '8px 10px', textAlign: 'center'
                    }}>
                      <div style={{ fontSize: 18, fontWeight: 700, color: s.media > 0 ? notaColor(s.media) : '#ccc' }}>
                        {s.media > 0 ? s.media.toFixed(1) : '—'}
                      </div>
                      <div style={{ fontSize: 10, color: '#aaa', textTransform: 'uppercase', fontWeight: 600 }}>Média</div>
                    </div>
                    <div style={{
                      flex: 1, background: '#F5F6FA', borderRadius: 8, padding: '8px 10px', textAlign: 'center'
                    }}>
                      <div style={{ fontSize: 18, fontWeight: 700, color: '#3C8CC8' }}>{s.total}</div>
                      <div style={{ fontSize: 10, color: '#aaa', textTransform: 'uppercase', fontWeight: 600 }}>Feedbacks</div>
                    </div>
                  </div>

                  {/* Link */}
                  <div style={{
                    background: 'linear-gradient(90deg, #FCE8F2, #E6F2FB)',
                    borderRadius: 7, padding: '6px 11px',
                    fontSize: 11, color: '#666', wordBreak: 'break-all',
                    marginBottom: 10, border: '1px solid rgba(200,0,100,0.1)'
                  }}>
                    🔗 /avaliacao/<strong style={{ color: '#C80064' }}>{c.slug}</strong>
                  </div>

                  {c.mensagem && (
                    <div style={{
                      fontSize: 11, color: '#999', fontStyle: 'italic',
                      marginBottom: 10, borderLeft: '3px solid #C80064', paddingLeft: 8,
                      lineHeight: 1.5
                    }}>
                      "{c.mensagem}"
                    </div>
                  )}

                  {/* Ações */}
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 'auto' }}>
                    <button className="btn btn-sm btn-outline-pink" onClick={() => copyLink(c.slug)}>
                      <i className="ti ti-copy" style={{ fontSize: 12 }} /> Copiar link
                    </button>
                    <button className="btn btn-sm" onClick={() => setModal(c)}>
                      <i className="ti ti-edit" style={{ fontSize: 12 }} /> Editar
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(c)}>
                      <i className="ti ti-trash" style={{ fontSize: 12 }} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
      }

      {modal && (
        <ColaboradorModal
          initial={modal === 'new' ? null : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
          loading={saving}
        />
      )}
    </div>
  )
}
