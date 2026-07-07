export function formatModified(mtimeMs: number): string {
  const date = new Date(mtimeMs)
  const now = new Date()
  const sameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()

  if (sameDay) {
    return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
  }

  const diffDays = Math.floor((now.getTime() - date.getTime()) / 86_400_000)
  if (diffDays >= 0 && diffDays < 7) {
    return date.toLocaleDateString(undefined, { weekday: 'short' })
  }

  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}
