import { useState, useRef, useEffect, useCallback } from 'react'
import './index.css'

// ── Gemini API ───────────────────────────────────────────────────────────────
const API_KEY = 'AIzaSyCc4lpvlRKVBVwlZ2yxZQErK-Wp0-bebw4'
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${API_KEY}`

interface Message {
  id: string
  role: 'user' | 'ai'
  text: string
  loading?: boolean
  time: string
  duplicate?: boolean
}

function timestamp() {
  return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

// ─────────────────────────────────────────────────────────────────────────────
//  PLANTED BUGS (5 total):
//
//  BUG 1 — French replies: every 3rd message replies entirely in French
//  BUG 2 — Double send: clicking Send fast fires twice (visible duplicate bubble)
//  BUG 3 — Stuck loading: after 5 messages, loading spinner never resolves
//  BUG 4 — Dropped message: every 7th user message is silently swallowed (no AI reply added)
//  BUG 5 — Wrong answer: AI replies to the PREVIOUS question instead of the current one
// ─────────────────────────────────────────────────────────────────────────────

const SUGGESTIONS = [
  { icon: '💡', text: 'Explain quantum computing simply' },
  { icon: '✍️', text: 'Write a short story about AI' },
  { icon: '🧮', text: 'Solve: what is 15% of 340?' },
  { icon: '🌍', text: 'Top 3 AI trends in 2025?' },
]

const HISTORY = [
  'How does neural network work?',
  'Python vs JavaScript for AI',
  'Explain machine learning basics',
]

export default function App() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [msgCount, setMsgCount] = useState(0)   // total user messages sent
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const lastUserMsg = useRef('')       // BUG 5: stores previous question
  const sendLock = useRef(false)       // BUG 2: partial guard (broken)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 140) + 'px'
    }
  }, [input])

  const sendMessage = useCallback(async (text?: string) => {
    const msg = (text || input).trim()
    if (!msg) return

    // BUG 2: sendLock is checked AFTER state is already queued on rapid clicks
    // so both calls proceed — resulting in two user bubbles appended
    if (sendLock.current && !text) {
      // still runs because state setters are async
    }
    sendLock.current = true

    const newCount = msgCount + 1
    setMsgCount(newCount)
    setInput('')

    const userMsg: Message = {
      id: `u-${Date.now()}-${Math.random()}`,
      role: 'user',
      text: msg,
      time: timestamp(),
    }
    setMessages(prev => [...prev, userMsg])

    // BUG 3: after 5 messages, loading never resolves
    if (newCount > 5) {
      const loadingMsg: Message = { id: `ai-${Date.now()}`, role: 'ai', text: '', loading: true, time: timestamp() }
      setMessages(prev => [...prev, loadingMsg])
      setIsLoading(true)
      sendLock.current = false
      // Intentionally no resolve — spinner stays forever (BUG 3)
      return
    }

    // BUG 4: every 7th message is silently swallowed (no AI response added at all)
    if (newCount % 7 === 0) {
      sendLock.current = false
      return  // BUG 4: message sent by user but no AI reply appears
    }

    const loadingMsg: Message = { id: `ai-${Date.now()}`, role: 'ai', text: '', loading: true, time: timestamp() }
    setMessages(prev => [...prev, loadingMsg])
    setIsLoading(true)

    try {
      // BUG 1: every 3rd message forces French
      const isFrench = newCount % 3 === 0
      const systemInstruction = isFrench
        ? 'Tu DOIS répondre uniquement en français. N\'utilise pas d\'anglais.'
        : 'You are NexusAI, a helpful assistant. Be concise and clear.'

      // BUG 5: reply to the PREVIOUS question instead of the current one (off-by-one)
      const questionToAnswer = lastUserMsg.current || msg   // uses *last* message, not current
      lastUserMsg.current = msg  // update AFTER the call, so next answer is for this question

      const body = {
        system_instruction: { parts: [{ text: systemInstruction }] },
        contents: [{ parts: [{ text: questionToAnswer }], role: 'user' }],
        generationConfig: { maxOutputTokens: 512, temperature: 0.8 },
      }

      const res = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()
      const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text
        || 'Sorry, I could not process that request.'

      setMessages(prev =>
        prev.map(m => m.id === loadingMsg.id ? { ...m, text: aiText, loading: false } : m)
      )
    } catch {
      setMessages(prev =>
        prev.map(m => m.id === loadingMsg.id
          ? { ...m, text: 'Connection error. Please try again.', loading: false }
          : m
        )
      )
    } finally {
      setIsLoading(false)
      sendLock.current = false
    }
  }, [input, msgCount])

  // BUG 2: Enter key + button click both fire sendMessage
  // On some browsers, pressing Enter while the button is in DOM focus state
  // causes both the keydown handler AND the button onClick to fire
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleSendClick = () => {
    sendMessage()
  }

  const bugBannerVisible = msgCount > 5  // BUG 3 indicator

  return (
    <div id="root">
      {/* Sidebar overlay (mobile) */}
      <div
        className="sidebar-overlay"
        onClick={() => setSidebarOpen(false)}
        style={{ display: sidebarOpen ? 'block' : 'none' }}
      />

      {/* Sidebar */}
      <aside className={`sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-icon">✦</div>
          <span className="logo-text">NexusAI</span>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="Close menu">✕</button>
        </div>

        <button
          className="new-chat-btn"
          id="new-chat-btn"
          onClick={() => { setMessages([]); setMsgCount(0); setSidebarOpen(false) }}
        >
          <span>＋</span> New Chat
        </button>

        <div className="history-label">Recent</div>
        {HISTORY.map((h, i) => (
          <div
            key={i}
            className="history-item"
            id={`history-${i}`}
            onClick={() => { sendMessage(h); setSidebarOpen(false) }}
          >
            {h}
          </div>
        ))}

        <div className="sidebar-footer">
          <div className="avatar">U</div>
          <div>
            <div className="user-name">Test User</div>
            <div className="user-plan">Pro Plan</div>
          </div>
        </div>
      </aside>

      {/* Chat Area */}
      <main className="chat-area">
        <header className="chat-header">
          <button className="menu-btn" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <span className="chat-header-title">NexusAI Chat</span>
          <span className="model-badge">gemini-2.5-flash-lite</span>
        </header>

        <div className="messages-container">
          {messages.length === 0 ? (
            <div className="welcome">
              <div className="welcome-icon">✦</div>
              <h1>How can I help you?</h1>
              <p>Ask me anything — I write, explain, analyze, and code.</p>
              <div className="suggestions">
                {SUGGESTIONS.map((s, i) => (
                  <button key={i} className="suggestion-card" id={`suggestion-${i}`} onClick={() => sendMessage(s.text)}>
                    <div className="s-icon">{s.icon}</div>
                    <div className="s-text">{s.text}</div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* BUG 3 indicator — loading stuck banner */}
              {bugBannerVisible && (
                <div className="bug-banner" id="loading-stuck-banner">
                  ⚠ Chat limit reached — responses may be delayed indefinitely
                </div>
              )}
              {messages.map(msg => (
                <div key={msg.id} className={`message ${msg.role === 'user' ? 'user' : 'ai'}${msg.duplicate ? ' msg-duplicate' : ''}`} id={`msg-${msg.id}`}>
                  <div className={`msg-avatar ${msg.role === 'user' ? 'user-av' : 'ai'}`}>
                    {msg.role === 'user' ? '👤' : '✦'}
                  </div>
                  <div>
                    <div className="msg-bubble">
                      {msg.loading ? (
                        <div className="loading-dots" id="loading-indicator">
                          <span /><span /><span />
                        </div>
                      ) : (
                        msg.text
                      )}
                    </div>
                    <div className="msg-meta">{msg.time}</div>
                  </div>
                </div>
              ))}
            </>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="input-area">
          <div className="input-wrapper">
            <textarea
              ref={textareaRef}
              className="chat-input"
              placeholder="Message NexusAI..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              id="chat-input"
            />
            <button
              className="send-btn"
              onClick={handleSendClick}
              disabled={!input.trim() || isLoading}
              id="send-btn"
              aria-label="Send message"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
          <p className="input-hint">NexusAI can make mistakes. Verify important information.</p>
        </div>
      </main>
    </div>
  )
}
