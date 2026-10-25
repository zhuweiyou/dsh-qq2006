/**
 * Bilingual copy for the plugin's own surface.
 *
 * The Client `locale` service is an optional peer: when it exists we follow the
 * active language (and its live switches) through `ctx.get('locale')`; when it
 * does not, the plugin keeps its Chinese copy and never blocks activation.
 * Nothing is registered into the Host dictionary registry, so there is no
 * namespace to collide with and no cleanup to get wrong.
 */
import { useEffect, useState } from 'react'

import type { ClientContext } from './types'

/** Read the active locale id, or `zh` when the service is absent. */
function readActive(ctx: ClientContext): string {
  try {
    const locale = ctx.get('locale') as
      | { getLocale?: () => { active?: string }; subscribe?: (fn: () => void) => () => void }
      | undefined
    const active = locale?.getLocale?.().active
    return typeof active === 'string' ? active : 'zh'
  } catch {
    return 'zh'
  }
}

/**
 * Track the active locale.
 * @param ctx - client context.
 * @returns the active locale id.
 */
export function useLocale(ctx: ClientContext): string {
  const [active, setActive] = useState<string>(() => readActive(ctx))
  useEffect(() => {
    const locale = ctx.get('locale') as
      | { getLocale?: () => { active?: string }; subscribe?: (fn: () => void) => () => void }
      | undefined
    const sync = (): void => setActive(readActive(ctx))
    sync()
    const off = locale?.subscribe?.(sync)
    return () => {
      off?.()
    }
  }, [ctx])
  return active
}

/** Picker for a locale id. */
export type Translate = (zh: string, en: string) => string

/**
 * Build a `t(zh, en)` helper.
 * @param active - active locale id.
 * @returns the translate function.
 */
export function translate(active: string): Translate {
  const english = active.toLowerCase().startsWith('en')
  return (zh, en) => (english ? en : zh)
}

/**
 * Build a translator from the *current* locale, for non-React callers.
 * @param ctx - client context.
 * @returns the translate function.
 */
export function translateNow(ctx: ClientContext): Translate {
  return translate(readActive(ctx))
}
