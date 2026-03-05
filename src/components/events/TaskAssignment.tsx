import { useState } from 'react'
import { Plus, Trash2, CheckCircle, Circle } from 'lucide-react'
import { Timestamp } from 'firebase/firestore'
import { updateEvent } from '../../firebase/events'
import { addTransaction, deleteTransaction } from '../../firebase/transactions'
import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../shared/Toast'
import type { GDGEvent, EventTask } from '../../types'

interface Props {
  event: GDGEvent
  onChange: (updated: GDGEvent) => void
}

export default function TaskAssignment({ event, onChange }: Props) {
  const { members, categories, activeSeason, refreshTransactions } = useData()
  const { member: currentMember } = useAuth()
  const { toast } = useToast()
  const gestionCats = categories.filter(c => c.grupo === 'gestion')

  const [showForm, setShowForm] = useState(false)
  const [categoriaId, setCategoriaId] = useState(gestionCats[0]?.id ?? '')
  const [memberId, setMemberId] = useState(members[0]?.id ?? '')
  const [descripcion, setDescripcion] = useState('')

  const addTask = async () => {
    if (!categoriaId || !memberId) return
    const cat = categories.find(c => c.id === categoriaId)
    const task: EventTask = {
      id: crypto.randomUUID(),
      categoriaId,
      memberId,
      descripcion: descripcion || (cat?.nombre ?? ''),
      completada: false,
      puntos: cat?.puntosDefault ?? 0,
    }
    const newTareas = [...event.tareas, task]
    await updateEvent(event.id, { tareas: newTareas })
    const updated = { ...event, tareas: newTareas }
    onChange(updated)
    toast('Tarea asignada')
    setDescripcion('')
    setShowForm(false)
  }

  const toggleTask = async (taskId: string) => {
    if (!activeSeason || !currentMember) return
    const newTareas = event.tareas.map(t => {
      if (t.id !== taskId) return t
      return { ...t, completada: !t.completada }
    })
    await updateEvent(event.id, { tareas: newTareas })

    const task = event.tareas.find(t => t.id === taskId)!
    const txId = `${task.memberId}_${event.id}_${task.categoriaId}_${taskId}`

    if (!task.completada) {
      await addTransaction({
        memberId: task.memberId,
        seasonId: activeSeason.id,
        eventId: event.id,
        categoriaId: task.categoriaId,
        puntos: task.puntos,
        descripcion: task.descripcion,
        tipo: 'auto',
        creadoEn: Timestamp.now(),
        creadoPor: currentMember.id,
      }, txId)
    } else {
      await deleteTransaction(txId)
    }

    const updated = { ...event, tareas: newTareas }
    onChange(updated)
    await refreshTransactions()
    toast(task.completada ? 'Tarea desmarcada' : 'Tarea completada')
  }

  const removeTask = async (taskId: string) => {
    const task = event.tareas.find(t => t.id === taskId)!
    const newTareas = event.tareas.filter(t => t.id !== taskId)
    await updateEvent(event.id, { tareas: newTareas })
    if (task.completada) {
      const txId = `${task.memberId}_${event.id}_${task.categoriaId}_${taskId}`
      await deleteTransaction(txId)
      await refreshTransactions()
    }
    const updated = { ...event, tareas: newTareas }
    onChange(updated)
    toast('Tarea eliminada')
  }

  const getMemberName = (id: string) => members.find(m => m.id === id)?.nombre ?? 'Desconocido'
  const getCatName = (id: string) => categories.find(c => c.id === id)?.nombre ?? ''

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="section-header text-sm font-heading font-semibold text-text-secondary">
          Tareas de Gestion
        </h3>
        <button onClick={() => setShowForm(!showForm)} className="btn-ghost flex items-center gap-1 text-xs">
          <Plus size={14} /> Asignar
        </button>
      </div>

      {showForm && (
        <div className="card p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Categoria</label>
              <select className="input-field text-sm" value={categoriaId} onChange={e => setCategoriaId(e.target.value)}>
                {gestionCats.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre} ({c.puntosDefault}pts)</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Miembro</label>
              <select className="input-field text-sm" value={memberId} onChange={e => setMemberId(e.target.value)}>
                {members.filter(m => m.activo).map(m => (
                  <option key={m.id} value={m.id}>{m.nombre}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Descripcion (opcional)</label>
            <input className="input-field" value={descripcion} onChange={e => setDescripcion(e.target.value)} placeholder="Detalle de la tarea" />
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowForm(false)} className="btn-ghost text-xs">Cancelar</button>
            <button onClick={addTask} className="btn-primary text-xs">Agregar Tarea</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {event.tareas.length === 0 ? (
          <p className="text-xs text-text-muted py-2">Sin tareas asignadas</p>
        ) : (
          event.tareas.map((task) => (
            <div key={task.id} className={`flex items-center gap-3 p-3 rounded-xl ${task.completada ? 'bg-success/5 border border-success/20' : 'bg-bg-card border border-border'}`}>
              <button onClick={() => toggleTask(task.id)} className="shrink-0">
                {task.completada ? (
                  <CheckCircle size={18} className="text-success" />
                ) : (
                  <Circle size={18} className="text-text-muted" />
                )}
              </button>
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${task.completada ? 'line-through text-text-muted' : 'text-text-primary'}`}>
                  {task.descripcion}
                </p>
                <p className="text-xs text-text-muted">{getMemberName(task.memberId)} · {getCatName(task.categoriaId)} · {task.puntos}pts</p>
              </div>
              <button onClick={() => removeTask(task.id)} className="text-text-muted hover:text-danger shrink-0">
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
