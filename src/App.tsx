import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'sonner'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { BlogProvider } from './context/BlogContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
import EnhancedLayout from './components/layout/EnhancedLayout'

// Pages
import EnhancedHomePage from './pages/EnhancedHomePage'
import BlogPage from './pages/BlogPage'
import ProfilePage from './pages/ProfilePage'
import CreatePostPage from './pages/CreatePostPage'
import EditPostPage from './pages/EditPostPage'
import AuthPage from './pages/AuthPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import NotFoundPage from './pages/NotFoundPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <AuthProvider>
            <BlogProvider>
              <Toaster 
                position="top-right" 
                toastOptions={{
                  className: 'bg-background border-2',
                }}
              />
              <Routes>
                {/* Public Auth Routes */}
                <Route path="/login" element={<AuthPage type="login" />} />
                <Route path="/register" element={<AuthPage type="register" />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                
                {/* Public Pages with Layout */}
                <Route path="/" element={
                  <EnhancedLayout>
                    <EnhancedHomePage />
                  </EnhancedLayout>
                } />
                
                <Route path="/blog/:id" element={
                  <EnhancedLayout>
                    <BlogPage />
                  </EnhancedLayout>
                } />
                    
                {/* Protected Routes */}
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <EnhancedLayout>
                      <ProfilePage />
                    </EnhancedLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/create-post" element={
                  <ProtectedRoute>
                    <EnhancedLayout>
                      <CreatePostPage />
                    </EnhancedLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/edit-post/:id" element={
                  <ProtectedRoute>
                    <EnhancedLayout>
                      <EditPostPage />
                    </EnhancedLayout>
                  </ProtectedRoute>
                } />
                
                {/* 404 Route */}
                <Route path="*" element={
                  <EnhancedLayout>
                    <NotFoundPage />
                  </EnhancedLayout>
                } />
              </Routes>
              <ReactQueryDevtools initialIsOpen={false} />
            </BlogProvider>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App