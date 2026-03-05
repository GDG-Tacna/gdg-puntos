import { Settings } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'
import CategoryEditor from '../components/settings/CategoryEditor'
import SeasonManager from '../components/settings/SeasonManager'

export default function SettingsPage() {
  const { isAdmin } = useAuth()

  if (!isAdmin) return <Navigate to="/ranking" replace />

  return (
    <div className="p-2 md:p-4 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Settings size={24} className="text-primary" />
        <h1 className="font-heading font-bold text-xl">Configuracion</h1>
      </div>

      <div className="space-y-8">
        <SeasonManager />
        <CategoryEditor />
      </div>
    </div>
  )
}
