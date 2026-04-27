import React, { useEffect, useState } from "react";
import "./operador.css";
import type { Dados } from "../lib/pegarDados.ts";
import pegarDados from "../lib/pegarDados.ts";
import { apagar, editar } from "../lib/editarApagar.ts";


const Operador: React.FC = () => {
  const [pedidoEditando, setPedidoEditando] = useState<Dados | null>(null);
  const [pedidos, setPedidos] = useState<Dados[]>([]);
  const [paginaAtual, setPaginaAtual] = useState(1);

  const itensPorPagina = 10;

  useEffect(() => {
    async function carregar() {
      try {
        const dados = await pegarDados(paginaAtual, itensPorPagina); 
        setPedidos(dados);
      } catch (err) {
        console.error(err);
      }
    }

    carregar();
  }, [paginaAtual]); 

  return (
    <div className="container">
      <h1 className="titulo">Controle de Pedidos</h1>

      <table className="tabela">
        <thead>
          <tr>
            <th>id pedido</th>
            <th>Usuário</th>
            <th>Base</th>
            <th>Suporte</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {pedidos.map((pedido) => (
            <tr key={pedido.id_pedido}>
              <td>{pedido.id_pedido}</td>
              <td>{pedido.nome_completo}</td>
              <td>{pedido.base}</td>
              <td>{pedido.suporte}</td>
              <td>{pedido.status}</td>

              <td className="acoes">
                <button className="editar" onClick={() => setPedidoEditando(pedido)}>EDITAR</button>
                <button className="cancelar" onClick={async () => {
                  const confirmou = window.confirm("Tem certeza que deseja cancelar este pedido?");
                        if (confirmou) {
                          await apagar(pedido.id_pedido);
                          window.location.reload();
                        }}}>CANCELAR</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
        
        {pedidoEditando && (
        <div className="modal">
          <h2>Editar Pedido #{pedidoEditando.id_pedido}</h2>

          <div className="form">

            <label>Base</label>
            <select
              value={pedidoEditando.base}
              onChange={(e) =>
                setPedidoEditando({
                  ...pedidoEditando,
                  base: e.target.value,
                })
              }
            >
              <option value="Base Branco">Base Branco</option>
              <option value="Base Cinza">Base Cinza</option>
              <option value="Base Trans">Base Trans</option>
              <option value="Base Preto">Base Preta</option>
              <option value="Base Cinza Escura">Base Cinza Escura</option>
            </select>

            <label>Suporte</label>
            <select
              value={pedidoEditando.suporte}
              onChange={(e) =>
                setPedidoEditando({
                  ...pedidoEditando,
                  suporte: e.target.value,
                })
              }
            >
              <option value="Suporte Azul">Suporte Azul</option>
              <option value="Suporte Amarelo">Suporte Amarelo</option>
              <option value="Suporte Verde">Suporte Verde</option>
              <option value="Suporte Vermelho">Suporte Vermelho</option>
            </select>

            <label>Status</label>
            <select
              value={pedidoEditando.status}
              onChange={(e) =>
                setPedidoEditando({
                  ...pedidoEditando,
                  status: e.target.value,
                })
              }
            >
              <option value="novo">Novo</option>
              <option value="recebido">Recebido</option>
              <option value="em_producao">Em Produção</option>
              <option value="enviado">Enviado</option>
              <option value="entregue">Entregue</option>
            </select>
          </div>

          <div className="botoes">
            <button
              className="salvar"
              onClick={async() => {
                if (!pedidoEditando) return;
                const pedidoAtual = pedidoEditando;
                await editar(
                  pedidoAtual.id_pedido,
                  pedidoAtual.base,
                  pedidoAtual.suporte,
                  pedidoAtual.status,
                );
                setPedidos((prev) =>
                  prev.map((p) =>
                    p.id_pedido === pedidoEditando.id_pedido
                      ? pedidoEditando
                      : p
                  )
                );
                setPedidoEditando(null);
              }}
            >
              Salvar
            </button>

            <button
              className="voltar"
              onClick={() => setPedidoEditando(null)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
      <div style={{ marginTop: "10px" }}>
        <button
          onClick={() => setPaginaAtual((p) => Math.max(p - 1, 1))}
        >
          Anterior
        </button>

        <span style={{ margin: "0 10px" }}>
          Página {paginaAtual} 
        </span>

        <button
          onClick={() => setPaginaAtual((p) => p + 1)}
        >
          Próxima
        </button>
      </div>
    </div>
  );
};

export default Operador;