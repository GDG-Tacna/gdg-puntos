import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import type { User } from 'firebase/auth'
import { auth, googleProvider } from '../firebase/config'
import { getMemberByEmail, updateMember } from '../firebase/members'
import type { Member } from '../types'

interface AuthContextValue {
  user: User | null
  member: Member | null
  loading: boolean
  isAdmin: boolean
  login: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [member, setMember] = useState<Member | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser?.email) {
        const m = await getMemberByEmail(firebaseUser.email)
        if (m) {
          if (!m.uid) {
            await updateMember(m.id, {
              uid: firebaseUser.uid,
              photoURL: firebaseUser.photoURL ?? '',
            })
            m.uid = firebaseUser.uid
            m.photoURL = firebaseUser.photoURL ?? ''
          }
          setMember(m)
        } else {
          setMember(null)
        }
      } else {
        setMember(null)
      }
      setLoading(false)
    })
  }, [])

  const login = async () => {
    await signInWithPopup(auth, googleProvider)
  }

  const logout = async () => {
    await signOut(auth)
    setMember(null)
  }

  return (
    <AuthContext.Provider value={{ user, member, loading, isAdmin: member?.rol === 'admin', login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
