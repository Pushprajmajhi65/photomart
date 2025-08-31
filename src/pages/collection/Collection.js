import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const allProducts = [
  // Nature Collection
  { id: 'nature-mountain-mist', name: 'Mountain Mist', description: 'Serene mountain landscape', image: 'nature-1', category: 'nature' },
  { id: 'nature-forest-path', name: 'Forest Path', description: 'Winding through lush forest', image: 'nature-2', category: 'nature' },
  { id: 'nature-ocean-waves', name: 'Ocean Waves', description: 'Calming beach scenery', image: 'nature-3', category: 'nature' },
  { id: 'nature-sunset-valley', name: 'Sunset Valley', description: 'Golden hour in peaceful valley', image: 'nature-1', category: 'nature' },
  { id: 'nature-misty-lake', name: 'Misty Lake', description: 'Tranquil lake with morning mist', image: 'nature-2', category: 'nature' },
  
  // Abstract Collection
  { id: 'abstract-color-flow', name: 'Color Flow', description: 'Dynamic flowing colors', image: 'abstract-1', category: 'abstract' },
  { id: 'abstract-urban-energy', name: 'Urban Energy', description: 'Bold geometric patterns', image: 'abstract-2', category: 'abstract' },
  { id: 'abstract-fluid-motion', name: 'Fluid Motion', description: 'Smooth abstract forms', image: 'abstract-3', category: 'abstract' },
  { id: 'abstract-cosmic-dance', name: 'Cosmic Dance', description: 'Swirling cosmic energy', image: 'abstract-1', category: 'abstract' },
  { id: 'abstract-neon-dreams', name: 'Neon Dreams', description: 'Vibrant neon abstract', image: 'abstract-2', category: 'abstract' },
  
  // Sports Collection
  { id: 'sports-ronaldo', name: 'Cristiano Ronaldo', description: 'Football legend portrait', image: 'sports-1', category: 'sports' },
  { id: 'sports-messi', name: 'Lionel Messi', description: 'GOAT footballer portrait', image: 'sports-2', category: 'sports' },
  { id: 'sports-virat', name: 'Virat Kohli', description: 'Cricket superstar portrait', image: 'sports-3', category: 'sports' },
  { id: 'sports-lebron', name: 'LeBron James', description: 'Basketball king portrait', image: 'sports-1', category: 'sports' },
  { id: 'sports-serena', name: 'Serena Williams', description: 'Tennis legend portrait', image: 'sports-2', category: 'sports' },
  
  // Minimalist Collection
  { id: 'minimal-simple-lines', name: 'Simple Lines', description: 'Clean geometric lines in neutral tones', image: 'minimal-1', category: 'minimalist' },
  { id: 'minimal-zen-balance', name: 'Zen Balance', description: 'Peaceful minimalist composition', image: 'minimal-2', category: 'minimalist' },
  { id: 'minimal-pure-form', name: 'Pure Form', description: 'Essential shapes in perfect harmony', image: 'minimal-3', category: 'minimalist' },
  { id: 'minimal-quiet-space', name: 'Quiet Space', description: 'Serene minimalist design', image: 'minimal-1', category: 'minimalist' },
  { id: 'minimal-soft-geometry', name: 'Soft Geometry', description: 'Gentle geometric forms', image: 'minimal-2', category: 'minimalist' }
];

const categories = [
  { id: 'all', name: 'All Categories', count: allProducts.length },
  { id: 'nature', name: "Nature's Serenity", count: allProducts.filter(p => p.category === 'nature').length },
  { id: 'abstract', name: 'Modern Abstract', count: allProducts.filter(p => p.category === 'abstract').length },
  { id: 'sports', name: 'Sports Legends', count: allProducts.filter(p => p.category === 'sports').length },
  { id: 'minimalist', name: 'Minimalist Art', count: allProducts.filter(p => p.category === 'minimalist').length }
];

export default function Collection() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const filteredProducts = allProducts.filter(product => 
    selectedCategory === 'all' || product.category === selectedCategory
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'category') return a.category.localeCompare(b.category);
    return 0;
  });

  return (
    <div className="category-collection-page">
      <div className="category-hero">
        <div className="category-hero-content">
          <motion.h1 
            className="category-hero-title" 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
          >
            Complete Canvas Collection
          </motion.h1>
          <motion.p 
            className="category-hero-description" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Discover professionally curated canvas artworks designed to transform any space
          </motion.p>
        </div>
      </div>

      {/* Filters Section */}
      <motion.div 
        className="collection-filters"
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="filter-section">
          <div className="filter-group">
            <h3>Categories</h3>
            <div className="category-filters">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`category-filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                  <span className="filter-count">({category.count})</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="filter-group">
            <h3>Sort By</h3>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="name">Name (A-Z)</option>
              <option value="category">Category</option>
            </select>
          </div>
        </div>
        
        <div className="results-count">
          <span>Showing {sortedProducts.length} artworks</span>
        </div>
      </motion.div>

      {/* Products Grid */}
      <div className="category-products">
        <div className="category-products-grid">
          {sortedProducts.map((item, index) => (
            <motion.div 
              key={item.id} 
              className="category-product-card" 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5, delay: index * 0.05 }} 
              whileHover={{ y: -8, scale: 1.02 }} 
              onClick={() => navigate(`/details/${item.id}`)}
            >
              <div className={`category-product-image ${item.image}`}></div>
              <div className="category-product-overlay">
                <div className="category-product-badge">Premium</div>
                <div className="category-product-actions">
                  <button className="category-action-btn quick-view">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  </button>
                  <button 
                    className="category-action-btn customize" 
                    onClick={(e) => { e.stopPropagation(); navigate('/editor'); }}
                  >
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
                <div className="product-category-tag">{categories.find(c => c.id === item.category)?.name || item.category}</div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {sortedProducts.length === 0 && (
          <motion.div 
            className="no-products"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h3>No products found</h3>
            <p>Try selecting a different category or adjusting your filters.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}


