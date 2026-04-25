import { Link } from 'react-router-dom'

export default function Navbar() {
    return (
        <header style={{
            position: 'sticky', top: 0, zIndex: 100,
            background: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}>
            {/* A11Y BUG: No skip navigation link — WCAG 2.4.1 */}
            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', gap: '2rem', height: 64 }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                    {/* A11Y BUG: Logo image without alt text — WCAG 1.1.1 */}
                    <img src="https://placehold.co/32x32/d52b1e/white?text=BT" style={{ width: 32, height: 32, borderRadius: 8 }} />
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
                    {/* A11Y BUG: Empty link — WCAG 2.4.4 */}
                    <a href="#" style={{ padding: '0.375rem 0.75rem' }}></a>
                    {/* BUG F: Offers link is dead /offers route */}
                </nav>

                {/* A11Y BUG: Icon-only button without aria-label — WCAG 4.1.2 */}
                <button style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', display: 'none' }}>☰</button>
                <button className="btn btn-primary btn-sm">Login</button>
            </div>
        </header>
    )
}
