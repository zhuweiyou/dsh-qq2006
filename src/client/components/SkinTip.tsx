/**
 * The yellow system tip that announces a skin change (`shell.overlay`).
 *
 * It is purely informational and never captures the pointer, so it cannot get
 * in the way of the shell it is decorating.
 */
import { useEffect, useRef, useState, type ReactNode } from 'react'

import { translate, useLocale } from '../i18n'
import { PALETTES } from '../presets'
import { useSkin } from '../store'
import type { ClientContext } from '../types'

/** How long the tip stays on screen. */
const TIP_MS = 2400

/** Overlay tip. */
export function SkinTip(props: { ctx: ClientContext }): ReactNode {
  const { ctx } = props
  const state = useSkin()
  const t = translate(useLocale(ctx))
  const [text, setText] = useState<string | null>(null)
  const previous = useRef(state)
  const mounted = useRef(false)

  useEffect(() => {
    const before = previous.current
    previous.current = state
    if (!mounted.current) {
      // Never toast on page load: the skin restoring itself is not news.
      mounted.current = true
      return
    }
    let next: string | null = null
    if (state.enabled !== before.enabled) {
      next = state.enabled ? t('QQ2006 皮肤已启用', 'QQ2006 skin enabled') : t('已恢复默认外观', 'Default look restored')
    } else if (state.preset !== before.preset) {
      const palette = PALETTES[state.preset]
      next = `${t('换肤', 'Palette')}：${t(palette.zh, palette.en)}`
    }
    if (next === null) return
    setText(next)
    const timer = setTimeout(() => setText(null), TIP_MS)
    return () => clearTimeout(timer)
  }, [state, t])

  if (text === null) return null
  return (
    <div className="qq06-tip" role="status">
      <span className="qq06-tip-icon" />
      <span>{text}</span>
    </div>
  )
}
