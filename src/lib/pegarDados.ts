import supabase from '../utils/supabase.ts';

export type Dados = {
    id_pedido : number;
    nome_completo:string;
    base:string;
    suporte:string;
    status:string;
};

async function pegarDados(){

    //Pega todos os dados da tabela pedido
    const { data: pedidos, error: pedidosErr } = await supabase
        .from('pedidos')
        .select('id_pedido, id_usuario, id_produto, status_pedido')

    if (pedidosErr) throw new Error(`Erro consultando pedidos: ${pedidosErr.message}`)
    
        
    //Transforma o ID do produto n nome do produto
    const idsProdutos = pedidos.map(p => p.id_produto);
    let nomes_customizados: any[] = [];

    for(let i = 0; i<idsProdutos.length; i++){
        const { data: rows, error: nomeErr } = await supabase
        .from('produtos_personalizados')
        .select('nome_customizado')
        .eq("id_produto", idsProdutos[i]) 
        if (nomeErr) throw new Error(`Erro consultando produtos personalizados: ${nomeErr.message}`)
        nomes_customizados.push(rows.at(0));
    }

    //Separa o nome em duas partes: Base e Suporte
    const suportes: string[] = [];
    const bases: string[] = [];

    nomes_customizados.forEach(item => {
    const [suporte, base] = item.nome_customizado.split(' + ');

    if (suporte) suportes.push(suporte);
    if (base) bases.push(base);
    });

    
    //Transforma o id do Usuario em nome e sobrenome
    const idsUsuarios = pedidos.map(p => p.id_usuario);
    let nomes_completos: any[] = [];

    for(let i = 0; i<idsUsuarios.length; i++){
    const { data: usuarios, error: usuarioErr } = await supabase
        .from('usuarios')
        .select('nome, sobrenome')
        .eq("id_usuario", idsUsuarios[i]) 
        if (usuarioErr) throw new Error(`Erro consultando produtos personalizados: ${usuarioErr.message}`)
        nomes_completos.push(usuarios[0].nome + " " + usuarios[0].sobrenome);
    } 

    const dadosFinais: Dados[] = [];

   for(let i = 0; i<idsUsuarios.length; i++){
        dadosFinais.push(
            {
                id_pedido: pedidos[i].id_pedido,
                nome_completo:nomes_completos[i],
                base:bases[i],
                suporte:suportes[i],
                status:pedidos[i].status_pedido
            }
        )    
   }

   return dadosFinais;

}






/*
function rodar(){
    pegarDados()
  .then(res => {
    console.log("Resultado:", res);
  })
  .catch(err => {
    console.error("Erro:", err);
  });
}
*/
export default pegarDados;


