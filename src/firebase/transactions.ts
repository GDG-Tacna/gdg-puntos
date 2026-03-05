import { collection, getDocs, doc, setDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore'
import { db } from './config'
import type { PointTransaction } from '../types'

const col = collection(db, 'pointTransactions')

export async function getTransactions(seasonId?: string): Promise<PointTransaction[]> {
  const q = seasonId
    ? query(col, where('seasonId', '==', seasonId), orderBy('creadoEn', 'desc'))
    : query(col, orderBy('creadoEn', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as PointTransaction))
}

export async function getTransactionsByMember(memberId: string, seasonId?: string): Promise<PointTransaction[]> {
  const constraints = [where('memberId', '==', memberId)]
  if (seasonId) constraints.push(where('seasonId', '==', seasonId))
  const q = query(col, ...constraints)
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as PointTransaction))
}

export async function addTransaction(data: Omit<PointTransaction, 'id'>, customId?: string): Promise<string> {
  const ref = customId ? doc(db, 'pointTransactions', customId) : doc(col)
  await setDoc(ref, data)
  return ref.id
}

export async function deleteTransaction(id: string): Promise<void> {
  await deleteDoc(doc(db, 'pointTransactions', id))
}
