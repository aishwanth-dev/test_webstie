import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, Wifi, Zap, Droplets, AlertCircle } from 'lucide-react'

const BUSES = [
    { id: 1, name: 'VRL Travels', type: 'Volvo AC Sleeper', dep: '21:30', arr: '06:00', duration: '8h 30m', price: 699, listPrice: 499, seats: 32, rating: 4.5, amenities: ['WiFi', 'Charging', 'Water'] },
    { id: 2, name: 'SRS Travels', type: 'AC Semi-Sleeper', dep: '22:00', arr: '06:30', duration: '8h 30m', price: 549, listPrice: 399, seats: 40, rating: 4.2, amenities: ['Charging', 'Blanket'] },
    { id: 3, name: 'Orange Travels', type: 'Non-AC Sleeper', dep: '20:00', arr: '05:30', duration: '9h 30m', price: 349, listPrice: 299, seats: 36, rating: 3.9, amenities: ['Water'] },
    { id: 4, name: 'KSRTC Express', type: 'AC Seater', dep: '09:00', arr: '17:00', duration: '8h', price: 449, listPrice: 449, seats: 45, rating: 4.7, amenities: ['WiFi', 'AC', 'Charging', 'Water'] },
    { id: 5, name: 'Patel Travels', type: 'Non-AC Seater', dep: '07:30', arr: '16:30', duration: '9h', price: 299, listPrice: 249, seats: 50, rating: 3.8, amenities: ['Water'] },
]

const AMENITY_ICONS: Record<string, any> = { WiFi: Wifi, Charging: Zap, Water: Droplets }

export default function Results() {
    const [from, setFrom] = useState('')
    const [to, setTo] = useState('')
    const [date, setDate] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        setFrom(localStorage.getItem('bt-from') || 'Chennai')
        setTo(localStorage.getItem('bt-to') || 'Bangalore')
        setDate(localStorage.getItem('bt-date-display') || 'Today')
    }, [])

    const selectBus = (bus: any) => {
        localStorage.setItem('bt-bus', JSON.stringify(bus))
        navigate('/seat')
    }

    return (
        <main style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{from} → {to} | {date}</h2>
                <p style={{ color: 'var(--muted)', marginTop: '0.25rem' }}>{BUSES.length} buses available</p>

                {/* BUG D: "No buses found" always shown even though buses ARE listed */}
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', borderRadius: 10, padding: '0.75rem 1rem', marginTop: '0.75rem', fontSize: '0.875rem', fontWeight: 600 }}>
                    <AlertCircle size={16} /> No buses found for this route. Try different dates.
                </motion.div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {BUSES.map((bus, i) => (
                    <motion.div key={bus.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                        className="glass" style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr', gap: '1rem', alignItems: 'center', padding: '1.5rem' }}>
                        <div>
                            <div style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: '0.25rem' }}>🚌 {bus.name}</div>
                            <div style={{ color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>{bus.type}</div>
                            <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                                {bus.amenities.map(a => {
                                    const Icon = AMENITY_ICONS[a]
                                    return <span key={a} className="badge badge-blue" style={{ fontSize: '0.65rem' }}>{Icon && <Icon size={10} />}{a}</span>
                                })}
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>{bus.dep}</span>
                            <div style={{ flex: 1, textAlign: 'center' }}>
                                <div style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>{bus.duration}</div>
                                <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,var(--primary),transparent)', margin: '0.25rem 0' }} />
                            </div>
                            <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>{bus.arr}</span>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontWeight: 700, color: 'var(--success)', fontSize: '0.9rem' }}>{bus.seats} seats</div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', marginTop: '0.25rem' }}>
                                <Star size={12} fill="#f59e0b" color="#f59e0b" />
                                <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{bus.rating}</span>
                            </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            {/* BUG G: listPrice (shown here) differs from actual price on seat page */}
                            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary)' }}>₹{bus.listPrice}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>per seat</div>
                            <motion.button whileTap={{ scale: 0.97 }} onClick={() => selectBus(bus)} className="btn btn-primary btn-sm">
                                Select Seats
                            </motion.button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </main>
    )
}
