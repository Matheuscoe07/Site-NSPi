import React, { useEffect, useState } from "react";
import "./operador.css";
import type { Dados } from "../lib/pegarDados.ts";
import rodar from "../lib/pegarDados.ts";

const [pedidos, setPedidos] = useState<Dados[]>([]);

const Operador: React.FC = () => {
    const [pedidos, setPedidos] = useState<Dados[]>([]);

  useEffect(() => {
    async function carregar() {
      try {
        const dados = await rodar();
        setPedidos(dados);
      } catch (err) {
        console.error(err);
      }
    }

    carregar();
  }, []);
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

    <div className="espacamento">
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
         </div>
      </table>
    </div>
  );
};

export default Operador;