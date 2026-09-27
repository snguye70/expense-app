const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }

export function BackIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M15 18l-6-6 6-6" {...stroke} />
    </svg>
  )
}

export function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" {...stroke} />
    </svg>
  )
}

export function MoreIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="5" cy="12" r="1.8" />
      <circle cx="12" cy="12" r="1.8" />
      <circle cx="19" cy="12" r="1.8" />
    </svg>
  )
}

export function ChevronIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 6l6 6-6 6" {...stroke} />
    </svg>
  )
}

export function DeleteIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21 5H9l-6 7 6 7h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1z" {...stroke} strokeWidth="1.8" />
      <path d="M17 9.5l-5 5M12 9.5l5 5" {...stroke} strokeWidth="1.8" />
    </svg>
  )
}

export function ScanIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2M8 12h8" {...stroke} />
    </svg>
  )
}

export function PlusIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 5v14M5 12h14" {...stroke} />
    </svg>
  )
}

export function FlashIcon({ on }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" {...stroke} fill={on ? 'currentColor' : 'none'} />
    </svg>
  )
}

export function ImageIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="3" {...stroke} strokeWidth="1.8" />
      <circle cx="9" cy="9" r="1.8" {...stroke} strokeWidth="1.8" />
      <path d="M21 15l-5-5L5 21" {...stroke} strokeWidth="1.8" />
    </svg>
  )
}

export function CheckIcon({ size = 16, width = 3 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7.5" {...stroke} strokeWidth={width} />
    </svg>
  )
}
