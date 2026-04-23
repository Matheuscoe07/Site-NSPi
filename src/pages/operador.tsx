import React from "react";
import "./operador.css";

const pedidos = [
  { id: 101, usuario: "Davi", base: "Azul", suporte: "Branco", status: "Aberto" },
  { id: 102, usuario: "Maria", base: "RJ", suporte: "N2", status: "Fechado" },
  { id: 103, usuario: "Carlos", base: "MG", suporte: "N1", status: "Em andamento" },
];

const Operador: React.FC = () => {
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
            <tr key={pedido.id}>
              <td>{pedido.id}</td>
              <td>{pedido.usuario}</td>
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