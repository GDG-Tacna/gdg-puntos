import { NavLink } from 'react-router-dom'
import { Trophy, Calendar, Users, History, Settings, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Avatar from '../shared/Avatar'

const navItems = [
  { to: '/ranking', icon: Trophy, label: 'Ranking' },
  { to: '/eventos', icon: Calendar, label: 'Eventos' },
  { to: '/miembros', icon: Users, label: 'Miembros' },
  { to: '/historial', icon: History, label: 'Historial' },
  { to: '/configuracion', icon: Settings, label: 'Configuracion', admin: true },
]

export default function Sidebar() {
  const { member, isAdmin, logout } = useAuth()

  return (
    <aside className="hidden md:flex flex-col w-64 bg-bg-sidebar border-r border-border h-screen sticky top-0">
      <div className="p-5 border-b border-border">
        <h1 className="font-heading font-bold text-lg text-primary">GDG Tacna</h1>
        <p className="text-xs text-text-muted mt-0.5">Sistema de Puntos</p>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems
          .filter((item) => !item.admin || isAdmin)
          .map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'nav-item-active' : 'nav-item-inactive'}`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
      </nav>

      {member && (
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3">
            <Avatar nombre={member.nombre} photoURL={member.photoURL} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">{member.nombre}</p>
              <p className="text-xs text-text-muted">{member.rol}</p>
            </div>
            <button onClick={logout} className="text-text-muted hover:text-danger transition-colors">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      )}
    </aside>
  )
}
