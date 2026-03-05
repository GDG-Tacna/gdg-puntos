import { NavLink } from 'react-router-dom'
import { Trophy, Calendar, Users, History, Settings } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { to: '/ranking', icon: Trophy, label: 'Ranking' },
  { to: '/eventos', icon: Calendar, label: 'Eventos' },
  { to: '/miembros', icon: Users, label: 'Miembros' },
  { to: '/historial', icon: History, label: 'Historial' },
  { to: '/configuracion', icon: Settings, label: 'Config', admin: true },
]

export default function BottomNav() {
  const { isAdmin } = useAuth()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-bg-sidebar/95 backdrop-blur-md border-t border-border">
      <div className="flex justify-around py-2 px-1">
        {navItems
          .filter((item) => !item.admin || isAdmin)
          .map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-colors text-[10px] font-medium ${
                  isActive ? 'text-primary' : 'text-text-muted'
                }`
              }
            >
              <item.icon size={20} />
              {item.label}
            </NavLink>
          ))}
      </div>
    </nav>
  )
}
