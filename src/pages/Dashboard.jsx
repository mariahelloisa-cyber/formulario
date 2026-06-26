import { useEffect, useState } from 'react'
import { getEstatisticas, getFeedbacks } from '../lib/supabase'
import { Stars } from '../components/Stars'

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

function MetricCard({ label, value, color, icon, bg }) {
  return (
    <div style={{
      background: bg || '#fff',
      border: '1px solid rgba(0,0,0,0.07)',
      borderRadius: 14, padding: '1.1rem 1.25rem',
      display: 'flex', alignItems: 'center', gap: 14,
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 12, flexShrink: 0,
        background: 'linear-gradient(135deg, #C80064, #8C1478, #3C8CC8)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 20, color: '#fff',
      }}>
        <i className={`ti ${icon}`} />
      </div>
      <div>
        <div style={{ fontSize: 11, color: '#999', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>{label}</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: color || '#1a1a2e', lineHeight: 1 }}>{value}</div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [stats, setStats] = useState([])
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getEstatisticas(), getFeedbacks()])
      .then(([s, f]) => { setStats(s); setFeedbacks(f) })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="page-loading"><span className="spin spin-dark" /> Carregando dados...</div>
  )

  const totalFbs = feedbacks.length
  const mediaGeral = totalFbs ? (feedbacks.reduce((a, f) => a + f.nota, 0) / totalFbs).toFixed(1) : '—'
  const pct5 = totalFbs ? Math.round(feedbacks.filter(f => f.nota === 5).length / totalFbs * 100) : 0
  const recentes = feedbacks.slice(0, 6)
  const rankIcons = ['🥇', '🥈', '🥉']

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 14,
          background: 'linear-gradient(135deg, #C80064, #8C1478, #3C8CC8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22, color: '#fff',
        }}>
          <i className="ti ti-layout-dashboard" />
        </div>
        <div>
          <h1 style={{ fontSize: 21, fontWeight: 700, color: '#1a1a2e' }}>Painel Geral</h1>
          <p style={{ color: '#999', fontSize: 13, marginTop: 2 }}>Visão consolidada do desempenho da equipe</p>
        </div>
      </div>

      {/* Métricas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: '1.5rem' }}>
        <MetricCard label="Total de avaliações" value={totalFbs} icon="ti-star" />
        <MetricCard label="Média geral" value={totalFbs ? `${mediaGeral} ★` : '—'} icon="ti-chart-bar" color="#C80064" />
        <MetricCard label="Colaboradores" value={stats.length} icon="ti-users" color="#3C8CC8" />
        <MetricCard label="Nota 5 estrelas" value={`${pct5}%`} icon="ti-trophy" color="#1D9E75" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>

        {/* Ranking */}
        <div className="card">
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: '1rem', color: '#1a1a2e', display: 'flex', alignItems: 'center', gap: 7 }}>
            <i className="ti ti-trophy" style={{ color: '#E8A020' }} /> Ranking de colaboradores
          </div>
          {stats.length === 0
            ? <div className="empty"><i className="ti ti-trophy" />Nenhum dado ainda</div>
            : stats.map((c, i) => (
              <div key={c.id} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 0',
                borderBottom: i < stats.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none'
              }}>
                <span style={{ width: 24, textAlign: 'center', fontSize: 16 }}>{rankIcons[i] || `${i + 1}`}</span>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg, #C80064, #3C8CC8)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700, color: '#fff',
                }}>
                  {c.nome.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.nome}</div>
                  <div style={{ fontSize: 11, color: '#aaa' }}>{c.cargo}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 13, color: '#E8A020', fontWeight: 700 }}>{c.media > 0 ? `${c.media} ★` : '—'}</div>
                  <div style={{ fontSize: 11, color: '#bbb' }}>{c.total} aval.</div>
                </div>
              </div>
            ))
          }
        </div>

        {/* Gráfico barras */}
        <div className="card">
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: '1rem', color: '#1a1a2e', display: 'flex', alignItems: 'center', gap: 7 }}>
            <i className="ti ti-chart-bar" style={{ color: '#3C8CC8' }} /> Média por colaborador
          </div>
          {stats.length === 0
            ? <div className="empty"><i className="ti ti-chart-bar" />Sem dados ainda</div>
            : <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {stats.map((c, i) => (
                <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ fontSize: 12, color: '#666', width: 76, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {c.nome.split(' ')[0]}
                  </div>
                  <div style={{ flex: 1, background: '#F5F6FA', borderRadius: 6, height: 24, overflow: 'hidden' }}>
                    <div style={{
                      width: `${c.media > 0 ? Math.round((c.media / 5) * 100) : 0}%`,
                      height: '100%',
                      background: i === 0
                        ? 'linear-gradient(90deg, #C80064, #8C1478)'
                        : i === 1
                          ? 'linear-gradient(90deg, #8C1478, #3C8CC8)'
                          : 'linear-gradient(90deg, #3C8CC8, #5BAEE8)',
                      borderRadius: 6,
                      display: 'flex', alignItems: 'center', paddingLeft: 8,
                      transition: 'width 0.5s ease',
                    }}>
                      {c.media > 0 && <span style={{ fontSize: 11, color: '#fff', fontWeight: 600 }}>{c.media}</span>}
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: '#aaa', width: 36, textAlign: 'right' }}>{c.total} av.</div>
                </div>
              ))}
            </div>
          }
        </div>
      </div>

      {/* Distribuição de notas */}
      {stats.length > 0 && (
        <div className="card" style={{ marginBottom: '1rem' }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: '1rem', color: '#1a1a2e', display: 'flex', alignItems: 'center', gap: 7 }}>
            <i className="ti ti-star" style={{ color: '#E8A020' }} /> Distribuição de notas por colaborador
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', paddingBottom: 10, fontWeight: 600, color: '#888', fontSize: 11, textTransform: 'uppercase' }}>Colaborador</th>
                  {[5,4,3,2,1].map(n => (
                    <th key={n} style={{ textAlign: 'center', paddingBottom: 10, fontWeight: 500, color: '#aaa', fontSize: 13 }}>{'★'.repeat(n)}</th>
                  ))}
                  <th style={{ textAlign: 'center', fontWeight: 600, color: '#888', fontSize: 11, textTransform: 'uppercase' }}>Total</th>
                  <th style={{ textAlign: 'center', fontWeight: 600, color: '#888', fontSize: 11, textTransform: 'uppercase' }}>Média</th>
                </tr>
              </thead>
              <tbody>
                {stats.map((c, i) => (
                  <tr key={c.id} style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                    <td style={{ padding: '9px 0', fontWeight: 600, color: '#1a1a2e' }}>{c.nome}</td>
                    {c.dist.map(d => (
                      <td key={d.nota} style={{ textAlign: 'center', color: d.count > 0 ? '#1a1a2e' : '#e0e0e0', fontWeight: d.count > 0 ? 600 : 400 }}>
                        {d.count}
                      </td>
                    ))}
                    <td style={{ textAlign: 'center', fontWeight: 700 }}>{c.total}</td>
                    <td style={{ textAlign: 'center', fontWeight: 700, color: '#C80064' }}>{c.media > 0 ? c.media : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Últimos feedbacks */}
      <div className="card">
        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: '1rem', color: '#1a1a2e', display: 'flex', alignItems: 'center', gap: 7 }}>
          <i className="ti ti-messages" style={{ color: '#C80064' }} /> Últimos feedbacks recebidos
        </div>
        {recentes.length === 0
          ? <div className="empty"><i className="ti ti-message" />Nenhum feedback ainda</div>
          : <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recentes.map(f => (
              <div key={f.id} style={{ border: '1px solid rgba(0,0,0,0.07)', borderRadius: 10, padding: '12px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6, gap: 12 }}>
                  <div>
                    <Stars value={f.nota} size={15} />
                    <div style={{ fontSize: 12, marginTop: 4 }}>
                      <span style={{ fontWeight: 600, color: '#C80064' }}>{f.colaboradores?.nome}</span>
                      <span style={{ color: '#ccc', margin: '0 5px' }}>·</span>
                      <span style={{ color: '#888' }}>{f.colaboradores?.cargo}</span>
                    </div>
                    {(f.nome_avaliador || f.nome_polo) && (
                      <div style={{ fontSize: 11, color: '#aaa', marginTop: 3 }}>
                        <i className="ti ti-user" style={{ fontSize: 11, marginRight: 3 }} />
                        {f.nome_avaliador}
                        {f.nome_polo && <span style={{ marginLeft: 6 }}>· <i className="ti ti-building" style={{ fontSize: 11, marginRight: 3 }} />{f.nome_polo}</span>}
                      </div>
                    )}
                  </div>
                  <span style={{ fontSize: 11, color: '#ccc', whiteSpace: 'nowrap', flexShrink: 0 }}>{fmtDate(f.criado_em)}</span>
                </div>
                {f.comentario
                  ? <div style={{ fontSize: 13, color: '#444', lineHeight: 1.55, background: '#F5F6FA', borderRadius: 7, padding: '8px 11px', borderLeft: '3px solid #C80064' }}>
                    "{f.comentario}"
                  </div>
                  : <div style={{ fontSize: 12, color: '#ccc', fontStyle: 'italic' }}>Sem comentário adicional</div>
                }
              </div>
            ))}
          </div>
        }
      </div>
    </div>
  )
}
