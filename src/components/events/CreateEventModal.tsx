import { useState } from 'react'
import { X } from 'lucide-react'
import { Timestamp } from 'firebase/firestore'
import { addEvent } from '../../firebase/events'
import { useData } from '../../context/DataContext'
import { useToast } from '../shared/Toast'
import type { GDGEvent } from '../../types'

interface Props {
  onClose: () => void
}

export default function CreateEventModal({ onClose }: Props) {
  const { activeSeason, setEvents, events } = useData()
  const { toast } = useToast()
  const [nombre, setNombre] = useState('')
  const [tipo, setTipo] = useState<'reunion' | 'evento'>('reunion')
  const [fecha, setFecha] = useState('')
  const [lugar, setLugar] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeSeason || !nombre || !fecha) return
    setSaving(true)

    const data: Omit<GDGEvent, 'id'> = {
      seasonId: activeSeason.id,
      tipo,
      nombre,
      fecha: Timestamp.fromDate(new Date(fecha + 'T12:00:00')),
      lugar,
      asistentes: [],
      tareas: [],
      creadoEn: Timestamp.now(),
    }

    const id = await addEvent(data)
    setEvents([{ id, ...data }, ...events])
    toast('Evento creado')
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-heading font-semibold text-lg">Nuevo Evento</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Nombre</label>
            <input className="input-field" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Tipo</label>
              <select className="input-field" value={tipo} onChange={(e) => setTipo(e.target.value as 'reunion' | 'evento')}>
                <option value="reunion">Reunion</option>
                <option value="evento">Evento</option>
              </select>
            </div>
            <div>
              <label className="label">Fecha</label>
              <input type="date" className="input-field" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
            </div>
          </div>

          <div>
            <label className="label">Lugar</label>
            <input className="input-field" value={lugar} onChange={(e) => setLugar(e.target.value)} placeholder="Opcional" />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost">Cancelar</button>
            <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
              {saving ? 'Creando...' : 'Crear Evento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
