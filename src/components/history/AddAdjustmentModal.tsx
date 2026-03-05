import { useState } from 'react'
import { X } from 'lucide-react'
import { Timestamp } from 'firebase/firestore'
import { addTransaction } from '../../firebase/transactions'
import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../shared/Toast'

interface Props {
  onClose: () => void
}

export default function AddAdjustmentModal({ onClose }: Props) {
  const { members, categories, activeSeason, events, refreshTransactions } = useData()
  const { member: currentMember } = useAuth()
  const { toast } = useToast()
  const [memberId, setMemberId] = useState(members[0]?.id ?? '')
  const [categoriaId, setCategoriaId] = useState(categories[0]?.id ?? '')
  const [eventId, setEventId] = useState('')
  const [puntos, setPuntos] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeSeason || !currentMember || !memberId || !puntos) return
    setSaving(true)

    await addTransaction({
      memberId,
      seasonId: activeSeason.id,
      eventId: eventId || '',
      categoriaId,
      puntos: Number(puntos),
      descripcion: descripcion || 'Ajuste manual',
      tipo: 'admin',
      creadoEn: Timestamp.now(),
      creadoPor: currentMember.id,
    })

    await refreshTransactions()
    toast('Ajuste registrado')
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-heading font-semibold text-lg">Ajuste de Puntos</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Miembro</label>
            <select className="input-field" value={memberId} onChange={e => setMemberId(e.target.value)}>
              {members.filter(m => m.activo).map(m => (
                <option key={m.id} value={m.id}>{m.nombre}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Categoria</label>
              <select className="input-field" value={categoriaId} onChange={e => setCategoriaId(e.target.value)}>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Puntos</label>
              <input type="number" className="input-field" value={puntos} onChange={e => setPuntos(e.target.value)} required placeholder="Ej: 15 o -5" />
            </div>
          </div>
          <div>
            <label className="label">Evento (opcional)</label>
            <select className="input-field" value={eventId} onChange={e => setEventId(e.target.value)}>
              <option value="">Sin evento</option>
              {events.map(ev => (
                <option key={ev.id} value={ev.id}>{ev.nombre}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Descripcion</label>
            <input className="input-field" value={descripcion} onChange={e => setDescripcion(e.target.value)} placeholder="Razon del ajuste" />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost">Cancelar</button>
            <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
              {saving ? 'Guardando...' : 'Registrar Ajuste'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
