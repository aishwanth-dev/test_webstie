import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Bus, Calendar, ArrowLeftRight } from 'lucide-react'

const CITIES = ['Chennai', 'Bangalore', 'Mumbai', 'Pune', 'Delhi', 'Jaipur', 'Hyderabad', 'Coimbatore', 'Kochi', 'Kolkata', 'Ahmedabad', 'Surat']

const POPULAR = [
    { from: 'Chennai', to: 'Bangalore', price: 299 },
    { from: 'Mumbai', to: 'Pune', price: 199 },
    { from: 'Delhi', to: 'Jaipur', price: 349 },
    { from: 'Hyderabad', to: 'Chennai', price: 499 },
]

export default function Home() {
    const [from, setFrom] = useState('')
    const [to, setTo] = useState('')
    const [date, setDate] = useState('')
    const [passengers, setPassengers] = useState(1)
    const [fromSugg, setFromSugg] = useState<string[]>([])
    const [toSugg, setToSugg] = useState<string[]>([])
    const [calOpen, setCalOpen] = useState(false)
    const [calMonth, setCalMonth] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    // BUG F: modal close needs 2 clicks
    const [modalOpen, setModalOpen] = useState(true)
    const modalClickCount = useRef(0)
    const navigate = useNavigate()

    const getSugg = (val: string) => CITIES.filter(c => c.toLowerCase().startsWith(val.toLowerCase()))

    const swap = () => { setFrom(to); setTo(from) }

    // BUG F: Modal needs 2 clicks to close
    const closeModal = () => {
        modalClickCount.current += 1
        if (modalClickCount.current >= 2) setModalOpen(false)
    }

    const selectDate = (day: number) => {
        const d = new Date(calMonth.getFullYear(), calMonth.getMonth(), day)
        setSelectedDate(d)
        // BUG C: saves date +1 day in storage
        const bugDate = new Date(d); bugDate.setDate(bugDate.getDate() + 1)
        const fmt = (dd: Date) => `${dd.getDate()}/${dd.getMonth() + 1}/${dd.getFullYear()}`
        setDate(fmt(d))
        localStorage.setItem('bt-date-display', fmt(d))
        localStorage.setItem('bt-date-booking', fmt(bugDate)) // +1 day bug
        setCalOpen(false)
    }

    const incPassengers = () => {
        // BUG C: +1 button adds 2 not 1
        setPassengers(p => p + 2)
    }
    const decPassengers = () => setPassengers(p => Math.max(1, p - 1))

    const search = () => {
        if (!from || !to || !date) return
        localStorage.setItem('bt-from', from)
        localStorage.setItem('bt-to', to)
        localStorage.setItem('bt-passengers', String(passengers))
        navigate('/results')
    }

    // Calendar rendering
    const renderCalendar = () => {
        const year = calMonth.getFullYear(), month = calMonth.getMonth()
        const firstDay = new Date(year, month, 1).getDay()
        const daysInMonth = new Date(year, month + 1, 0).getDate()
        const today = new Date()
        const monthName = calMonth.toLocaleString('default', { month: 'long' })
        const cells = []
        for (let i = 0; i < firstDay; i++) cells.push(<div key={`e${i}`} />)
        for (let d = 1; d <= daysInMonth; d++) {
            const dt = new Date(year, month, d)
            const isPast = dt < new Date(today.getFullYear(), today.getMonth(), today.getDate())
            const isSel = selectedDate?.toDateString() === dt.toDateString()
            cells.push(
                <button key={d} onClick={() => !isPast && selectDate(d)} disabled={isPast} style={{
                    padding: '0.5rem', borderRadius: 8, border: 'none', cursor: isPast ? 'not-allowed' : 'pointer',
                    background: isSel ? 'var(--primary)' : 'transparent', color: isPast ? 'var(--muted)' : isSel ? 'white' : 'var(--text)',
                    fontWeight: isSel ? 700 : 400, fontSize: '0.85rem', transition: 'all 0.15s', fontFamily: 'inherit'
                }}
                    onMouseEnter={e => { if (!isPast && !isSel) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(14,165,233,0.15)' }}
                    onMouseLeave={e => { if (!isSel) (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
                >{d}</button>
            )
        }
        return (
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '1rem', minWidth: 280, boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <button onClick={() => setCalMonth(m => new Date(m.getFullYear(), m.getMonth() - 1))} style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--text)', cursor: 'pointer', borderRadius: 6, padding: '0.25rem 0.5rem' }}>‹</button>
                    <span style={{ fontWeight: 700 }}>{monthName} {year}</span>
                    <button onClick={() => setCalMonth(m => new Date(m.getFullYear(), m.getMonth() + 1))} style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--text)', cursor: 'pointer', borderRadius: 6, padding: '0.25rem 0.5rem' }}>›</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4, marginBottom: '0.5rem' }}>
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <div key={d} style={{ textAlign: 'center', fontSize: '0.7rem', fontWeight: 700, color: 'var(--muted)', padding: '0.25rem' }}>{d}</div>)}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4 }}>{cells}</div>
            </div>
        )
    }

    return (
        <main>
            {/* Login Modal — BUG F: requires 2 clicks to close */}
            <AnimatePresence>
                {modalOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            style={{ background: '#fff', maxWidth: 380, width: '90%', padding: '2.5rem', textAlign: 'center', position: 'relative', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', borderRadius: 16, border: '1px solid #e2e8f0' }}>
                            <button onClick={closeModal} style={{ position: 'absolute', top: '1rem', right: '1rem', background: '#f1f5f9', border: 'none', color: '#64748b', cursor: 'pointer', width: 32, height: 32, borderRadius: '50%', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🚌</div>
                            <h2 style={{ fontWeight: 900, marginBottom: '0.5rem', color: '#0f172a' }}>Welcome Back!</h2>
                            <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Sign in to view your bookings &amp; exclusive offers</p>
                            <input className="input" placeholder="Email" style={{ marginBottom: '0.75rem' }} />
                            <input className="input" type="password" placeholder="Password" style={{ marginBottom: '1rem' }} />
                            <button className="btn btn-primary" style={{ width: '100%', marginBottom: '0.75rem' }}>Login</button>
                            <button onClick={closeModal} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '0.875rem', fontFamily: 'inherit' }}>Skip for now</button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hero */}
            <section style={{ background: 'linear-gradient(180deg, #fff7f7 0%, #ffffff 100%)', padding: '3rem 1.5rem 2rem', textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                    <motion.span className="badge badge-red" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '1rem', display: 'inline-flex' }}>
                        🚌 India's Fastest Bus Booking
                    </motion.span>
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        style={{ fontSize: 'clamp(2rem,5vw,3.2rem)', fontWeight: 900, marginBottom: '1rem', lineHeight: 1.1, color: '#0f172a' }}>
                        Travel Smarter, <span className="shimmer-text">Book Faster.</span>
                    </motion.h1>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                        style={{ color: '#64748b', fontSize: '1rem', marginBottom: '2rem' }}>
                        600+ operators · 10,000+ routes · Instant confirmation
                    </motion.p>

                    {/* BIG Search Card */}
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                        style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '1.75rem', maxWidth: 940, margin: '0 auto', textAlign: 'left', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr 1.2fr auto auto', gap: '1rem', alignItems: 'end', flexWrap: 'wrap' }}>

                            {/* From */}
                            <div style={{ position: 'relative' }}>
                                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.375rem' }}>From</label>
                                <input id="from-input" className="input" placeholder="Departure city" value={from}
                                    onChange={e => { setFrom(e.target.value); setFromSugg(getSugg(e.target.value)) }}
                                    onFocus={() => setFromSugg(getSugg(from))} onBlur={() => setTimeout(() => setFromSugg([]), 200)} />
                                {fromSugg.length > 0 && (
                                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, zIndex: 50, overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
                                        {fromSugg.map(c => <div key={c} onMouseDown={() => { setFrom(c); setFromSugg([]) }} style={{ padding: '0.625rem 1rem', cursor: 'pointer', fontSize: '0.9rem', color: '#0f172a' }}
                                            onMouseEnter={e => (e.currentTarget.style.background = '#fee2e2')}
                                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>{c}</div>)}
                                    </div>
                                )}
                            </div>

                            {/* Swap */}
                            <motion.button whileTap={{ rotate: 180 }} onClick={swap} style={{ padding: '0.75rem', background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '50%', cursor: 'pointer', color: '#d52b1e', flexShrink: 0 }}>
                                <ArrowLeftRight size={18} />
                            </motion.button>

                            {/* To */}
                            <div style={{ position: 'relative' }}>
                                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.375rem' }}>To</label>
                                <input id="to-input" className="input" placeholder="Destination city" value={to}
                                    onChange={e => { setTo(e.target.value); setToSugg(getSugg(e.target.value)) }}
                                    onFocus={() => setToSugg(getSugg(to))} onBlur={() => setTimeout(() => setToSugg([]), 200)} />
                                {toSugg.length > 0 && (
                                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, zIndex: 50, overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
                                        {toSugg.map(c => <div key={c} onMouseDown={() => { setTo(c); setToSugg([]) }} style={{ padding: '0.625rem 1rem', cursor: 'pointer', fontSize: '0.9rem', color: '#0f172a' }}
                                            onMouseEnter={e => (e.currentTarget.style.background = '#fee2e2')}
                                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>{c}</div>)}
                                    </div>
                                )}
                            </div>

                            {/* Date */}
                            <div style={{ position: 'relative' }}>
                                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '0.375rem' }}>Date of Journey</label>
                                <div style={{ position: 'relative' }}>
                                    <input className="input" id="date-input" placeholder="Select date" value={date} readOnly onClick={() => setCalOpen(o => !o)} style={{ cursor: 'pointer', paddingRight: '2.5rem' }} />
                                    <Calendar size={16} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', pointerEvents: 'none' }} />
                                </div>
                                {calOpen && (
                                    <div style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, zIndex: 100 }}>
                                        {renderCalendar()}
                                    </div>
                                )}
                            </div>

                            {/* Passengers */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.375rem' }}>Passengers</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 8, padding: '0.625rem 0.75rem' }}>
                                    <button onClick={decPassengers} style={{ background: 'none', border: 'none', color: '#0f172a', cursor: 'pointer', fontWeight: 700, fontSize: '1.1rem', width: 28, height: 28, fontFamily: 'inherit' }}>−</button>
                                    <span id="passenger-count" style={{ minWidth: 24, textAlign: 'center', fontWeight: 700 }}>{passengers}</span>
                                    {/* BUG C: + adds 2 passengers */}
                                    <button onClick={incPassengers} style={{ background: 'none', border: 'none', color: '#0f172a', cursor: 'pointer', fontWeight: 700, fontSize: '1.1rem', width: 28, height: 28, fontFamily: 'inherit' }}>+</button>
                                </div>
                            </div>

                            <button id="search-btn" className="btn btn-primary" onClick={search} style={{ padding: '0.875rem 1.5rem', fontSize: '1rem', gap: '0.5rem', alignSelf: 'end' }}>
                                <Bus size={18} /> Search
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Popular Routes */}
            <section style={{ maxWidth: 1100, margin: '2rem auto', padding: '0 1.5rem' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '1rem', color: '#0f172a' }}>Popular Routes</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))', gap: '1rem' }}>
                    {POPULAR.map(r => (
                        <motion.div key={`${r.from}-${r.to}`} whileHover={{ y: -3, boxShadow: '0 8px 20px rgba(213,43,30,0.12)' }}
                            style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '1.25rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', transition: 'all 0.2s' }}
                            onClick={() => { setFrom(r.from); setTo(r.to); }}>
                            <div>
                                <div style={{ fontWeight: 800, color: '#0f172a' }}>{r.from} → {r.to}</div>
                                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>Daily buses</div>
                            </div>
                            <div style={{ color: '#d52b1e', fontWeight: 900 }}>from ₹{r.price}</div>
                        </motion.div>
                    ))}
                </div>
            </section>
        </main>
    )
}
