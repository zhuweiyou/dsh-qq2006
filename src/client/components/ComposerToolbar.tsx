/**
 * The QQ2006 small toolbar above the composer (`conversation.input.dock`).
 *
 * Presentational only: every icon is a `<span>` with a title, because the real
 * composer already owns its actions. It exists so the most-used surface in the
 * app reads as a 2006 chat window without touching a single Host control.
 */
import type { ReactNode } from 'react'

import { translate, useLocale } from '../i18n'
import { PALETTES } from '../presets'
import { useSkin } from '../store'
import type { ClientContext } from '../types'

/** Icon key + Chinese/English tooltip. */
const TOOLS: readonly { key: string; zh: string; en: string }[] = [
  { key: 'font', zh: '字体', en: 'Font' },
  { key: 'face', zh: '表情', en: 'Emoticons' },
  { key: 'other', zh: '其他内容', en: 'More content' },
  { key: 'picture', zh: '发送图片', en: 'Send image' },
  { key: 'catch', zh: '截图', en: 'Screenshot' },
  { key: 'scene', zh: '场景', en: 'Scene' },
  { key: 'bag', zh: '魔法表情', en: 'Magic' },
  { key: 'ptt', zh: '语音', en: 'Voice' },
]

/** The toolbar strip. */
export function ComposerToolbar(props: { ctx: ClientContext }): ReactNode {
  const { ctx } = props
  const state = useSkin()
  const t = translate(useLocale(ctx))
  if (!state.enabled) return null
  const palette = PALETTES[state.preset]

  return (
    <div className="qq06-dock" aria-hidden="true">
      <span className="qq06-dock-lead">{t('聊天', 'Chat')}</span>
      {TOOLS.map((tool) => (
        <span key={tool.key} className={`qq06-dock-icon qq06-dock-icon--${tool.key}`} title={t(tool.zh, tool.en)} />
      ))}
      <span className="qq06-dock-spacer" />
      <span className="qq06-dock-meta">
        QQ2006 · {t(palette.zh, palette.en)}
      </span>
    </div>
  )
}
