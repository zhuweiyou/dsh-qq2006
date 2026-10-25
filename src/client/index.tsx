/**
 * Browser half of `dsh-qq2006`.
 *
 * ## Contract
 *
 * The Host loads `lib/client.js` as a plain script; the script registers one
 * lazy factory with `window.__ModuleLoader__.load({ id, factory })`. React comes
 * from the browser module table through the factory's `require`, so this package
 * never bundles a second React and never imports a Host client package.
 *
 * ## What the skin actually does
 *
 * 1. Injects one scoped stylesheet (`client.css`) for the plugin lifetime.
 * 2. Publishes the active palette + artwork as CSS custom properties on `body`.
 * 3. When enabled, sets `body[data-dsh-qq2006]`, forces the light preference and
 *    stacks a token layer through `ctx.theme.overrideTokens` — the sanctioned
 *    recolour path, so nothing is hardcoded over the Host's own palette.
 * 4. Registers four slots: the General-settings row, the skin-center page, the
 *    composer toolbar, and the sidebar brand mark/name (the last two only while
 *    the skin is on, so the shipped brand returns the moment it is switched off).
 *
 * Everything is created inside `apply` and disposed with `ctx.effect`, so
 * disabling the plugin (or HMR) leaves no stylesheet, attribute, token layer or
 * slot behind.
 *
 * @module dsh-qq2006/client
 */
import type { ReactNode } from 'react'

import { ASSET_VARIABLES } from './assets'
import { translateNow } from './i18n'
import { dismissNotice, showNotice } from './notice'
import { hostTokenVariables, paletteVariables, PALETTES, tokenOverrides } from './presets'
import { installStorageSync, skinStore } from './store'
import type { ClientContext } from './types'

import stylesheet from './client.css'
import { ComposerToolbar } from './components/ComposerToolbar'
import { BrandMark, BrandName } from './components/SidebarBits'
import { SkinPage } from './components/SkinPage'
import { SkinRow } from './components/SkinRow'
import { ThemeNotice } from './components/ThemeNotice'

/** This package's name: the ModuleLoader id and the token-layer source. */
const PACKAGE = 'dsh-qq2006'

/** Body attribute that scopes every skin rule in `client.css`. */
const SKIN_ATTRIBUTE = 'data-dsh-qq2006'

/** Second body attribute: the SimSun typography option. */
const FONT_ATTRIBUTE = 'data-dsh-qq2006-font'

/** `<style>` id used to de-duplicate the stylesheet. */
const STYLE_ID = `${PACKAGE}/client.css`

/** `<style>` id for the palette + artwork variables. */
const VARS_ID = `${PACKAGE}/vars.css`

/** Services this plugin cannot work without. */
export const inject = ['slots', 'theme']

/**
 * Render the variables stylesheet text.
 *
 * `overrideTokens` cannot carry artwork (it validates token names and colours),
 * and a dynamic bundle has no static asset route, so the data URLs travel
 * through one generated `body[data-dsh-qq2006]` block instead.
 * @param preset - active palette id.
 * @returns CSS text for the variables stylesheet.
 */
function variablesText(preset: keyof typeof PALETTES): string {
  const lines: string[] = []
  for (const [name, value] of Object.entries(ASSET_VARIABLES)) {
    lines.push(`  ${name}: url("${value}");`)
  }
  for (const [name, value] of Object.entries(paletteVariables(PALETTES[preset]))) {
    lines.push(`  ${name}: ${value};`)
  }
  // Same public token names the theme service documents, restated inside the
  // skin scope. `!important` keeps them authoritative even when the shell
  // re-applies a theme snapshot to the document.
  for (const [name, value] of Object.entries(hostTokenVariables(PALETTES[preset]))) {
    lines.push(`  ${name}: ${value} !important;`)
  }
  return `body[${SKIN_ATTRIBUTE}] {\n${lines.join('\n')}\n}\n`
}

/**
 * Insert (or refresh) the plugin stylesheet.
 * @returns disposer removing the tag.
 */
function mountStylesheet(): () => void {
  if (typeof document === 'undefined') return () => {}
  let tag = document.querySelector<HTMLStyleElement>(`style[data-plugin-css="${STYLE_ID}"]`)
  if (tag === null) {
    tag = document.createElement('style')
    tag.dataset.plugin = PACKAGE
    tag.dataset.pluginCss = STYLE_ID
    document.head.appendChild(tag)
  }
  tag.textContent = stylesheet
  const created = tag
  return () => {
    created.remove()
  }
}

/**
 * Insert (or refresh) the palette + artwork variables.
 * @param preset - active palette id.
 * @returns disposer removing the tag.
 */
function mountVariables(preset: keyof typeof PALETTES): () => void {
  if (typeof document === 'undefined') return () => {}
  let tag = document.querySelector<HTMLStyleElement>(`style[data-plugin-css="${VARS_ID}"]`)
  if (tag === null) {
    tag = document.createElement('style')
    tag.dataset.plugin = PACKAGE
    tag.dataset.pluginCss = VARS_ID
    document.head.appendChild(tag)
  }
  tag.textContent = variablesText(preset)
  const created = tag
  return () => {
    created.remove()
  }
}

/**
 * Activate the browser half.
 * @param ctx - Client Cordis context (slots + theme are guaranteed by `inject`).
 */
export function apply(ctx: ClientContext): void {
  // One stylesheet for the plugin's lifetime. Scoped rules only, so it can stay
  // mounted while the skin itself is switched off.
  ctx.effect(() => mountStylesheet(), `${PACKAGE}: stylesheet`)

  // Cross-tab sync for the switch and palette.
  ctx.effect(() => installStorageSync(), `${PACKAGE}: storage sync`)

  // The palette + artwork block exists only while the skin is on.
  ctx.effect(() => {
    let disposeVars: (() => void) | null = null
    const syncVars = (): void => {
      const state = skinStore.get()
      if (!state.enabled) {
        disposeVars?.()
        disposeVars = null
        return
      }
      if (disposeVars !== null) {
        // Re-rendering the same tag in place is cheaper than remove + insert.
        const tag = document.querySelector<HTMLStyleElement>(`style[data-plugin-css="${VARS_ID}"]`)
        if (tag !== null) tag.textContent = variablesText(state.preset)
        return
      }
      disposeVars = mountVariables(state.preset)
    }
    const off = skinStore.subscribe(syncVars)
    syncVars()
    return () => {
      off()
      disposeVars?.()
      disposeVars = null
    }
  }, `${PACKAGE}: variables`)

  // The actual skin: body attribute, light preference, token layer.
  ctx.effect(() => {
    let disposeTokens: (() => void) | null = null
    let restoreTheme: (() => void) | null = null

    /**
     * Keep the shell on the light palette while the skin is on.
     *
     * QQ2006 has exactly one palette, and the Host ships separate dark tokens
     * plus dark-only component rules (`body[data-ds-dark-theme] …`). Mixing them
     * with the skin leaves dark chips and menus on a light window, so the skin
     * pins the preference to `light` for as long as it is enabled — including
     * when the user picks dark afterwards. The last non-light choice is
     * remembered and restored the moment the skin is switched off.
     */
    const enforceLight = (notify: boolean): void => {
      if (!skinStore.get().enabled) return
      const current = ctx.theme.getTheme().preference
      if (current === 'light') return
      // Remember the newest non-light choice so switching the skin off restores
      // whatever the user last asked for.
      restoreTheme = () => {
        ctx.theme.setTheme(current)
      }
      ctx.theme.setTheme('light')
      if (!notify) return
      showNotice(
        translateNow(ctx)(
          'QQ2006 皮肤只支持浅色，要切换深色或跟随系统，请先关闭皮肤。',
          'The QQ2006 skin is light-only. Turn the skin off to use dark mode or follow the system.',
        ),
      )
    }

    const sync = (): void => {
      const body = document.body
      const state = skinStore.get()
      if (!state.enabled) {
        body.removeAttribute(SKIN_ATTRIBUTE)
        body.removeAttribute(FONT_ATTRIBUTE)
        disposeTokens?.()
        disposeTokens = null
        restoreTheme?.()
        restoreTheme = null
        return
      }

      body.setAttribute(SKIN_ATTRIBUTE, state.preset)
      if (state.retroFont) body.setAttribute(FONT_ATTRIBUTE, '1')
      else body.removeAttribute(FONT_ATTRIBUTE)

      enforceLight(false)

      // Same source id: calling again replaces the layer instead of stacking a
      // second one, which keeps memory and token order stable.
      disposeTokens = ctx.theme.overrideTokens(PACKAGE, tokenOverrides(PALETTES[state.preset]))
    }

    const offStore = skinStore.subscribe(sync)
    const offTheme = ctx.on('theme/change', () => enforceLight(true))
    sync()
    return () => {
      offStore()
      offTheme()
      disposeTokens?.()
      disposeTokens = null
      restoreTheme?.()
      restoreTheme = null
      dismissNotice()
      document.body.removeAttribute(SKIN_ATTRIBUTE)
      document.body.removeAttribute(FONT_ATTRIBUTE)
    }
  }, `${PACKAGE}: skin state`)

  // --- Slots ---------------------------------------------------------------
  // `settings.general.item`: one preference row beside the built-in
  // Appearance/Font-size rows. The owner projects no label; the row draws its
  // own copy and control.
  ctx.slots.inject('settings.general.item', () =>
    ctx.slots.register(
      { name: 'settings.general.item', id: 'qq2006', order: 120 },
      () => <SkinRow ctx={ctx} />,
    ),
  )

  // `settings.general.item`: the light-only hint. It renders just above the
  // Appearance row — inside the settings dialog, where the user actually clicks
  // the other appearance. The frame-wide overlay layer sits at z-index 20 while
  // the dialog is 1000, so a floating notice could never be visible there.
  ctx.slots.inject('settings.general.item', () =>
    ctx.slots.register({ name: 'settings.general.item', id: 'qq2006-theme-hint', order: 9 }, () => <ThemeNotice />),
  )

  // `settings.section`: the skin center page (switch, presets, working previews).
  ctx.slots.inject('settings.section', () =>
    ctx.slots.register(
      {
        name: 'settings.section',
        id: 'qq2006',
        order: 16,
        label: () => labelOf(ctx),
      },
      () => <SkinPage ctx={ctx} />,
    ),
  )

  // `conversation.input.dock`: the classic small toolbar above the composer.
  ctx.slots.inject('conversation.input.dock', () =>
    ctx.slots.register(
      { name: 'conversation.input.dock', id: 'qq2006-toolbar', order: 10 },
      () => <ComposerToolbar ctx={ctx} />,
    ),
  )

  // `sidebar.brand.mark` / `sidebar.brand.name`: penguin + QQ2006 wordmark.
  //
  // A `single` slot renders the lowest-`priority` occupant, so a permanent
  // priority:-1 entry would leave the brand row empty the moment the user turns
  // the skin off. These two are therefore registered only while it is on.
  registerWhileEnabled(ctx, 'sidebar.brand.mark', () => <BrandMark />)
  registerWhileEnabled(ctx, 'sidebar.brand.name', () => <BrandName />)


}

/**
 * Localized label for nav projections.
 *
 * The slot owner re-reads a label thunk on every render, so following the live
 * locale needs no re-registration.
 * @param ctx - client context.
 * @returns the label in the active language.
 */
function labelOf(ctx: ClientContext): string {
  const locale = ctx.get('locale') as { getLocale?: () => { active?: string } } | undefined
  const active = locale?.getLocale?.().active ?? 'zh'
  return active.toLowerCase().startsWith('en') ? 'QQ2006 skin' : 'QQ2006 皮肤'
}

/**
 * Keep a `single`-slot replacement installed only while the skin is on.
 *
 * `single` slots render their lowest-`priority` occupant, so a permanent
 * priority:-1 entry would shadow the shipped mark forever and leave the brand
 * row empty when the skin is switched off. Registering on enable and disposing
 * on disable keeps the default UI byte-for-byte untouched.
 * @param ctx - client context.
 * @param key - slot key.
 * @param component - replacement component.
 */
function registerWhileEnabled(ctx: ClientContext, key: string, component: () => ReactNode): void {
  ctx.effect(() => {
    let disposeEntry: (() => void) | null = null
    const offInject = ctx.slots.inject(key, () => {
      const sync = (): void => {
        if (skinStore.get().enabled) {
          if (disposeEntry === null) {
            disposeEntry = ctx.slots.register({ name: key, priority: -1 }, component)
          }
          return
        }
        if (disposeEntry !== null) {
          disposeEntry()
          disposeEntry = null
        }
      }
      const unsubscribe = skinStore.subscribe(sync)
      sync()
      return () => {
        unsubscribe()
        disposeEntry?.()
        disposeEntry = null
      }
    })
    return () => {
      offInject()
      disposeEntry?.()
      disposeEntry = null
    }
  }, `${PACKAGE}: single slot ${key}`)
}
