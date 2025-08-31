import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import ThreeCanvasPreview from '../../ThreeCanvasPreview';
import { useCart } from '../../context/CartContext';

const defaultArtwork = 'https://images.unsplash.com/photo-1549576490-b0b4831ef60a?q=80&w=1200&auto=format&fit=crop';

function getCanvasDisplaySize(sizeKey) {
  const sizeMap = {
    '12x18': { width: '160px', height: '240px' },
    '1824': { width: '200px', height: '267px' },
    '2436': { width: '240px', height: '360px' },
    '2430': { width: '240px', height: '300px' },
    '2030': { width: '200px', height: '300px' }
  };
  return sizeMap[sizeKey] || sizeMap['12x18'];
}

const canvasSizes = [
  { size: '12"×18"', price: 400, popular: false },
  { size: '18"×24"', price: 800, popular: true },
  { size: '24"×36"', price: 1300, popular: false },
  { size: '24"×30"', price: 1150, popular: false },
  { size: '20"×30"', price: 1050, popular: false }
];

const productData = {
  'nature-mountain-mist': { name: 'Mountain Mist', description: 'Serene mountain landscape with morning fog creating a peaceful atmosphere', category: "Nature's Serenity", image: 'nature-1' },
  'nature-forest-path': { name: 'Forest Path', description: 'Winding path through lush green forest, perfect for bringing nature indoors', category: "Nature's Serenity", image: 'nature-2' },
  'nature-ocean-waves': { name: 'Ocean Waves', description: 'Calming ocean waves on pristine beach, ideal for relaxation spaces', category: "Nature's Serenity", image: 'nature-3' }
};

export default function ProductDetails() {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const productId = location.pathname.split('/details/')[1];
  const [selectedSize, setSelectedSize] = useState('12x18');
  const [selectedPrice, setSelectedPrice] = useState(400);
  const [viewMode, setViewMode] = useState('2d');
  const product = productData[productId] || productData['nature-mountain-mist'];

  return (
    <div className="product-details-page">
      <div className="product-details-container">
        <motion.div className="product-image-section" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <div className="view-mode-controls">
            <button className={`view-icon ${viewMode==='3d'?'active':''}`} title="3D View" onClick={()=>setViewMode('3d')}>3D</button>
            <button className={`view-icon ${viewMode==='2d'?'active':''}`} title="2D View" onClick={()=>setViewMode('2d')}>2D</button>
            <button className={`view-icon ${viewMode==='normal'?'active':''}`} title="Normal" onClick={()=>setViewMode('normal')}>N</button>
          </div>
          {viewMode === '3d' && (
            <>
              <div className="simple-3d-preview">
                <div style={{ width: '100%', height: '520px' }}>
                  <ThreeCanvasPreview imageSrc={defaultArtwork} width={parseInt(getCanvasDisplaySize(selectedSize).width)} height={parseInt(getCanvasDisplaySize(selectedSize).height)} depth={24} />
                </div>
              </div>
              <div className="size-note">{canvasSizes.find(s => s.size.replace(/[^a-zA-Z0-9]/g, '') === selectedSize)?.size || '12"×18"'}</div>
            </>
          )}
          {viewMode === '2d' && (
            <div className="flat-2d-preview">
              <div className={`canvas-on-wall ${product.image}`} style={{ width: getCanvasDisplaySize(selectedSize).width, height: getCanvasDisplaySize(selectedSize).height }}>
                <div className="canvas-frame"><div className="canvas-content" style={{ backgroundImage: `url(${defaultArtwork})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div></div>
              </div>
            </div>
          )}
          {viewMode === 'normal' && (
            <div className="flat-2d-preview">
              <div className={`normal-frame canvas-on-wall ${product.image}`} style={{ width: getCanvasDisplaySize(selectedSize).width, height: getCanvasDisplaySize(selectedSize).height }}>
                <div className="canvas-content" style={{ backgroundImage: `url(${defaultArtwork})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
              </div>
            </div>
          )}
          <div className="product-thumbnails">
            <div className={`thumbnail active ${product.image}`}></div>
            <div className={`thumbnail ${product.image}`}></div>
            <div className={`thumbnail ${product.image}`}></div>
          </div>
        </motion.div>
        <motion.div className="product-info-section" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          <div className="product-breadcrumb">
            <span onClick={() => navigate('/collection')} className="breadcrumb-link">Collection</span>
            <span className="breadcrumb-separator">›</span>
            <span>{product.category}</span>
          </div>
          <h1 className="product-title">{product.name}</h1>
          <p className="product-description">{product.description}</p>
          <div className="product-price-section"><span className="current-price">₹{selectedPrice}</span><span className="price-label">Premium Canvas Print</span></div>
          <div className="size-selection">
            <h3>Choose Canvas Size</h3>
            <div className="size-options">
              {canvasSizes.map((option, index) => (
                <motion.div key={index} className={`size-option ${selectedSize === option.size.replace(/[^a-zA-Z0-9]/g, '') ? 'selected' : ''}`} onClick={() => { setSelectedSize(option.size.replace(/[^a-zA-Z0-9]/g, '')); setSelectedPrice(option.price); }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  {option.popular && <div className="popular-badge">Popular</div>}
                  <div className="size-name">{option.size}</div>
                  <div className="size-price">₹{option.price}</div>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="product-actions">
            <motion.button className="add-to-cart-btn" onClick={() => addToCart({ id: productId, name: product.name, image: product.image, category: product.category }, canvasSizes.find(s => s.size.replace(/[^a-zA-Z0-9]/g, '') === selectedSize)?.size || '12"×18"', selectedPrice)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>Add to Cart - ₹{selectedPrice}</motion.button>
            <motion.button className="customize-btn-details" onClick={() => navigate('/editor')} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>Customize Design</motion.button>
          </div>
          <div className="product-features">
            <div className="feature"><div className="feature-icon">🎨</div><div className="feature-text"><strong>Premium Quality</strong><span>Museum-grade canvas & fade-resistant inks</span></div></div>
            <div className="feature"><div className="feature-icon">📦</div><div className="feature-text"><strong>Fast Delivery</strong><span>Ready to ship within 2-3 business days</span></div></div>
            <div className="feature"><div className="feature-icon">🖼️</div><div className="feature-text"><strong>Ready to Hang</strong><span>Comes with hanging hardware included</span></div></div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}


