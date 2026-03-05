interface Props {
  nombre: string
  photoURL?: string
  size?: 'sm' | 'lg'
}

export default function Avatar({ nombre, photoURL, size = 'sm' }: Props) {
  const initials = nombre
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')

  if (photoURL) {
    return (
      <img
        src={photoURL}
        alt={nombre}
        className={`${size === 'lg' ? 'w-14 h-14 rounded-2xl' : 'w-9 h-9 rounded-xl'} object-cover shrink-0`}
      />
    )
  }

  return <div className={size === 'lg' ? 'avatar avatar-lg' : 'avatar'}>{initials}</div>
}
