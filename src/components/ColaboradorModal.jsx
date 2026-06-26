import { useState, useEffect } from 'react'

function slugify(s) {
  return s.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
}

export default function ColaboradorModal({ initial, onSave, onClose, loading }) {
  const [form, setForm] = useState({ nome: '', cargo: '', slug: '', mensagem: '' })
  const [slugTouched, setSlugTouched] = useState(false)

  useEffect(() => {
    if (initial) { setForm(initial); setSlugTouched(true) }
  }, [initial])

  function set(k, v) {
    setForm(f => {
      const next = { ...f, [k]: v }
      if (k === 'nome' && !slugTouched) next.slug = slugify(v.split(' ')[0])
      return next
    })
  }

  function submit(e) {
    e.preventDefault()
    if (!form.nome.trim() || !form.cargo.trim() || !form.slug.trim()) return
    onSave(form)
  }

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-title">{initial ? 'Editar colaborador' : 'Novo colaborador'}</div>
        <form onSubmit={submit}>
          <div className="form-group">
            <label className="label">Nome completo *</label>
            <input value={form.nome} onChange={e => set('nome', e.target.value)} placeholder="Ex: Aline Santos" required />
          </div>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="label">Cargo / Função *</label>
              <input value={form.cargo} onChange={e => set('cargo', e.target.value)} placeholder="Ex: Gestora de Contas" required />
            </div>
            <div className="form-group">
              <label className="label">Identificador do link *</label>
              <input value={form.slug} onChange={e => { setSlugTouched(true); set('slug', slugify(e.target.value)) }} placeholder="Ex: aline" required />
              <div style={{ fontSize: 11, color: '#888', marginTop: 4 }}>
                /avaliacao/<strong>{form.slug || '...'}</strong>
              </div>
            </div>
          </div>
          <div className="form-group">
            <label className="label">Mensagem personalizada (opcional)</label>
            <textarea value={form.mensagem} onChange={e => set('mensagem', e.target.value)}
              rows={2} placeholder="Mensagem exibida no formulário para o parceiro..." />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <span className="spin" /> : <i className="ti ti-check" />}
              {initial ? 'Salvar' : 'Cadastrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
