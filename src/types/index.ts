import type { Timestamp } from 'firebase/firestore'

export interface Member {
  id: string
  uid: string
  nombre: string
  email: string
  photoURL: string
  rol: 'admin' | 'miembro'
  activo: boolean
  creadoEn: Timestamp
}

export interface Season {
  id: string
  nombre: string
  fechaInicio: Timestamp
  fechaFin: Timestamp
  activa: boolean
  premios: string[]
  creadoEn: Timestamp
}

export interface EventTask {
  id: string
  categoriaId: string
  memberId: string
  descripcion: string
  completada: boolean
  puntos: number
}

export interface GDGEvent {
  id: string
  seasonId: string
  tipo: 'reunion' | 'evento'
  nombre: string
  fecha: Timestamp
  lugar: string
  asistentes: string[]
  tareas: EventTask[]
  creadoEn: Timestamp
}

export interface PointTransaction {
  id: string
  memberId: string
  seasonId: string
  eventId: string
  categoriaId: string
  puntos: number
  descripcion: string
  tipo: 'auto' | 'admin'
  creadoEn: Timestamp
  creadoPor: string
}

export interface PointCategory {
  id: string
  nombre: string
  grupo: 'asistencia' | 'gestion'
  puntosDefault: number
  icono: string
  orden: number
}
