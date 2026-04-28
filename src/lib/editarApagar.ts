import supabase from '../utils/supabase.ts';
import type Dados from "./pegarDados.ts";

export async function apagar(idPedido : number){

     const { data: pedidos, error: pedidosErr } = await supabase
        .from('pedidos')
        .update({ status_pedido: 'cancelado' })
        .eq('id_pedido', idPedido)
    if (pedidosErr) throw new Error(`Erro cancelando um pedido: ${pedidosErr.message}`)
    
}

export async function editar(idPedido : number, base: String, suporte : String, status : String){
    
    console.log("entrou no editar");
    //Converte nome da base em id da base
    const { data: idBase, error: baseErr } = await supabase
        .from('pecas')
        .select('id_peca')
        .eq("nome", base) 
        if (baseErr) throw new Error(`Erro convertendo peças: ${baseErr.message}`)
    

    //Converte nome do suporte em id do suporte
    const { data: idSup, error: suporteErr } = await supabase
        .from('pecas')
        .select('id_peca')
        .eq("nome", suporte) 
        if (suporteErr) throw new Error(`Erro convertendo peças: ${suporteErr.message}`)
    
    //Pega os dois ids e transforma em id_produto

    let produto = await aux(idBase[0].id_peca, idSup[0].id_peca, base, suporte).then((res) => res[0].id_produto);
    console.log(produto);

    const { data: pedidos, error: pedidosErr } = await supabase
        .from('pedidos')
        .update({ 
            status_pedido: status,
            id_produto: produto
         })
        .eq('id_pedido', idPedido)
    if (pedidosErr) throw new Error(`Erro atualizando o pedido: ${pedidosErr.message}`)

    console.log("terminou de editar");
}   

async function aux(idBase: number, idSup: number, base: String, suporte: String) {
    const { data: perso, error: nomeErr } = await supabase
        .from('produtos_personalizados')
        .select('id_produto')
        .eq("id_base", idBase)
        .eq('id_suporte', idSup) 
        if (nomeErr) throw new Error(`Erro consultando produtos personalizados: ${nomeErr.message}`)
        
        if(perso[0] == null){
            console.log("vamos criar um novo");
            const { data: novo, error: createProdErr } = await supabase
            .from('produtos_personalizados')
            .insert([{
            id_base: idBase,
            id_suporte: idSup,
            nome_customizado : suporte + " + " + base,
            data_criacao: new Date().toISOString(),
            }])
             if (createProdErr) throw new Error(`Erro criando produto personalizado: ${createProdErr.message}`)
            return aux(idBase, idSup, base, suporte);
        }
    return perso;
}



