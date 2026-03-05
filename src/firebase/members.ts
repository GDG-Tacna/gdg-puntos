import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore'
import { db } from './config'
import type { Member } from '../types'

const col = collection(db, 'members')

export async function getMembers(): Promise<Member[]> {
  const snap = await getDocs(col)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Member))
}

export async function getMemberByEmail(email: string): Promise<Member | null> {
  const q = query(col, where('email', '==', email))
  const snap = await getDocs(q)
  if (snap.empty) return null
  const d = snap.docs[0]
  return { id: d.id, ...d.data() } as Member
}

export async function addMember(data: Omit<Member, 'id'>): Promise<string> {
  const ref = doc(col)
  await setDoc(ref, data)
  return ref.id
}

export async function updateMember(id: string, data: Partial<Member>): Promise<void> {
  await updateDoc(doc(db, 'members', id), data)
}

export async function deleteMember(id: string): Promise<void> {
  await deleteDoc(doc(db, 'members', id))
}
