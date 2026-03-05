import { collection, getDocs, doc, setDoc, updateDoc, query, where, orderBy } from 'firebase/firestore'
import { db } from './config'
import type { Season } from '../types'

const col = collection(db, 'seasons')

export async function getSeasons(): Promise<Season[]> {
  const q = query(col, orderBy('fechaInicio', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Season))
}

export async function getActiveSeason(): Promise<Season | null> {
  const q = query(col, where('activa', '==', true))
  const snap = await getDocs(q)
  if (snap.empty) return null
  const d = snap.docs[0]
  return { id: d.id, ...d.data() } as Season
}

export async function addSeason(data: Omit<Season, 'id'>): Promise<string> {
  const ref = doc(col)
  await setDoc(ref, data)
  return ref.id
}

export async function updateSeason(id: string, data: Partial<Season>): Promise<void> {
  await updateDoc(doc(db, 'seasons', id), data)
}
