import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://SEU_PROJETO.supabase.co'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'SUA_ANON_KEY'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// ─── Colaboradores ───────────────────────────────────────────
export async function getColaboradores() {
  const { data, error } = await supabase
    .from('colaboradores')
    .select('*')
    .eq('ativo', true)
    .order('nome')
  if (error) throw error
  return data
}

export async function getColaboradorBySlug(slug) {
  const { data, error } = await supabase
    .from('colaboradores')
    .select('*')
    .eq('slug', slug)
    .eq('ativo', true)
    .single()
  if (error) throw error
  return data
}

// ATUALIZADO: Agora inclui foto_url no insert
export async function criarColaborador({ nome, cargo, slug, mensagem, foto_url }) {
  const { data, error } = await supabase
    .from('colaboradores')
    .insert({ nome, cargo, slug, mensagem, foto_url })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function editarColaborador(id, campos) {
  const { data, error } = await supabase
    .from('colaboradores')
    .update(campos)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deletarColaborador(id) {
  const { error } = await supabase
    .from('colaboradores')
    .update({ ativo: false })
    .eq('id', id)
  if (error) throw error
}

// NOVA FUNÇÃO: Faz o upload do arquivo vindo do PC para o Storage
export async function uploadFoto(file) {
  const fileExt = file.name.split('.').pop()
  // Gera um nome único para evitar que fotos com o mesmo nome se sobrescrevam
  const fileName = `${Math.random()}_${Date.now()}.${fileExt}`
  const filePath = `${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('colaboradores')
    .upload(filePath, file)

  if (uploadError) throw uploadError

  // Retorna a URL pública que salvamos no banco de dados
  const { data } = supabase.storage
    .from('colaboradores')
    .getPublicUrl(filePath)

  return data.publicUrl
}

// ─── Feedbacks ───────────────────────────────────────────────
export async function getFeedbacks({ colaboradorId, nota } = {}) {
  let q = supabase
    .from('feedbacks')
    .select('*, colaboradores(nome, cargo, slug)')
    .order('criado_em', { ascending: false })
  if (colaboradorId) q = q.eq('colaborador_id', colaboradorId)
  if (nota) q = q.eq('nota', nota)
  const { data, error } = await q
  if (error) throw error
  return data
}

export async function enviarFeedback({ colaboradorId, nota, comentario, nomeAvaliador, nomePolo }) {
  const { data, error } = await supabase
    .from('feedbacks')
    .insert({
      colaborador_id: colaboradorId,
      nota,
      comentario,
      nome_avaliador: nomeAvaliador,
      nome_polo: nomePolo,
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getEstatisticas() {
  const { data: fbs, error } = await supabase
    .from('feedbacks')
    .select('nota, colaborador_id, colaboradores(id, nome, cargo, slug)')
  if (error) throw error

  const map = {}
  for (const f of fbs) {
    const cid = f.colaborador_id
    if (!map[cid]) map[cid] = { ...f.colaboradores, notas: [] }
    map[cid].notas.push(f.nota)
  }

  return Object.values(map).map(c => ({
    ...c,
    total: c.notas.length,
    media: c.notas.length
      ? +(c.notas.reduce((a, b) => a + b, 0) / c.notas.length).toFixed(1)
      : 0,
    dist: [5, 4, 3, 2, 1].map(n => ({ nota: n, count: c.notas.filter(x => x === n).length })),
  })).sort((a, b) => b.media - a.media || b.total - a.total)
}