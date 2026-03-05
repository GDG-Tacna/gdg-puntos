import { useState } from 'react'
import { History, Plus } from 'lucide-react'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import SeasonSelector from '../components/shared/SeasonSelector'
import AdminGuard from '../components/shared/AdminGuard'
import TransactionTable from '../components/history/TransactionTable'
import TransactionCard from '../components/history/TransactionCard'
import TransactionFilters from '../components/history/TransactionFilters'
import AddAdjustmentModal from '../components/history/AddAdjustmentModal'

export default function HistoryPage() {
  const { transactions, members, categories, events, loading } = useData()
  const { isAdmin } = useAuth()
  const [selectedMember, setSelectedMember] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [showAdjustment, setShowAdjustment] = useState(false)

  const filtered = transactions.filter(tx => {
    if (selectedMember && tx.memberId !== selectedMember) return false
    if (selectedCategory && tx.categoriaId !== selectedCategory) return false
    return true
  })

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="skeleton h-16 w-full" />
        ))}
      </div>
    )
  }

  return (
    <div className="p-2 md:p-4 max-w-full mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <History size={24} className="text-primary" />
          <h1 className="font-heading font-bold text-xl">Historial</h1>
          <span className="text-sm text-text-muted">({filtered.length})</span>
        </div>
        <div className="flex items-center gap-3">
          <SeasonSelector />
          <AdminGuard>
            <button onClick={() => setShowAdjustment(true)} className="btn-primary flex items-center gap-2">
              <Plus size={16} /> Ajuste
            </button>
          </AdminGuard>
        </div>
      </div>

      <div className="mb-4">
        <TransactionFilters
          members={members}
          categories={categories}
          selectedMember={selectedMember}
          selectedCategory={selectedCategory}
          onMemberChange={setSelectedMember}
          onCategoryChange={setSelectedCategory}
        />
      </div>

      <TransactionTable transactions={filtered} members={members} categories={categories} events={events} />

      <div className="md:hidden space-y-2">
        {filtered.length === 0 ? (
          <div className="card p-6 text-center">
            <p className="text-text-muted text-sm">Sin transacciones</p>
          </div>
        ) : (
          filtered.map((tx) => (
            <TransactionCard
              key={tx.id}
              tx={tx}
              member={members.find(m => m.id === tx.memberId)}
              category={categories.find(c => c.id === tx.categoriaId)}
              event={events.find(e => e.id === tx.eventId)}
            />
          ))
        )}
      </div>

      {showAdjustment && isAdmin && <AddAdjustmentModal onClose={() => setShowAdjustment(false)} />}
    </div>
  )
}
