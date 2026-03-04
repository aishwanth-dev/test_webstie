import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Search, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { getCart } from '../utils/cart'

export default function Navbar() {
    const [query, setQuery] = useState('')
    const [cartCount, setCartCount] = useState(0)

    const navigate = useNavigate()

    useEffect(() => {
        const update = () => {
            const cart = getCart()
            setCartCount(cart.reduce((s: number, i: any) => s + i.qty, 0))
        }
        update()
        window.addEventListener('cart-updated', update)
        return () => window.removeEventListener('cart-updated', update)
    }, [])

    const doSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (query.trim()) navigate(`/?q=${encodeURIComponent(query)}`)
    }

    return (
        <header style={{
            position: 'sticky', top: 0, zIndex: 100,
            background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}>
            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', height: 64 }}>
                {/* Logo */}
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                    <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#7c3aed,#a78bfa)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Zap size={16} color="white" />
                    </div>
                    <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'white' }}>ShopTest</span>
                </Link>

                {/* Nav Links */}
                <nav style={{ display: 'flex', gap: '0.25rem', flex: 1 }}>
                    {['Electronics', 'Clothing', 'Gaming', 'Accessories'].map(cat => (
                        <Link key={cat} to={`/?cat=${cat.toLowerCase()}`} style={{
                            color: 'var(--muted2)', textDecoration: 'none', padding: '0.375rem 0.75rem',
                            borderRadius: 8, fontSize: '0.85rem', fontWeight: 500, transition: 'all 0.2s'
                        }}
                            onMouseEnter={e => (e.currentTarget.style.color = 'white')}
                            onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted2)')}>
                            {cat}
                        </Link>
                    ))}
                    {/* BUG F: "Best Sellers" goes to a broken route */}
                    <Link to="/best-sellers" style={{
                        color: 'var(--muted2)', textDecoration: 'none', padding: '0.375rem 0.75rem',
                        borderRadius: 8, fontSize: '0.85rem', fontWeight: 500, transition: 'all 0.2s'
                    }}>Best Sellers</Link>
                </nav>

                {/* Search */}
                <form onSubmit={doSearch} style={{ display: 'flex', alignItems: 'center', gap: 0, background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
                    <input
                        className="input"
                        style={{ background: 'transparent', border: 'none', borderRadius: 0, width: 200, boxShadow: 'none', padding: '0.5rem 0.75rem' }}
                        placeholder="Search products..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                    />
                    <button type="submit" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 0.75rem', color: 'var(--muted)' }}>
                        <Search size={16} />
                    </button>
                </form>

                {/* Cart */}
                <Link to="/cart" style={{ position: 'relative', color: 'white', textDecoration: 'none' }}>
                    <ShoppingCart size={22} />
                    {cartCount > 0 && (
                        <motion.span
                            key={cartCount}
                            initial={{ scale: 0 }} animate={{ scale: 1 }}
                            style={{
                                position: 'absolute', top: -8, right: -8,
                                background: 'var(--primary)', color: 'white',
                                fontSize: '0.65rem', fontWeight: 800, width: 18, height: 18,
                                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                        >{cartCount}</motion.span>
                    )}
                </Link>
            </div>
        </header>
    )
}
