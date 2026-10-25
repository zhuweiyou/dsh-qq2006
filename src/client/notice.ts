/**
 * One transient text notice, shown from non-React code.
 *
 * The theme guard lives in `index.tsx` (it reacts to a Cordis event), while the
 * banner is a slot component. This tiny store is the bridge: `showNotice` from
 * the guard, `useNotice` inside the component.
 */
import { useSyncExternalStore } from 'react'

/** A notice currently on screen. */
export interface Notice {
  /** Monotonic id, so a repeated message restarts the animation. */
  id: number
  text: string
}

/** How long a notice stays visible. */
const NOTICE_MS = 4200

let current: Notice | null = null
let sequence = 0
let timer: ReturnType<typeof setTimeout> | null = null
const listeners = new Set<() => void>()

/** Notify every subscriber. */
function emit(): void {
  for (const listener of listeners) listener()
}

/**
 * Show one notice, replacing any visible one.
 * @param text - already-localized message.
 */
export function showNotice(text: string): void {
  sequence += 1
  current = { id: sequence, text }
  emit()
  if (timer !== null) clearTimeout(timer)
  timer = setTimeout(() => {
    timer = null
    current = null
    emit()
  }, NOTICE_MS)
}

/** Remove the notice and cancel its timer. */
export function dismissNotice(): void {
  if (timer !== null) {
    clearTimeout(timer)
    timer = null
  }
  if (current !== null) {
    current = null
    emit()
  }
}

/** Subscribe to notice changes. */
function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/** Read the current notice. */
function get(): Notice | null {
  return current
}

/**
 * React binding for the notice.
 * @returns the visible notice, or `null`.
 */
export function useNotice(): Notice | null {
  return useSyncExternalStore(subscribe, get, get)
}
