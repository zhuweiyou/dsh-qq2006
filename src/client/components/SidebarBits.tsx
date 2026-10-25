/**
 * Sidebar contributions: the penguin brand mark, the "QQ2006" name and the
 * palette-cycling footer button (the 2006 title-bar colour button, moved to
 * where this shell has room for it).
 *
 * All three render nothing while the skin is off, so the default UI stays
 * exactly as shipped.
 */
import type { ReactNode } from 'react'

import { translate, useLocale } from '../i18n'
import { PALETTES, PRESET_LIST } from '../presets'
import { skinStore, useSkin } from '../store'
import type { ClientContext } from '../types'
import { Penguin } from './ui'

/** Replaces the brand mark while the skin is on. */
export function BrandMark(): ReactNode {
  const state = useSkin()
  if (!state.enabled) return null
  return (
    <span className="qq06-brand">
      <Penguin size={22} className="qq06-brand-penguin" />
    </span>
  )
}

/** Replaces the brand name while the skin is on. */
export function BrandName(): ReactNode {
  const state = useSkin()
  if (!state.enabled) return null
  return (
    <span className="qq06-brand-name">
      QQ2006
      <i className="qq06-brand-dot" />
    </span>
  )
}

/** Cycles the palette; the trigger sits beside Settings. */
export function FooterButton(props: { ctx: ClientContext }): ReactNode {
  const { ctx } = props
  const state = useSkin()
  const t = translate(useLocale(ctx))
  if (!state.enabled) return null

  const current = PRESET_LIST.findIndex((item) => item.id === state.preset)
  const next = PRESET_LIST[(current + 1) % PRESET_LIST.length] ?? PRESET_LIST[0]
  const label = t('换肤', 'Skin')

  return (
    <button
      type="button"
      className="qq06-footer-btn"
      title={`${label}：${PALETTES[state.preset]?.zh ?? ''} → ${next?.zh ?? ''}`}
      onClick={() => {
        if (next !== undefined) skinStore.patch({ preset: next.id })
      }}
    >
      <span className="qq06-footer-swatch" />
      <span className="qq06-footer-text">{label}</span>
    </button>
  )
}
