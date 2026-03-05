import { collection, getDocs, doc, setDoc, updateDoc, query, orderBy } from 'firebase/firestore'
import { db } from './config'
import type { PointCategory } from '../types'

const col = collection(db, 'pointCategories')

export async function getCategories(): Promise<PointCategory[]> {
  const q = query(col, orderBy('orden', 'asc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as PointCategory))
}

export async function updateCategory(id: string, data: Partial<PointCategory>): Promise<void> {
  await updateDoc(doc(db, 'pointCategories', id), data)
}

export async function seedCategories(): Promise<void> {
  const existing = await getDocs(col)
  if (!existing.empty) return

  const defaults: Omit<PointCategory, 'id'>[] = [
    { nombre: 'Asistencia reunion semanal', grupo: 'asistencia', puntosDefault: 5, icono: 'Calendar', orden: 1 },
    { nombre: 'Asistencia a evento', grupo: 'asistencia', puntosDefault: 10, icono: 'CalendarCheck', orden: 2 },
    { nombre: 'Gestion de topics', grupo: 'gestion', puntosDefault: 15, icono: 'MessageSquare', orden: 3 },
    { nombre: 'Visita a universidad/institucion', grupo: 'gestion', puntosDefault: 20, icono: 'School', orden: 4 },
    { nombre: 'Gestion de regalos/swag', grupo: 'gestion', puntosDefault: 20, icono: 'Gift', orden: 5 },
    { nombre: 'Gestion de speaker', grupo: 'gestion', puntosDefault: 25, icono: 'Mic', orden: 6 },
    { nombre: 'Conseguir patrocinador', grupo: 'gestion', puntosDefault: 30, icono: 'Handshake', orden: 7 },
  ]

  for (const cat of defaults) {
    const ref = doc(col, `default-${cat.orden}`)
    await setDoc(ref, cat)
  }
}
