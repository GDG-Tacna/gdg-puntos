import { useState } from 'react'
import { Calendar, Plus } from 'lucide-react'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import SeasonSelector from '../components/shared/SeasonSelector'
import AdminGuard from '../components/shared/AdminGuard'
import EventList from '../components/events/EventList'
import CreateEventModal from '../components/events/CreateEventModal'

export default function EventsPage() {
  const { events, loading } = useData()
  const { isAdmin } = useAuth()
  const [showCreate, setShowCreate] = useState(false)

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="skeleton h-28 w-full" />
        ))}
      </div>
    )
  }

  return (
    <div className="p-2 md:p-4 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Calendar size={24} className="text-primary" />
          <h1 className="font-heading font-bold text-xl">Eventos</h1>
        </div>
        <div className="flex items-center gap-3">
          <SeasonSelector />
          <AdminGuard>
            <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2">
              <Plus size={16} /> Nuevo
            </button>
          </AdminGuard>
        </div>
      </div>

      <EventList events={events} />

      {showCreate && isAdmin && <CreateEventModal onClose={() => setShowCreate(false)} />}
    </div>
  )
}
