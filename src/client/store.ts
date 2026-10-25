/**
 * Persistent skin state shared by every slot component.
 *
 * A single module-level store keeps the switch, the preset picker, the toolbar
 * and the settings page in lockstep, and `useSyncExternalStore` makes React
 * re-render on change without prop drilling. Persistence is per browser
 * (`localStorage`): the Host is deliberately untouched, so the plugin has no
 * settings-namespace peer to break when DSH changes its settings schema.
 */
import { useSyncExternalStore } from 'react'

import { toPresetId, type PresetId } from './presets'

/** Durable skin state. */
export interface SkinState {
  /** Whether the skin paints the shell at all. */
  enabled: boolean
  /** Active colour preset. */
  preset: PresetId
  /** Use the classic SimSun stack instead of the Host's font settings. */
  retroFont: boolean
}

/** `localStorage` key. Versioned so a future migration can ignore old shapes. */
export const STORAGE_KEY = 'dsh.qq2006.skin.v1'

/** State used before the user has ever chosen anything. */
export const DEFAULT_STATE: SkinState = Object.freeze({
  enabled: false,
  preset: 'classic' as PresetId,
  retroFont: true,
})

const listeners = new Set<() => void>()

/**
 * Read the persisted state.
 * @returns a complete state object; malformed fields fall back individually.
 */
function read(): SkinState {
  try {
    const raw = globalThis.localStorage?.getItem(STORAGE_KEY)
    if (raw === null || raw === undefined) return { ...DEFAULT_STATE }
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) return { ...DEFAULT_STATE }
    const record = parsed as Record<string, unknown>
    return {
      enabled: record.enabled === true,
      preset: toPresetId(record.preset),
      retroFont: record.retroFont !== false,
    }
  } catch {
    return { ...DEFAULT_STATE }
  }
}

let state: SkinState = read()

/** Write through to `localStorage`, ignoring private-mode failures. */
function persist(next: SkinState): void {
  try {
    globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // Storage disabled: the current page session still works.
  }
}

/** Notify every subscriber with a fresh snapshot object. */
function emit(): void {
  for (const listener of listeners) listener()
}

/** Read the current immutable snapshot. */
function get(): SkinState {
  return state
}

/**
 * Subscribe to state changes.
 * @param listener - change callback.
 * @returns unsubscribe.
 */
function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/**
 * Merge a partial update and publish it.
 * @param patch - fields to change.
 */
function patch(update: Partial<SkinState>): void {
  const next: SkinState = {
    enabled: update.enabled ?? state.enabled,
    preset: update.preset === undefined ? state.preset : toPresetId(update.preset),
    retroFont: update.retroFont ?? state.retroFont,
  }
  if (next.enabled === state.enabled && next.preset === state.preset && next.retroFont === state.retroFont) {
    return
  }
  state = next
  persist(next)
  emit()
}

/** Restore the defaults (and persist them). */
function reset(): void {
  state = { ...DEFAULT_STATE }
  persist(state)
  emit()
}

/**
 * Replace state from another browser tab.
 * @param value - raw shape read from a `storage` event.
 */
function adopt(value: SkinState): void {
  state = value
  emit()
}

/** The store singleton. */
export const skinStore = { get, subscribe, patch, reset, adopt } as const

/**
 * React binding for the store.
 * @returns the current state, re-rendering on change.
 */
export function useSkin(): SkinState {
  return useSyncExternalStore(subscribe, get, get)
}

/**
 * Keep several tabs consistent.
 *
 * `storage` only fires in *other* documents, so the writing tab never fights
 * itself; a malformed payload is ignored rather than resetting the skin.
 * @returns disposer removing the listener.
 */
export function installStorageSync(): () => void {
  if (typeof window === 'undefined') return () => {}
  const onStorage = (event: StorageEvent): void => {
    if (event.key !== STORAGE_KEY) return
    if (event.newValue === null) {
      adopt({ ...DEFAULT_STATE })
      return
    }
    try {
      const parsed = JSON.parse(event.newValue) as Record<string, unknown>
      adopt({
        enabled: parsed.enabled === true,
        preset: toPresetId(parsed.preset),
        retroFont: parsed.retroFont !== false,
      })
    } catch {
      // Ignore unrelated or corrupt values.
    }
  }
  window.addEventListener('storage', onStorage)
  return () => window.removeEventListener('storage', onStorage)
}
