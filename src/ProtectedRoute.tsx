import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './auth'

export default function ProtectedRoute() {
    const { isAuthenticated, loading } = useAuth()
    const location = useLocation()

    if (loading) return <div style={{ padding: 24 }}>Carregando…</div>
    if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />
    return <Outlet />
}