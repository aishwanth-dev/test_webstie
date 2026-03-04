import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function Payment() {
    const [bus, setBus] = useState<any>(null)
    const [seats, setSeats] = useState<number[]>([])
    const [total, setTotal] = useState(0)
    const [from, setFrom] = useState('')
    const [to, setTo] = useState('')
    const [done, setDone] = useState(false)

    useEffect(() => {
        setBus(JSON.parse(localStorage.getItem('bt-bus') || 'null'))
        setSeats(JSON.parse(localStorage.getItem('bt-seats') || '[]'))
        setTotal(Number(localStorage.getItem('bt-total') || 0))
        setFrom(localStorage.getItem('bt-from') || '')
        setTo(localStorage.getItem('bt-to') || '')
    }, [])

    const confirm = (e: React.FormEvent) => {
        e.preventDefault()
        setDone(true)
    }

    if (done) return (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', gap: '1rem', textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '5rem' }}>🎉</div>
            <h1 style={{ fontSize: '2rem', fontWeight: 900 }}>Booking Confirmed!</h1>
            <p style={{ color: 'var(--muted2)' }}>{from} → {to}</p>
            <div className="glass" style={{ padding: '2rem', minWidth: 300, textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>PNR: BT{Math.floor(Math.random() * 9000 + 1000)}</div>
                {/* BUG C: Shows +1 day wrong travel date */}
                <div style={{ color: 'var(--muted)', marginTop: '0.5rem', fontSize: '0.875rem' }}>
                    Travel Date: {localStorage.getItem('bt-date-booking')}
                </div>
                <div style={{ fontWeight: 800, fontSize: '1.3rem', marginTop: '1rem', color: 'var(--success)' }}>₹{total} paid</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.5rem' }}>Seats: {seats.sort((a, b) => a - b).join(', ')}</div>
            </div>
            <a href="/" className="btn btn-primary" style={{ marginTop: '0.5rem', textDecoration: 'none' }}>Book Another</a>
        </motion.div>
    )

    return (
        <main style={{ maxWidth: 1000, margin: '0 auto', padding: '2rem 1.5rem' }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '1.5rem' }}>Passenger Details & Payment</h1>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem', alignItems: 'start' }}>
                <form onSubmit={confirm} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {seats.map((seat, i) => (
                        <div key={seat} className="glass" style={{ padding: '1.5rem' }}>
                            <h3 style={{ fontWeight: 700, marginBottom: '1rem', color: 'var(--primary)' }}>Passenger {i + 1} — Seat {seat}</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                {[['name', 'Full Name', 'John Doe', 'text'], ['age', 'Age', '25', 'number']].map(([n, l, ph, t]) => (
                                    <div key={n} style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted)' }}>{l}</label>
                                        <input className="input" type={t} placeholder={ph} required min={t === 'number' ? 1 : undefined} max={t === 'number' ? 120 : undefined} />
                                    </div>
                                ))}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted)' }}>Gender</label>
                                    <select className="input" style={{ cursor: 'pointer' }}>
                                        <option>Male</option><option>Female</option><option>Other</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="glass" style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontWeight: 700, marginBottom: '1rem', color: 'var(--primary)' }}>Payment Method</h3>
                        {['💳 Credit / Debit Card', '📱 UPI', '🏦 Net Banking'].map(m => (
                            <label key={m} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'var(--surface2)', borderRadius: 10, marginBottom: '0.5rem', cursor: 'pointer' }}>
                                <input type="radio" name="payment" defaultChecked={m.includes('Credit')} style={{ accentColor: 'var(--primary)' }} />
                                <span style={{ fontSize: '0.9rem' }}>{m}</span>
                            </label>
                        ))}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem', marginTop: '1rem' }}>
                            <input className="input" placeholder="4111 1111 1111 1111" maxLength={19} />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                <input className="input" placeholder="MM/YY" maxLength={5} />
                                <input className="input" placeholder="CVV" maxLength={3} type="password" />
                            </div>
                        </div>
                    </div>
                    <motion.button whileTap={{ scale: 0.97 }} type="submit" className="btn btn-primary" style={{ fontSize: '1rem', padding: '1rem', borderRadius: 12 }}>
                        🔒 Confirm & Pay ₹{total}
                    </motion.button>
                </form>

                <div className="glass" style={{ padding: '1.5rem', position: 'sticky', top: 80 }}>
                    <h3 style={{ fontWeight: 800, marginBottom: '1rem' }}>Trip Summary</h3>
                    {bus && <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--muted2)', padding: '0.3rem 0' }}><span>Bus</span><span>{bus.name}</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--muted2)', padding: '0.3rem 0' }}><span>Departure</span><span>{bus.dep}</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--muted2)', padding: '0.3rem 0' }}><span>Seats</span><span>{seats.sort((a, b) => a - b).join(', ')}</span></div>
                        {/* BUG C: shows +1 day wrong date */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#f87171', padding: '0.3rem 0', fontWeight: 600 }}>
                            <span>Travel Date</span>
                            <span>{localStorage.getItem('bt-date-booking')}</span>
                        </div>
                        <div style={{ borderTop: '1px solid var(--border)', marginTop: '0.75rem', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary)' }}>
                            <span>Total</span><span>₹{total}</span>
                        </div>
                    </>}
                    <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '0.75rem', marginTop: '1rem' }}>🔒 Secured by BusTest Pay</p>
                </div>
            </div>
        </main>
    )
}
