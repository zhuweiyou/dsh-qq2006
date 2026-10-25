/**
 * The skin center: a full settings page with the switch, four presets, the
 * typography option, and two working previews of the 2006 client.
 */
import { useState, type ReactNode } from 'react'

import { translate, useLocale } from '../i18n'
import { PALETTES, PRESET_LIST, type PresetId } from '../presets'
import { skinStore, useSkin } from '../store'
import type { ClientContext } from '../types'
import { ChatWindowPreview } from './ChatWindow'
import { LoginWindowPreview } from './LoginWindow'
import { Penguin, SkinSwitch } from './ui'

/** The settings section page. */
export function SkinPage(props: { ctx: ClientContext }): ReactNode {
  const { ctx } = props
  const state = useSkin()
  const t = translate(useLocale(ctx))
  const [tab, setTab] = useState<'chat' | 'login'>('chat')
  const palette = PALETTES[state.preset]

  return (
    <div className="qq06-page">
      <header className="qq06-page-head">
        <div className="qq06-kicker">{t('外观 · 第三方皮肤', 'Appearance · third-party skin')}</div>
        <h1 className="qq06-h1">
          {t('QQ2006 皮肤', 'QQ2006 skin')}
          <span className="qq06-h1-sub">2006</span>
        </h1>
        <p className="qq06-lead">
          {t(
            '把 DeepSeek Harness 的 Web 界面变回 2006 年的那个蓝色小企鹅：珊瑚蓝窗口、宋体、经典控件、聊天工具栏。皮肤只改本页外观，不影响任何功能与会话数据。',
            'Turns the DeepSeek Harness Web UI back into the blue penguin of 2006: coral-blue windows, SimSun text, classic controls and the chat toolbar. Presentation only — features and session data are untouched.',
          )}
        </p>
      </header>

      <section className={`qq06-card${state.enabled ? ' qq06-card--on' : ''}`}>
        <div className="qq06-card-head">
          <Penguin size={36} className="qq06-card-penguin" />
          <div className="qq06-card-heading">
            <h2 className="qq06-h2">
              {t('启用皮肤', 'Enable the skin')}
              <span className={`qq06-state${state.enabled ? ' qq06-state--on' : ''}`}>
                {state.enabled ? t('已开启', 'on') : t('已关闭', 'off')}
              </span>
            </h2>
            <p className="qq06-sub">
              {t(
                `当前配色：${palette.zh}。开启后立即套用到侧栏、标题行、对话框、输入框与滚动条。`,
                `Current palette: ${palette.en}. Applies to the sidebar, title row, dialogs, inputs and scrollbars immediately.`,
              )}
            </p>
          </div>
          <SkinSwitch
            checked={state.enabled}
            label={t('QQ2006 皮肤', 'QQ2006 skin')}
            onChange={(enabled) => skinStore.patch({ enabled })}
          />
        </div>

        <div className="qq06-card-body">
          <div className="qq06-field-label qq06-field-label--block">{t('配色预设', 'Palette')}</div>
          <div className="qq06-preset-grid" role="radiogroup" aria-label={t('配色预设', 'Palette')}>
            {PRESET_LIST.map((item) => (
              <button
                key={item.id}
                type="button"
                role="radio"
                aria-checked={item.id === state.preset}
                className={`qq06-preset${item.id === state.preset ? ' qq06-preset--active' : ''}`}
                onClick={() => skinStore.patch({ preset: item.id as PresetId })}
              >
                <span
                  className="qq06-preset-thumb"
                  style={{ background: `linear-gradient(180deg, ${item.titleFrom}, ${item.titleTo})` }}
                >
                  <span className="qq06-preset-thumb-bar" />
                  <span className="qq06-preset-thumb-body" style={{ background: item.base }}>
                    <i style={{ background: item.sidebar }} />
                    <b style={{ background: `linear-gradient(180deg, #ffffff, ${item.layer2})` }} />
                  </span>
                </span>
                <span className="qq06-preset-name">{t(item.zh, item.en)}</span>
              </button>
            ))}
          </div>

          <label className="qq06-option">
            <input
              type="checkbox"
              checked={state.retroFont}
              onChange={(event) => skinStore.patch({ retroFont: event.target.checked })}
            />
            <span>
              {t('复古宋体', 'Retro SimSun text')}
              <em>{t('用 12px 宋体还原当年的排版；关闭则沿用系统字体设置。', 'Uses 12px SimSun like the original client; off keeps your Host font settings.')}</em>
            </span>
          </label>
        </div>
      </section>

      <section className="qq06-card">
        <div className="qq06-card-head qq06-card-head--plain">
          <div className="qq06-card-heading">
            <h2 className="qq06-h2">{t('效果预览', 'Preview')}</h2>
            <p className="qq06-sub">
              {t('原版素材按原生尺寸绘制，可直接在窗口里操作。', 'Drawn with the original artwork at native sizes — and it actually works.')}
            </p>
          </div>
          <div className="qq06-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'chat'}
              className={`qq06-tab${tab === 'chat' ? ' qq06-tab--active' : ''}`}
              onClick={() => setTab('chat')}
            >
              {t('聊天窗口', 'Chat window')}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'login'}
              className={`qq06-tab${tab === 'login' ? ' qq06-tab--active' : ''}`}
              onClick={() => setTab('login')}
            >
              {t('登录窗口', 'Login window')}
            </button>
          </div>
        </div>
        <div className="qq06-preview">
          {tab === 'chat' ? <ChatWindowPreview /> : <LoginWindowPreview />}
        </div>
      </section>

      <section className="qq06-card qq06-card--meta">
        <div className="qq06-meta-grid">
          <div>
            <h3 className="qq06-h3">{t('装到哪里了', 'Where it shows up')}</h3>
            <ul className="qq06-list">
              <li>{t('侧栏：企鹅图标与 QQ2006 名称', 'Sidebar: penguin mark and QQ2006 name')}</li>
              <li>{t('输入框：直角撑满整列，上方是原版小工具栏', 'Composer: square and edge-to-edge, with the original small toolbar above')}</li>
              <li>{t('设置 → 通用：本开关所在的行', 'Settings → General: the switch row')}</li>
              <li>{t('整站：配色、方角控件、经典滚动条与宋体', 'Shell-wide: palette, square controls, classic scrollbars, SimSun')}</li>
            </ul>
          </div>
          <div>
            <h3 className="qq06-h3">{t('开关与恢复', 'Toggle and reset')}</h3>
            <p className="qq06-sub">
              {t(
                '开关状态保存在本浏览器，刷新与重启后保持。关闭即完全恢复默认外观；「恢复默认」会清空配色与选项。',
                'The switch is stored in this browser and survives reloads. Turning it off restores the default look completely; Reset clears the palette and options.',
              )}
            </p>
            <button type="button" className="qq06-btn qq06-btn--wide" onClick={() => skinStore.reset()}>
              {t('恢复默认设置', 'Reset to defaults')}
            </button>
          </div>
        </div>
        <p className="qq06-fineprint">
          {t(
            '素材来自腾讯 QQ2006 原版客户端（经 mengkunsoft/QQ2006 整理），版权归腾讯公司所有，仅供学习交流，请勿商用。',
            'Artwork comes from the original Tencent QQ2006 client (collected by mengkunsoft/QQ2006); copyright Tencent. Learning and personal use only, no commercial use.',
          )}
        </p>
      </section>
    </div>
  )
}
