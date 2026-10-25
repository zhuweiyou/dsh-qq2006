/**
 * The four QQ2006 colour presets.
 *
 * Every preset keeps the same structural values (white lists, sunken inputs,
 * 1px blue borders) and only moves the coral-blue family, so switching a preset
 * can never produce an unreadable page.
 */

/** Preset ids, also used as the persisted value and the `data-dsh-qq2006` value. */
export const PRESET_IDS = ['classic', 'pink', 'mint', 'violet'] as const

/** One preset id. */
export type PresetId = (typeof PRESET_IDS)[number]

/** Full colour set for one preset. */
export interface Palette {
  id: PresetId
  /** Chinese label. */
  zh: string
  /** English label. */
  en: string
  /** Accent: links, switches, focus, brand marks. */
  brand: string
  /** Application base background. */
  base: string
  /** Nested surface. */
  layer2: string
  /** Subtle border. */
  border1: string
  /** Strong border. */
  border2: string
  /** Primary text. */
  label1: string
  /** Secondary text. */
  label2: string
  /** Sidebar column and title-row fill. */
  sidebar: string
  /** Window title band gradient stops. */
  titleFrom: string
  titleTo: string
  /** `--dsw-alias-state-*`. */
  success: string
  warn: string
  error: string
  idle: string
}

/** The classic coral blue of the 2006 client. */
const CLASSIC: Palette = {
  id: 'classic',
  zh: '经典蓝',
  en: 'Classic blue',
  brand: '#1f6fd0',
  base: '#e5f1fc',
  layer2: '#eff7fe',
  border1: '#a3c5e5',
  border2: '#6f9fd0',
  label1: '#10243a',
  label2: '#4a6b8a',
  sidebar: '#cde5f9',
  titleFrom: '#7fc9ff',
  titleTo: '#0b5cab',
  success: '#2f8f3f',
  warn: '#bd8300',
  error: '#b23b1e',
  idle: '#8698a8',
}

/** 2006-era pink skin. */
const PINK: Palette = {
  id: 'pink',
  zh: '粉红',
  en: 'Pink',
  brand: '#cf4f7d',
  base: '#fdf1f5',
  layer2: '#fdf7fa',
  border1: '#e8b7c9',
  border2: '#cd87a1',
  label1: '#3a1220',
  label2: '#8a5165',
  sidebar: '#f8dbe6',
  titleFrom: '#ffc2d7',
  titleTo: '#b53a63',
  success: '#2f8f3f',
  warn: '#bd8300',
  error: '#b23b1e',
  idle: '#a88a94',
}

/** 2006-era mint skin. */
const MINT: Palette = {
  id: 'mint',
  zh: '薄荷绿',
  en: 'Mint',
  brand: '#2f8f72',
  base: '#eef9f3',
  layer2: '#f5fcf8',
  border1: '#aad9c6',
  border2: '#74b79d',
  label1: '#0d2f24',
  label2: '#4b7568',
  sidebar: '#d5eee2',
  titleFrom: '#9fe6cb',
  titleTo: '#1f7357',
  success: '#2f8f3f',
  warn: '#bd8300',
  error: '#b23b1e',
  idle: '#7f9a90',
}

/** 2006-era violet skin. */
const VIOLET: Palette = {
  id: 'violet',
  zh: '紫罗兰',
  en: 'Violet',
  brand: '#6b5bd6',
  base: '#f3f1fd',
  layer2: '#f9f8fe',
  border1: '#c6bff0',
  border2: '#8f83d6',
  label1: '#1d1546',
  label2: '#5c5486',
  sidebar: '#e2ddf7',
  titleFrom: '#c3baff',
  titleTo: '#4b3fa8',
  success: '#2f8f3f',
  warn: '#bd8300',
  error: '#b23b1e',
  idle: '#8f8aa8',
}

/** All presets by id. */
export const PALETTES: Record<PresetId, Palette> = {
  classic: CLASSIC,
  pink: PINK,
  mint: MINT,
  violet: VIOLET,
}

/** Ordered presets for pickers. */
export const PRESET_LIST: readonly Palette[] = [CLASSIC, PINK, MINT, VIOLET]

/**
 * Narrow an arbitrary stored string to a preset id.
 * @param value - candidate from `localStorage`.
 * @returns a known preset id, defaulting to the classic skin.
 */
export function toPresetId(value: unknown): PresetId {
  return PRESET_IDS.includes(value as PresetId) ? (value as PresetId) : 'classic'
}

/**
 * Map a palette onto the Host's public alias tokens.
 *
 * Both modes receive the same values: QQ2006 has exactly one palette, and the
 * plugin forces the light preference while it is enabled (see `index.tsx`).
 * @param palette - active preset.
 * @returns token → `{ light, dark }` record for `theme.overrideTokens`.
 */
export function tokenOverrides(palette: Palette): Record<string, { light: string; dark: string }> {
  const both = (value: string) => ({ light: value, dark: value })
  return {
    '--dsw-alias-bg-base': both(palette.base),
    '--dsw-alias-bg-layer-1': both('#ffffff'),
    '--dsw-alias-bg-layer-2': both(palette.layer2),
    '--dsw-alias-bg-overlay': both('#ffffff'),
    '--dsw-alias-border-l1': both(palette.border1),
    '--dsw-alias-border-l2': both(palette.border2),
    '--dsw-alias-brand-primary': both(palette.brand),
    '--dsw-alias-label-primary': both(palette.label1),
    '--dsw-alias-label-secondary': both(palette.label2),
    '--dsw-alias-state-error-primary': both(palette.error),
    '--dsw-alias-state-idle-primary': both(palette.idle),
    '--dsw-alias-state-success-primary': both(palette.success),
    '--dsw-alias-state-warn-primary': both(palette.warn),
    '--dsw-specific-sidebar-fill': both(palette.sidebar),
  }
}

/**
 * The Host's public alias tokens for one palette, written into the skin's own
 * `body[data-dsh-qq2006]` block.
 *
 * `theme.overrideTokens` is still called (it is the sanctioned registry path),
 * but the scoped block is what guarantees the recolour: the Host publishes its
 * tokens on the document and re-publishes them when the theme snapshot changes,
 * so the skin states the same public token names once more inside its own
 * scope. No private token is touched.
 * @param palette - active preset.
 * @returns token → value record.
 */
export function hostTokenVariables(palette: Palette): Record<string, string> {
  return {
    '--dsw-alias-bg-base': palette.base,
    '--dsw-alias-bg-layer-1': '#ffffff',
    '--dsw-alias-bg-layer-2': palette.layer2,
    '--dsw-alias-bg-overlay': '#ffffff',
    '--dsw-alias-border-l1': palette.border1,
    '--dsw-alias-border-l2': palette.border2,
    '--dsw-alias-brand-primary': palette.brand,
    '--dsw-alias-label-primary': palette.label1,
    '--dsw-alias-label-secondary': palette.label2,
    '--dsw-alias-state-error-primary': palette.error,
    '--dsw-alias-state-idle-primary': palette.idle,
    '--dsw-alias-state-success-primary': palette.success,
    '--dsw-alias-state-warn-primary': palette.warn,
    '--dsw-specific-sidebar-fill': palette.sidebar,
  }
}

/**
 * CSS custom properties consumed by `client.css`.
 * @param palette - active preset.
 * @returns declarations without the selector.
 */
export function paletteVariables(palette: Palette): Record<string, string> {
  return {
    '--qq-brand': palette.brand,
    '--qq-base': palette.base,
    '--qq-layer2': palette.layer2,
    '--qq-border1': palette.border1,
    '--qq-border2': palette.border2,
    '--qq-label1': palette.label1,
    '--qq-label2': palette.label2,
    '--qq-sidebar': palette.sidebar,
    '--qq-title-from': palette.titleFrom,
    '--qq-title-to': palette.titleTo,
  }
}
