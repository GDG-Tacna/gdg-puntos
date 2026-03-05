import { Share2 } from 'lucide-react'
import { useToast } from '../shared/Toast'
import type { MemberScore } from '../../hooks/useSeasonPoints'

interface Props {
  leaderboard: MemberScore[]
  seasonName: string
}

export default function ShareButton({ leaderboard, seasonName }: Props) {
  const { toast } = useToast()

  const handleShare = () => {
    const medals = ['🥇', '🥈', '🥉']
    const lines = [
      `🏆 *Ranking ${seasonName}*`,
      '',
      ...leaderboard.slice(0, 10).map((s, i) => {
        const medal = medals[i] ?? `${i + 1}.`
        return `${medal} ${s.nombre} — ${s.total} pts`
      }),
      '',
      '📊 _GDG Tacna — Sistema de Puntos_',
    ]
    navigator.clipboard.writeText(lines.join('\n'))
    toast('Ranking copiado al portapapeles')
  }

  return (
    <button onClick={handleShare} className="btn-ghost flex items-center gap-2">
      <Share2 size={16} />
      Compartir
    </button>
  )
}
