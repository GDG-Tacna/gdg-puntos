import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, query, where, orderBy, getDoc } from 'firebase/firestore'
import { db } from './config'
import type { GDGEvent } from '../types'

const col = collection(db, 'events')

export async function getEvents(seasonId?: string): Promise<GDGEvent[]> {
  const q = seasonId
    ? query(col, where('seasonId', '==', seasonId), orderBy('fecha', 'desc'))
    : query(col, orderBy('fecha', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as GDGEvent))
}

export async function getEvent(id: string): Promise<GDGEvent | null> {
  const snap = await getDoc(doc(db, 'events', id))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as GDGEvent
}

export async function addEvent(data: Omit<GDGEvent, 'id'>): Promise<string> {
  const ref = doc(col)
  await setDoc(ref, data)
  return ref.id
}

export async function updateEvent(id: string, data: Partial<GDGEvent>): Promise<void> {
  await updateDoc(doc(db, 'events', id), data)
}

export async function deleteEvent(id: string): Promise<void> {
  await deleteDoc(doc(db, 'events', id))
}
