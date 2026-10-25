/**
 * QQ2006 artwork, inlined as data URLs by the build.
 *
 * A dynamic client bundle runs in the browser with no file system and no static
 * route of its own, so every image the skin draws must travel inside
 * `client.js`. The files are tiny (16x16 / 24x24 / 40x40), and the whole subset
 * costs well under 300 KiB before base64.
 *
 * Artwork: extracted from the original QQ2006 client, redistributed by
 * mengkunsoft/QQ2006. Learning and personal use only — see README.
 */
import avatarFriend from '../assets/qq2006/avatar/63.png'
import avatarMe from '../assets/qq2006/avatar/1.png'
import colorDown from '../assets/qq2006/ColorButton_Down.png'
import colorHover from '../assets/qq2006/ColorButton_Hover.png'
import colorNormal from '../assets/qq2006/ColorButton_Normal.png'
import closeDown from '../assets/qq2006/CloseButton_Down.png'
import closeHover from '../assets/qq2006/CloseButton_Hover.png'
import closeNormal from '../assets/qq2006/CloseButton_Normal.png'
import dropdownActive from '../assets/qq2006/dropdown_active.png'
import dropdownHover from '../assets/qq2006/dropdown_hover.png'
import bigBg from '../assets/qq2006/im/IMBigToolBarBackground.png'
import big3d from '../assets/qq2006/im/IMBigToolbar3DShow.png'
import bigInvite from '../assets/qq2006/im/IMBigToolbarInvite.png'
import bigMsg from '../assets/qq2006/im/IMBigToolbarMQQ.png'
import bigAudio from '../assets/qq2006/im/IMBigToolbarQQSQQ.png'
import bigFile from '../assets/qq2006/im/IMBigToolbarSendFile.png'
import bigVideo from '../assets/qq2006/im/IMBigToolbarVideo.png'
import imTop from '../assets/qq2006/im/IMBorderTop.png'
import imButtonDown from '../assets/qq2006/im/IMButton_Down.png'
import imButtonHover from '../assets/qq2006/im/IMButton_Hover.png'
import imButton from '../assets/qq2006/im/IMButton_Normal.png'
import imCloseDown from '../assets/qq2006/im/IMCloseButton_Down.png'
import imCloseHover from '../assets/qq2006/im/IMCloseButton_Hover.png'
import imClose from '../assets/qq2006/im/IMCloseButton_Normal.png'
import imMaxDown from '../assets/qq2006/im/IMMaxButton_Down.png'
import imMaxHover from '../assets/qq2006/im/IMMaxButton_Hover.png'
import imMax from '../assets/qq2006/im/IMMaxButton_Normal.png'
import imMinDown from '../assets/qq2006/im/IMMinButton_Down.png'
import imMinHover from '../assets/qq2006/im/IMMinButton_Hover.png'
import imMin from '../assets/qq2006/im/IMMinButton_Normal.png'
import imSideHover from '../assets/qq2006/im/IMSidebarButton_Hover.png'
import imSide from '../assets/qq2006/im/IMSidebarButton_Normal.png'
import imSideMenuHover from '../assets/qq2006/im/IMSidebarMenu_Hover.png'
import imSideMenu from '../assets/qq2006/im/IMSidebarMenu_Normal.png'
import smallBg from '../assets/qq2006/im/IMSmallToolbarBackground.png'
import smallCatch from '../assets/qq2006/im/IMSmallToolbarCatch.png'
import smallFace from '../assets/qq2006/im/IMSmallToolbarFace.png'
import smallFont from '../assets/qq2006/im/IMSmallToolbarFont.png'
import smallOther from '../assets/qq2006/im/IMSmallToolbarOtherContent.png'
import smallPicture from '../assets/qq2006/im/IMSmallToolbarPicture.png'
import smallPtt from '../assets/qq2006/im/IMSmallToolbarPtt.png'
import smallScene from '../assets/qq2006/im/IMSmallToolbarScene.png'
import smallSuperbag from '../assets/qq2006/im/IMSmallToolbarSuperbag.png'
import imIcon from '../assets/qq2006/im/icon.png'
import loginBanner from '../assets/qq2006/login_banner.png'
import minDown from '../assets/qq2006/MinButton_Down.png'
import minHover from '../assets/qq2006/MinButton_Hover.png'
import minNormal from '../assets/qq2006/MinButton_Normal.png'
import penguin from '../assets/qq2006/qq.png'
import titleCenter from '../assets/qq2006/BackgroundTitleCenter.png'
import titleLeft from '../assets/qq2006/BackgroundTitleLeft.png'
import titleRight from '../assets/qq2006/BackgroundTitleRight.png'

/** Direct image sources for `<img>` elements. */
export const IMAGES = {
  penguin,
  avatarFriend,
  avatarMe,
} as const

/** CSS custom properties that carry the artwork into `client.css`. */
export const ASSET_VARIABLES: Record<string, string> = {
    '--qq-i-login-banner': loginBanner,
  '--qq-i-title-left': titleLeft,
  '--qq-i-title-center': titleCenter,
  '--qq-i-title-right': titleRight,
  '--qq-i-btn-min': minNormal,
  '--qq-i-btn-min-hover': minHover,
  '--qq-i-btn-min-down': minDown,
  '--qq-i-btn-color': colorNormal,
  '--qq-i-btn-color-hover': colorHover,
  '--qq-i-btn-color-down': colorDown,
  '--qq-i-btn-close': closeNormal,
  '--qq-i-btn-close-hover': closeHover,
  '--qq-i-btn-close-down': closeDown,
    '--qq-i-dropdown-hover': dropdownHover,
  '--qq-i-dropdown-active': dropdownActive,
  '--qq-i-im-top': imTop,
    '--qq-i-im-icon': imIcon,
  '--qq-i-im-min': imMin,
  '--qq-i-im-min-hover': imMinHover,
  '--qq-i-im-min-down': imMinDown,
  '--qq-i-im-max': imMax,
  '--qq-i-im-max-hover': imMaxHover,
  '--qq-i-im-max-down': imMaxDown,
  '--qq-i-im-close': imClose,
  '--qq-i-im-close-hover': imCloseHover,
  '--qq-i-im-close-down': imCloseDown,
  '--qq-i-big-bg': bigBg,
  '--qq-i-big-msg': bigMsg,
  '--qq-i-big-video': bigVideo,
  '--qq-i-big-audio': bigAudio,
  '--qq-i-big-file': bigFile,
  '--qq-i-big-3d': big3d,
  '--qq-i-big-invite': bigInvite,
  '--qq-i-small-bg': smallBg,
  '--qq-i-small-font': smallFont,
  '--qq-i-small-face': smallFace,
  '--qq-i-small-other': smallOther,
  '--qq-i-small-picture': smallPicture,
  '--qq-i-small-catch': smallCatch,
  '--qq-i-small-scene': smallScene,
  '--qq-i-small-bag': smallSuperbag,
  '--qq-i-small-ptt': smallPtt,
      '--qq-i-side': imSide,
  '--qq-i-side-hover': imSideHover,
  '--qq-i-side-menu': imSideMenu,
  '--qq-i-side-menu-hover': imSideMenuHover,
  '--qq-i-im-button': imButton,
  '--qq-i-im-button-hover': imButtonHover,
  '--qq-i-im-button-down': imButtonDown,
      }
