import { Trophy } from 'lucide-react'
import { useSeasonPoints } from '../hooks/useSeasonPoints'
import { useData } from '../context/DataContext'
import SeasonSelector from '../components/shared/SeasonSelector'
import LeaderboardCard from '../components/ranking/LeaderboardCard'

export default function DashboardPage() {
  const { activeSeason, loading } = useData()
  const { leaderboard, maxPoints } = useSeasonPoints()

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="skeleton h-20 w-full" />
        ))}
      </div>
    )
  }

  return (
    <div className="p-2 md:p-4 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Trophy size={24} className="text-primary" />
          <h1 className="font-heading font-bold text-xl">Ranking</h1>
        </div>
        <SeasonSelector />
      </div>

      {!activeSeason ? (
        <div className="card p-8 text-center">
          <p className="text-text-muted text-sm">No hay temporada activa. Crea una en Configuracion.</p>
        </div>
      ) : leaderboard.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-text-muted text-sm">Sin datos de puntos todavia</p>
        </div>
      ) : (
        <div className="space-y-3">
          {leaderboard.map((score, i) => (
            <LeaderboardCard key={score.memberId} score={score} rank={i + 1} maxPoints={maxPoints} />
          ))}
        </div>
      )}
    </div>
  )
}
