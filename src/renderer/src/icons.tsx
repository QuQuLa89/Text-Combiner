interface IconProps {
  className?: string
}

const base = 'w-4 h-4'

export function PlusIcon({ className = base }: IconProps): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function TrashIcon({ className = base }: IconProps): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function DownloadIcon({ className = base }: IconProps): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 3v12m0 0-4-4m4 4 4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function FolderIcon({ className = base }: IconProps): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M3 6a1 1 0 0 1 1-1h5l2 2h9a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ChevronDownIcon({ className = base }: IconProps): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function CheckIcon({ className = base }: IconProps): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="m5 13 4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function PencilIcon({ className = base }: IconProps): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="m16.5 3.5 4 4L7 21l-4.5 1L3.5 17.5 16.5 3.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function DocumentIcon({ className = base }: IconProps): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M6 2h8l5 5v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M14 2v5h5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  )
}
