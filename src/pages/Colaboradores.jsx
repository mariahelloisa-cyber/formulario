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
    } catch (e) { toast(e.message || 'Erro ao salvar', 'error') }
    finally { setSaving(false) }
  }

  async function handleDelete(c) {
    if (!confirm(`Deseja mesmo remover ${c.nome}?`)) return
    try {
      await deletarColaborador(c.id)
      toast('Colaborador removido')
      load()
    } catch (e) { toast(e.message, 'error') }
  }

  function copyLink(slug) {
    const linkCompleto = `${window.location.origin}/avaliacao/${slug}`
    navigator.clipboard.writeText(linkCompleto)
    toast('Link copiado para a área de transferência!')
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="page-title">Colaboradores</h1>
          <p className="page-subtitle">Gerencie os links e veja o resumo de cada integrante</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal('new')}>
          <i className="ti ti-plus" /> Novo colaborador
        </button>
      </div>

      {loading 
        ? <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><span className="spin" /></div>
        : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {colabs.map(c => {
              const s = stats[c.id] || { media: 0, total: 0 }
              const inicial = c.nome ? c.nome.charAt(0).toUpperCase() : '?'

              return (
                <div key={c.id} className="card animate-fade-in">
                  
                  {/* Círculo do avatar centralizado mantendo o exato comportamento visual da inicial */}
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                    {c.foto_url ? (
                      <img 
                        src={c.foto_url} 
                        alt={c.nome} 
                        style={{ 
                          width: '56px', 
                          height: '56px', 
                          borderRadius: '50%', 
                          objectFit: 'cover',
                          border: '2px solid rgba(0,0,0,0.05)'
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '56px', height: '56px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, #C80064, #8C1478)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontWeight: 600, fontSize: 20
                      }}>
                        {inicial}
                      </div>
                    )}
                  </div>

                  {/* Nome e Cargo originais */}
                  <h3>{c.nome}</h3>
                  <p>{c.cargo}</p>

                  {/* Notas e Estatísticas originais */}
                  <div style={{ display: 'flex', gap: 16, background: '#F8F9FA', borderRadius: 8, padding: '8px 12px', marginBottom: 12, marginTop: 12 }}>
                    <div>
                      <div style={{ fontSize: 10, color: '#999', fontWeight: 600, textTransform: 'uppercase' }}>Média</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: '#C80064', display: 'flex', alignItems: 'center', gap: 3 }}>
                        <i className="ti ti-star-filled" style={{ fontSize: 13 }} /> {s.media || '0.0'}
                      </div>
                    </div>
                    <div style={{ width: 1, background: 'rgba(0,0,0,0.08)' }} />
                    <div>
                      <div style={{ fontSize: 10, color: '#999', fontWeight: 600, textTransform: 'uppercase' }}>Avaliações</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: '#333' }}>{s.total || 0}</div>
                    </div>
                  </div>

                  <div style={{ fontSize: 11, color: '#777', marginBottom: 10 }}>
                    <i className="ti ti-link" style={{ marginRight: 4 }} />
                    /avaliacao/<strong>{c.slug}</strong>
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

                  {/* Ações originais */}
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