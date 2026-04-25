// Cart utility — shared across pages
export const PRODUCTS = [
    { id: 1, name: 'Gaming Console Pro X', category: 'gaming', price: 499, cartPrice: 549, emoji: '🎮', rating: 4.5, reviews: 128, tag: 'HOT', description: 'Next-gen gaming console with 4K support, ray tracing, and 120fps gameplay.', reviewText: "This dress is absolutely gorgeous for fall events and girls night out! Perfect fit and quality fabric." },
    { id: 2, name: 'Wireless Gaming Headset', category: 'gaming', price: 89, cartPrice: 89, emoji: '🎧', rating: 4.2, reviews: 64, tag: 'NEW', description: '7.1 surround sound, 40hr battery, noise-cancelling mic.', reviewText: "Great headset. Clear audio, comfortable fit for long sessions." },
    { id: 3, name: '4K OLED Monitor', category: 'electronics', price: 349, cartPrice: 349, emoji: '🖥️', rating: 4.7, reviews: 210, tag: 'TOP', description: 'Crystal 4K OLED display with 144Hz, HDR10+, and 1ms response.', reviewText: "Stunning colours. Gaming and movie watching is incredible on this." },
    { id: 4, name: 'Wireless Mouse Pro', category: 'electronics', price: 45, cartPrice: 55, emoji: '🖱️', rating: 4.0, reviews: 90, tag: '', description: 'Premium noise-cancelling headphones with studio sound quality.', reviewText: "Nice feel, accurate tracking. Great for productivity." },
    { id: 5, name: 'Mechanical Keyboard', category: 'electronics', price: 129, cartPrice: 129, emoji: '⌨️', rating: 4.4, reviews: 156, tag: 'SALE', description: 'Tactile mechanical switches, per-key RGB, aluminium frame.', reviewText: "Love the satisfying click. Build quality is excellent." },
    { id: 6, name: 'USB-C Hub 7-in-1', category: 'accessories', price: 35, cartPrice: 35, emoji: '🔌', rating: 4.3, reviews: 45, tag: '', description: '7-in-1 USB hub: HDMI 4K, 3x USB-A, SD, microSD, 100W PD.', reviewText: "Compact and works perfectly. All ports as advertised." },
    { id: 7, name: 'Ergonomic Gaming Chair', category: 'gaming', price: 299, cartPrice: 299, emoji: '🪑', rating: 4.6, reviews: 77, tag: 'TOP', description: 'Memory foam lumbar, 4D armrests, 160° recline, breathable fabric.', reviewText: "So comfortable for long coding/gaming sessions. Zero back pain since." },
    { id: 8, name: 'Console Cleaning Kit', category: 'accessories', price: 19, cartPrice: 19, emoji: '🧹', rating: 3.8, reviews: 22, tag: '', description: 'Professional cleaning kit for electronics and appliances.', reviewText: "Works fine on my coffee maker and TV remote." },
]

export function getCart(): any[] {
    try { return JSON.parse(localStorage.getItem('st-cart') || '[]') } catch { return [] }
}

export function saveCart(cart: any[]) {
    localStorage.setItem('st-cart', JSON.stringify(cart))
    window.dispatchEvent(new Event('cart-updated'))
}

export function addToCart(product: any) {
    const cart = getCart()
    const existing = cart.find((i: any) => i.id === product.id)
    // BUG C: addToCart adds qty=2 every time instead of 1
    if (existing) {
        existing.qty += 2
        existing.price = product.cartPrice // price silently changes to cartPrice
    } else {
        cart.push({ ...product, price: product.cartPrice, qty: 2 })
    }
    saveCart(cart)
}
