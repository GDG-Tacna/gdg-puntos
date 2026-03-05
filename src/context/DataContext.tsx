import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { getMembers } from '../firebase/members'
import { getSeasons } from '../firebase/seasons'
import { getCategories, seedCategories } from '../firebase/categories'
import { getEvents } from '../firebase/events'
import { getTransactions } from '../firebase/transactions'
import type { Member, Season, PointCategory, GDGEvent, PointTransaction } from '../types'

const FETCH_TIMEOUT = 8_000

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Tiempo de espera agotado')), ms)
    ),
  ])
}

interface DataContextValue {
  members: Member[]
  seasons: Season[]
  activeSeason: Season | null
  setActiveSeasonId: (id: string) => void
  categories: PointCategory[]
  events: GDGEvent[]
  transactions: PointTransaction[]
  loading: boolean
  error: string | null
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>
  setEvents: React.Dispatch<React.SetStateAction<GDGEvent[]>>
  setTransactions: React.Dispatch<React.SetStateAction<PointTransaction[]>>
  setSeasons: React.Dispatch<React.SetStateAction<Season[]>>
  setCategories: React.Dispatch<React.SetStateAction<PointCategory[]>>
  refreshTransactions: () => Promise<void>
}

const DataContext = createContext<DataContextValue | null>(null)

export function DataProvider({ children }: { children: ReactNode }) {
  const [members, setMembers] = useState<Member[]>([])
  const [seasons, setSeasons] = useState<Season[]>([])
  const [activeSeasonId, setActiveSeasonId] = useState<string>('')
  const [categories, setCategories] = useState<PointCategory[]>([])
  const [events, setEvents] = useState<GDGEvent[]>([])
  const [transactions, setTransactions] = useState<PointTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const activeSeason = seasons.find(s => s.id === activeSeasonId) ?? seasons.find(s => s.activa) ?? null

  const refreshTransactions = async () => {
    const txs = await getTransactions(activeSeason?.id)
    setTransactions(txs)
  }

  useEffect(() => {
    async function load() {
      try {
        await seedCategories()
        const [m, s, c] = await Promise.all([
          withTimeout(getMembers(), FETCH_TIMEOUT),
          withTimeout(getSeasons(), FETCH_TIMEOUT),
          withTimeout(getCategories(), FETCH_TIMEOUT),
        ])
        setMembers(m)
        setSeasons(s)
        setCategories(c)
        const active = s.find(ss => ss.activa)
        if (active) {
          setActiveSeasonId(active.id)
          const [ev, tx] = await Promise.all([
            getEvents(active.id),
            getTransactions(active.id),
          ])
          setEvents(ev)
          setTransactions(tx)
        }
      } catch (err) {
        console.error('[Firestore] Error loading data:', err)
        setError('No se pudieron cargar los datos. Verifica tu conexion.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  useEffect(() => {
    if (!activeSeasonId) return
    Promise.all([
      getEvents(activeSeasonId),
      getTransactions(activeSeasonId),
    ]).then(([ev, tx]) => {
      setEvents(ev)
      setTransactions(tx)
    })
  }, [activeSeasonId])

  return (
    <DataContext.Provider
      value={{
        members, seasons, activeSeason, setActiveSeasonId, categories,
        events, transactions, loading, error,
        setMembers, setEvents, setTransactions, setSeasons, setCategories,
        refreshTransactions,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used inside DataProvider')
  return ctx
}
