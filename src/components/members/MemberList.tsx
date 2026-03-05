import MemberCard from './MemberCard'
import type { Member } from '../../types'
import type { MemberScore } from '../../hooks/useSeasonPoints'

interface Props {
  members: Member[]
  scores: MemberScore[]
}

export default function MemberList({ members, scores }: Props) {
  const getScore = (id: string) => scores.find(s => s.memberId === id)

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {members.map((m) => {
        const score = getScore(m.id)
        const rank = scores.findIndex(s => s.memberId === m.id) + 1
        return (
          <MemberCard key={m.id} member={m} points={score?.total ?? 0} rank={rank} />
        )
      })}
    </div>
  )
}
