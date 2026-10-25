/**
 * The QQ2006 login window — the piece people actually remember.
 *
 * It is a working miniature: type a number, type a password, toggle
 * 自动登录 / 隐身登录, expand 高级设置, press 登录 and watch the classic
 * "正在登录…" sequence resolve into a welcome line. The window itself is
 * illustrative only; it talks to nothing.
 */
import { useEffect, useRef, useState, type ReactNode } from 'react'

import { IMAGES } from '../assets'

/** Login window phase. */
type Phase = 'idle' | 'logging' | 'done'

/** Result of the last submit, for the inline hint. */
type Hint = { tone: 'warn' | 'ok'; text: string } | null

/** The login window replica. */
export function LoginWindowPreview(): ReactNode {
  const [qq, setQq] = useState('3453674')
  const [password, setPassword] = useState('')
  const [autoLogin, setAutoLogin] = useState(true)
  const [hidden, setHidden] = useState(false)
  const [advanced, setAdvanced] = useState(false)
  const [phase, setPhase] = useState<Phase>('idle')
  const [hint, setHint] = useState<Hint>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (timer.current !== null) clearTimeout(timer.current)
    },
    [],
  )

  const submit = (): void => {
    if (phase === 'logging') return
    if (qq.trim() === '') {
      setHint({ tone: 'warn', text: '请输入QQ号码' })
      return
    }
    if (password.trim() === '') {
      setHint({ tone: 'warn', text: '请输入QQ密码' })
      return
    }
    setHint(null)
    setPhase('logging')
    timer.current = setTimeout(() => {
      setPhase('done')
      setHint({ tone: 'ok', text: `欢迎回来，${qq.trim()}${hidden ? '（隐身）' : ''}` })
      timer.current = setTimeout(() => setPhase('idle'), 1800)
    }, 1200)
  }

  const cancel = (): void => {
    if (timer.current !== null) clearTimeout(timer.current)
    setPhase('idle')
    setHint(null)
  }

  return (
    <div className="qq06-login">
      <div className="qq06-xpbar">
        <span className="qq06-xpbar-text">QQ用户登录</span>
        <span className="qq06-xpbar-btns">
          <span className="qq06-xpbtn qq06-xpbtn--min" />
          <span className="qq06-xpbtn qq06-xpbtn--max" />
          <span className="qq06-xpbtn qq06-xpbtn--close" />
        </span>
      </div>
      <div className="qq06-login-banner" role="presentation" />
      <div className="qq06-login-form">
        <div className="qq06-field">
          <span className="qq06-field-label">QQ号码</span>
          <span className="qq06-field-control">
            <input
              className="qq06-input qq06-input--qq"
              value={qq}
              placeholder="<请在这儿输入QQ号码>"
              onChange={(event) => setQq(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') submit()
              }}
            />
            <span className="qq06-dropdown" role="presentation" />
          </span>
          <button type="button" className="qq06-btn qq06-btn--mini">
            申请号码
          </button>
        </div>
        <div className="qq06-field">
          <span className="qq06-field-label">QQ密码</span>
          <span className="qq06-field-control">
            <input
              className="qq06-input"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') submit()
              }}
            />
          </span>
          <a className="qq06-link" href="#qq2006-forgot" onClick={(event) => event.preventDefault()}>
            忘了密码？
          </a>
        </div>
        <div className="qq06-checks">
          <span className="qq06-field-label" />
          <label className="qq06-check">
            <input type="checkbox" checked={autoLogin} onChange={(event) => setAutoLogin(event.target.checked)} />
            自动登录
          </label>
          <label className="qq06-check">
            <input type="checkbox" checked={hidden} onChange={(event) => setHidden(event.target.checked)} />
            隐身登录
          </label>
        </div>
        {advanced ? (
          <div className="qq06-advanced">
            <div>登录服务器：UDP 8000 · 不使用代理</div>
            <div>网络设置：自动检测 · 超时 30 秒</div>
          </div>
        ) : null}
        {hint !== null ? <div className={`qq06-hint qq06-hint--${hint.tone}`}>{hint.text}</div> : null}
      </div>
      <div className="qq06-login-actions">
        <button type="button" className="qq06-btn" onClick={() => setAdvanced((value) => !value)}>
          高级设置 {advanced ? '↑' : '↓'}
        </button>
        <span className="qq06-spacer" />
        <button type="button" className="qq06-btn qq06-btn--primary" onClick={submit}>
          登录
        </button>
        <button type="button" className="qq06-btn" onClick={cancel}>
          取消
        </button>
      </div>
      {phase !== 'idle' ? (
        <div className="qq06-login-mask">
          <div className="qq06-login-busy">
            <img src={IMAGES.penguin} width={40} height={40} alt="" draggable={false} />
            <p>正在登录{phase === 'logging' ? <span className="qq06-dots" /> : '成功'}</p>
            <button type="button" className="qq06-btn" onClick={cancel}>
              取消登录
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
