import { createContext, useContext, useEffect, useState } from 'react'

type AuthCtx = {
    isAuthenticated: boolean
    loading: boolean
    login: (token: string) => void
    logout: () => void
}

const AuthContext = createContext<AuthCtx>({} as AuthCtx)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem('token')
        setIsAuthenticated(!!token)
        setLoading(false)
    }, [])

    const login = (token: string) => {
        localStorage.setItem('token', token)
        setIsAuthenticated(true)
    }

    const logout = () => {
        localStorage.removeItem('token')
        setIsAuthenticated(false)
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
        {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)