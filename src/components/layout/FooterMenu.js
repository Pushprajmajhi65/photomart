import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export default function FooterMenu() {
  const navigate = useNavigate();
  const { isMenuOpen, setIsMenuOpen } = useCart();

  const navigateToPage = (page) => {
    navigate(`/${page === 'home' ? '' : page}`);
    setIsMenuOpen(false);
  };

  return (
    <AnimatePresence>
      {isMenuOpen && (
        <motion.footer className="footer-menu" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}>
          <div className="footer-menu-card">
            <button className="footer-close" aria-label="Close menu" onClick={() => setIsMenuOpen(false)}>✕</button>
            <div className="footer-content">
              <motion.button className="footer-icon-button" onClick={() => navigateToPage('home')} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} title="Home">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                  <polyline points="9,22 9,12 15,12 15,22"/>
                </svg>
                <span>Home</span>
              </motion.button>
              <motion.button className="footer-icon-button" onClick={() => navigateToPage('collection')} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} title="Collection">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7"/>
                  <rect x="14" y="3" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/>
                </svg>
                <span>Collection</span>
              </motion.button>
              <motion.button className="footer-icon-button" onClick={() => navigateToPage('editor')} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} title="Image Editor">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
                <span>Editor</span>
              </motion.button>
              <motion.button className="footer-icon-button" onClick={() => navigateToPage('gifts')} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} title="Gifts">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20,12 20,22 4,22 4,12"/>
                  <rect x="2" y="7" width="20" height="5"/>
                  <line x1="12" y1="22" x2="12" y2="7"/>
                  <path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/>
                  <path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/>
                </svg>
                <span>Gifts</span>
              </motion.button>
            </div>
          </div>
        </motion.footer>
      )}
    </AnimatePresence>
  );
}


