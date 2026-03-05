import { useState } from 'react'
import { X } from 'lucide-react'
import { Timestamp } from 'firebase/firestore'
import { addMember } from '../../firebase/members'
import { useData } from '../../context/DataContext'
import { useToast } from '../shared/Toast'
import type { Member } from '../../types'

interface Props {
  onClose: () => void
}

export default function AddMemberModal({ onClose }: Props) {
  const { setMembers, members } = useData()
  const { toast } = useToast()
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [rol, setRol] = useState<'admin' | 'miembro'>('miembro')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombre || !email) return
    setSaving(true)

    const data: Omit<Member, 'id'> = {
      uid: '',
      nombre,
      email,
      photoURL: '',
      rol,
      activo: true,
      creadoEn: Timestamp.now(),
    }

    const id = await addMember(data)
    setMembers([...members, { id, ...data }])
    toast('Miembro agregado')
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-heading font-semibold text-lg">Nuevo Miembro</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Nombre completo</label>
            <input className="input-field" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          </div>
          <div>
            <label className="label">Email (Gmail para Google Sign-In)</label>
            <input type="email" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="label">Rol</label>
            <select className="input-field" value={rol} onChange={(e) => setRol(e.target.value as 'admin' | 'miembro')}>
              <option value="miembro">Miembro</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost">Cancelar</button>
            <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
              {saving ? 'Guardando...' : 'Agregar Miembro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
