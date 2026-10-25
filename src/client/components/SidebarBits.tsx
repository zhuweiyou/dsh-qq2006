/**
 * Sidebar contributions: the penguin brand mark and the "QQ2006" name.
 *
 * They render nothing while the skin is off, so the default UI stays exactly as
 * shipped. Palette switching lives in Settings only.
 */
import type { ReactNode } from 'react'

import { useSkin } from '../store'
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

