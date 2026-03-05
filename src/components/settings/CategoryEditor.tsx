import { useState } from 'react'
import { Save } from 'lucide-react'
import { updateCategory } from '../../firebase/categories'
import { useData } from '../../context/DataContext'
import { useToast } from '../shared/Toast'

export default function CategoryEditor() {
  const { categories, setCategories } = useData()
  const { toast } = useToast()
  const [editing, setEditing] = useState<Record<string, number>>({})

  const handleSave = async (id: string) => {
    const pts = editing[id]
    if (pts === undefined) return
    await updateCategory(id, { puntosDefault: pts })
    setCategories(prev => prev.map(c => c.id === id ? { ...c, puntosDefault: pts } : c))
    setEditing(prev => {
      const next = { ...prev }
      delete next[id]
      return next
    })
    toast('Categoria actualizada')
  }

  return (
    <div className="space-y-3">
      <h3 className="section-header text-sm font-heading font-semibold text-text-secondary">
        Categorias de Puntos
      </h3>
      <div className="space-y-2">
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center gap-3 p-3 rounded-xl bg-bg-card border border-border">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text-primary">{cat.nombre}</p>
              <p className="text-xs text-text-muted capitalize">{cat.grupo}</p>
            </div>
            <input
              type="number"
              className="input-field w-20 text-center text-sm"
              defaultValue={cat.puntosDefault}
              onChange={(e) => setEditing(prev => ({ ...prev, [cat.id]: Number(e.target.value) }))}
            />
            {editing[cat.id] !== undefined && (
              <button onClick={() => handleSave(cat.id)} className="text-success hover:text-success/80">
                <Save size={16} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
