// Local recomendado: src/lib/criarPedido.ts ou services/criarPedido.ts
// Este arquivo pode ser importado de qualquer parte do app

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.EXPO_PUBLIC_SUPABASE_URL!,
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!
);

export async function criarPedidoSimples({
    id_usuario,
    id_base,
    id_suporte,
    nome_customizado,
}: {
    id_usuario: number;
    id_base: number;
    id_suporte: number;
    nome_customizado: string;
}) {
  // 1. Verifica se produto já existe
    const { data: existente, error: erroBusca } = await supabase
        .from('produtos_personalizados')
        .select('id_produto')
        .eq('nome_customizado', nome_customizado)
        .maybeSingle();

    let id_produto = existente?.id_produto;

    // 2. Se não existe, cria produto
    if (!id_produto) {
        const { data: novo, error: erroCriacao } = await supabase
        .from('produtos_personalizados')
        .insert([
            {
            nome_customizado,
            status_producao: 'pendente',
            data_criacao: new Date().toISOString(),
            id_usuario,
            id_suporte,
            id_base,
            },
        ])
        .select()
        .single();

        if (erroCriacao || !novo) {
            console.error(erroCriacao);
            return { error: erroCriacao?.message || 'Erro ao criar produto personalizado' };
        }

        id_produto = novo.id_produto;
    }

    // 3. Cria pedido vinculado
    const { data: pedido, error: erroPedido } = await supabase
        .from('pedidos')
        .insert([
        {
            id_usuario,
            id_produto,
            status_pedido: 'recebido',
            data_pedido: new Date().toISOString(),
        },
        ])
        .select()
        .single();

    if (erroPedido || !pedido) return { error: 'Erro ao criar pedido' };

    return { success: true, pedido };
}