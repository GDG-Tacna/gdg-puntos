import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { getTransactionsByMember } from '../firebase/transactions'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import { useSeasonPoints } from '../hooks/useSeasonPoints'
import Avatar from '../components/shared/Avatar'
import MemberPointsBreakdown from '../components/members/MemberPointsBreakdown'
import type { PointTransaction } from '../types'

export default function MemberProfilePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { members, categories, activeSeason } = useData()
  const { member: currentMember, isAdmin } = useAuth()
  const { leaderboard } = useSeasonPoints()
  const [txs, setTxs] = useState<PointTransaction[]>([])

  const member = members.find(m => m.id === id)
  const canView = isAdmin || currentMember?.id === id

  useEffect(() => {
    if (!id || !canView) return
    getTransactionsByMember(id, activeSeason?.id).then(setTxs)
  }, [id, activeSeason?.id, canView])

  if (!member) {
    return (
      <div className="p-6">
        <p className="text-text-muted">Miembro no encontrado</p>
      </div>
    )
  }

  if (!canView) {
    return (
      <div className="p-6">
        <p className="text-text-muted">No tienes permiso para ver este perfil</p>
      </div>
    )
  }

  const score = leaderboard.find(s => s.memberId === id)
  const rank = leaderboard.findIndex(s => s.memberId === id) + 1

  return (
    <div className="p-2 md:p-4 max-w-5xl mx-auto">
      <button onClick={() => navigate('/miembros')} className="btn-ghost flex items-center gap-2 mb-4">
        <ArrowLeft size={16} /> Volver
      </button>

      <div className="card p-5 mb-6">
        <div className="flex items-center gap-4">
          <Avatar nombre={member.nombre} photoURL={member.photoURL} size="lg" />
          <div className="flex-1">
            <h1 className="font-heading font-bold text-xl">{member.nombre}</h1>
            <p className="text-sm text-text-secondary">{member.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`badge text-xs ${member.rol === 'admin' ? '' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'}`}>
                {member.rol}
              </span>
              {rank > 0 && <span className="text-xs text-text-muted">#{rank} en el ranking</span>}
            </div>
          </div>
          <div className="text-right">
            <span className="font-heading font-bold text-3xl text-primary">{score?.total ?? 0}</span>
            <p className="text-xs text-text-muted">puntos</p>
          </div>
        </div>
      </div>

      <MemberPointsBreakdown transactions={txs} categories={categories} />
    </div>
  )
}
