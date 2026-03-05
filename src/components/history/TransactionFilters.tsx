import type { Member, PointCategory } from '../../types'

interface Props {
  members: Member[]
  categories: PointCategory[]
  selectedMember: string
  selectedCategory: string
  onMemberChange: (id: string) => void
  onCategoryChange: (id: string) => void
}

export default function TransactionFilters({ members, categories, selectedMember, selectedCategory, onMemberChange, onCategoryChange }: Props) {
  return (
    <div className="flex flex-wrap gap-3">
      <select
        className="input-field w-auto min-w-[150px]"
        value={selectedMember}
        onChange={(e) => onMemberChange(e.target.value)}
      >
        <option value="">Todos los miembros</option>
        {members.map((m) => (
          <option key={m.id} value={m.id}>{m.nombre}</option>
        ))}
      </select>
      <select
        className="input-field w-auto min-w-[150px]"
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
      >
        <option value="">Todas las categorias</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>{c.nombre}</option>
        ))}
      </select>
    </div>
  )
}
