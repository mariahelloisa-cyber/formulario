import { useState, useEffect } from 'react'
import { uploadFoto } from '../lib/supabase' // Importando a nova função de upload

function slugify(s) {
  return s.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
}

export default function ColaboradorModal({ initial, onSave, onClose, loading }) {
  // ATUALIZADO: Inclui foto_url no estado do formulário
  const [form, setForm] = useState({ nome: '', cargo: '', slug: '', mensagem: '', foto_url: '' })
  const [slugTouched, setSlugTouched] = useState(false)
  
  // Novos estados para gerenciar o upload local do PC
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (initial) { 
      setForm({
        nome: initial.nome || '',
        cargo: initial.cargo || '',
        slug: initial.slug || '',
        mensagem: initial.mensagem || '',
        foto_url: initial.foto_url || ''
      })
      setPreview(initial.foto_url || '')
      setSlugTouched(true) 
    } else {
      setForm({ nome: '', cargo: '', slug: '', mensagem: '', foto_url: '' })
      setPreview('')
      setFile(null)
      setSlugTouched(false)
    }
  }, [initial])

  function set(k, v) {
    setForm(f => {
      const next = { ...f, [k]: v }
      if (k === 'nome' && !slugTouched) next.slug = slugify(v.split(' ')[0])
      return next
    })
  }

  // Função para capturar o arquivo do computador e criar um preview em tempo real
  function handleFileChange(e) {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      setPreview(URL.createObjectURL(selectedFile))
    }
  }

  async function submit(e) {
    e.preventDefault()
    if (!form.nome.trim() || !form.cargo.trim() || !form.slug.trim()) return
    
    setUploading(true)
    try {
      let finalFotoUrl = form.foto_url

      // Se o usuário selecionou uma nova foto do PC, faz o upload primeiro
      if (file) {
        finalFotoUrl = await uploadFoto(file)
      }

      // Envia os dados completos com a URL final gerada pelo Storage do Supabase
      onSave({ ...form, foto_url: finalFotoUrl })
    } catch (err) {
      alert('Erro ao fazer upload da foto: ' + err.message)
    } finally {
      setUploading(false)
    }
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

          {/* NOVO CAMPO: Seleção de foto do PC com Pré-visualização */}
          <div className="form-group">
            <label className="label">Foto do Colaborador (Direto do PC)</label>
            
            {preview && (
              <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
                <img 
                  src={preview} 
                  alt="Preview do colaborador" 
                  style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', border: '2px solid #534AB7' }} 
                />
                <span style={{ fontSize: 12, color: '#1D9E75', fontWeight: 500 }}>✔ Foto selecionada</span>
              </div>
            )}

            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              style={{ 
                width: '100%', 
                padding: '6px', 
                background: '#fafafa', 
                border: '1px dashed #ccc', 
                borderRadius: '4px',
                cursor: 'pointer' 
              }} 
            />
          </div>

          <div className="form-group">
            <label className="label">Mensagem personalizada (opcional)</label>
            <textarea value={form.mensagem} onChange={e => set('mensagem', e.target.value)}
              rows={2} placeholder="Mensagem exibida no formulário para o parceiro..." />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={loading || uploading}>
              {(loading || uploading) ? <span className="spin" /> : <i className="ti ti-check" />}
              {uploading ? 'Enviando foto...' : initial ? 'Salvar' : 'Cadastrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}