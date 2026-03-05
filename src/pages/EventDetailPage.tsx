import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, MapPin } from 'lucide-react'
import { getEvent } from '../firebase/events'
import { useData } from '../context/DataContext'
import AttendanceChecklist from '../components/events/AttendanceChecklist'
import TaskAssignment from '../components/events/TaskAssignment'
import type { GDGEvent } from '../types'

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { setEvents, events } = useData()
  const [event, setEvent] = useState<GDGEvent | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    getEvent(id).then((ev) => {
      setEvent(ev)
      setLoading(false)
    })
  }, [id])

  const handleChange = (updated: GDGEvent) => {
    setEvent(updated)
    setEvents(events.map(e => e.id === updated.id ? updated : e))
  }

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="skeleton h-8 w-48" />
        <div className="skeleton h-40 w-full" />
      </div>
    )
  }

  if (!event) {
    return (
      <div className="p-6">
        <p className="text-text-muted">Evento no encontrado</p>
      </div>
    )
  }

  const fecha = event.fecha.toDate().toLocaleDateString('es-PE', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <div className="p-2 md:p-4 max-w-5xl mx-auto">
      <button onClick={() => navigate('/eventos')} className="btn-ghost flex items-center gap-2 mb-4">
        <ArrowLeft size={16} /> Volver
      </button>

      <div className="card p-5 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <span className={`badge mb-2 ${event.tipo === 'evento' ? '' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'}`}>
              {event.tipo === 'evento' ? 'Evento' : 'Reunion'}
            </span>
            <h1 className="font-heading font-bold text-xl mt-1">{event.nombre}</h1>
          </div>
        </div>

        <div className="mt-3 space-y-1.5 text-sm text-text-secondary">
          <div className="flex items-center gap-2">
            <Calendar size={15} /> {fecha}
          </div>
          {event.lugar && (
            <div className="flex items-center gap-2">
              <MapPin size={15} /> {event.lugar}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <AttendanceChecklist event={event} onChange={handleChange} />
        <TaskAssignment event={event} onChange={handleChange} />
      </div>
    </div>
  )
}
