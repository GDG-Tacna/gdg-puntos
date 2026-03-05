import { useState } from 'react'
import { Users, Plus } from 'lucide-react'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import { useSeasonPoints } from '../hooks/useSeasonPoints'
import AdminGuard from '../components/shared/AdminGuard'
import MemberList from '../components/members/MemberList'
import AddMemberModal from '../components/members/AddMemberModal'

export default function MembersPage() {
  const { members, loading } = useData()
  const { isAdmin } = useAuth()
  const { leaderboard } = useSeasonPoints()
  const [showAdd, setShowAdd] = useState(false)

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="skeleton h-20 w-full" />
        ))}
      </div>
    )
  }

  return (
    <div className="p-2 md:p-4 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users size={24} className="text-primary" />
          <h1 className="font-heading font-bold text-xl">Miembros</h1>
          <span className="text-sm text-text-muted">({members.length})</span>
        </div>
        <AdminGuard>
          <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Agregar
          </button>
        </AdminGuard>
      </div>

      <MemberList members={members} scores={leaderboard} />

      {showAdd && isAdmin && <AddMemberModal onClose={() => setShowAdd(false)} />}
    </div>
  )
}
