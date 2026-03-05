import EventCard from './EventCard'
import type { GDGEvent } from '../../types'

interface Props {
  events: GDGEvent[]
}

export default function EventList({ events }: Props) {
  if (events.length === 0) {
    return (
      <div className="card p-8 text-center">
        <p className="text-text-muted text-sm">No hay eventos en esta temporada</p>
      </div>
    )
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  )
}
