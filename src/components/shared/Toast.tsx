import { createContext, useContext, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import { Check } from 'lucide-react'

interface ToastData {
  id: number
  message: string
}

interface ToastContextValue {
  toast: (message: string) => void
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} })

export function useToast() {
  return useContext(ToastContext)
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([])

  const toast = useCallback((message: string) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 2000)
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-24 md:bottom-6 right-4 z-[60] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-2 bg-success/15 border border-success/30 text-success text-sm font-medium px-4 py-2.5 rounded-xl shadow-lg backdrop-blur-sm animate-slide-up pointer-events-auto"
          >
            <Check size={14} strokeWidth={3} />
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
