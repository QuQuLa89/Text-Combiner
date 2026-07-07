interface StatusToastProps {
  message: string | null
  tone?: 'info' | 'error'
}

export function StatusToast({ message, tone = 'info' }: StatusToastProps): JSX.Element | null {
  if (!message) return null

  return (
    <div
      className={`pointer-events-none fixed bottom-4 left-1/2 -translate-x-1/2 rounded-md px-3 py-1.5 text-xs shadow-lg ${
        tone === 'error' ? 'bg-red-500/90 text-white' : 'bg-bg-tertiary text-text-primary'
      }`}
    >
      {message}
    </div>
  )
}
