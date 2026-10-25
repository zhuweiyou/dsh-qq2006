/**
 * A pixel-accurate QQ2006 chat window, rendered entirely from the original
 * artwork.
 *
 * It is the showpiece of the skin center: real 24x24 big-toolbar icons, the
 * 16x16 small toolbar, the sunken white message area with the classic
 * navy/green nicknames, the QQ Show side rail and the beveled bottom buttons.
 *
 * Purely presentational — every control is a `<span>`, so nothing inside the
 * Host's settings panel becomes clickable by accident.
 */
import type { ReactNode } from 'react'

import { IMAGES } from '../assets'
import { TitleBar } from './ui'

/** One big-toolbar entry. */
interface BigItem {
  key: string
  label: string
}

const BIG_ITEMS: readonly BigItem[] = [
  { key: 'msg', label: '短信' },
  { key: 'video', label: '视频' },
  { key: 'audio', label: '语音' },
  { key: 'file', label: '传文件' },
  { key: '3d', label: '3D秀' },
  { key: 'invite', label: '邀请' },
]

/** One small-toolbar entry. */
const SMALL_ITEMS: readonly string[] = ['font', 'face', 'other', 'picture', 'catch', 'scene', 'bag', 'ptt']

/** One message row. */
interface Message {
  mine?: boolean
  who: string
  time: string
  text: string
}

const MESSAGES: readonly Message[] = [
  { mine: true, who: '痴情梦丶', time: '20:37:01', text: '在吗？' },
  { who: 'メ乖乖女ソ', time: '20:37:08', text: '嗯，你说 :)' },
  { mine: true, who: '痴情梦丶', time: '20:37:15', text: 'Vae 的新歌《玫瑰花的葬礼》你听了吗' },
  { who: 'メ乖乖女ソ', time: '20:37:26', text: '听了，循环了一晚上' },
]

/** The chat window replica. */
export function ChatWindowPreview(): ReactNode {
  return (
    <div className="qq06-im">
      <TitleBar variant="chat" title="与 メ乖乖女ソ 聊天中" icon />
      <div className="qq06-im-bigbar">
        {BIG_ITEMS.map((item) => (
          <span key={item.key} className={`qq06-im-bigbtn qq06-im-bigbtn--${item.key}`}>
            {item.label}
          </span>
        ))}
      </div>
      <div className="qq06-im-body">
        <div className="qq06-im-chat">
          <div className="qq06-im-friend">
            <img src={IMAGES.avatarFriend} width={20} height={20} alt="" draggable={false} />
            <span>メ乖乖女ソ(3453674)：为了躲开所有结局的可能，你连开始都直接按了暂停键</span>
          </div>
          <div className="qq06-im-msgs">
            {MESSAGES.map((message, index) => (
              <div key={index} className={`qq06-im-msg${message.mine === true ? ' qq06-im-msg--mine' : ''}`}>
                <div className="qq06-im-msg-head">
                  {message.who}
                  <span className="qq06-im-msg-time">{message.time}</span>
                </div>
                <div className="qq06-im-msg-body">{message.text}</div>
              </div>
            ))}
          </div>
          <div className="qq06-im-smallbar">
            {SMALL_ITEMS.map((key) => (
              <span key={key} className={`qq06-im-smallbtn qq06-im-smallbtn--${key}`} />
            ))}
          </div>
          <div className="qq06-im-input">
            <span>在吗？</span>
            <i className="qq06-caret" />
          </div>
          <div className="qq06-im-actions">
            <span className="qq06-im-action">聊天记录(R)</span>
            <span className="qq06-im-action">消息模式(T)</span>
            <span className="qq06-im-action">关闭(C)</span>
            <span className="qq06-im-action qq06-im-action--send">发送(S)</span>
          </div>
        </div>
        <div className="qq06-im-side">
          <span className="qq06-im-sidebtn">对方形象</span>
          <div className="qq06-im-portrait">
            <img src={IMAGES.avatarFriend} alt="" draggable={false} />
            <span className="qq06-im-portrait-badge">QQ秀</span>
          </div>
          <span className="qq06-im-sidebtn">个人空间</span>
          <div className="qq06-im-zone">
            <div>摘要：若无能为你撑起晴空</div>
            <div>日记：48个 / 166评论</div>
            <div>相册：12个 / 25评论</div>
            <div>收藏：62个</div>
          </div>
          <span className="qq06-im-sidebtn">我的形象</span>
          <div className="qq06-im-portrait qq06-im-portrait--mine">
            <img src={IMAGES.avatarMe} alt="" draggable={false} />
            <span className="qq06-im-portrait-badge">秀</span>
          </div>
        </div>
      </div>
    </div>
  )
}
