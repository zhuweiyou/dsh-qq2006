/**
 * The slice of the Client Cordis context this plugin uses.
 *
 * Declared locally on purpose: the skin must not depend on
 * `@deepseek-ai/dsh-client-*` packages at runtime *or* at type level. Those
 * packages are part of the Host build, they change shape between releases, and
 * importing them is what made the previous iteration fail to load.
 *
 * Signatures here were read from the live runtime with `cordis_inspect_query`
 * (Client `Service` provider: `slots`, `theme`, `locale`).
 */
import type { ComponentType } from 'react'

import type { Palette } from './presets'

/** One token value for both palettes (`overrideTokens` wire shape). */
export interface ThemeTokenModes {
  light: string
  dark: string
}

/** Immutable theme snapshot exposed by the `theme` service. */
export interface ThemeSnapshot {
  /** `light` | `dark` | `system` for built-in preferences. */
  preference: string
  active: { id: string; colorScheme: 'light' | 'dark' }
}

/** Registry/override face of the `theme` service. */
export interface ThemeService {
  getTheme(): ThemeSnapshot
  setTheme(id: string): void
  overrideTokens(source: string, tokens: Record<string, ThemeTokenModes>): () => void
}

/** Immutable locale snapshot exposed by the `locale` service. */
export interface LocaleSnapshot {
  active: string
  revision: number
}

/** Read face of the `locale` service (optional peer). */
export interface LocaleService {
  getLocale(): LocaleSnapshot
  subscribe?(listener: () => void): () => void
}

/** Registration options accepted by `ctx.slots.register`. */
export interface SlotRegisterOptions {
  /** Exact slot key, for example `settings.general.item`. */
  name: string
  /**
   * Cell id inside that slot; reuse replaces the shipped occupant.
   *
   * List/keyed slots require it. Single slots accept no options at all beyond
   * `name`, because they hold exactly one occupant.
   */
  id?: string
  /** Ascending position. */
  order?: number
  /** Override weight for a single slot's shipped occupant (higher wins). */
  priority?: number
  /** Projected label (nav rows, tabs). */
  label?: string | (() => string)
  /** Owner-provided props factory, called with the binding key. */
  inject?: (...args: string[]) => Record<string, unknown>
}

/** Slot service: the only structural extension point of the Web shell. */
export interface SlotService {
  inject(key: string, callback: () => () => void): () => void
  register(options: SlotRegisterOptions, component: ComponentType<never> | ComponentType<Record<string, unknown>>): () => void
}

/** Client plugin context. */
export interface ClientContext {
  get(name: string): unknown
  effect(callback: () => (() => void) | void, label?: string): () => void
  on(name: string, listener: (...args: unknown[]) => void): () => void
  slots: SlotService
  theme: ThemeService
}

/** Everything a slot component needs from the plugin instance. */
export interface SkinContext {
  ctx: ClientContext
  palette(): Palette
}
