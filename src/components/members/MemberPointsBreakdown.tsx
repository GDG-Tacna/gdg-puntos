import type { PointTransaction, PointCategory } from '../../types'

interface Props {
  transactions: PointTransaction[]
  categories: PointCategory[]
}

export default function MemberPointsBreakdown({ transactions, categories }: Props) {
  const grouped = categories.map(cat => {
    const txs = transactions.filter(t => t.categoriaId === cat.id)
    const total = txs.reduce((sum, t) => sum + t.puntos, 0)
    return { cat, count: txs.length, total }
  }).filter(g => g.count > 0)

  const totalPoints = transactions.reduce((sum, t) => sum + t.puntos, 0)

  return (
    <div className="space-y-3">
      <h3 className="section-header text-sm font-heading font-semibold text-text-secondary">
        Desglose de Puntos
      </h3>

      {grouped.length === 0 ? (
        <p className="text-xs text-text-muted">Sin puntos registrados</p>
      ) : (
        <div className="space-y-2">
          {grouped.map(({ cat, count, total }) => (
            <div key={cat.id} className="flex items-center justify-between p-3 rounded-xl bg-bg-hover/50">
              <div>
                <p className="text-sm text-text-primary">{cat.nombre}</p>
                <p className="text-xs text-text-muted">{count} {count === 1 ? 'vez' : 'veces'} · {cat.puntosDefault}pts c/u</p>
              </div>
              <span className="font-heading font-bold text-primary">{total}</span>
            </div>
          ))}
          <div className="flex items-center justify-between p-3 rounded-xl border border-primary/20 bg-primary-soft">
            <span className="font-heading font-semibold text-sm text-text-primary">Total</span>
            <span className="font-heading font-bold text-lg text-primary">{totalPoints}</span>
          </div>
        </div>
      )}
    </div>
  )
}
