import { useState } from 'react'
import { Timestamp } from 'firebase/firestore'
import { updateEvent } from '../../firebase/events'
import { addTransaction, deleteTransaction } from '../../firebase/transactions'
import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../shared/Toast'
import Avatar from '../shared/Avatar'
import type { GDGEvent } from '../../types'

interface Props {
  event: GDGEvent
  onChange: (updated: GDGEvent) => void
}

export default function AttendanceChecklist({ event, onChange }: Props) {
  const { members, categories, activeSeason, refreshTransactions } = useData()
  const { member: currentMember } = useAuth()
  const { toast } = useToast()
  const [saving, setSaving] = useState<string | null>(null)

  const attendanceCat = categories.find(
    c => c.grupo === 'asistencia' && (event.tipo === 'evento' ? c.nombre.includes('evento') : c.nombre.includes('reunion'))
  )

  const toggleAttendance = async (memberId: string) => {
    if (!attendanceCat || !activeSeason || !currentMember) return
    setSaving(memberId)

    const isPresent = event.asistentes.includes(memberId)
    const newAsistentes = isPresent
      ? event.asistentes.filter(id => id !== memberId)
      : [...event.asistentes, memberId]

    const txId = `${memberId}_${event.id}_${attendanceCat.id}`

    await updateEvent(event.id, { asistentes: newAsistentes })

    if (isPresent) {
      await deleteTransaction(txId)
    } else {
      await addTransaction({
        memberId,
        seasonId: activeSeason.id,
        eventId: event.id,
        categoriaId: attendanceCat.id,
        puntos: attendanceCat.puntosDefault,
        descripcion: `Asistencia: ${event.nombre}`,
        tipo: 'auto',
        creadoEn: Timestamp.now(),
        creadoPor: currentMember.id,
      }, txId)
    }

    const updated = { ...event, asistentes: newAsistentes }
    onChange(updated)
    await refreshTransactions()
    toast(isPresent ? 'Asistencia removida' : 'Asistencia registrada')
    setSaving(null)
  }

  return (
    <div className="space-y-2">
      <h3 className="section-header text-sm font-heading font-semibold text-text-secondary">
        Asistencia ({event.asistentes.length}/{members.filter(m => m.activo).length})
      </h3>
      <div className="space-y-1">
        {members.filter(m => m.activo).map((m) => {
          const isPresent = event.asistentes.includes(m.id)
          return (
            <label
              key={m.id}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                isPresent ? 'bg-success/5 border border-success/20' : 'hover:bg-bg-hover'
              }`}
            >
              <input
                type="checkbox"
                className="checkbox-custom"
                checked={isPresent}
                onChange={() => toggleAttendance(m.id)}
                disabled={saving === m.id}
              />
              <Avatar nombre={m.nombre} photoURL={m.photoURL} />
              <span className="text-sm text-text-primary">{m.nombre}</span>
              {saving === m.id && (
                <div className="ml-auto w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              )}
            </label>
          )
        })}
      </div>
    </div>
  )
}
