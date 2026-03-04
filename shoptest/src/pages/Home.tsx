import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ShoppingCart, Zap, ArrowRight, TrendingUp, AlertCircle } from 'lucide-react'
import { PRODUCTS, addToCart } from '../utils/cart'

export default function Home() {
    const [params] = useSearchParams()
    const query = params.get('q') || ''
    const cat = params.get('cat') || ''
    const [products, setProducts] = useState(PRODUCTS)
    const [toastMsg, setToastMsg] = useState('')
    const [noBanner, setNoBanner] = useState(false)

    useEffect(() => {
        let results = PRODUCTS
        if (query) {
            const q = query.toLowerCase()
            document.title = `Results for "${query}" — ShopTest`

            // BUG D: Searching "gaming console" or "console" shows accessories instead of gaming products
            if (q.includes('gaming console') || q === 'console') {
                results = PRODUCTS.filter(p => p.category === 'accessories')
                setNoBanner(true) // Also show "no products" while products ARE showing below
            } else {
                results = PRODUCTS.filter(p =>
                    p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
                )
                setNoBanner(false)
            }
        } else if (cat) {
            results = PRODUCTS.filter(p => p.category === cat.toLowerCase())
            setNoBanner(false)
        } else {
            setNoBanner(false)
        }
        setProducts(results)
    }, [query, cat])

    const handleAdd = (product: any) => {
        addToCart(product)
        setToastMsg(`${product.name} added to cart!`)
        setTimeout(() => setToastMsg(''), 2500)
    }

    return (
        <main style={{ maxWidth: 1280, margin: '0 auto', padding: '2rem 1.5rem' }}>

            {/* Hero — only when no search */}
            {!query && !cat && (
                <motion.section
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                    style={{
                        background: 'linear-gradient(135deg, rgba(124,58,237,0.2) 0%, rgba(245,158,11,0.08) 100%)',
                        border: '1px solid rgba(124,58,237,0.2)', borderRadius: 24, padding: '4rem 3rem',
                        marginBottom: '3rem', position: 'relative', overflow: 'hidden', textAlign: 'center'
                    }}
                >
                    {/* Floating orbs */}
                    <div style={{ position: 'absolute', width: 300, height: 300, background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)', top: -100, left: -100, borderRadius: '50%' }} />
                    <div style={{ position: 'absolute', width: 200, height: 200, background: 'radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%)', bottom: -80, right: -60, borderRadius: '50%' }} />

                    <span className="badge badge-purple" style={{ marginBottom: '1rem', display: 'inline-flex' }}>
                        <TrendingUp size={10} /> Summer Sale — Up to 50% Off
                    </span>
                    <h1 style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 900, marginBottom: '1rem', lineHeight: 1.1 }}>
                        Shop the Future, <span className="shimmer-text">Today.</span>
                    </h1>
                    <p style={{ color: 'var(--muted2)', fontSize: '1.1rem', marginBottom: '2rem', maxWidth: 500, margin: '0 auto 2rem' }}>
                        Premium electronics, gaming gear, and accessories — curated for you.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/?cat=gaming" className="btn btn-primary">
                            Shop Gaming <ArrowRight size={16} />
                        </Link>
                        <Link to="/?cat=electronics" className="btn btn-ghost">
                            Electronics
                        </Link>
                    </div>
                </motion.section>
            )}

            {/* Search result heading */}
            {query && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                        Results for <span style={{ color: 'var(--primary)' }}>"{query}"</span>
                    </h2>
                    {/* BUG C: Shows "No products" banner even though products ARE shown below */}
                    {noBanner && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', borderRadius: 10, padding: '0.75rem 1rem', marginTop: '0.75rem', fontSize: '0.875rem', fontWeight: 600 }}
                        >
                            <AlertCircle size={16} /> No products found for your search.
                        </motion.div>
                    )}
                </motion.div>
            )}

            {/* Products Grid */}
            {products.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)' }}>
                    <p style={{ fontSize: '1.2rem' }}>No products found.</p>
                    <Link to="/" className="btn btn-ghost" style={{ marginTop: '1rem' }}>Browse All</Link>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
                    {products.map((p, i) => (
                        <motion.div
                            key={p.id}
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="glass"
                            style={{ overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
                            whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
                        >
                            <Link to={`/product/${p.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div style={{
                                    height: 180, background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(245,158,11,0.05))',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem',
                                    position: 'relative'
                                }}>
                                    {p.emoji}
                                    {p.tag && (
                                        <span className={`badge ${p.tag === 'SALE' ? 'badge-amber' : p.tag === 'HOT' ? 'badge-red' : p.tag === 'TOP' ? 'badge-green' : 'badge-purple'}`}
                                            style={{ position: 'absolute', top: 12, left: 12 }}>
                                            {p.tag}
                                        </span>
                                    )}
                                </div>
                            </Link>
                            <div style={{ padding: '1.25rem' }}>
                                <Link to={`/product/${p.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.25rem' }}>{p.name}</h3>
                                    <p style={{ fontSize: '0.78rem', color: 'var(--muted)', marginBottom: '0.75rem', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.description}</p>
                                </Link>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', gap: 2 }}>
                                        {[1, 2, 3, 4, 5].map(s => (
                                            <Star key={s} size={12} fill={s <= Math.floor(p.rating) ? '#f59e0b' : 'transparent'} color={s <= Math.floor(p.rating) ? '#f59e0b' : 'var(--muted)'} />
                                        ))}
                                    </div>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>({p.reviews})</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)' }}>${p.price}</span>
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        className="btn btn-primary btn-sm"
                                        onClick={() => handleAdd(p)}
                                        id={`add-cart-${p.id}`}
                                        style={{ gap: '0.3rem' }}
                                    >
                                        <ShoppingCart size={14} /> Add
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Toast */}
            <AnimatePresence>
                {toastMsg && (
                    <motion.div
                        initial={{ opacity: 0, y: 60, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: 60, x: '-50%' }}
                        style={{ position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', background: 'rgba(124,58,237,0.9)', backdropFilter: 'blur(12px)', color: 'white', padding: '0.875rem 1.5rem', borderRadius: 12, fontWeight: 600, fontSize: '0.9rem', zIndex: 999 }}
                    >
                        ✓ {toastMsg}
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    )
}
