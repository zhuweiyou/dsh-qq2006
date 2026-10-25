/**
 * Small shared chrome pieces: the square QQ switch and the preset dots.
 *
 * Everything is a real `<button>` with its own behaviour, so it never steals
 * focus inside someone else's settings panel.
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
