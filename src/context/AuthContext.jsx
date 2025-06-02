import { createContext, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const navigate = useNavigate()

  // Set auth header if token exists
  if (token) {
    
    api.defaults.headers.common['Authorization'] = `Token ${token}`
  }

  const login = async (credentials) => {
    try {
      const { data } = await api.post('/auth/login/', credentials)
      setToken(data.token)
      localStorage.setItem('token', data.token)
      navigate('/') // Redirect to home after login
    } catch (error) {
      throw error // Let the login page handle the error
    }
  }

  const register = async (userData) => {
    await api.post('/auth/register/', userData)
    navigate('/login') // Redirect to login after registration
  }

  const logout = () => {
    localStorage.removeItem('token')
    delete api.defaults.headers.common['Authorization']
    setToken(null)
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated: !!token,
      token,
      login,
      register,
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)