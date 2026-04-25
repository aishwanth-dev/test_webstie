import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function NotFound() {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', gap: '1rem', textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '6rem', fontWeight: 900, color: 'var(--primary)', opacity: 0.2 }}>404</div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Page Not Found</h1>
            <p style={{ color: 'var(--muted)' }}>This page does not exist or has been removed.</p>
            <Link to="/" className="btn btn-primary" style={{ marginTop: '0.5rem', textDecoration: 'none' }}>← Back to Shop</Link>
        </motion.div>
    )
}
