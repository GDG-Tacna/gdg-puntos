import { useMemo } from 'react'
import { useData } from '../context/DataContext'

export interface MemberScore {
  memberId: string
  nombre: string
  photoURL: string
  total: number
  asistencia: number
  gestion: number
}

export function useSeasonPoints() {
  const { members, transactions, categories, activeSeason } = useData()

  return useMemo(() => {
    const asistenciaIds = new Set(categories.filter(c => c.grupo === 'asistencia').map(c => c.id))

    const scores = new Map<string, MemberScore>()

    for (const m of members.filter(m => m.activo)) {
      scores.set(m.id, {
        memberId: m.id,
        nombre: m.nombre,
        photoURL: m.photoURL,
        total: 0,
        asistencia: 0,
        gestion: 0,
      })
    }

    for (const tx of transactions) {
      if (activeSeason && tx.seasonId !== activeSeason.id) continue
      const score = scores.get(tx.memberId)
      if (!score) continue
      score.total += tx.puntos
      if (asistenciaIds.has(tx.categoriaId)) {
        score.asistencia += tx.puntos
      } else {
        score.gestion += tx.puntos
      }
    }

    const leaderboard = Array.from(scores.values()).sort((a, b) => b.total - a.total)
    const maxPoints = leaderboard[0]?.total ?? 1

    return { leaderboard, maxPoints }
  }, [members, transactions, categories, activeSeason])
}
