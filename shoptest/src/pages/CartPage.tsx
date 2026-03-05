import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Globe } from 'lucide-react'
import { getCart, saveCart } from '../utils/cart'

const CURRENCIES: Record<string, { symbol: string; label: string }> = {
    USD: { symbol: '$', label: 'United States — USD' },
    EUR: { symbol: '£', label: 'Germany — EUR' }, // BUG G: Germany shows £ instead of €
    GBP: { symbol: '£', label: 'United Kingdom — GBP' },
    INR: { symbol: '₹', label: 'India — INR' },
}

export default function CartPage() {
    const [cart, setCart] = useState<any[]>([])
    const [currency, setCurrency] = useState('USD')

    useEffect(() => {
        setCart(getCart())
        window.addEventListener('cart-updated', () => setCart(getCart()))
    }, [])

    const sym = CURRENCIES[currency].symbol

    const changeQty = (id: number, delta: number) => {
        const updated = cart.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i)
        setCart(updated); saveCart(updated)
    }

    const remove = (id: number) => {
        const updated = cart.filter(i => i.id !== id)
        setCart(updated); saveCart(updated)
    }

    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0)
    const tax = subtotal * 0.1
    // BUG G: total calculation subtracts a mystery $50 from the order
    const total = subtotal + tax - 50

    return (
        <main style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '2rem' }}>Shopping Cart</h1>

            {/* Currency selector */}
            <div className="glass" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', marginBottom: '1.5rem', width: 'fit-content' }}>
                <Globe size={16} style={{ color: 'var(--muted)' }} />
                <span style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>Ship to:</span>
                <select
                    value={currency}
                    onChange={e => setCurrency(e.target.value)}
                    style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: 8, padding: '0.375rem 0.75rem', fontSize: '0.875rem', cursor: 'pointer' }}
                >
                    {Object.entries(CURRENCIES).map(([k, v]) => (
                        <option key={k} value={k}>{v.label}</option>
                    ))}
                </select>
                <span style={{ background: 'var(--primary)', color: 'white', padding: '0.15rem 0.6rem', borderRadius: 6, fontWeight: 700, fontSize: '0.875rem' }}>{sym}</span>
            </div>

            {cart.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '5rem', color: 'var(--muted)' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
                    <h2 style={{ marginBottom: '0.5rem' }}>Your cart is empty</h2>
                    <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-flex' }}>Start Shopping</Link>
                </motion.div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem', alignItems: 'start' }}>
                    {/* Items */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <AnimatePresence>
                            {cart.map(item => (
                                <motion.div
                                    key={item.id}
                                    layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                                    className="glass"
                                    style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem' }}
                                >
                                    <Link to={`/product/${item.id}`} style={{ fontSize: '2.5rem', flexShrink: 0 }}>{item.emoji}</Link>
                                    <div style={{ flex: 1 }}>
                                        <Link to={`/product/${item.id}`} style={{ textDecoration: 'none', color: 'inherit', fontWeight: 700 }}>{item.name}</Link>
                                        {/* BUG G: Price shown in cart (cartPrice) differs from product page (price) */}
                                        <p style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>{sym}{item.price} each</p>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, padding: '0.25rem 0.5rem' }}>
                                        <button onClick={() => changeQty(item.id, -1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', width: 28, height: 28, fontSize: '1.1rem' }}>−</button>
                                        <span style={{ minWidth: 24, textAlign: 'center', fontWeight: 700 }}>{item.qty}</span>
                                        <button onClick={() => changeQty(item.id, 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', width: 28, height: 28, fontSize: '1.1rem' }}>+</button>
                                    </div>
                                    <span style={{ fontWeight: 700, minWidth: 80, textAlign: 'right' }}>{sym}{(item.price * item.qty).toFixed(2)}</span>
                                    <button onClick={() => remove(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', padding: '0.25rem', transition: 'color 0.2s' }}
                                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--danger)')}
                                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Summary */}
                    <div className="glass" style={{ padding: '1.5rem', position: 'sticky', top: 80 }}>
                        <h3 style={{ fontWeight: 800, marginBottom: '1.25rem' }}>Order Summary</h3>
                        {/* Cart Completers – BUG G: still shows £ for Germany */}
                        <div style={{ background: 'var(--surface2)', borderRadius: 10, padding: '0.875rem', marginBottom: '1.25rem', border: '1px solid var(--border)' }}>
                            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', marginBottom: '0.5rem' }}>Cart-Completers for {sym}30 & Under</p>
                            {[{ e: '🧹', n: 'Cleaning Kit', p: 19 }, { e: '🔌', n: 'USB Hub', p: 25 }].map(c => (
                                <div key={c.n} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--muted2)', padding: '0.25rem 0' }}>
                                    <span>{c.e} {c.n}</span><span>{sym}{c.p}</span>
                                </div>
                            ))}
                        </div>
                        {[['Subtotal', `${sym}${subtotal.toFixed(2)}`], ['Tax (10%)', `${sym}${tax.toFixed(2)}`]].map(([l, v]) => (
                            <div key={l} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--muted2)', padding: '0.5rem 0', fontSize: '0.9rem' }}>
                                <span>{l}</span><span>{v}</span>
                            </div>
                        ))}
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem', borderTop: '1px solid var(--border)', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
                            <span>Total</span>
                            {/* BUG: Total is wrong — subtracts $50 from subtotal+tax */}
                            <span style={{ color: 'var(--primary)' }}>{sym}{total.toFixed(2)}</span>
                        </div>
                        <Link to="/checkout" className="btn btn-primary" style={{ width: '100%', marginTop: '1.25rem', textDecoration: 'none', justifyContent: 'center' }}>
                            Proceed to Checkout →
                        </Link>
                    </div>
                </div>
            )}
        </main>
    )
}
