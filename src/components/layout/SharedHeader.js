import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function SharedHeader({ toggleMenu, toggleCart, getCartItemCount }) {
  return (
    <header className="header">
      <motion.button
        className="menu-toggle"
        onClick={toggleMenu}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
        aria-label="Open menu"
      >
        <div className="three-lines">
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </motion.button>

      <Link to="/" className="brand-logo" aria-label="Frameio home">
        <span className="brand-logo-text"><span className="brand-f">F</span>rameio</span>
      </Link>

      <motion.button
        className="cart-toggle"
        onClick={toggleCart}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Toggle cart"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="9" cy="21" r="1"/>
          <circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
        {getCartItemCount() > 0 && (
          <motion.span 
            className="cart-badge"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            key={getCartItemCount()}
          >
            {getCartItemCount()}
          </motion.span>
        )}
      </motion.button>
    </header>
  );
}

