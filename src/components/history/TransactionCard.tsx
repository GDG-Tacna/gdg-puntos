import type { PointTransaction, Member, PointCategory, GDGEvent } from '../../types'

interface Props {
  tx: PointTransaction
  member?: Member
  category?: PointCategory
  event?: GDGEvent
}

export default function TransactionCard({ tx, member, category, event }: Props) {
  const fecha = tx.creadoEn.toDate().toLocaleDateString('es-PE', {
    day: 'numeric', month: 'short',
  })

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-bg-card border border-border">
      <div className="flex-1 min-w-0">
        <p className="text-sm text-text-primary truncate">{tx.descripcion}</p>
        <p className="text-xs text-text-muted">
          {member?.nombre ?? 'Desconocido'} · {category?.nombre ?? ''} · {event?.nombre ?? ''} · {fecha}
        </p>
      </div>
      <div className="text-right shrink-0">
        <span className={`font-heading font-bold ${tx.puntos >= 0 ? 'text-success' : 'text-danger'}`}>
          {tx.puntos > 0 ? '+' : ''}{tx.puntos}
        </span>
        <p className="text-[10px] text-text-muted">{tx.tipo}</p>
      </div>
    </div>
  )
}
