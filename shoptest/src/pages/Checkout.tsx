import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getCart } from '../utils/cart'

export default function Checkout() {
    const [cart, setCart] = useState<any[]>([])
    const [done, setDone] = useState(false)
    const [form, setForm] = useState({ name: '', email: '', card: '', expiry: '', cvv: '', address: '', city: '', zip: '' })

    useEffect(() => { setCart(getCart()) }, [])

    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0)
    const tax = subtotal * 0.1
    // BUG G: same wrong total — $50 subtracted
    const total = subtotal + tax - 50

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        localStorage.removeItem('st-cart')
        window.dispatchEvent(new Event('cart-updated'))
        setDone(true)
    }

    if (done) return (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem', textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '5rem' }}>🎉</div>
            <h1 style={{ fontSize: '2rem', fontWeight: 900 }}>Order Confirmed!</h1>
            <p style={{ color: 'var(--muted2)' }}>Thank you for your order. You'll receive a confirmation email shortly.</p>
            <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '1.2rem' }}>Total paid: ${total.toFixed(2)}</p>
            <Link to="/" className="btn btn-primary" style={{ marginTop: '0.5rem', textDecoration: 'none' }}>Continue Shopping</Link>
        </motion.div>
    )

    return (
        <main style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '2rem' }}>Checkout</h1>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem', alignItems: 'start' }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {[
                        { legend: 'Contact', fields: [['name', 'Full Name', 'John Doe', 'text'], ['email', 'Email', 'john@example.com', 'email'], ['phone', 'Phone', '+1 555 000 0000', 'tel']] },
                        { legend: 'Shipping', fields: [['address', 'Address', '123 Main St', 'text'], ['city', 'City', 'New York', 'text'], ['zip', 'ZIP', '10001', 'text']] },
                        { legend: 'Payment', fields: [['card', 'Card Number', '4111 1111 1111 1111', 'text'], ['expiry', 'Expiry', 'MM/YY', 'text'], ['cvv', 'CVV', '123', 'text']] },
                    ].map(section => (
                        <div key={section.legend} className="glass" style={{ padding: '1.5rem' }}>
                            <h3 style={{ marginBottom: '1rem', fontWeight: 700, color: 'var(--primary)' }}>{section.legend}</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: section.fields.length === 3 && section.legend !== 'Contact' ? '1fr 1fr 1fr' : '1fr', gap: '0.75rem' }}>
                                {section.fields.map(([name, label, ph, type]) => (
                                    <div key={name} style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted)' }}>{label}</label>
                                        <input className="input" type={type} placeholder={ph} required onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    <motion.button whileTap={{ scale: 0.98 }} type="submit" className="btn btn-primary" style={{ fontSize: '1rem', padding: '1rem', borderRadius: 12 }}>
                        🔒 Place Order
                    </motion.button>
                </form>

                {/* Summary */}
                <div className="glass" style={{ padding: '1.5rem', position: 'sticky', top: 80 }}>
                    <h3 style={{ fontWeight: 800, marginBottom: '1rem' }}>Order Summary</h3>
                    {cart.map(item => (
                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', fontSize: '0.875rem', color: 'var(--muted2)' }}>
                            <span>{item.emoji} {item.name} ×{item.qty}</span>
                            <span>${(item.price * item.qty).toFixed(2)}</span>
                        </div>
                    ))}
                    <div style={{ borderTop: '1px solid var(--border)', marginTop: '0.75rem', paddingTop: '0.75rem' }}>
                        {[['Subtotal', `$${subtotal.toFixed(2)}`], ['Tax (10%)', `$${tax.toFixed(2)}`]].map(([l, v]) => (
                            <div key={l} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--muted)', fontSize: '0.9rem', padding: '0.25rem 0' }}>
                                <span>{l}</span><span>{v}</span>
                            </div>
                        ))}
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem', marginTop: '0.5rem', color: 'var(--primary)' }}>
                            <span>Total</span>
                            {/* BUG G: Wrong total — subtracted $50 */}
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>
                    <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '0.75rem', marginTop: '1rem' }}>🔒 Secured by ShopTest Pay</p>
                </div>
            </div>
        </main>
    )
}
