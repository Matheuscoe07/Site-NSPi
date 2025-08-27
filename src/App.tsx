import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './auth'
import 'bootstrap-icons/font/bootstrap-icons.css'

import Home from './pages/home'
import Login from './pages/login'
import Registrar from './pages/registrar'
import Pedido from './pages/pedido'
import ProtectedRoute from './ProtectedRoute'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Home única (mostra estados diferentes conforme login) */}
        <Route path="/" element={<Pedido />} /> {/* VOLTAR PARA A TELA HOME!!!!!!!!!!!!! */}

        {/* Públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/registrar" element={<Registrar />} />

        {/* Protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route path="/pedido" element={<Pedido />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}