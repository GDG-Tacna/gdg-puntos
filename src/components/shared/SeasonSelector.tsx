import { ChevronDown } from 'lucide-react'
import { useData } from '../../context/DataContext'

export default function SeasonSelector() {
  const { seasons, activeSeason, setActiveSeasonId } = useData()

  if (seasons.length === 0) return null

  return (
    <div className="relative">
      <select
        value={activeSeason?.id ?? ''}
        onChange={(e) => setActiveSeasonId(e.target.value)}
        className="input-field pr-10 appearance-none cursor-pointer text-sm"
      >
        {seasons.map((s) => (
          <option key={s.id} value={s.id}>
            {s.nombre}
          </option>
        ))}
      </select>
      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
    </div>
  )
}
