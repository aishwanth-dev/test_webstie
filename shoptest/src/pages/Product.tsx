import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Star, ShoppingCart, ChevronLeft } from 'lucide-react'
import { PRODUCTS, addToCart } from '../utils/cart'

export default function Product() {
    const { id } = useParams()
    const product = PRODUCTS.find(p => p.id === Number(id))
    const [qty, setQty] = useState(1)
    const [added, setAdded] = useState(false)

    if (!product) return (
        <div style={{ textAlign: 'center', padding: '6rem', color: 'var(--muted)' }}>
            <h2>Product not found</h2>
            <Link to="/" className="btn btn-ghost" style={{ marginTop: '1rem', display: 'inline-flex' }}>← Back</Link>
        </div>
    )

    const handleAdd = () => {
        for (let i = 0; i < qty; i++) addToCart(product)
        setAdded(true)
        setTimeout(() => setAdded(false), 2000)
    }

    return (
        <main style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem' }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--muted2)', textDecoration: 'none', marginBottom: '2rem', fontSize: '0.875rem' }}>
                <ChevronLeft size={16} /> Back to Shop
            </Link>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>
                {/* Image */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    className="glass"
                    style={{
                        height: 420, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9rem',
                        background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(245,158,11,0.05))'
                    }}
                >
                    {product.emoji}
                </motion.div>

                {/* Info */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <span className="badge badge-purple" style={{ marginBottom: '0.75rem', display: 'inline-flex' }}>{product.category}</span>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, lineHeight: 1.2, marginBottom: '0.5rem' }}>{product.name}</h1>
                        {/* BUG G: Description is wrong for id=4 (says "noise-cancelling headphones" for a mouse) */}
                        <p style={{ color: 'var(--muted2)', lineHeight: 1.7 }}>{product.description}</p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', gap: 3 }}>
                            {[1, 2, 3, 4, 5].map(s => (
                                <Star key={s} size={16} fill={s <= Math.floor(product.rating) ? '#f59e0b' : 'transparent'} color={s <= Math.floor(product.rating) ? '#f59e0b' : 'var(--muted)'} />
                            ))}
                        </div>
                        <span style={{ color: 'var(--muted)' }}>{product.rating} · {product.reviews} reviews</span>
                    </div>

                    <div style={{ padding: '1.25rem', background: 'var(--surface2)', borderRadius: 14, border: '1px solid var(--border)' }}>
                        {/* BUG G: Displayed price differs from cart price */}
                        <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--primary)' }}>${product.price}</div>
                        {product.price !== product.cartPrice && (
                            <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.25rem' }}>
                                Free shipping · Est. delivery 3-5 days
                            </p>
                        )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 10, padding: '0.5rem' }}>
                            <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.2rem', width: 32, height: 32 }}>−</button>
                            <span style={{ minWidth: 32, textAlign: 'center', fontWeight: 700 }}>{qty}</span>
                            <button onClick={() => setQty(qty + 1)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.2rem', width: 32, height: 32 }}>+</button>
                        </div>
                        <motion.button
                            whileTap={{ scale: 0.97 }}
                            className="btn btn-primary"
                            onClick={handleAdd}
                            style={{ flex: 1, fontSize: '1rem', gap: '0.5rem' }}
                        >
                            <ShoppingCart size={18} />
                            {added ? '✓ Added to Cart!' : 'Add to Cart'}
                        </motion.button>
                    </div>

                    <Link to="/cart" className="btn btn-ghost" style={{ textAlign: 'center', textDecoration: 'none' }}>
                        View Cart →
                    </Link>
                </motion.div>
            </div>

            {/* Reviews - BUG G: Product #1 (Gaming Console) shows dress review */}
            <motion.section
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                style={{ marginTop: '3rem', borderTop: '1px solid var(--border)', paddingTop: '2rem' }}
            >
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.5rem' }}>
                    Customer Reviews <span style={{ color: 'var(--muted)', fontWeight: 400, fontSize: '1rem' }}>({product.reviews})</span>
                </h2>

                {/* BUG: If product.id === 1, reviewText is about a dress, not a gaming console */}
                {[
                    { name: 'Sarah M.', rating: 5, text: product.reviewText },
                    { name: 'James T.', rating: 4, text: 'Works exactly as described. Good value for the price.' },
                    { name: 'Priya R.', rating: 5, text: 'Super fast shipping, exactly as described. Would buy again.' },
                ].map((r, i) => (
                    <div key={i} className="glass" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                            <div style={{ width: 36, height: 36, background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem' }}>
                                {r.name[0]}
                            </div>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{r.name}</div>
                                <div style={{ display: 'flex', gap: 2, marginTop: 2 }}>
                                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={11} fill={s <= r.rating ? '#f59e0b' : 'transparent'} color={s <= r.rating ? '#f59e0b' : 'var(--muted)'} />)}
                                </div>
                            </div>
                        </div>
                        <p style={{ color: 'var(--muted2)', lineHeight: 1.6, fontSize: '0.9rem' }}>{r.text}</p>
                    </div>
                ))}
            </motion.section>
        </main>
    )
}
