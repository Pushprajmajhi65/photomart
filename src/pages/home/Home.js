import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import collectionImg from '../../images/collections.jpeg';
import customCanvasImg from '../../images/customcanvas.jpeg';
import giftImg from '../../images/gift.jpeg';

export default function Home() {
  const navigate = useNavigate();

  const navigateToPage = (page) => {
    navigate(`/${page === 'home' ? '' : page}`);
  };

  return (
    <>
      <section className="hero-section">
        <div className="hero-bg">
          <div className="hero-anim-bg">
            <div className="anim-cube a1"></div>
            <div className="anim-cube a2"></div>
            <div className="anim-cube a3"></div>
            <div className="anim-cube a4"></div>
            <div className="anim-cube a5"></div>
            <div className="anim-cube a6"></div>
            <div className="anim-cube a7"></div>
            <div className="anim-cube a8"></div>
            <div className="anim-cube a9"></div>
            <div className="anim-cube a10"></div>
            <div className="anim-cube a11"></div>
            <div className="anim-cube a12"></div>
            <div className="anim-pill p1"></div>
            <div className="anim-pill p2"></div>
          </div>
        </div>
        <div className="hero-inner">
          <h1 className="hero-title">Premium Personalized Canvas Photo Frames</h1>
          <p className="hero-subtitle">Preserve your best memories in stunning detail — crafted with museum-quality printing and premium wood frames.</p>
        </div>
      </section>

      <section className="landing-cards landing-cards--bottom">
        <div className="landing-card landing-card--sm landing-card--left">
          <div className="landing-card__icon">🎨</div>
          <h3>Custom Canvas</h3>
          <p>Create Your Own Canvas</p>
          <div className="landing-card__media" style={{ backgroundImage: `url(${customCanvasImg})` }}></div>
          <button className="bottom-card-btn" onClick={() => navigateToPage('editor')}>Start Creating</button>
        </div>

        <div className="landing-card landing-card--xl landing-card--center">
          <div className="landing-card__icon">📁</div>
          <h2>Collection</h2>
          <p>Premium Art Canvas</p>
          <div className="landing-card__media" style={{ backgroundImage: `url(${collectionImg})` }}></div>
          <button className="bottom-card-btn" onClick={() => navigateToPage('collection')}>Browse Collection</button>
        </div>

        <div className="landing-card landing-card--sm landing-card--right">
          <div className="landing-card__icon">🎁</div>
          <h3>Gifts</h3>
          <p>Personalized Items</p>
          <div className="landing-card__media" style={{ backgroundImage: `url(${giftImg})` }}></div>
          <button className="bottom-card-btn" onClick={() => navigateToPage('gifts')}>Shop Gifts</button>
        </div>
      </section>

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

      <section className="section collection-showcase">
        <div className="collection-header">
          <h2 className="section-title-collection">Our Curated Collection</h2>
          <p className="collection-subtitle">Discover professionally designed canvas artworks ready to transform your space</p>
        </div>
        <div className="collection-grid">
          <motion.div className="collection-item is-active" whileHover={{ y: -8 }} transition={{ duration: 0.3 }}>
            <div className="collection-image nature"></div>
            <div className="collection-overlay">
              <div className="collection-content">
                <h3>Nature's Serenity</h3>
                <p>Peaceful landscapes that bring tranquility to any room</p>
                <div className="collection-actions">
                  <motion.button className="preview-btn" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Preview</motion.button>
                  <motion.button className="customize-btn" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigateToPage('editor')}>Customize</motion.button>
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
                  <motion.button className="preview-btn" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Preview</motion.button>
                  <motion.button className="customize-btn" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigateToPage('editor')}>Customize</motion.button>
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
                  <motion.button className="preview-btn" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Preview</motion.button>
                  <motion.button className="customize-btn" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigateToPage('editor')}>Customize</motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        <div className="collection-footer">
          <motion.button className="view-all-btn" onClick={() => navigateToPage('collection')} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            View All Collections
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14"/>
              <path d="M12 5l7 7-7 7"/>
            </svg>
          </motion.button>
        </div>
      </section>

      <footer className="company-footer">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-logo">
                <div className="logo-icon">📸</div>
                <h3>PhotoMart</h3>
              </div>
              <p>Transform your memories into stunning wall art with our premium canvas printing service.</p>
            </div>
            <div className="footer-links">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#" onClick={() => navigateToPage('collection')}>Collection</a></li>
                <li><a href="#" onClick={() => navigateToPage('gifts')}>Gifts</a></li>
              </ul>
            </div>
            <div className="footer-links">
              <h4>Support</h4>
              <ul>
                <li><a href="#">Contact Us</a></li>
                <li><a href="#">Size Guide</a></li>
                <li><a href="#">Shipping Info</a></li>
                <li><a href="#">Returns</a></li>
              </ul>
            </div>
            <div className="footer-contact">
              <h4>Get in Touch</h4>
              <div className="contact-info">
                <p>📧 hello@photomart.com</p>
                <p>📞 +1 (555) 123-4567</p>
                <p>📍 123 Canvas Street, Art District</p>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2024 PhotoMart. All rights reserved.</p>
            <div className="footer-bottom-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}


