/**
 * QQ2006 artwork, inlined as data URLs by the build.
 *
 * A dynamic client bundle runs in the browser with no file system and no static
 * route of its own, so every image the skin draws must travel inside
 * `client.js`. The subset here is tiny: the penguin and the eight 16×16 small
 * toolbar icons.
 *
 * Artwork: extracted from the original QQ2006 client, redistributed by
 * mengkunsoft/QQ2006. Learning and personal use only — see README.
 */
import smallCatch from '../assets/qq2006/im/IMSmallToolbarCatch.png'
import smallFace from '../assets/qq2006/im/IMSmallToolbarFace.png'
import smallFont from '../assets/qq2006/im/IMSmallToolbarFont.png'
import smallOther from '../assets/qq2006/im/IMSmallToolbarOtherContent.png'
import smallPicture from '../assets/qq2006/im/IMSmallToolbarPicture.png'
import smallPtt from '../assets/qq2006/im/IMSmallToolbarPtt.png'
import smallScene from '../assets/qq2006/im/IMSmallToolbarScene.png'
import smallSuperbag from '../assets/qq2006/im/IMSmallToolbarSuperbag.png'
import penguin from '../assets/qq2006/qq.png'

/** Direct image sources for `<img>` elements. */
export const IMAGES = {
  penguin,
} as const

/** CSS custom properties that carry the artwork into `client.css`. */
export const ASSET_VARIABLES: Record<string, string> = {
  '--qq-i-small-font': smallFont,
  '--qq-i-small-face': smallFace,
  '--qq-i-small-other': smallOther,
  '--qq-i-small-picture': smallPicture,
  '--qq-i-small-catch': smallCatch,
  '--qq-i-small-scene': smallScene,
  '--qq-i-small-bag': smallSuperbag,
  '--qq-i-small-ptt': smallPtt,
}
