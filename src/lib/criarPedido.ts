// src/lib/criarPedido.ts
import supabase from '../utils/supabase'

// 🔎 id da UI -> tipo/cor/nome (matching com teu /pedido.tsx)
const UI_TO_PECA: Record<number, { tipo: 'suporte' | 'base'; cor: string; nome: string }> = {
  1:  { tipo: 'suporte', cor: 'blue',        nome: 'Suporte Azul' },
  2:  { tipo: 'suporte', cor: 'red',         nome: 'Suporte Vermelho' },
  3:  { tipo: 'suporte', cor: 'yellow',      nome: 'Suporte Amarelo' },
  4:  { tipo: 'suporte', cor: 'green',       nome: 'Suporte Verde' },
  5:  { tipo: 'base',    cor: 'black',       nome: 'Base Preto' },
  6:  { tipo: 'base',    cor: 'lightgray',   nome: 'Base Cinza Claro' },
  8:  { tipo: 'base',    cor: 'darkgray',    nome: 'Base Cinza Escuro' },
  9:  { tipo: 'base',    cor: 'white',       nome: 'Base Branco' },
  10: { tipo: 'base',    cor: 'transparente',nome: 'Base Transparente' }, // UI em PT
}

// normalizador pra comparar strings (case/acento/espaço)
function norm(s: string) {
  return (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
  .replace(/\s+/g, '')
}

// possíveis sinônimos que vamos tentar no INSERT (ENUM)
function buildColorCandidates(uiColor: string): string[] {
  const n = norm(uiColor)
  if (n === 'transparente' || n === 'transparent') {
    // tenta várias grafias; a que o ENUM aceitar, fica
    return ['transparent', 'transparente', 'Transparente', 'TRANSPARENTE']
  }
  // demais cores já estão ok, mas adiciono PT por via das dúvidas
  if (n === 'lightgray') return ['lightgray', 'cinza_claro', 'cinza claro']
  if (n === 'darkgray')  return ['darkgray', 'cinza_escuro', 'cinza escuro']
  if (n === 'black')     return ['black', 'preto']
  if (n === 'white')     return ['white', 'branco']
  if (n === 'blue')      return ['blue', 'azul']
  if (n === 'red')       return ['red', 'vermelho']
  if (n === 'yellow')    return ['yellow', 'amarelo']
  if (n === 'green')     return ['green', 'verde']
  return [uiColor]
}

/**
 * Resolve um id da UI (5..10) para um id_peca real.
 * - Se já for id_peca existente, usa direto;
 * - Senão mapeia por tipo/cor e procura no banco SEM filtrar ENUM no SQL;
 * - Se não existir, tenta criar com candidatos de cor até o ENUM aceitar.
 */
async function getOrCreatePecaId(inputId: number): Promise<number> {
  // 0) já é id_peca?
  const { data: check } = await supabase
    .from('pecas')
    .select('id_peca')
    .eq('id_peca', inputId)
    .maybeSingle()
  if (check?.id_peca) return Number(check.id_peca)

  const map = UI_TO_PECA[inputId]
  if (!map) throw new Error(`Peça inválida (id=${inputId}).`)

  const candidates = buildColorCandidates(map.cor)

  // 1) busca TODAS as peças do tipo e filtra no JS (não explode o ENUM no WHERE)
  const { data: rows, error: findErr } = await supabase
    .from('pecas')
    .select('id_peca, cor')
    .eq('tipo', map.tipo)

  if (findErr) throw new Error(`Erro consultando pecas: ${findErr.message}`)

  const match = rows?.find(r => candidates.some(c => norm(r.cor) === norm(c)))
  if (match?.id_peca) return Number(match.id_peca)

  // 2) não achou -> tenta criar com candidatos até um passar no ENUM
  for (const cor of candidates) {
    const { data: created, error: insErr } = await supabase
      .from('pecas')
      .insert([{ nome: map.nome, tipo: map.tipo, cor, ativo: true }])
      .select('id_peca')
      .single()

    if (!insErr && created?.id_peca) return Number(created.id_peca)

    // ENUM recusou? tenta próxima variante
    if (insErr?.message?.toLowerCase().includes('invalid input value for enum')) {
      continue
    }
    // outro erro: repassa
    if (insErr) throw new Error(`Erro ao criar peça (${map.tipo}/${cor}): ${insErr.message}`)
  }

  // nenhuma variante passou -> instrução clara
  throw new Error(
    `A cor "${map.cor}" não existe no ENUM de 'pecas.cor' e não deu pra criar automaticamente.
Adicione essa cor ao ENUM no Supabase (SQL):
  ALTER TYPE pecas_cor_enum ADD VALUE IF NOT EXISTS 'transparent';
  INSERT INTO public.pecas (nome, tipo, cor, ativo)
  VALUES ('${map.nome}','${map.tipo}','transparent', true)
  ON CONFLICT DO NOTHING;`
  )
}

type Params = {
  id_usuario: number
  id_base: number      // vindo da UI
  id_suporte: number   // vindo da UI
  nome_customizado: string
}

export async function criarPedidoSimples({
  id_usuario, id_base, id_suporte, nome_customizado,
}: Params) {
  try {
    // 🔑 garante ids reais (e cria peça se não existir)
    const [idBase, idSuporte] = await Promise.all([
      getOrCreatePecaId(id_base),
      getOrCreatePecaId(id_suporte),
    ])

    // 1) já existe produto pra essa combinação/user?
    const { data: existente, error: findProdErr } = await supabase
      .from('produtos_personalizados')
      .select('id_produto')
      .eq('id_usuario', id_usuario)
      .eq('id_base', idBase)
      .eq('id_suporte', idSuporte)
      .maybeSingle()

    if (findProdErr) return { error: findProdErr.message }

    let id_produto = existente?.id_produto

    // 2) se não existe, cria
    if (!id_produto) {
      const { data: novo, error: createProdErr } = await supabase
        .from('produtos_personalizados')
        .insert([{
          id_usuario,
          id_base: idBase,
          id_suporte: idSuporte,
          nome_customizado,
          status_producao: 'pendente',
          data_criacao: new Date().toISOString(),
        }])
        .select('id_produto')
        .single()

      if (createProdErr || !novo) {
        return { error: createProdErr?.message || 'Erro ao criar produto personalizado' }
      }
      id_produto = novo.id_produto
    }

    // 3) cria o pedido
    const { data: pedido, error: pedidoErr } = await supabase
      .from('pedidos')
      .insert([{
        id_usuario,
        id_produto,
        status_pedido: 'recebido',
        data_pedido: new Date().toISOString(),
      }])
      .select('*')
      .single()

    if (pedidoErr || !pedido) return { error: pedidoErr?.message || 'Erro ao criar pedido' }
    return { success: true, pedido }
  } catch (e: any) {
    console.error('[criarPedidoSimples] erro:', e)
    return { error: e?.message || 'Falha ao criar pedido' }
  }
}
