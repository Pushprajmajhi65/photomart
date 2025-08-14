import React, { useState, useEffect } from 'react';
import ThreeCanvasPreview from './ThreeCanvasPreview';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SharedHeaderCmp from './components/layout/SharedHeader';
import CustomerForm from './CustomerForm';
import ImageEditor from './ImageEditor';
import RoomView from './RoomView';
import './App.css';

function AppContent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('photomart-cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [uploadedImages, setUploadedImages] = useState({
    frame1: null,
    frame2: null,
    frame3: null
  });
  const navigate = useNavigate();
  const location = useLocation();


  useEffect(() => {
    const handleMouseMove = (e) => {
      // Don't auto-show footer menu on Image Editor page
      if (location.pathname === '/editor') {
        return;
      }
      
      const threshold = 90;
      if (window.innerHeight - e.clientY <= threshold) {
        setIsMenuOpen(true);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [location.pathname]);

  // Save cart to localStorage whenever cartItems changes
  useEffect(() => {
    localStorage.setItem('photomart-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const handleImageUpload = (frameId, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImages(prev => ({
          ...prev,
          [frameId]: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navigateToPage = (page) => {
    navigate(`/${page === 'home' ? '' : page}`);
    setIsMenuOpen(false);
  };

  // Cart functionality
  const addToCart = (product, size, price) => {
    const cartItem = {
      id: `${product.id}-${size}`,
      productId: product.id,
      name: product.name,
      image: product.image,
      category: product.category,
      size: size,
      price: price,
      quantity: 1
    };

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === cartItem.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === cartItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, cartItem];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const updateCartQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const SharedHeader = () => (
    <SharedHeaderCmp toggleMenu={toggleMenu} toggleCart={toggleCart} getCartItemCount={getCartItemCount} />
  );

  const HomePage = () => (
    <>
      <SharedHeader />

      {/* Hero */}
      <section className="hero-section">
        <div className="hero-bg">
          <div className="hero-anim-bg">
            <div className="anim-cube a1"></div>
            <div className="anim-cube a2"></div>
            <div className="anim-cube a3"></div>
            <div className="anim-pill p1"></div>
            <div className="anim-pill p2"></div>
          </div>
        </div>
        <div className="hero-inner">
          <h1 className="hero-title">Premium Personalized Canvas Photo Frames</h1>
          <p className="hero-subtitle">Preserve your best memories in stunning detail — crafted with museum-quality printing and premium wood frames.</p>
        </div>
      </section>

      {/* Premium landing cards */}
      <section className="landing-cards">
        {/* Left - Custom Canvas */}
        <div className="landing-card landing-card--sm landing-card--left">
          <div className="landing-card__icon">🎨</div>
          <h3>Custom Canvas</h3>
          <p>Create Your Own Canvas</p>
          <div className="landing-card__media is-placeholder"></div>
        </div>

        {/* Center - Collection (primary focus) */}
        <div className="landing-card landing-card--xl landing-card--center">
          <div className="landing-card__icon">📁</div>
          <h2>Collection</h2>
          <p>Premium Art Canvas</p>
          <div
            className="landing-card__media"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1540574173026-643ea20ade25?q=80&w=1600&auto=format&fit=crop')",
            }}
          />
        </div>

        {/* Right - Gifts */}
        <div className="landing-card landing-card--sm landing-card--right">
          <div className="landing-card__icon">🎁</div>
          <h3>Gifts</h3>
          <p>Personalized Items</p>
          <div
            className="landing-card__media"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1585386959984-a4155223168f?q=80&w=1600&auto=format&fit=crop')",
            }}
          />
        </div>
      </section>

      {/* Features removed as requested */}

      {/* Our Collection */}
      <section className="section collection-showcase">
        <div className="collection-header">
          <h2 className="section-title-collection">Our Curated Collection</h2>
          <p className="collection-subtitle">Discover professionally designed canvas artworks ready to transform your space</p>
        </div>
        <div className="collection-grid">
          <motion.div className="collection-item" whileHover={{ y: -8 }} transition={{ duration: 0.3 }}>
            <div className="collection-image nature"></div>
            <div className="collection-overlay">
              <div className="collection-content">
                <h3>Nature's Serenity</h3>
                <p>Peaceful landscapes that bring tranquility to any room</p>
                <div className="collection-actions">
                  <motion.button className="preview-btn" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                    Preview
                  </motion.button>
                  <motion.button className="customize-btn" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigateToPage('editor')}>
                    Customize
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div className="collection-item" whileHover={{ y: -8 }} transition={{ duration: 0.3 }}>
            <div className="collection-image abstract"></div>
            <div className="collection-overlay">
              <div className="collection-content">
                <h3>Modern Abstract</h3>
                <p>Contemporary designs perfect for modern interiors</p>
                <div className="collection-actions">
                  <motion.button className="preview-btn" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                    Preview
                  </motion.button>
                  <motion.button className="customize-btn" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigateToPage('editor')}>
                    Customize
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div className="collection-item" whileHover={{ y: -8 }} transition={{ duration: 0.3 }}>
            <div className="collection-image minimalist"></div>
            <div className="collection-overlay">
              <div className="collection-content">
                <h3>Minimalist Art</h3>
                <p>Clean, simple designs that complement any aesthetic</p>
                <div className="collection-actions">
                  <motion.button className="preview-btn" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                    Preview
                  </motion.button>
                  <motion.button className="customize-btn" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigateToPage('editor')}>
                    Customize
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div className="collection-item" whileHover={{ y: -8 }} transition={{ duration: 0.3 }}>
            <div className="collection-image vintage"></div>
            <div className="collection-overlay">
              <div className="collection-content">
                <h3>Vintage Classics</h3>
                <p>Timeless artwork with classic appeal and charm</p>
                <div className="collection-actions">
                  <motion.button className="preview-btn" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                    Preview
                  </motion.button>
                  <motion.button className="customize-btn" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigateToPage('editor')}>
                    Customize
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div className="collection-item" whileHover={{ y: -8 }} transition={{ duration: 0.3 }}>
            <div className="collection-image botanical"></div>
            <div className="collection-overlay">
              <div className="collection-content">
                <h3>Botanical Beauty</h3>
                <p>Fresh plant-inspired designs for nature lovers</p>
                <div className="collection-actions">
                  <motion.button className="preview-btn" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                    Preview
                  </motion.button>
                  <motion.button className="customize-btn" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigateToPage('editor')}>
                    Customize
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div className="collection-item" whileHover={{ y: -8 }} transition={{ duration: 0.3 }}>
            <div className="collection-image geometric"></div>
            <div className="collection-overlay">
              <div className="collection-content">
                <h3>Geometric Patterns</h3>
                <p>Bold shapes and patterns for contemporary spaces</p>
                <div className="collection-actions">
                  <motion.button className="preview-btn" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                    Preview
                  </motion.button>
                  <motion.button className="customize-btn" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigateToPage('editor')}>
                    Customize
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        <div className="collection-footer">
          <motion.button 
            className="view-all-btn" 
            onClick={() => navigateToPage('collection')}
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
          >
            View All Collections
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14"/>
              <path d="M12 5l7 7-7 7"/>
            </svg>
          </motion.button>
        </div>
      </section>

      {/* How it works */}
      <section className="section how-it-works-modern">
        <div className="section-header-modern">
          <h2 className="section-title-modern">Create Your Perfect Canvas in 4 Simple Steps</h2>
          <p className="section-subtitle">Transform your memories into stunning wall art with our streamlined process</p>
        </div>
        <div className="steps-container-modern">
          <div className="step-card-modern">
            <div className="step-number">01</div>
            <div className="step-content-modern">
              <div className="step-icon-modern">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              </div>
              <h3>Upload Your Photo</h3>
              <p>Drag and drop or browse to select your favorite high-resolution image</p>
            </div>
            <div className="step-connector"></div>
          </div>
          
          <div className="step-card-modern">
            <div className="step-number">02</div>
            <div className="step-content-modern">
              <div className="step-icon-modern">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <rect x="7" y="7" width="10" height="10"/>
                </svg>
              </div>
              <h3>Customize & Preview</h3>
              <p>Choose your canvas size, frame style, and see a live 3D preview</p>
            </div>
            <div className="step-connector"></div>
          </div>
          
          <div className="step-card-modern">
            <div className="step-number">03</div>
            <div className="step-content-modern">
              <div className="step-icon-modern">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1"/>
                  <circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
                </svg>
              </div>
              <h3>Secure Checkout</h3>
              <p>Complete your order with our safe and encrypted payment process</p>
            </div>
            <div className="step-connector"></div>
          </div>
          
          <div className="step-card-modern">
            <div className="step-number">04</div>
            <div className="step-content-modern">
              <div className="step-icon-modern">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="3" width="15" height="13"/>
                  <polygon points="16,3 21,8 21,21 16,21"/>
                  <polygon points="1,21 7,21 7,3"/>
                </svg>
              </div>
              <h3>Premium Delivery</h3>
              <p>Receive your museum-quality canvas, carefully packaged and ready to hang</p>
            </div>
          </div>
        </div>
      </section>





      {/* Floating quick actions */}
      <div className="floating-cta">
        <button className="cta-primary" onClick={() => navigateToPage('editor')}>Start Editing</button>
        <button className="cta-secondary" onClick={() => navigateToPage('custom')}>Custom Frames</button>
      </div>


    </>
  );

  const CollectionPage = () => (
    <>
      <SharedHeader />
      <div className="collection-page">
        <motion.div className="collection-page-header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="collection-page-hero">
            <h1>Our Complete Collection</h1>
            <p>Discover professionally curated canvas artworks designed to transform any space</p>
            <div className="collection-stats">
              <div className="stat">
                <span className="stat-number">100+</span>
                <span className="stat-label">Unique Designs</span>
              </div>
              <div className="stat">
                <span className="stat-number">6</span>
                <span className="stat-label">Categories</span>
              </div>
              <div className="stat">
                <span className="stat-number">Premium</span>
                <span className="stat-label">Quality</span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="collection-page-content">
          <div className="collection-categories">
            <motion.div className="category-section" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h2 className="category-title">Nature's Serenity</h2>
              <p className="category-description">Peaceful landscapes and natural scenes that bring tranquility to any room</p>
              <div className="category-grid">
                <div className="collection-card" onClick={() => navigate('/details/nature-mountain-mist')}>
                  <div className="card-image nature-1"></div>
                  <div className="card-overlay">
                    <div className="card-content">
                      <h3>Mountain Mist</h3>
                      <p>Serene mountain landscape with morning fog</p>
                      <div className="card-actions">
                        <button className="preview-btn-page" onClick={(e) => e.stopPropagation()}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                          Preview
                        </button>
                        <button className="customize-btn-page" onClick={(e) => { e.stopPropagation(); navigate('/details/nature-mountain-mist'); }}>View Details</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="collection-card" onClick={() => navigate('/details/nature-forest-path')}>
                  <div className="card-image nature-2"></div>
                  <div className="card-overlay">
                    <div className="card-content">
                      <h3>Forest Path</h3>
                      <p>Winding path through lush green forest</p>
                      <div className="card-actions">
                        <button className="preview-btn-page" onClick={(e) => e.stopPropagation()}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                          Preview
                        </button>
                        <button className="customize-btn-page" onClick={(e) => { e.stopPropagation(); navigate('/details/nature-forest-path'); }}>View Details</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="collection-card" onClick={() => navigate('/details/nature-ocean-waves')}>
                  <div className="card-image nature-3"></div>
                  <div className="card-overlay">
                    <div className="card-content">
                      <h3>Ocean Waves</h3>
                      <p>Calming ocean waves on pristine beach</p>
                      <div className="card-actions">
                        <button className="preview-btn-page" onClick={(e) => e.stopPropagation()}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                          Preview
                        </button>
                        <button className="customize-btn-page" onClick={(e) => { e.stopPropagation(); navigate('/details/nature-ocean-waves'); }}>View Details</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="category-footer">
                <motion.button 
                  className="view-more-btn"
                  onClick={() => navigate('/collection/nature')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  View More Nature Collection
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14"/>
                    <path d="M12 5l7 7-7 7"/>
                  </svg>
                </motion.button>
              </div>
            </motion.div>

            <motion.div className="category-section" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <h2 className="category-title">Modern Abstract</h2>
              <p className="category-description">Contemporary designs perfect for modern interiors and creative spaces</p>
              <div className="category-grid">
                <div className="collection-card" onClick={() => navigate('/details/abstract-color-flow')}>
                  <div className="card-image abstract-1"></div>
                  <div className="card-overlay">
                    <div className="card-content">
                      <h3>Color Flow</h3>
                      <p>Dynamic abstract with flowing colors</p>
                      <div className="card-actions">
                        <button className="preview-btn-page" onClick={(e) => e.stopPropagation()}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                          Preview
                        </button>
                        <button className="customize-btn-page" onClick={(e) => { e.stopPropagation(); navigate('/details/abstract-color-flow'); }}>View Details</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="collection-card" onClick={() => navigate('/details/abstract-urban-energy')}>
                  <div className="card-image abstract-2"></div>
                  <div className="card-overlay">
                    <div className="card-content">
                      <h3>Urban Energy</h3>
                      <p>Bold geometric patterns with vibrant energy</p>
                      <div className="card-actions">
                        <button className="preview-btn-page" onClick={(e) => e.stopPropagation()}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                          Preview
                        </button>
                        <button className="customize-btn-page" onClick={(e) => { e.stopPropagation(); navigate('/details/abstract-urban-energy'); }}>View Details</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="collection-card" onClick={() => navigate('/details/abstract-fluid-motion')}>
                  <div className="card-image abstract-3"></div>
                  <div className="card-overlay">
                    <div className="card-content">
                      <h3>Fluid Motion</h3>
                      <p>Smooth abstract forms in motion</p>
                      <div className="card-actions">
                        <button className="preview-btn-page" onClick={(e) => e.stopPropagation()}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                          Preview
                        </button>
                        <button className="customize-btn-page" onClick={(e) => { e.stopPropagation(); navigate('/details/abstract-fluid-motion'); }}>View Details</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="category-footer">
                <motion.button 
                  className="view-more-btn"
                  onClick={() => navigate('/collection/abstract')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  View More Abstract Collection
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14"/>
                    <path d="M12 5l7 7-7 7"/>
                  </svg>
                </motion.button>
              </div>
            </motion.div>

            <motion.div className="category-section" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <h2 className="category-title">Minimalist Art</h2>
              <p className="category-description">Clean, simple designs that complement any aesthetic with understated elegance</p>
              <div className="category-grid">
                <div className="collection-card">
                  <div className="card-image minimal-1"></div>
                  <div className="card-overlay">
                    <div className="card-content">
                      <h3>Simple Lines</h3>
                      <p>Clean geometric lines in neutral tones</p>
                      <div className="card-actions">
                        <button className="preview-btn-page">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                          Preview
                        </button>
                        <button className="customize-btn-page" onClick={(e) => { e.stopPropagation(); navigate('/details/abstract-color-flow'); }}>View Details</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="collection-card">
                  <div className="card-image minimal-2"></div>
                  <div className="card-overlay">
                    <div className="card-content">
                      <h3>Zen Balance</h3>
                      <p>Peaceful minimalist composition</p>
                      <div className="card-actions">
                        <button className="preview-btn-page">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                          Preview
                        </button>
                        <button className="customize-btn-page" onClick={(e) => { e.stopPropagation(); navigate('/details/abstract-color-flow'); }}>View Details</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="collection-card">
                  <div className="card-image minimal-3"></div>
                  <div className="card-overlay">
                    <div className="card-content">
                      <h3>Pure Form</h3>
                      <p>Essential shapes in perfect harmony</p>
                      <div className="card-actions">
                        <button className="preview-btn-page">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                          Preview
                        </button>
                        <button className="customize-btn-page" onClick={(e) => { e.stopPropagation(); navigate('/details/abstract-color-flow'); }}>View Details</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="category-footer">
                <motion.button 
                  className="view-more-btn"
                  onClick={() => navigate('/collection/minimalist')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  View More Minimalist Collection
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14"/>
                    <path d="M12 5l7 7-7 7"/>
                  </svg>
                </motion.button>
              </div>
            </motion.div>

            <motion.div className="category-section" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
              <h2 className="category-title">Divine Goddess Collection</h2>
              <p className="category-description">Sacred and spiritual artwork featuring revered goddesses and religious iconography</p>
              <div className="category-grid">
                <div className="collection-card">
                  <div className="card-image goddess-1"></div>
                  <div className="card-overlay">
                    <div className="card-content">
                      <h3>Goddess Durga</h3>
                      <p>Powerful divine mother goddess in vibrant colors</p>
                      <div className="card-actions">
                        <button className="preview-btn-page">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                          Preview
                        </button>
                        <button className="customize-btn-page" onClick={(e) => { e.stopPropagation(); navigate('/details/abstract-color-flow'); }}>View Details</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="collection-card">
                  <div className="card-image goddess-2"></div>
                  <div className="card-overlay">
                    <div className="card-content">
                      <h3>Goddess Lakshmi</h3>
                      <p>Goddess of wealth and prosperity with lotus</p>
                      <div className="card-actions">
                        <button className="preview-btn-page">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                          Preview
                        </button>
                        <button className="customize-btn-page" onClick={(e) => { e.stopPropagation(); navigate('/details/abstract-color-flow'); }}>View Details</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="collection-card">
                  <div className="card-image goddess-3"></div>
                  <div className="card-overlay">
                    <div className="card-content">
                      <h3>Goddess Saraswati</h3>
                      <p>Goddess of knowledge and arts with veena</p>
                      <div className="card-actions">
                        <button className="preview-btn-page">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                          Preview
                        </button>
                        <button className="customize-btn-page" onClick={(e) => { e.stopPropagation(); navigate('/details/abstract-color-flow'); }}>View Details</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="category-footer">
                <motion.button 
                  className="view-more-btn"
                  onClick={() => navigate('/collection/goddess')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  View More Goddess Collection
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14"/>
                    <path d="M12 5l7 7-7 7"/>
                  </svg>
                </motion.button>
              </div>
            </motion.div>

            <motion.div className="category-section" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}>
              <h2 className="category-title">Celebrity Artists</h2>
              <p className="category-description">Stunning portraits of famous actors and actresses from around the world</p>
              <div className="category-grid">
                <div className="collection-card">
                  <div className="card-image celebrity-1"></div>
                  <div className="card-overlay">
                    <div className="card-content">
                      <h3>Shah Rukh Khan</h3>
                      <p>King of Bollywood in classic portrait style</p>
                      <div className="card-actions">
                        <button className="preview-btn-page">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                          Preview
                        </button>
                        <button className="customize-btn-page" onClick={(e) => { e.stopPropagation(); navigate('/details/abstract-color-flow'); }}>View Details</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="collection-card">
                  <div className="card-image celebrity-2"></div>
                  <div className="card-overlay">
                    <div className="card-content">
                      <h3>Tom Holland</h3>
                      <p>Spider-Man actor in dynamic portrait</p>
                      <div className="card-actions">
                        <button className="preview-btn-page">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                          Preview
                        </button>
                        <button className="customize-btn-page" onClick={(e) => { e.stopPropagation(); navigate('/details/abstract-color-flow'); }}>View Details</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="collection-card">
                  <div className="card-image celebrity-3"></div>
                  <div className="card-overlay">
                    <div className="card-content">
                      <h3>Priyanka Chopra</h3>
                      <p>Global icon in elegant artistic style</p>
                      <div className="card-actions">
                        <button className="preview-btn-page">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                          Preview
                        </button>
                        <button className="customize-btn-page" onClick={(e) => { e.stopPropagation(); navigate('/details/abstract-color-flow'); }}>View Details</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="category-footer">
                <motion.button 
                  className="view-more-btn"
                  onClick={() => navigate('/collection/celebrities')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  View More Celebrity Collection
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14"/>
                    <path d="M12 5l7 7-7 7"/>
                  </svg>
                </motion.button>
              </div>
            </motion.div>

            <motion.div className="category-section" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}>
              <h2 className="category-title">Sports Legends</h2>
              <p className="category-description">Iconic portraits of legendary athletes and sports personalities</p>
              <div className="category-grid">
                <div className="collection-card">
                  <div className="card-image sports-1"></div>
                  <div className="card-overlay">
                    <div className="card-content">
                      <h3>Cristiano Ronaldo</h3>
                      <p>Football legend in action pose</p>
                      <div className="card-actions">
                        <button className="preview-btn-page">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                          Preview
                        </button>
                        <button className="customize-btn-page" onClick={(e) => { e.stopPropagation(); navigate('/details/abstract-color-flow'); }}>View Details</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="collection-card">
                  <div className="card-image sports-2"></div>
                  <div className="card-overlay">
                    <div className="card-content">
                      <h3>Lionel Messi</h3>
                      <p>GOAT footballer in artistic portrait</p>
                      <div className="card-actions">
                        <button className="preview-btn-page">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                          Preview
                        </button>
                        <button className="customize-btn-page" onClick={(e) => { e.stopPropagation(); navigate('/details/abstract-color-flow'); }}>View Details</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="collection-card">
                  <div className="card-image sports-3"></div>
                  <div className="card-overlay">
                    <div className="card-content">
                      <h3>Virat Kohli</h3>
                      <p>Cricket superstar in victory pose</p>
                      <div className="card-actions">
                        <button className="preview-btn-page">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                          Preview
                        </button>
                        <button className="customize-btn-page" onClick={(e) => { e.stopPropagation(); navigate('/details/abstract-color-flow'); }}>View Details</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="category-footer">
                <motion.button 
                  className="view-more-btn"
                  onClick={() => navigate('/collection/sports')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  View More Sports Collection
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14"/>
                    <path d="M12 5l7 7-7 7"/>
                  </svg>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );

  const ProductDetailsPage = () => {
    const location = useLocation();
    const productId = location.pathname.split('/details/')[1];
    const [selectedSize, setSelectedSize] = useState('12x18');
    const [selectedPrice, setSelectedPrice] = useState(400);
    const [viewMode, setViewMode] = useState('3d'); // '3d' | '2d' | 'normal'
    const detailImageUrl = 'https://images.unsplash.com/photo-1549576490-b0b4831ef60a?q=80&w=1200&auto=format&fit=crop';

    // Static placeholder artwork for products without dedicated images
    const defaultArtworkSvg = encodeURIComponent(`
      <svg xmlns='http://www.w3.org/2000/svg' width='800' height='1200'>
        <defs>
          <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
            <stop offset='0%' stop-color='#9242F1'/>
            <stop offset='100%' stop-color='#6EC3F4'/>
          </linearGradient>
        </defs>
        <rect width='100%' height='100%' fill='url(#g)'/>
        <circle cx='400' cy='420' r='140' fill='rgba(255,255,255,0.35)'/>
        <rect x='160' y='750' width='480' height='120' rx='16' fill='rgba(255,255,255,0.8)'/>
        <text x='400' y='820' font-size='42' font-family='Poppins, Arial' fill='#333' text-anchor='middle'>Photomart Canvas</text>
      </svg>
    `);
    const defaultArtwork = `data:image/svg+xml;utf8,${defaultArtworkSvg}`;

    // Function to get canvas display size for wall preview
    const getCanvasDisplaySize = (sizeKey) => {
      const sizeMap = {
        '12x18': { width: '160px', height: '240px' },
        '1824': { width: '200px', height: '267px' },
        '2436': { width: '240px', height: '360px' },
        '2430': { width: '240px', height: '300px' },
        '2030': { width: '200px', height: '300px' }
      };
      return sizeMap[sizeKey] || sizeMap['12x18'];
    };

    const canvasSizes = [
      { size: '12"×18"', price: 400, popular: false },
      { size: '18"×24"', price: 800, popular: true },
      { size: '24"×36"', price: 1300, popular: false },
      { size: '24"×30"', price: 1150, popular: false },
      { size: '20"×30"', price: 1050, popular: false }
    ];

    const productData = {
      'nature-mountain-mist': {
        name: 'Mountain Mist',
        description: 'Serene mountain landscape with morning fog creating a peaceful atmosphere',
        category: 'Nature\'s Serenity',
        image: 'nature-1'
      },
      'nature-forest-path': {
        name: 'Forest Path',
        description: 'Winding path through lush green forest, perfect for bringing nature indoors',
        category: 'Nature\'s Serenity',
        image: 'nature-2'
      },
      'nature-ocean-waves': {
        name: 'Ocean Waves',
        description: 'Calming ocean waves on pristine beach, ideal for relaxation spaces',
        category: 'Nature\'s Serenity',
        image: 'nature-3'
      },
      'abstract-color-flow': {
        name: 'Color Flow',
        description: 'Dynamic abstract with flowing colors that energize any modern space',
        category: 'Modern Abstract',
        image: 'abstract-1'
      },
      'abstract-urban-energy': {
        name: 'Urban Energy',
        description: 'Bold geometric patterns with vibrant energy for contemporary interiors',
        category: 'Modern Abstract',
        image: 'abstract-2'
      },
      'abstract-fluid-motion': {
        name: 'Fluid Motion',
        description: 'Smooth abstract forms in motion, perfect for creative environments',
        category: 'Modern Abstract',
        image: 'abstract-3'
      },
      'sports-ronaldo': {
        name: 'Cristiano Ronaldo',
        description: 'Iconic portrait of the football legend in dynamic action pose',
        category: 'Sports Legends',
        image: 'sports-1'
      },
      'sports-messi': {
        name: 'Lionel Messi',
        description: 'GOAT footballer in artistic portrait style, perfect for sports enthusiasts',
        category: 'Sports Legends',
        image: 'sports-2'
      },
      'sports-virat': {
        name: 'Virat Kohli',
        description: 'Cricket superstar in victory pose, ideal for cricket fans',
        category: 'Sports Legends',
        image: 'sports-3'
      }
    };

    const product = productData[productId] || productData['nature-mountain-mist'];

    return (
      <>
        <SharedHeader />
        <div className="product-details-page">
          <div className="product-details-container">
            <motion.div 
              className="product-image-section"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* View mode controls */}
              <div className="view-mode-controls">
                <button className={`view-icon ${viewMode==='3d'?'active':''}`} title="3D View" onClick={()=>setViewMode('3d')}>
                  3D
                </button>
                <button className={`view-icon ${viewMode==='2d'?'active':''}`} title="2D View" onClick={()=>setViewMode('2d')}>
                  2D
                </button>
                <button className={`view-icon ${viewMode==='normal'?'active':''}`} title="Normal" onClick={()=>setViewMode('normal')}>
                  N
                </button>
              </div>

              {viewMode === '3d' && (
                <>
                  <div className="simple-3d-preview">
                    <div style={{ width: '100%', height: '520px' }}>
                      <ThreeCanvasPreview
                        imageSrc={'https://images.unsplash.com/photo-1549576490-b0b4831ef60a?q=80&w=1200&auto=format&fit=crop'}
                        width={parseInt(getCanvasDisplaySize(selectedSize).width)}
                        height={parseInt(getCanvasDisplaySize(selectedSize).height)}
                        depth={24}
                      />
                    </div>
                  </div>
                  <div className="size-note">{canvasSizes.find(s => s.size.replace(/[^a-zA-Z0-9]/g, '') === selectedSize)?.size || '12"×18"'}</div>
                </>
              )}

              {viewMode === '2d' && (
                <div className="flat-2d-preview">
                  <div className={`canvas-on-wall ${product.image}`} style={{ width: getCanvasDisplaySize(selectedSize).width, height: getCanvasDisplaySize(selectedSize).height }}>
                    <div className="canvas-frame">
                      <div className="canvas-content" style={{ backgroundImage: `url(${detailImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                    </div>
                  </div>
                </div>
              )}

              {viewMode === 'normal' && (
                <div className="flat-2d-preview">
                  <div className={`normal-frame canvas-on-wall ${product.image}`} style={{ width: getCanvasDisplaySize(selectedSize).width, height: getCanvasDisplaySize(selectedSize).height }}>
                    <div className="canvas-content" style={{ backgroundImage: `url(${detailImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                  </div>
                </div>
              )}
              
              {/* Thumbnail options */}
              <div className="product-thumbnails">
                <div className={`thumbnail active ${product.image}`}></div>
                <div className={`thumbnail ${product.image}`}></div>
                <div className={`thumbnail ${product.image}`}></div>
              </div>
            </motion.div>

            <motion.div 
              className="product-info-section"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="product-breadcrumb">
                <span onClick={() => navigate('/collection')} className="breadcrumb-link">Collection</span>
                <span className="breadcrumb-separator">›</span>
                <span>{product.category}</span>
              </div>

              <h1 className="product-title">{product.name}</h1>
              <p className="product-description">{product.description}</p>

              <div className="product-price-section">
                <span className="current-price">₹{selectedPrice}</span>
                <span className="price-label">Premium Canvas Print</span>
              </div>

              <div className="size-selection">
                <h3>Choose Canvas Size</h3>
                <div className="size-options">
                  {canvasSizes.map((option, index) => (
                    <motion.div
                      key={index}
                      className={`size-option ${selectedSize === option.size.replace(/[^a-zA-Z0-9]/g, '') ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedSize(option.size.replace(/[^a-zA-Z0-9]/g, ''));
                        setSelectedPrice(option.price);
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {option.popular && <div className="popular-badge">Popular</div>}
                      <div className="size-name">{option.size}</div>
                      <div className="size-price">₹{option.price}</div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="product-actions">
                <motion.button 
                  className="add-to-cart-btn"
                  onClick={() => addToCart(
                    { id: productId, name: product.name, image: product.image, category: product.category },
                    canvasSizes.find(s => s.size.replace(/[^a-zA-Z0-9]/g, '') === selectedSize)?.size || '12"×18"',
                    selectedPrice
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Add to Cart - ₹{selectedPrice}
                </motion.button>
                <motion.button 
                  className="customize-btn-details"
                  onClick={() => navigate('/editor')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Customize Design
                </motion.button>
              </div>

              <div className="product-features">
                <div className="feature">
                  <div className="feature-icon">🎨</div>
                  <div className="feature-text">
                    <strong>Premium Quality</strong>
                    <span>Museum-grade canvas & fade-resistant inks</span>
                  </div>
                </div>
                <div className="feature">
                  <div className="feature-icon">📦</div>
                  <div className="feature-text">
                    <strong>Fast Delivery</strong>
                    <span>Ready to ship within 2-3 business days</span>
                  </div>
                </div>
                <div className="feature">
                  <div className="feature-icon">🖼️</div>
                  <div className="feature-text">
                    <strong>Ready to Hang</strong>
                    <span>Comes with hanging hardware included</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </>
    );
  };

  const CategoryCollectionPage = ({ category }) => {
    const categoryData = {
      nature: {
        title: "Nature's Serenity Collection",
        description: "Peaceful landscapes and natural scenes that bring tranquility to any room",
        items: [
          { id: 'nature-mountain-mist', name: 'Mountain Mist', description: 'Serene mountain landscape', image: 'nature-1' },
          { id: 'nature-forest-path', name: 'Forest Path', description: 'Winding through lush forest', image: 'nature-2' },
          { id: 'nature-ocean-waves', name: 'Ocean Waves', description: 'Calming beach scenery', image: 'nature-3' },
          { id: 'nature-sunset-valley', name: 'Sunset Valley', description: 'Golden hour in the mountains', image: 'nature-1' },
          { id: 'nature-lake-reflection', name: 'Lake Reflection', description: 'Mirror-like mountain lake', image: 'nature-2' },
          { id: 'nature-autumn-forest', name: 'Autumn Forest', description: 'Fall colors in the woods', image: 'nature-3' }
        ]
      },
      abstract: {
        title: "Modern Abstract Collection",
        description: "Contemporary designs perfect for modern interiors and creative spaces",
        items: [
          { id: 'abstract-color-flow', name: 'Color Flow', description: 'Dynamic flowing colors', image: 'abstract-1' },
          { id: 'abstract-urban-energy', name: 'Urban Energy', description: 'Bold geometric patterns', image: 'abstract-2' },
          { id: 'abstract-fluid-motion', name: 'Fluid Motion', description: 'Smooth abstract forms', image: 'abstract-3' },
          { id: 'abstract-cosmic-burst', name: 'Cosmic Burst', description: 'Explosive color patterns', image: 'abstract-1' },
          { id: 'abstract-digital-waves', name: 'Digital Waves', description: 'Tech-inspired design', image: 'abstract-2' },
          { id: 'abstract-paint-splash', name: 'Paint Splash', description: 'Artistic paint explosion', image: 'abstract-3' }
        ]
      },
      sports: {
        title: "Sports Legends Collection",
        description: "Iconic portraits of legendary athletes and sports personalities",
        items: [
          { id: 'sports-ronaldo', name: 'Cristiano Ronaldo', description: 'Football legend portrait', image: 'sports-1' },
          { id: 'sports-messi', name: 'Lionel Messi', description: 'GOAT footballer portrait', image: 'sports-2' },
          { id: 'sports-virat', name: 'Virat Kohli', description: 'Cricket superstar portrait', image: 'sports-3' },
          { id: 'sports-lebron', name: 'LeBron James', description: 'Basketball legend', image: 'sports-1' },
          { id: 'sports-serena', name: 'Serena Williams', description: 'Tennis champion', image: 'sports-2' },
          { id: 'sports-usain', name: 'Usain Bolt', description: 'Fastest man alive', image: 'sports-3' }
        ]
      }
    };

    const currentCategory = categoryData[category] || categoryData.nature;

    return (
      <>
        <SharedHeader />
        <div className="category-collection-page">
          <div className="category-hero">
            <div className="category-hero-content">
              <motion.button 
                className="back-button-category"
                onClick={() => navigate('/collection')}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                ← Back to Collection
              </motion.button>
              <motion.h1 
                className="category-hero-title"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {currentCategory.title}
              </motion.h1>
              <motion.p 
                className="category-hero-description"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {currentCategory.description}
              </motion.p>
            </div>
          </div>

          <div className="category-products">
            <div className="category-products-grid">
              {currentCategory.items.map((item, index) => (
                <motion.div
                  key={item.id}
                  className="category-product-card"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  onClick={() => navigate(`/details/${item.id}`)}
                >
                  <div className={`category-product-image ${item.image}`}></div>
                  <div className="category-product-overlay">
                    <div className="category-product-badge">Premium</div>
                    <div className="category-product-actions">
                      <button className="category-action-btn quick-view" onClick={(e) => e.stopPropagation()}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      </button>
                      <button className="category-action-btn customize" onClick={(e) => { e.stopPropagation(); navigate('/editor'); }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 20h9"/>
                          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="category-product-info">
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <div className="category-product-price">From ₹400</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  };

  const GiftsPage = () => (
    <>
      <SharedHeader />
      <div className="page-container">
        <motion.div className="page-header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <button className="back-button" onClick={() => navigate('/')}>← Back to Home</button>
          <h1>Gift Collection</h1>
          <p>Perfect gifts for your loved ones</p>
        </motion.div>
        <div className="coming-soon"><h2>Coming Soon!</h2><p>Our gift collection will be available soon. Stay tuned!</p></div>
      </div>
    </>
  );

  const CheckoutPage = () => {
    const [form, setForm] = useState({
      fullName: '',
      email: '',
      phone: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
      express: false,
    });

    const EXPRESS_FEE = 199;
    const subtotal = getCartTotal();
    const delivery = form.express ? EXPRESS_FEE : 0;
    const total = subtotal + delivery;

    const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

    const handleSubmit = (e) => {
      e.preventDefault();
      // Basic validation
      if (!form.fullName || !form.email || !form.phone || !form.address1 || !form.city || !form.state || !form.postalCode) {
        alert('Please fill all required fields.');
        return;
      }
      alert('Checkout info captured. Implement payment next.');
    };

    return (
      <>
        <SharedHeader />
        <div className="page-container checkout-page">
          <motion.div className="page-header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
            <h1>Checkout</h1>
            <p>Securely complete your order</p>
          </motion.div>

          <div className="checkout-grid">
            <form className="checkout-card checkout-form" onSubmit={handleSubmit}>
              <h2>Personal Information</h2>
              <div className="input-row">
                <label>Full Name *</label>
                <input type="text" placeholder="Enter your full name" value={form.fullName} onChange={(e)=>update('fullName', e.target.value)} required />
              </div>
              <div className="two-col">
                <div className="input-row">
                  <label>Email Address *</label>
                  <input type="email" placeholder="your.email@example.com" value={form.email} onChange={(e)=>update('email', e.target.value)} required />
                </div>
                <div className="input-row">
                  <label>Phone Number *</label>
                  <input type="tel" placeholder="e.g. +91 98765 43210" value={form.phone} onChange={(e)=>update('phone', e.target.value)} required />
                </div>
              </div>

              <h2>Shipping Address</h2>
              <div className="input-row">
                <label>Address Line 1 *</label>
                <input type="text" placeholder="House/Flat, Street" value={form.address1} onChange={(e)=>update('address1', e.target.value)} required />
              </div>
              <div className="input-row">
                <label>Address Line 2</label>
                <input type="text" placeholder="Landmark, Area" value={form.address2} onChange={(e)=>update('address2', e.target.value)} />
              </div>
              <div className="two-col">
                <div className="input-row">
                  <label>City *</label>
                  <input type="text" value={form.city} onChange={(e)=>update('city', e.target.value)} required />
                </div>
                <div className="input-row">
                  <label>State/Province *</label>
                  <input type="text" value={form.state} onChange={(e)=>update('state', e.target.value)} required />
                </div>
              </div>
              <div className="two-col">
                <div className="input-row">
                  <label>Postal Code *</label>
                  <input type="text" value={form.postalCode} onChange={(e)=>update('postalCode', e.target.value)} required />
                </div>
                <div className="input-row">
                  <label>Country</label>
                  <input type="text" value={form.country} onChange={(e)=>update('country', e.target.value)} />
                </div>
              </div>

              <div className="express-row">
                <label className="switch">
                  <input type="checkbox" checked={form.express} onChange={(e)=>update('express', e.target.checked)} />
                  <span className="slider" />
                </label>
                <div className="express-info">
                  <div className="express-title">Express Delivery</div>
                  <div className="express-desc">Get it faster. Additional charge applies.</div>
                </div>
                <div className="express-fee">{form.express ? `+₹${EXPRESS_FEE}` : 'Optional'}</div>
              </div>
              <div className="express-disclaimer">Selecting Express Delivery may increase your shipping fees and estimated delivery time may vary based on your location.</div>

              <div className="submit-row">
                <button type="submit" className="primary-btn">Continue to Payment</button>
              </div>
            </form>

            <div className="checkout-card order-summary">
              <h2>Order Summary</h2>
              <div className="summary-row"><span>Items</span><span>{getCartItemCount()}</span></div>
              <div className="summary-row"><span>Subtotal</span><span>₹{subtotal}</span></div>
              <div className="summary-row"><span>Delivery</span><span>{form.express ? `₹${EXPRESS_FEE}` : 'FREE'}</span></div>
              <div className="summary-row total"><span>Total</span><span>₹{total}</span></div>
              <div className="mini-items">
                {cartItems.map(ci => (
                  <div key={ci.id} className="mini-item">
                    <div className={`mini-thumb ${ci.image}`} />
                    <div className="mini-info">
                      <div className="mini-name">{ci.name}</div>
                      <div className="mini-meta">{ci.size} • ₹{ci.price} × {ci.quantity}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const Cart = () => (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div 
            className="cart-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
          />
          <motion.div 
            className="cart-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className="cart-header">
              <h2>Shopping Cart</h2>
              <motion.button 
                className="cart-close"
                onClick={() => setIsCartOpen(false)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ✕
              </motion.button>
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
                  <motion.button 
                    className="continue-shopping-btn"
                    onClick={() => {
                      setIsCartOpen(false);
                      navigate('/collection');
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Continue Shopping
                  </motion.button>
                </div>
              ) : (
                <>
                  <div className="cart-items">
                    {cartItems.map((item) => (
                      <motion.div 
                        key={item.id}
                        className="cart-item"
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                      >
                        <div className={`cart-item-image ${item.image}`}></div>
                        <div className="cart-item-details">
                          <h4>{item.name}</h4>
                          <p className="cart-item-category">{item.category}</p>
                          <p className="cart-item-size">Size: {item.size}</p>
                          <div className="cart-item-price">₹{item.price}</div>
                        </div>
                        <div className="cart-item-controls">
                          <div className="quantity-controls">
                            <motion.button 
                              className="quantity-btn"
                              onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              -
                            </motion.button>
                            <span className="quantity">{item.quantity}</span>
                            <motion.button 
                              className="quantity-btn"
                              onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              +
                            </motion.button>
                          </div>
                          <motion.button 
                            className="remove-item-btn"
                            onClick={() => removeFromCart(item.id)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
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
                    <motion.button 
                      className="checkout-btn"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                       onClick={() => {
                         setIsCartOpen(false);
                         navigate('/checkout');
                       }}
                    >
                      Proceed to Checkout
                    </motion.button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/collection" element={<CollectionPage />} />
        <Route path="/editor" element={
          <>
            <SharedHeader />
            <ImageEditor onBack={() => navigate('/')} />
          </>
        } />
        <Route path="/custom" element={
          <>
            <SharedHeader />
            <CustomerForm />
          </>
        } />
        <Route path="/details/:productId" element={<ProductDetailsPage />} />
        <Route path="/collection/nature" element={<CategoryCollectionPage category="nature" />} />
        <Route path="/collection/abstract" element={<CategoryCollectionPage category="abstract" />} />
        <Route path="/collection/minimalist" element={<CategoryCollectionPage category="minimalist" />} />
        <Route path="/collection/goddess" element={<CategoryCollectionPage category="goddess" />} />
        <Route path="/collection/celebrities" element={<CategoryCollectionPage category="celebrities" />} />
        <Route path="/collection/sports" element={<CategoryCollectionPage category="sports" />} />
        <Route path="/gifts" element={<GiftsPage />} />
        <Route path="/room" element={<><SharedHeader /><RoomView /></>} />
        <Route path="/checkout" element={<CheckoutPage />} />
      </Routes>
      
      {/* Global Footer Menu - shows on all pages */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.footer className="footer-menu" initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }}>
            <div className="footer-menu-card">
              <button className="footer-close" aria-label="Close menu" onClick={() => setIsMenuOpen(false)}>✕</button>
              <div className="footer-content">
              <motion.button 
                className="footer-icon-button" 
                onClick={() => navigateToPage('home')} 
                whileHover={{ scale: 1.1 }} 
                whileTap={{ scale: 0.9 }}
                title="Home"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                  <polyline points="9,22 9,12 15,12 15,22"/>
                </svg>
                <span>Home</span>
              </motion.button>
              <motion.button 
                className="footer-icon-button" 
                onClick={() => navigateToPage('collection')} 
                whileHover={{ scale: 1.1 }} 
                whileTap={{ scale: 0.9 }}
                title="Collection"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7"/>
                  <rect x="14" y="3" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/>
                </svg>
                <span>Collection</span>
              </motion.button>
              <motion.button 
                className="footer-icon-button" 
                onClick={() => navigateToPage('editor')} 
                whileHover={{ scale: 1.1 }} 
                whileTap={{ scale: 0.9 }}
                title="Image Editor"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
                <span>Editor</span>
              </motion.button>
              <motion.button 
                className="footer-icon-button" 
                onClick={() => navigateToPage('custom')} 
                whileHover={{ scale: 1.1 }} 
                whileTap={{ scale: 0.9 }}
                title="Custom Frames"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <rect x="7" y="7" width="10" height="10"/>
                </svg>
                <span>Frames</span>
              </motion.button>
              <motion.button 
                className="footer-icon-button" 
                onClick={() => navigateToPage('gifts')} 
                whileHover={{ scale: 1.1 }} 
                whileTap={{ scale: 0.9 }}
                title="Gifts"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20,12 20,22 4,22 4,12"/>
                  <rect x="2" y="7" width="20" height="5"/>
                  <line x1="12" y1="22" x2="12" y2="7"/>
                  <path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/>
                  <path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/>
                </svg>
                <span>Gifts</span>
              </motion.button>
              <motion.button 
                className="footer-icon-button" 
                onClick={() => navigate('/room')} 
                whileHover={{ scale: 1.1 }} 
                whileTap={{ scale: 0.9 }}
                title="Room View"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="14" rx="2" ry="2"/>
                  <path d="M3 10h18"/>
                </svg>
                <span>Room</span>
              </motion.button>
              </div>
            </div>
          </motion.footer>
        )}
      </AnimatePresence>
      
      {/* Cart Component */}
      <Cart />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App; 