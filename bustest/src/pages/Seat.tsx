import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Seat() {
    const [bus, setBus] = useState<any>(null)
    const [selected, setSelected] = useState<number[]>([])
    const navigate = useNavigate()

    const BOOKED = [3, 8, 14, 21, 25]

    useEffect(() => {
        const b = JSON.parse(localStorage.getItem('bt-bus') || 'null')
        setBus(b)
    }, [])

    const toggleSeat = (n: number) => {
        if (BOOKED.includes(n)) return
        setSelected(prev => {
            if (prev.includes(n)) {
                // deselect this and adjacent
                return prev.filter(s => s !== n && s !== n + 1)
            }
            const next = [...prev, n]
            // BUG C: selecting one seat also selects the adjacent seat
            if (n + 1 <= 36 && !BOOKED.includes(n + 1)) next.push(n + 1)
            return [...new Set(next)]
        })
    }

    const proceed = () => {
        localStorage.setItem('bt-seats', JSON.stringify(selected))
        localStorage.setItem('bt-total', String(selected.length * (bus?.price || 0)))
        navigate('/payment')
    }

    if (!bus) return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--muted)' }}>No bus selected. <a href="/results" style={{ color: 'var(--primary)' }}>Go back</a></div>

    return (
        <main style={{ maxWidth: 1000, margin: '0 auto', padding: '2rem 1.5rem' }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '1.5rem' }}>Select Your Seat</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem', alignItems: 'start' }}>
                <div>
                    <div className="glass" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
                        <div style={{ fontWeight: 800 }}>{bus.name} — {bus.type}</div>
                        <div style={{ color: 'var(--muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>{bus.dep} → {bus.arr}</div>
                        {/* BUG G: Actual price (bus.price) differs from what was shown in results (bus.listPrice) */}
                        <div style={{ color: 'var(--primary)', fontWeight: 700, marginTop: '0.25rem' }}>₹{bus.price} per seat</div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', fontSize: '0.8rem', color: 'var(--muted)' }}>
                        {[['#1a2a3d', 'rgba(14,165,233,0.3)', 'Available'], ['var(--primary)', 'var(--primary)', 'Selected'], ['#1a1a1a', '#333', 'Booked']].map(([bg, border, label]) => (
                            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <div style={{ width: 16, height: 16, background: bg, border: `2px solid ${border}`, borderRadius: 4 }} />
                                {label}
                            </div>
                        ))}
                    </div>

                    <div className="glass" style={{ padding: '1.5rem' }}>
                        <div style={{ textAlign: 'right', color: 'var(--muted)', fontSize: '0.8rem', paddingBottom: '0.75rem', borderBottom: '2px dashed rgba(255,255,255,0.08)', marginBottom: '1rem' }}>🚗 Driver</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
                            {Array.from({ length: 36 }, (_, i) => i + 1).map(n => {
                                const isBooked = BOOKED.includes(n)
                                const isSel = selected.includes(n)
                                return (
                                    <motion.button key={n} whileTap={!isBooked ? { scale: 0.92 } : undefined}
                                        onClick={() => toggleSeat(n)} disabled={isBooked}
                                        style={{
                                            padding: '0.625rem', borderRadius: 8, border: `2px solid ${isBooked ? '#333' : isSel ? 'var(--primary)' : 'rgba(14,165,233,0.3)'}`,
                                            background: isBooked ? '#111' : isSel ? 'var(--primary)' : 'rgba(14,165,233,0.07)',
                                            color: isBooked ? '#444' : 'white', cursor: isBooked ? 'not-allowed' : 'pointer',
                                            fontSize: '0.8rem', fontWeight: 700, transition: 'all 0.15s', fontFamily: 'inherit'
                                        }}
                                    >{n}</motion.button>
                                )
                            })}
                        </div>
                    </div>
                </div>

                <div className="glass" style={{ padding: '1.5rem', position: 'sticky', top: 80 }}>
                    <h3 style={{ fontWeight: 800, marginBottom: '1rem' }}>Booking Summary</h3>
                    {selected.length === 0 ? (
                        <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>Select seats to see price</p>
                    ) : (
                        <>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--muted2)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                                <span>Seats</span><span>{selected.sort((a, b) => a - b).join(', ')}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--muted2)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                                <span>{selected.length} × ₹{bus.price}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem', borderTop: '1px solid var(--border)', paddingTop: '0.75rem', marginTop: '0.5rem', color: 'var(--primary)' }}>
                                <span>Total</span><span>₹{selected.length * bus.price}</span>
                            </div>
                            <motion.button whileTap={{ scale: 0.97 }} onClick={proceed} className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', fontSize: '1rem' }}>
                                Continue to Payment
                            </motion.button>
                        </>
                    )}
                </div>
            </div>
        </main>
    )
}
