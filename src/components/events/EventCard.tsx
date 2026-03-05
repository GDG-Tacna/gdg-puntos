import { useNavigate } from 'react-router-dom'
import { Calendar, MapPin, Users, CheckCircle } from 'lucide-react'
import type { GDGEvent } from '../../types'

interface Props {
  event: GDGEvent
}

export default function EventCard({ event }: Props) {
  const navigate = useNavigate()
  const fecha = event.fecha.toDate().toLocaleDateString('es-PE', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
  const completedTasks = event.tareas.filter(t => t.completada).length

  return (
    <div
      className="card-interactive p-4 cursor-pointer"
      onClick={() => navigate(`/eventos/${event.id}`)}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className={`badge mb-2 ${event.tipo === 'evento' ? '' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'}`}>
            {event.tipo === 'evento' ? 'Evento' : 'Reunion'}
          </span>
          <h3 className="font-heading font-semibold text-sm text-text-primary mt-1">{event.nombre}</h3>
        </div>
      </div>

      <div className="mt-3 space-y-1.5 text-xs text-text-secondary">
        <div className="flex items-center gap-2">
          <Calendar size={13} /> {fecha}
        </div>
        {event.lugar && (
          <div className="flex items-center gap-2">
            <MapPin size={13} /> {event.lugar}
          </div>
        )}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Users size={13} /> {event.asistentes.length} asistentes
          </div>
          {event.tareas.length > 0 && (
            <div className="flex items-center gap-2">
              <CheckCircle size={13} /> {completedTasks}/{event.tareas.length} tareas
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
