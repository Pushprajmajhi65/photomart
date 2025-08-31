import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';

const categoryData = {
  nature: {
    title: "Nature's Serenity Collection",
    description: 'Peaceful landscapes and natural scenes that bring tranquility to any room',
    items: [
      { id: 'nature-mountain-mist', name: 'Mountain Mist', description: 'Serene mountain landscape', image: 'nature-1' },
      { id: 'nature-forest-path', name: 'Forest Path', description: 'Winding through lush forest', image: 'nature-2' },
      { id: 'nature-ocean-waves', name: 'Ocean Waves', description: 'Calming beach scenery', image: 'nature-3' }
    ]
  },
  abstract: {
    title: 'Modern Abstract Collection',
    description: 'Contemporary designs perfect for modern interiors and creative spaces',
    items: [
      { id: 'abstract-color-flow', name: 'Color Flow', description: 'Dynamic flowing colors', image: 'abstract-1' },
      { id: 'abstract-urban-energy', name: 'Urban Energy', description: 'Bold geometric patterns', image: 'abstract-2' },
      { id: 'abstract-fluid-motion', name: 'Fluid Motion', description: 'Smooth abstract forms', image: 'abstract-3' }
    ]
  },
  sports: {
    title: 'Sports Legends Collection',
    description: 'Iconic portraits of legendary athletes and sports personalities',
    items: [
      { id: 'sports-ronaldo', name: 'Cristiano Ronaldo', description: 'Football legend portrait', image: 'sports-1' },
      { id: 'sports-messi', name: 'Lionel Messi', description: 'GOAT footballer portrait', image: 'sports-2' },
      { id: 'sports-virat', name: 'Virat Kohli', description: 'Cricket superstar portrait', image: 'sports-3' }
    ]
  }
};

export default function CategoryCollection() {
  const navigate = useNavigate();
  const params = useParams();
  const category = params.category;
  const currentCategory = categoryData[category] || categoryData.nature;

  return (
    <div className="category-collection-page">
      <div className="category-hero">
        <div className="category-hero-content">
          <motion.button className="back-button-category" onClick={() => navigate('/collection')} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>← Back to Collection</motion.button>
          <motion.h1 className="category-hero-title" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>{currentCategory.title}</motion.h1>
          <motion.p className="category-hero-description" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>{currentCategory.description}</motion.p>
        </div>
      </div>
      <div className="category-products">
        <div className="category-products-grid">
          {currentCategory.items.map((item, index) => (
            <motion.div key={item.id} className="category-product-card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} whileHover={{ y: -8, scale: 1.02 }} onClick={() => navigate(`/details/${item.id}`)}>
              <div className={`category-product-image ${item.image}`}></div>
              <div className="category-product-overlay">
                <div className="category-product-badge">Premium</div>
                <div className="category-product-actions">
                  <button className="category-action-btn quick-view">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  </button>
                  <button className="category-action-btn customize" onClick={(e) => { e.stopPropagation(); navigate('/editor'); }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
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
  );
}


