import { Link } from 'react-router-dom'
import { Bus } from 'lucide-react'

export default function Navbar() {
    return (
        <header style={{
            position: 'sticky', top: 0, zIndex: 100,
            background: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}>
            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', gap: '2rem', height: 64 }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                    <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#d52b1e,#f87171)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Bus size={16} color="white" />
                    </div>
                    <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a' }}>BusTest</span>
                </Link>

                <nav style={{ display: 'flex', gap: '0.25rem', flex: 1 }}>
                    {['Bus Routes', 'Offers', 'Track Bus', 'Help'].map(n => (
                        <Link key={n} to={n === 'Bus Routes' ? '/results' : n === 'Offers' ? '/offers' : '#'} style={{
                            color: '#475569', textDecoration: 'none', padding: '0.375rem 0.75rem',
                            borderRadius: 8, fontSize: '0.85rem', fontWeight: 500, transition: 'all 0.15s'
                        }}
                            onMouseEnter={e => { e.currentTarget.style.color = '#d52b1e'; e.currentTarget.style.background = '#fee2e2' }}
                            onMouseLeave={e => { e.currentTarget.style.color = '#475569'; e.currentTarget.style.background = 'transparent' }}>
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
