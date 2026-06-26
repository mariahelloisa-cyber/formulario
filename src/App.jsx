import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastProvider } from './components/Toast'
import PrivateRoute from './components/PrivateRoute'
import AdminLayout from './components/AdminLayout'
import Dashboard from './pages/Dashboard'
import Colaboradores from './pages/Colaboradores'
import Feedbacks from './pages/Feedbacks'
import Avaliacao from './pages/Avaliacao'
import Login from './pages/Login'
import './index.css'

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          {/* Público — formulário de avaliação */}
          <Route path="/avaliacao/:slug" element={<Avaliacao />} />

          {/* Login */}
          <Route path="/login" element={<Login />} />

          {/* Admin — protegido */}
          <Route path="/admin" element={
            <PrivateRoute><AdminLayout><Dashboard /></AdminLayout></PrivateRoute>
          } />
          <Route path="/admin/colaboradores" element={
            <PrivateRoute><AdminLayout><Colaboradores /></AdminLayout></PrivateRoute>
          } />
          <Route path="/admin/feedbacks" element={
            <PrivateRoute><AdminLayout><Feedbacks /></AdminLayout></PrivateRoute>
          } />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  )
}
