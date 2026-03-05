import { useState, useRef, useEffect, useCallback } from 'react'
import './index.css'

const API_KEY = 'AIzaSyDViEmSm8WaXTzJ02AxyuPB7_4T7uGbMyE'
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${API_KEY}`

// ─────────────────────────────────────────────────
// PLANTED BUGS — less frequent, more subtle:
// BUG 1 — Every 5th message: AI replies in French
// BUG 2 — Rapid double-click: sendLock fires twice (async queue issue)
// BUG 3 — After 8th message: loading spinner never resolves
// BUG 4 — Every 11th message: silently swallowed, no reply
// BUG 5 — AI answers the PREVIOUS question (off-by-one ref)
// ─────────────────────────────────────────────────

interface Msg {
  id: string
  role: 'user' | 'ai'
  text: string
  loading?: boolean
  time: string
}

function fmt() {
  return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

const CHIPS = [
  { icon: '💡', label: 'Explain quantum computing simply' },
  { icon: '✍️', label: 'Write a short poem about the ocean' },
  { icon: '🧮', label: 'What is 18% tip on $47.50?' },
  { icon: '🌍', label: 'Top 3 AI trends in 2025' },
]

const HISTORY = [
  'How does a neural network work?',
  'Python vs JavaScript for AI',
  'Explain machine learning basics',
]

export default function App() {
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const [count, setCount] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const bottomRef = useRef<HTMLDivElement>(null)
  const taRef = useRef<HTMLTextAreaElement>(null)
  const prevQ = useRef('')      // BUG 5 store
  const lock = useRef(false)  // BUG 2 broken guard

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs])

  // Auto-resize textarea
  useEffect(() => {
    const ta = taRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = Math.min(ta.scrollHeight, 140) + 'px'
  }, [draft])

  const send = useCallback(async (text?: string) => {
    const msg = (text ?? draft).trim()
    if (!msg) return

    // BUG 2: lock.current is checked but the async React state update
    // already enqueued a re-render before this guard runs — so rapid clicks fire twice
    if (lock.current && !text) return
    lock.current = true

    const n = count + 1
    setCount(n)
    setDraft('')

    const userMsg: Msg = { id: `u${Date.now()}${Math.random()}`, role: 'user', text: msg, time: fmt() }
    setMsgs(p => [...p, userMsg])

    // BUG 3: after 8 messages loading never resolves
    if (n > 8) {
      const loadId = `ai${Date.now()}`
      setMsgs(p => [...p, { id: loadId, role: 'ai', text: '', loading: true, time: fmt() }])
      setBusy(true)
      lock.current = false
      return  // intentionally never resolved
    }

    // BUG 4: every 11th message is silently swallowed — no AI reply added
    if (n % 11 === 0) {
      lock.current = false
      return
    }

    const loadId = `ai${Date.now()}`
    setMsgs(p => [...p, { id: loadId, role: 'ai', text: '', loading: true, time: fmt() }])
    setBusy(true)

    try {
      // BUG 1: every 5th message forces French response
      const isFrench = n % 5 === 0
      const sysText = isFrench
        ? 'Tu dois OBLIGATOIREMENT répondre en français seulement. Ne réponds jamais en anglais.'
        : 'You are NexusAI, a helpful and concise AI assistant. Give clear, well-structured answers. Be friendly but professional.'

      // BUG 5: reply to the PREVIOUS question, not the current one (off-by-one)
      const questionToAnswer = prevQ.current || msg
      prevQ.current = msg  // update AFTER so next call answers today's question

      const res = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: sysText }] },
          contents: [{ role: 'user', parts: [{ text: questionToAnswer }] }],
          generationConfig: { maxOutputTokens: 600, temperature: 0.7 },
        }),
      })

      if (!res.ok) throw new Error(`API error ${res.status}`)
      const data = await res.json()
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
        ?? 'Sorry, I could not generate a response. Please try again.'

      setMsgs(p => p.map(m => m.id === loadId ? { ...m, text: reply, loading: false } : m))
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Unknown error'
      setMsgs(p => p.map(m => m.id === loadId
        ? { ...m, text: `Connection error: ${errMsg}. Please try again.`, loading: false }
        : m
      ))
    } finally {
      setBusy(false)
      lock.current = false
    }
  }, [draft, count])

  const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  const reset = () => {
    setMsgs([]); setCount(0)
    prevQ.current = ''; lock.current = false
    setBusy(false); setSidebarOpen(false)
  }

  return (
    <div id="root">
      {/* Overlay (mobile sidebar) */}
      <div
        className={`sidebar-overlay${sidebarOpen ? ' show' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* ── Sidebar ── */}
      <aside className={`sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="sidebar-top">
          <span className="brand">NexusAI</span>
          <button className="icon-btn sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="Close menu">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        <button className="new-chat-btn" id="new-chat-btn" onClick={reset}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New chat
        </button>

        <div className="history-label">Recent</div>
        {HISTORY.map((h, i) => (
          <div key={i} className="history-item" id={`history-${i}`}
            onClick={() => { send(h); setSidebarOpen(false) }}>
            {h}
          </div>
        ))}

        <div className="sidebar-footer">
          <div className="avatar">U</div>
          <div className="user-info">
            <div className="name">Test User</div>
            <div className="plan">Pro Plan</div>
          </div>
        </div>
      </aside>

      {/* ── Main chat ── */}
      <div className="chat-main">
        <header className="topbar">
          <button className="icon-btn hamburger" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <span className="topbar-title">NexusAI Chat</span>
          <span className="model-chip">gemini-2.5-flash-lite</span>
        </header>

        {/* Scroll area — fills full chat width */}
        <div className="scroll-area">
          {msgs.length === 0 ? (
            <div className="welcome">
              <div className="welcome-logo">✦</div>
              <h1>What can I help with?</h1>
              <p>Ask me anything — I write, explain, analyze, and code.</p>
              <div className="chips">
                {CHIPS.map((c, i) => (
                  <button key={i} className="chip" id={`chip-${i}`} onClick={() => send(c.label)}>
                    <span>{c.icon}</span>{c.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="messages">
              {count > 8 && (
                <div className="stuck-banner" id="stuck-banner">
                  ⚠ Response limit reached — new messages may not receive replies
                </div>
              )}
              {msgs.map(m => (
                <div key={m.id} className={`msg-row ${m.role}`} id={`msg-${m.id}`}>
                  <div className={`row-avatar ${m.role === 'ai' ? 'ai-av' : 'usr-av'}`}>
                    {m.role === 'ai' ? '✦' : '👤'}
                  </div>
                  {/* msg-content: ai fills flex, user stays max 70% */}
                  <div className="msg-content">
                    <div className="bubble">
                      {m.loading
                        ? <div className="dots" id="loading-dots"><span /><span /><span /></div>
                        : m.text
                      }
                    </div>
                    <div className="msg-time">{m.time}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input bar */}
        <div className="input-bar-wrap">
          <div className="input-bar">
            <textarea
              ref={taRef}
              id="chat-input"
              className="chat-textarea"
              placeholder="Message NexusAI..."
              rows={1}
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={onKey}
            />
            <button
              id="send-btn"
              className="send-btn"
              onClick={() => send()}
              disabled={!draft.trim() || busy}
              aria-label="Send message"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
          <p className="input-hint">NexusAI can make mistakes. Verify important information.</p>
        </div>
      </div>
    </div>
  )
}
