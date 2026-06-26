import { useEffect, useState } from 'react'
import { getFeedbacks, getColaboradores } from '../lib/supabase'
import { Stars } from '../components/Stars'
import { useToast } from '../components/Toast'

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const NOTA_COLORS = { 5: '#1D9E75', 4: '#3C8CC8', 3: '#BA7517', 2: '#C86020', 1: '#C80064' }
const NOTA_BG    = { 5: '#E1F5EE', 4: '#E6F2FB', 3: '#FEF3E2', 2: '#FEF0E6', 1: '#FCE8F2' }

export default function Feedbacks() {
  const toast = useToast()
  const [feedbacks, setFeedbacks] = useState([])
  const [colabs, setColabs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterColab, setFilterColab] = useState('')
  const [filterNota, setFilterNota] = useState('')

  useEffect(() => {
    Promise.all([getFeedbacks(), getColaboradores()])
      .then(([f, c]) => { setFeedbacks(f); setColabs(c) })
      .catch(e => toast(e.message, 'error'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = feedbacks.filter(f => {
    if (filterColab && f.colaborador_id !== filterColab) return false
    if (filterNota && f.nota !== parseInt(filterNota)) return false
    return true
  })

  const totalAval = filtered.length
  const mediaFiltrada = totalAval
    ? (filtered.reduce((a, f) => a + f.nota, 0) / totalAval).toFixed(1)
    : '—'

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 14, flexShrink: 0,
          background: 'linear-gradient(135deg, #C80064, #8C1478, #3C8CC8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22, color: '#fff',
        }}>
          <i className="ti ti-messages" />
        </div>
        <div>
          <h1 style={{ fontSize: 21, fontWeight: 700, color: '#1a1a2e' }}>Feedbacks</h1>
          <p style={{ color: '#999', fontSize: 13, marginTop: 2 }}>Todos os feedbacks recebidos pela equipe</p>
        </div>
      </div>

      {/* Filtros */}
      <div style={{
        background: '#fff', border: '1px solid rgba(0,0,0,0.07)',
        borderRadius: 12, padding: '1rem 1.25rem', marginBottom: '1.25rem',
        display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center'
      }}>
        <i className="ti ti-filter" style={{ color: '#aaa', fontSize: 16 }} />
        <select style={{ width: 'auto', minWidth: 200 }} value={filterColab} onChange={e => setFilterColab(e.target.value)}>
          <option value="">Todos os colaboradores</option>
          {colabs.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
        </select>
        <select style={{ width: 'auto', minWidth: 170 }} value={filterNota} onChange={e => setFilterNota(e.target.value)}>
          <option value="">Todas as notas</option>
          {[5,4,3,2,1].map(n => <option key={n} value={n}>{'★'.repeat(n)} ({n} estrela{n > 1 ? 's' : ''})</option>)}
        </select>
        {(filterColab || filterNota) && (
          <button className="btn btn-sm" onClick={() => { setFilterColab(''); setFilterNota('') }}>
            <i className="ti ti-x" /> Limpar
          </button>
        )}
        <div style={{ marginLeft: 'auto', fontSize: 13, color: '#666', display: 'flex', gap: 12, alignItems: 'center' }}>
          <span><strong style={{ color: '#1a1a2e' }}>{totalAval}</strong> resultado{totalAval !== 1 ? 's' : ''}</span>
          {totalAval > 0 && (
            <span style={{ color: '#C80064', fontWeight: 700 }}>média {mediaFiltrada} ★</span>
          )}
        </div>
      </div>

      {/* Lista */}
      {loading
        ? <div className="page-loading"><span className="spin spin-dark" /> Carregando...</div>
        : filtered.length === 0
          ? <div className="empty card">
            <i className="ti ti-message-off" />
            Nenhum feedback encontrado
          </div>
          : <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.map(f => (
              <div key={f.id} style={{
                background: '#fff', border: '1px solid rgba(0,0,0,0.07)',
                borderRadius: 12, padding: '14px 16px',
                borderLeft: `4px solid ${NOTA_COLORS[f.nota] || '#ccc'}`
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8, gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <span style={{
                      background: NOTA_BG[f.nota], color: NOTA_COLORS[f.nota],
                      borderRadius: 8, padding: '3px 10px', fontSize: 13, fontWeight: 700,
                    }}>
                      {'★'.repeat(f.nota)}{'☆'.repeat(5 - f.nota)} {f.nota}/5
                    </span>
                    <span style={{ fontSize: 13 }}>
                      <span style={{ fontWeight: 600, color: '#C80064' }}>{f.colaboradores?.nome}</span>
                      <span style={{ color: '#ccc', margin: '0 5px' }}>·</span>
                      <span style={{ color: '#888', fontSize: 12 }}>{f.colaboradores?.cargo}</span>
                    </span>
                  </div>
                  <span style={{ fontSize: 11, color: '#ccc', whiteSpace: 'nowrap', flexShrink: 0 }}>{fmtDate(f.criado_em)}</span>
                </div>

                {/* Avaliador e polo */}
                {(f.nome_avaliador || f.nome_polo) && (
                  <div style={{
                    display: 'flex', gap: 16, marginBottom: 8, flexWrap: 'wrap',
                    fontSize: 12, color: '#666',
                  }}>
                    {f.nome_avaliador && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <i className="ti ti-user" style={{ fontSize: 12, color: '#3C8CC8' }} />
                        <strong>{f.nome_avaliador}</strong>
                      </span>
                    )}
                    {f.nome_polo && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <i className="ti ti-building" style={{ fontSize: 12, color: '#8C1478' }} />
                        <strong>{f.nome_polo}</strong>
                      </span>
                    )}
                  </div>
                )}

                {f.comentario
                  ? <div style={{
                    fontSize: 13, color: '#333', lineHeight: 1.6,
                    background: '#F5F6FA', borderRadius: 8, padding: '10px 13px',
                  }}>
                    "{f.comentario}"
                  </div>
                  : <div style={{ fontSize: 12, color: '#ccc', fontStyle: 'italic' }}>Sem comentário adicional</div>
                }
              </div>
            ))}
          </div>
      }
    </div>
  )
}
