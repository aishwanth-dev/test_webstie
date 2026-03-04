import { Link } from 'react-router-dom'
import { Bus } from 'lucide-react'

export default function Navbar() {
    return (
        <header style={{
            position: 'sticky', top: 0, zIndex: 100,
            background: 'rgba(2,11,24,0.88)', backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(99,179,255,0.08)',
        }}>
            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', gap: '2rem', height: 64 }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                    <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#0ea5e9,#38bdf8)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Bus size={16} color="white" />
                    </div>
                    <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'white' }}>BusTest</span>
                </Link>

                <nav style={{ display: 'flex', gap: '0.25rem', flex: 1 }}>
                    {['Bus Routes', 'Offers', 'Track Bus', 'Help'].map(n => (
                        <Link key={n} to={n === 'Bus Routes' ? '/results' : n === 'Offers' ? '/offers' : '#'} style={{
                            color: 'var(--muted2)', textDecoration: 'none', padding: '0.375rem 0.75rem',
                            borderRadius: 8, fontSize: '0.85rem', fontWeight: 500, transition: 'color 0.2s'
                        }}
                            onMouseEnter={e => (e.currentTarget.style.color = 'white')}
                            onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted2)')}>
                            {n}
                        </Link>
                    ))}
                    {/* BUG F: Offers link is dead /offers route */}
                </nav>

                <button className="btn btn-primary btn-sm">Login</button>
            </div>
        </header>
    )
}
