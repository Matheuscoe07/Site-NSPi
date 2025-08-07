import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import supabase from '@utils/supabase';

import Index from './pages/index';        // tela inicial pública
import Home from './pages/home';          // home do sistema logado
import Pedido from './pages/pedido';
import Login from './pages/login';
import Registrar from './pages/registrar';
import Confirmado from './pages/confirmado'; // 👈 ADICIONADO!

export default function App() {
  return (
    <Routes>
      {/* Rota inicial (pública) */}
      <Route path="/" element={<Index />} />

      {/* Telas acessadas após login */}
      <Route path="/home" element={<Home />} />
      <Route path="/pedido" element={<Pedido />} />
      <Route path="/confirmado" element={<Confirmado />} /> {/* 👈 NOVA ROTA */}

      {/* Autenticação */}
      <Route path="/login" element={<Login />} />
      <Route path="/registrar" element={<Registrar />} />

      {/* Página de teste com Supabase */}
      <Route path="/teste" element={<TodosPage />} />
    </Routes>
  );
}

function TodosPage() {
  const [todos, setTodos] = useState<string[]>([]);

  useEffect(() => {
    async function getTodos() {
      const { data: todos } = await supabase.from('todos').select();
      if (todos && todos.length > 0) {
        setTodos(todos.map((t: any) => t.nome || JSON.stringify(t)));
      }
    }

    getTodos();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Todos cadastrados</h2>
      <ul>
        {todos.map((todo, index) => (
          <li key={index}>{todo}</li>
        ))}
      </ul>
    </div>
  );
}