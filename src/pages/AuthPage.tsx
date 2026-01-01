import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AnimatedAuthCard from '../components/auth/AnimatedAuthCard'
import { useAuth } from '../context/AuthContext'
import { LoginCredentials, RegisterData } from '../types/auth'

interface AuthPageProps {
  type: 'login' | 'register'
}

const AuthPage: React.FC<AuthPageProps> = ({ type: initialType }) => {
  const [type, setType] = useState<'login' | 'register'>(initialType)
  const { login, register, isLoading } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (data: any) => {
    if (type === 'login') {
      const result = await login(data as LoginCredentials)
      if (result.success) {
        navigate('/')
      }
    } else {
      const result = await register(data as RegisterData)
      if (result.success) {
        navigate('/')
      }
    }
  }

  return (
    <AnimatedAuthCard
      type={type}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      toggleType={() => setType(type === 'login' ? 'register' : 'login')}
    />
  )
}

export default AuthPage