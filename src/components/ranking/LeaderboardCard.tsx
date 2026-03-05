import Avatar from '../shared/Avatar'
import type { MemberScore } from '../../hooks/useSeasonPoints'

interface Props {
  score: MemberScore
  rank: number
  maxPoints: number
}

const medalColors: Record<number, string> = {
  1: 'text-yellow-400',
  2: 'text-gray-300',
  3: 'text-amber-600',
}

export default function LeaderboardCard({ score, rank, maxPoints }: Props) {
  const pct = maxPoints > 0 ? (score.total / maxPoints) * 100 : 0

  return (
    <div className={`card p-4 animate-stagger-in ${rank <= 3 ? 'border-primary/20' : ''}`}
         style={{ animationDelay: `${rank * 50}ms` }}>
      <div className="flex items-center gap-4">
        <span className={`font-heading font-bold text-lg w-8 text-center ${medalColors[rank] ?? 'text-text-muted'}`}>
          {rank <= 3 ? ['', '1st', '2nd', '3rd'][rank] : `#${rank}`}
        </span>

        <Avatar nombre={score.nombre} photoURL={score.photoURL} />

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text-primary truncate">{score.nombre}</p>
          <div className="flex gap-3 mt-1 text-xs text-text-muted">
            <span>Asistencia: {score.asistencia}</span>
            <span>Gestion: {score.gestion}</span>
          </div>
          <div className="progress-bar mt-2">
            <div
              className="progress-bar-fill bg-primary"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <div className="text-right">
          <span className="font-heading font-bold text-xl text-primary">{score.total}</span>
          <p className="text-[10px] text-text-muted uppercase">pts</p>
        </div>
      </div>
    </div>
  )
}
