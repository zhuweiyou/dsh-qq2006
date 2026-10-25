/**
 * Small shared chrome pieces: the square QQ switch, the 24px title band and the
 * preset dots.
 *
 * Everything is a `<span>` or a real `<button>` with its own behaviour; the
 * title band is decorative, so it never steals focus inside someone else's
 * settings panel.
 */
import type { ReactNode } from 'react'

import { IMAGES } from '../assets'
import { PRESET_LIST, type Palette, type PresetId } from '../presets'

/** Square QQ2006-style switch. */
export function SkinSwitch(props: {
  checked: boolean
  onChange: (next: boolean) => void
  label: string
}): ReactNode {
  const { checked, onChange, label } = props
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={`qq06-switch${checked ? ' qq06-switch--on' : ''}`}
      onClick={() => onChange(!checked)}
    >
      <span className="qq06-switch-track">
        <span className="qq06-switch-knob" />
      </span>
      <span className="qq06-switch-text">{checked ? '已开启' : '已关闭'}</span>
    </button>
  )
}

/**
 * The 24px window title band.
 *
 * `panel` uses the original three-slice main-panel artwork (the left slice
 * carries the "QQ 2006" lettering); `chat` uses the rounded IM strip.
 */
export function TitleBar(props: { variant: 'panel' | 'chat'; title: string; icon?: boolean }): ReactNode {
  const { variant, title, icon = false } = props
  return (
    <div className={`qq06-title qq06-title--${variant}`} aria-hidden="true">
      <span className="qq06-title-left" />
      <span className="qq06-title-center" />
      <span className="qq06-title-right" />
      {icon ? <span className="qq06-title-icon" /> : null}
      <span className="qq06-title-text">{title}</span>
      <span className="qq06-title-btns">
        <span className="qq06-tbtn qq06-tbtn--min" />
        {variant === 'chat' ? <span className="qq06-tbtn qq06-tbtn--max" /> : <span className="qq06-tbtn qq06-tbtn--color" />}
        <span className="qq06-tbtn qq06-tbtn--close" />
      </span>
    </div>
  )
}

/** Four preset swatches. */
export function PresetDots(props: {
  value: PresetId
  onChange: (next: PresetId) => void
  titleOf?: (palette: Palette) => string
}): ReactNode {
  const { value, onChange, titleOf } = props
  return (
    <div className="qq06-dots" role="radiogroup" aria-label="QQ2006 配色">
      {PRESET_LIST.map((palette) => (
        <button
          key={palette.id}
          type="button"
          role="radio"
          aria-checked={palette.id === value}
          title={titleOf?.(palette) ?? palette.zh}
          className={`qq06-dot${palette.id === value ? ' qq06-dot--active' : ''}`}
          style={{ background: `linear-gradient(135deg, ${palette.titleFrom}, ${palette.titleTo})` }}
          onClick={() => onChange(palette.id)}
        >
          <span className="qq06-dot-dot" />
        </button>
      ))}
    </div>
  )
}

/** The penguin, at the two sizes the plugin uses. */
export function Penguin(props: { size?: number; className?: string }): ReactNode {
  const size = props.size ?? 22
  return (
    <img
      src={IMAGES.penguin}
      width={size}
      height={size}
      alt=""
      draggable={false}
      className={props.className ?? 'qq06-penguin'}
    />
  )
}
