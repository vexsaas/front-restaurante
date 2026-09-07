import { createContext, useContext, useEffect, useState } from 'react'
import api from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('admin_token'))
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('admin_user')
    return raw ? JSON.parse(raw) : null
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (token) {
      localStorage.setItem('admin_token', token)
    } else {
      localStorage.removeItem('admin_token')
    }
  }, [token])

  async function login(email, password) {
    setLoading(true)
    try {
      const { data } = await api.post('/login', { email, password })
      setToken(data.data.token)
      setUser(data.data.user)
      localStorage.setItem('admin_user', JSON.stringify(data.data.user))
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'No se pudo iniciar sesión.'
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }

  async function logout() {
    try {
      await api.post('/logout')
    } catch {
      // ignorar errores de red al cerrar sesión
    }
    setToken(null)
    setUser(null)
    localStorage.removeItem('admin_user')
  }

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated: !!token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
