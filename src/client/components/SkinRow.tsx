/**
 * The General-section row: a compact QQ2006 switch with preset swatches.
 *
 * The slot owner projects no label and no props for `settings.general.item`, so
 * the row draws its own copy, state and control.
 */
import type { ReactNode } from 'react'

import { translate, useLocale } from '../i18n'
import { PALETTES } from '../presets'
import { skinStore, useSkin } from '../store'
import type { ClientContext } from '../types'
import { Penguin, PresetDots, SkinSwitch } from './ui'

/** One General preference row. */
export function SkinRow(props: { ctx: ClientContext }): ReactNode {
  const { ctx } = props
  const state = useSkin()
  const t = translate(useLocale(ctx))
  const palette = PALETTES[state.preset]

  return (
    <div className="qq06-row">
      <Penguin size={30} className="qq06-row-penguin" />
      <div className="qq06-row-main">
        <div className="qq06-row-title">
          {t('QQ2006 皮肤', 'QQ2006 skin')}
          <span className="qq06-tag">{t('怀旧', 'retro')}</span>
        </div>
        <div className="qq06-row-desc">
          {state.enabled
            ? t(`已启用 · ${palette.zh} · 珊瑚蓝窗口与宋体`, `On · ${palette.en} · coral-blue windows, SimSun text`)
            : t('珊瑚蓝窗口、宋体字、经典聊天工具栏；开启后整站生效', 'Coral-blue windows, SimSun text and the classic chat toolbar. Turns the whole UI retro.')}
        </div>
        <PresetDots
          value={state.preset}
          onChange={(preset) => skinStore.patch({ preset })}
          titleOf={(item) => (t(item.zh, item.en))}
        />
      </div>
      <SkinSwitch
        checked={state.enabled}
        label={t('QQ2006 皮肤', 'QQ2006 skin')}
        onChange={(enabled) => skinStore.patch({ enabled })}
      />
    </div>
  )
}
