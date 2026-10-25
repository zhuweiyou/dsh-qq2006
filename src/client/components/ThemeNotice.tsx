/**
 * The yellow system tip that explains why the appearance did not change.
 *
 * It is click-through and disappears on its own; the only interaction it needs
 * is being read.
 */
import type { ReactNode } from 'react'

import { useNotice } from '../notice'

/** Overlay notice. */
export function ThemeNotice(): ReactNode {
  const notice = useNotice()
  if (notice === null) return null
  return (
    <div className="qq06-notice" role="status" key={notice.id}>
      <span className="qq06-notice-icon" />
      <span>{notice.text}</span>
    </div>
  )
}
