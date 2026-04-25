import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Search } from 'lucide-react'
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
            background: '#fff', borderBottom: '1px solid #e2e8f0',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}>
            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', height: 64 }}>
                {/* Logo */}
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                    <div style={{ width: 34, height: 34, background: '#2563eb', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: 'white', fontSize: '1rem' }}>🛒</span>
                    </div>
                    <span style={{ fontWeight: 900, fontSize: '1.15rem', color: '#0f172a', letterSpacing: '-0.02em' }}>ShopTest</span>
                </Link>

                {/* Nav Links */}
                <nav style={{ display: 'flex', gap: '0.125rem', flex: 1 }}>
                    {['Electronics', 'Clothing', 'Gaming', 'Accessories'].map(cat => (
                        <Link key={cat} to={`/?cat=${cat.toLowerCase()}`} style={{
                            color: '#475569', textDecoration: 'none', padding: '0.4rem 0.75rem',
                            borderRadius: 6, fontSize: '0.875rem', fontWeight: 600, transition: 'all 0.15s'
                        }}
                            onMouseEnter={e => (e.currentTarget.style.background = '#f1f5f9')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                            {cat}
                        </Link>
                    ))}
                    {/* BUG F: "Best Sellers" goes to a broken route */}
                    <Link to="/best-sellers" style={{
                        color: '#dc2626', textDecoration: 'none', padding: '0.4rem 0.75rem',
                        borderRadius: 6, fontSize: '0.875rem', fontWeight: 700
                    }}>Best Sellers 🔥</Link>
                </nav>

                {/* Search */}
                <form onSubmit={doSearch} style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 8, overflow: 'hidden' }}>
                    <input
                        className="input"
                        style={{ background: 'transparent', border: 'none', borderRadius: 0, width: 220, boxShadow: 'none', padding: '0.5rem 0.875rem', fontSize: '0.875rem' }}
                        placeholder="Search products..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        id="search-input"
                    />
                    <button type="submit" id="search-btn" style={{ background: '#2563eb', border: 'none', cursor: 'pointer', padding: '0.5rem 0.875rem', color: 'white', display: 'flex', alignItems: 'center' }}>
                        <Search size={16} />
                    </button>
                </form>

                {/* Cart */}
                <Link to="/cart" id="cart-link" style={{ position: 'relative', color: '#0f172a', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.375rem', fontWeight: 700, fontSize: '0.875rem' }}>
                    <ShoppingCart size={22} />
                    <span>Cart</span>
                    {cartCount > 0 && (
                        <motion.span
                            key={cartCount}
                            initial={{ scale: 0 }} animate={{ scale: 1 }}
                            style={{
                                position: 'absolute', top: -8, right: -8,
                                background: '#dc2626', color: 'white',
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
