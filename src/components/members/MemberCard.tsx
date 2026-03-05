import { useNavigate } from 'react-router-dom'
import Avatar from '../shared/Avatar'
import type { Member } from '../../types'

interface Props {
  member: Member
  points: number
  rank: number
}

export default function MemberCard({ member, points, rank }: Props) {
  const navigate = useNavigate()

  return (
    <div
      className="card-interactive p-4 cursor-pointer"
      onClick={() => navigate(`/miembros/${member.id}`)}
    >
      <div className="flex items-center gap-3">
        <Avatar nombre={member.nombre} photoURL={member.photoURL} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text-primary truncate">{member.nombre}</p>
          <p className="text-xs text-text-muted">{member.email}</p>
        </div>
        <div className="text-right">
          <span className="font-heading font-bold text-primary">{points}</span>
          <p className="text-[10px] text-text-muted">#{rank} pts</p>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-3">
        <span className={`badge text-[10px] ${member.rol === 'admin' ? '' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'}`}>
          {member.rol}
        </span>
        {!member.activo && (
          <span className="badge text-[10px] bg-danger/10 border-danger/20 text-danger">Inactivo</span>
        )}
      </div>
    </div>
  )
}
