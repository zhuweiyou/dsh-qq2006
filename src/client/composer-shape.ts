/**
 * Square the composer card and let it span the conversation column.
 *
 * The Host renders the composer inside a rounded, inset, max-width card whose
 * class name is build-hashed by its CSS modules — not a public selector, and
 * exactly the kind of dependency that broke the previous iteration. This module
 * finds the card *structurally*: it starts at the composer editor and walks up,
 * tagging every wrapper that carries a visible corner radius. The outermost
 * tagged wrapper is then pulled sideways by exactly its container's horizontal
 * padding, so the card reaches the column edges without touching the container
 * that also lays out the message list.
 *
 * React may remount the composer (session switch, view change), which drops the
 * attributes, so a debounced MutationObserver re-applies them. Nothing is tagged
 * while the skin is off, and disposal removes every attribute and custom
 * property it added.
 */

/** Marks one composer wrapper that must lose its radius/inset. */
const SQUARE_ATTRIBUTE = 'data-qq06-square'

/** Marks the outermost wrapper, which is pulled out to the column edges. */
const PULL_ATTRIBUTE = 'data-qq06-pull'

/** Custom properties carrying the container padding to pull against. */
const PULL_LEFT = '--qq06-pull-left'
const PULL_RIGHT = '--qq06-pull-right'

/** How many ancestors above the editor may belong to the composer card. */
const MAX_DEPTH = 5

/** Mutation debounce: coalesces a streaming render, stays invisible. */
const SETTLE_MS = 90

/** A radius larger than this counts as "the card is rounded". */
const ROUNDED_PX = 2

/** Ignore absurd padding (a layout bug would otherwise tear the card out). */
const MAX_PULL_PX = 48

/**
 * Find the composer editor.
 *
 * Current builds use a Lexical `contenteditable`; older or plain variants may
 * use a wide textarea. Narrow textareas (the plugin's own previews) are ignored
 * so the walk never starts inside our own UI.
 * @returns the editor element, or `null`.
 */
function findEditor(): HTMLElement | null {
  const editable = document.querySelector<HTMLElement>('[contenteditable="true"]')
  if (editable !== null) return editable
  for (const candidate of document.querySelectorAll<HTMLTextAreaElement>('textarea')) {
    if (candidate.getBoundingClientRect().width > 240) return candidate
  }
  return null
}

/**
 * Start tagging the composer card.
 * @returns disposer that stops observing and removes every tag.
 */
export function squareComposer(): () => void {
  if (typeof document === 'undefined') return () => {}

  let timer: ReturnType<typeof setTimeout> | null = null
  let observer: MutationObserver | null = null
  let pulled: HTMLElement | null = null

  const tag = (element: HTMLElement | null, attribute: string): void => {
    if (element === null || element === document.body) return
    if (!element.hasAttribute(attribute)) element.setAttribute(attribute, '')
  }

  const clearPull = (): void => {
    if (pulled === null) return
    pulled.style.removeProperty(PULL_LEFT)
    pulled.style.removeProperty(PULL_RIGHT)
    pulled.removeAttribute(PULL_ATTRIBUTE)
    pulled = null
  }

  /**
   * Walk from the editor up to the first non-rounded wrapper.
   *
   * Every rounded ancestor on the way is part of the composer (inner editor
   * shell, then the card itself), so all of them are squared; only the outermost
   * one is pulled out by its container's padding.
   */
  const sync = (): void => {
    const editor = findEditor()
    if (editor === null) return

    let node: HTMLElement | null = editor.parentElement
    let outermost: HTMLElement | null = null

    for (let depth = 0; depth < MAX_DEPTH && node !== null; depth += 1) {
      const radius = Number.parseFloat(getComputedStyle(node).borderTopLeftRadius)
      if (Number.isFinite(radius) && radius > ROUNDED_PX) {
        tag(node, SQUARE_ATTRIBUTE)
        outermost = node
      }
      node = node.parentElement
    }

    if (outermost === null) {
      clearPull()
      return
    }
    if (pulled !== null && pulled !== outermost) clearPull()

    const container = outermost.parentElement
    if (container === null) return
    const style = getComputedStyle(container)
    const padLeft = Math.min(Number.parseFloat(style.paddingLeft) || 0, MAX_PULL_PX)
    const padRight = Math.min(Number.parseFloat(style.paddingRight) || 0, MAX_PULL_PX)

    if (padLeft === 0 && padRight === 0) {
      clearPull()
      return
    }
    if (pulled === null) {
      pulled = outermost
      pulled.setAttribute(PULL_ATTRIBUTE, '')
    }
    pulled.style.setProperty(PULL_LEFT, `-${padLeft}px`)
    pulled.style.setProperty(PULL_RIGHT, `-${padRight}px`)
  }

  const schedule = (): void => {
    if (timer !== null) return
    timer = setTimeout(() => {
      timer = null
      sync()
    }, SETTLE_MS)
  }

  window.addEventListener('resize', schedule)
  observer = new MutationObserver(schedule)
  observer.observe(document.body, { childList: true, subtree: true })

  // Tag immediately as well, so the first paint after enabling is already square.
  sync()

  return () => {
    observer?.disconnect()
    observer = null
    window.removeEventListener('resize', schedule)
    if (timer !== null) clearTimeout(timer)
    clearPull()
    for (const element of document.querySelectorAll(`[${SQUARE_ATTRIBUTE}]`)) {
      element.removeAttribute(SQUARE_ATTRIBUTE)
    }
  }
}
