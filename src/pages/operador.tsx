import React, { useEffect, useState } from "react";
import "./operador.css";
import type { Dados } from "../lib/pegarDados.ts";
import pegarDados from "../lib/pegarDados.ts";


const Operador: React.FC = () => {
  const [pedidos, setPedidos] = useState<Dados[]>([]);
  const [paginaAtual, setPaginaAtual] = useState(1);

  const itensPorPagina = 20;

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
                <button className="editar">EDITAR</button>
                <button className="cancelar">CANCELAR</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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