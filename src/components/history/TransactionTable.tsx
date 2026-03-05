import type { PointTransaction, Member, PointCategory, GDGEvent } from '../../types'

interface Props {
  transactions: PointTransaction[]
  members: Member[]
  categories: PointCategory[]
  events: GDGEvent[]
}

export default function TransactionTable({ transactions, members, categories, events }: Props) {
  const getMember = (id: string) => members.find(m => m.id === id)
  const getCat = (id: string) => categories.find(c => c.id === id)
  const getEvent = (id: string) => events.find(e => e.id === id)

  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="table-header">Fecha</th>
            <th className="table-header">Miembro</th>
            <th className="table-header">Categoria</th>
            <th className="table-header">Evento</th>
            <th className="table-header">Descripcion</th>
            <th className="table-header text-right">Puntos</th>
            <th className="table-header">Tipo</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => {
            const fecha = tx.creadoEn.toDate().toLocaleDateString('es-PE', { day: 'numeric', month: 'short' })
            return (
              <tr key={tx.id} className="border-b border-border/50 hover:bg-bg-hover/30 transition-colors">
                <td className="px-5 py-3 text-sm text-text-secondary">{fecha}</td>
                <td className="px-5 py-3 text-sm text-text-primary">{getMember(tx.memberId)?.nombre ?? '-'}</td>
                <td className="px-5 py-3 text-sm text-text-secondary">{getCat(tx.categoriaId)?.nombre ?? '-'}</td>
                <td className="px-5 py-3 text-sm text-text-secondary">{getEvent(tx.eventId)?.nombre ?? '-'}</td>
                <td className="px-5 py-3 text-sm text-text-secondary truncate max-w-[200px]">{tx.descripcion}</td>
                <td className="px-5 py-3 text-sm font-heading font-bold text-right">
                  <span className={tx.puntos >= 0 ? 'text-success' : 'text-danger'}>
                    {tx.puntos > 0 ? '+' : ''}{tx.puntos}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <span className={`badge text-[10px] ${tx.tipo === 'admin' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' : ''}`}>
                    {tx.tipo}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
