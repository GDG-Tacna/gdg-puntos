import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Timestamp } from 'firebase/firestore'
import { addSeason, updateSeason } from '../../firebase/seasons'
import { useData } from '../../context/DataContext'
import { useToast } from '../shared/Toast'
import type { Season } from '../../types'

export default function SeasonManager() {
  const { seasons, setSeasons } = useData()
  const { toast } = useToast()
  const [showForm, setShowForm] = useState(false)
  const [nombre, setNombre] = useState('')
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')
  const [saving, setSaving] = useState(false)

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombre || !fechaInicio || !fechaFin) return
    setSaving(true)

    const data: Omit<Season, 'id'> = {
      nombre,
      fechaInicio: Timestamp.fromDate(new Date(fechaInicio)),
      fechaFin: Timestamp.fromDate(new Date(fechaFin)),
      activa: false,
      premios: [],
      creadoEn: Timestamp.now(),
    }

    const id = await addSeason(data)
    setSeasons(prev => [{ id, ...data }, ...prev])
    toast('Temporada creada')
    setShowForm(false)
    setNombre('')
    setFechaInicio('')
    setFechaFin('')
    setSaving(false)
  }

  const toggleActive = async (seasonId: string) => {
    for (const s of seasons) {
      if (s.activa) {
        await updateSeason(s.id, { activa: false })
      }
    }
    await updateSeason(seasonId, { activa: true })
    setSeasons(prev => prev.map(s => ({ ...s, activa: s.id === seasonId })))
    toast('Temporada activada')
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="section-header text-sm font-heading font-semibold text-text-secondary">
          Temporadas
        </h3>
        <button onClick={() => setShowForm(!showForm)} className="btn-ghost flex items-center gap-1 text-xs">
          {showForm ? <X size={14} /> : <Plus size={14} />}
          {showForm ? 'Cancelar' : 'Nueva'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="card p-4 space-y-3">
          <div>
            <label className="label">Nombre</label>
            <input className="input-field" value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Ej: GDG Tacna 2026-I" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Inicio</label>
              <input type="date" className="input-field" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} required />
            </div>
            <div>
              <label className="label">Fin</label>
              <input type="date" className="input-field" value={fechaFin} onChange={e => setFechaFin(e.target.value)} required />
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={saving} className="btn-primary text-xs disabled:opacity-50">
              {saving ? 'Creando...' : 'Crear Temporada'}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {seasons.map((s) => (
          <div key={s.id} className={`flex items-center justify-between p-3 rounded-xl border ${s.activa ? 'border-primary/30 bg-primary-soft' : 'border-border bg-bg-card'}`}>
            <div>
              <p className="text-sm font-medium text-text-primary">{s.nombre}</p>
              <p className="text-xs text-text-muted">
                {s.fechaInicio.toDate().toLocaleDateString('es-PE')} — {s.fechaFin.toDate().toLocaleDateString('es-PE')}
              </p>
            </div>
            {s.activa ? (
              <span className="badge">Activa</span>
            ) : (
              <button onClick={() => toggleActive(s.id)} className="btn-ghost text-xs">Activar</button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
