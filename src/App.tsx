import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './auth'
import 'bootstrap-icons/font/bootstrap-icons.css'

import Home from './pages/home'
import Login from './pages/login'
import Registrar from './pages/registrar'
import Pedido from './pages/pedido'
import ProtectedRoute from './ProtectedRoute'
import Contato from '@pages/contato'
import Confirmado from '@pages/confirmado'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Home única (mostra estados diferentes conforme login) */}
        <Route path="/" element={<Home />} /> {/* VOLTAR PARA A TELA HOME!!!!!!!!!!!!! */}

        {/* Públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/registrar" element={<Registrar />} />
        <Route path="/contato" element={<Contato />} />

        {/* Protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route path="/pedido" element={<Pedido />} />
          <Route path="/confirmado" element={<Confirmado />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}