import React from 'react';
import { useCart, CartProvider } from '../../context/CartContext';
import SharedHeader from './SharedHeader';
import FooterMenu from './FooterMenu';
import { motion, AnimatePresence } from 'framer-motion';

function CartOverlay() {
  const { isCartOpen, setIsCartOpen, cartItems, updateCartQuantity, removeFromCart, getCartItemCount, getCartTotal } = useCart();
  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div className="cart-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCartOpen(false)} />
          <motion.div className="cart-drawer" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}>
            <div className="cart-header">
              <h2>Shopping Cart</h2>
              <motion.button className="cart-close" onClick={() => setIsCartOpen(false)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>✕</motion.button>
            </div>
            <div className="cart-content">
              {cartItems.length === 0 ? (
                <div className="cart-empty">
                  <div className="empty-cart-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="9" cy="21" r="1"/>
                      <circle cx="20" cy="21" r="1"/>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                    </svg>
                  </div>
                  <h3>Your cart is empty</h3>
                  <p>Add some beautiful canvas prints to get started!</p>
                </div>
              ) : (
                <>
                  <div className="cart-items">
                    {cartItems.map((item) => (
                      <motion.div key={item.id} className="cart-item" layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                        <div className={`cart-item-image ${item.image}`}></div>
                        <div className="cart-item-details">
                          <h4>{item.name}</h4>
                          <p className="cart-item-category">{item.category}</p>
                          <p className="cart-item-size">Size: {item.size}</p>
                          <div className="cart-item-price">₹{item.price}</div>
                        </div>
                        <div className="cart-item-controls">
                          <div className="quantity-controls">
                            <motion.button className="quantity-btn" onClick={() => updateCartQuantity(item.id, item.quantity - 1)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>-</motion.button>
                            <span className="quantity">{item.quantity}</span>
                            <motion.button className="quantity-btn" onClick={() => updateCartQuantity(item.id, item.quantity + 1)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>+</motion.button>
                          </div>
                          <motion.button className="remove-item-btn" onClick={() => removeFromCart(item.id)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3,6 5,6 21,6"/>
                              <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"/>
                            </svg>
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="cart-footer">
                    <div className="cart-total">
                      <div className="total-row">
                        <span>Subtotal ({getCartItemCount()} items)</span>
                        <span className="total-price">₹{getCartTotal()}</span>
                      </div>
                      <div className="total-row delivery">
                        <span>Delivery</span>
                        <span className="delivery-price">FREE</span>
                      </div>
                      <div className="total-row final">
                        <span>Total</span>
                        <span className="final-price">₹{getCartTotal()}</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function MainInner({ children }) {
  const { setIsMenuOpen, setIsCartOpen, getCartItemCount } = useCart();
  return (
    <>
      <SharedHeader toggleMenu={() => setIsMenuOpen(true)} toggleCart={() => setIsCartOpen(true)} getCartItemCount={getCartItemCount} />
      {children}
      <FooterMenu />
      <CartOverlay />
    </>
  );
}

export default function Main({ children }) {
  return (
    <CartProvider>
      <MainInner>{children}</MainInner>
    </CartProvider>
  );
}


