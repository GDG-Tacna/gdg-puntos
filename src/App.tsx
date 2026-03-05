import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { DataProvider } from './context/DataContext'
import { ToastProvider } from './components/shared/Toast'
import ProtectedRoute from './components/shared/ProtectedRoute'
import Layout from './components/layout/Layout'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import EventsPage from './pages/EventsPage'
import EventDetailPage from './pages/EventDetailPage'
import MembersPage from './pages/MembersPage'
import MemberProfilePage from './pages/MemberProfilePage'
import HistoryPage from './pages/HistoryPage'
import SettingsPage from './pages/SettingsPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              element={
                <ProtectedRoute>
                  <DataProvider>
                    <Layout />
                  </DataProvider>
                </ProtectedRoute>
              }
            >
              <Route path="/ranking" element={<DashboardPage />} />
              <Route path="/eventos" element={<EventsPage />} />
              <Route path="/eventos/:id" element={<EventDetailPage />} />
              <Route path="/miembros" element={<MembersPage />} />
              <Route path="/miembros/:id" element={<MemberProfilePage />} />
              <Route path="/historial" element={<HistoryPage />} />
              <Route path="/configuracion" element={<SettingsPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/ranking" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
