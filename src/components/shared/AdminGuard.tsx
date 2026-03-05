import { useAuth } from '../../context/AuthContext'

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useAuth()
  if (!isAdmin) return null
  return <>{children}</>
}
