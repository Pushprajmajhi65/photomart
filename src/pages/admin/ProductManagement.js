import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    category: '',
    image: '',
    sizes: [
      { size: '12"×18"', price: 400, popular: false },
      { size: '18"×24"', price: 800, popular: true },
      { size: '24"×36"', price: 1300, popular: false },
      { size: '24"×30"', price: 1150, popular: false },
      { size: '20"×30"', price: 1050, popular: false }
    ]
  });

  const categories = [
    'Nature\'s Serenity',
    'Modern Abstract', 
    'Minimalist Art',
    'Divine Goddess Collection',
    'Celebrity Artists',
    'Sports Legends'
  ];

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      // Mock data - replace with actual API call
      const mockProducts = [
        {
          id: 1,
          name: 'Mountain Mist',
          description: 'Serene mountain landscape with morning fog',
          category: 'Nature\'s Serenity',
          image: 'nature-1',
          stock: 45,
          sizes: [
            { size: '12"×18"', price: 400, popular: false, stock: 15 },
            { size: '18"×24"', price: 800, popular: true, stock: 20 },
            { size: '24"×36"', price: 1300, popular: false, stock: 10 }
          ],
          status: 'active',
          createdAt: '2024-01-10T10:30:00Z',
          totalSales: 127
        },
        {
          id: 2,
          name: 'Color Flow',
          description: 'Dynamic abstract with flowing colors',
          category: 'Modern Abstract',
          image: 'abstract-1',
          stock: 32,
          sizes: [
            { size: '12"×18"', price: 400, popular: false, stock: 12 },
            { size: '18"×24"', price: 800, popular: true, stock: 15 },
            { size: '24"×36"', price: 1300, popular: false, stock: 5 }
          ],
          status: 'active',
          createdAt: '2024-01-08T14:20:00Z',
          totalSales: 89
        },
        {
          id: 3,
          name: 'Ocean Waves',
          description: 'Calming ocean waves on pristine beach',
          category: 'Nature\'s Serenity',
          image: 'nature-3',
          stock: 8,
          sizes: [
            { size: '12"×18"', price: 400, popular: false, stock: 3 },
            { size: '18"×24"', price: 800, popular: true, stock: 5 },
            { size: '24"×36"', price: 1300, popular: false, stock: 0 }
          ],
          status: 'low_stock',
          createdAt: '2024-01-05T09:15:00Z',
          totalSales: 156
        },
        {
          id: 4,
          name: 'Simple Lines',
          description: 'Clean geometric lines in neutral tones',
          category: 'Minimalist Art',
          image: 'minimal-1',
          stock: 0,
          sizes: [
            { size: '12"×18"', price: 400, popular: false, stock: 0 },
            { size: '18"×24"', price: 800, popular: true, stock: 0 },
            { size: '24"×36"', price: 1300, popular: false, stock: 0 }
          ],
          status: 'out_of_stock',
          createdAt: '2024-01-02T16:45:00Z',
          totalSales: 203
        }
      ];

      setProducts(mockProducts);
      setLoading(false);
    } catch (error) {
      console.error('Error loading products:', error);
      setLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      // Replace with actual API call
      const newProduct = {
        ...productForm,
        id: Date.now(),
        status: 'active'
      };
      
      setProducts([...products, newProduct]);
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    try {
      // Replace with actual API call
      const updatedProducts = products.map(p => 
        p.id === editingProduct.id ? { ...productForm, id: editingProduct.id } : p
      );
      
      setProducts(updatedProducts);
      setEditingProduct(null);
      resetForm();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        // Replace with actual API call
        setProducts(products.filter(p => p.id !== productId));
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const resetForm = () => {
    setProductForm({
      name: '',
      description: '',
      category: '',
      image: '',
      sizes: [
        { size: '12"×18"', price: 400, popular: false },
        { size: '18"×24"', price: 800, popular: true },
        { size: '24"×36"', price: 1300, popular: false },
        { size: '24"×30"', price: 1150, popular: false },
        { size: '20"×30"', price: 1050, popular: false }
      ]
    });
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setProductForm(product);
    setShowAddModal(true);
  };

  const openDetailsModal = (product) => {
    setSelectedProduct(product);
    setShowDetailsModal(true);
  };

  const updateSizePrice = (index, field, value) => {
    const updatedSizes = [...productForm.sizes];
    updatedSizes[index] = { ...updatedSizes[index], [field]: value };
    setProductForm({ ...productForm, sizes: updatedSizes });
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return 'out-of-stock';
    if (stock <= 5) return 'low-stock';
    if (stock <= 15) return 'medium-stock';
    return 'in-stock';
  };

  const getStatusLabel = (status) => {
    const labels = {
      active: 'Active',
      low_stock: 'Low Stock',
      out_of_stock: 'Out of Stock',
      inactive: 'Inactive'
    };
    return labels[status] || status;
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="product-management">
      <div className="page-header">
        <h1>Product Management</h1>
        <button 
          className="add-btn"
          onClick={() => setShowAddModal(true)}
        >
          <span>➕</span>
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="category-filter"
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="products-table-container">
        <div className="products-table">
          <div className="table-header">
            <span>S.N.</span>
            <span>Product</span>
            <span>Category</span>
            <span>Total Stock</span>
            <span>Actions</span>
          </div>
          
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              className="table-row clickable-row"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => openDetailsModal(product)}
            >
              <div className="sn-cell">
                <span className="serial-number">{index + 1}</span>
              </div>
              
              <div className="product-cell">
                <div className={`product-thumbnail ${product.image}`}></div>
                <div className="product-info">
                  <h4>{product.name}</h4>
                </div>
              </div>
              
              <div className="category-cell">
                <span className="category-badge">{product.category}</span>
              </div>
              
              <div className="total-stock-cell">
                <span className={`stock-number ${getStockStatus(product.stock)}`}>
                  {product.stock} units
                </span>
              </div>
              
              <div className="actions-cell" onClick={(e) => e.stopPropagation()}>
                <button 
                  className="action-btn edit"
                  onClick={() => openEditModal(product)}
                  title="Edit Product"
                >
                  ✏️
                </button>
                <button 
                  className="action-btn delete"
                  onClick={() => handleDeleteProduct(product.id)}
                  title="Delete Product"
                >
                  🗑️
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="no-products">
            <h3>No products found</h3>
            <p>Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      {/* Add/Edit Product Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setShowAddModal(false);
              setEditingProduct(null);
              resetForm();
            }}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                <button 
                  className="close-btn"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingProduct(null);
                    resetForm();
                  }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={editingProduct ? handleEditProduct : handleAddProduct}>
                <div className="form-group">
                  <label>Product Name</label>
                  <input
                    type="text"
                    value={productForm.name}
                    onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={productForm.description}
                    onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                    rows="3"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Image Class (e.g., nature-1, abstract-1)</label>
                  <input
                    type="text"
                    value={productForm.image}
                    onChange={(e) => setProductForm({...productForm, image: e.target.value})}
                    placeholder="e.g., nature-1"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Sizes & Pricing</label>
                  {productForm.sizes.map((size, index) => (
                    <div key={index} className="size-input-group">
                      <input
                        type="text"
                        value={size.size}
                        onChange={(e) => updateSizePrice(index, 'size', e.target.value)}
                        placeholder="Size (e.g., 12×18)"
                      />
                      <input
                        type="number"
                        value={size.price}
                        onChange={(e) => updateSizePrice(index, 'price', parseInt(e.target.value))}
                        placeholder="Price"
                      />
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={size.popular}
                          onChange={(e) => updateSizePrice(index, 'popular', e.target.checked)}
                        />
                        Popular
                      </label>
                    </div>
                  ))}
                </div>

                <div className="modal-actions">
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingProduct(null);
                      resetForm();
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="save-btn">
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedProduct && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDetailsModal(false)}
          >
            <motion.div
              className="modal-content product-details-modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>Product Details</h2>
                <button 
                  className="close-btn"
                  onClick={() => setShowDetailsModal(false)}
                >
                  ✕
                </button>
              </div>

              <div className="product-details-content">
                <div className="product-details-grid">
                  {/* Product Image and Basic Info */}
                  <div className="product-image-section">
                    <div className={`product-large-image ${selectedProduct.image}`}></div>
                    <div className="product-basic-info">
                      <h3>{selectedProduct.name}</h3>
                      <p className="product-description">{selectedProduct.description}</p>
                      <div className="product-meta">
                        <span className="category-badge">{selectedProduct.category}</span>
                        <span className={`status-badge ${selectedProduct.status}`}>
                          {getStatusLabel(selectedProduct.status)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Product Statistics */}
                  <div className="product-stats-section">
                    <h4>Product Statistics</h4>
                    <div className="stats-grid">
                      <div className="stat-item">
                        <span className="stat-label">Total Sales</span>
                        <span className="stat-value">{selectedProduct.totalSales}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Total Stock</span>
                        <span className={`stat-value ${getStockStatus(selectedProduct.stock)}`}>
                          {selectedProduct.stock} units
                        </span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Created</span>
                        <span className="stat-value">
                          {new Date(selectedProduct.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Status</span>
                        <span className={`stat-value status-${selectedProduct.status}`}>
                          {getStatusLabel(selectedProduct.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Size-wise Stock and Pricing */}
                <div className="sizes-section">
                  <h4>Size-wise Stock & Pricing</h4>
                  <div className="sizes-table">
                    <div className="sizes-header">
                      <span>Size</span>
                      <span>Price</span>
                      <span>Stock</span>
                      <span>Status</span>
                      <span>Popular</span>
                    </div>
                    {selectedProduct.sizes.map((size, index) => (
                      <div key={index} className="size-row">
                        <span className="size-name">{size.size}</span>
                        <span className="size-price">₹{size.price}</span>
                        <span className={`size-stock ${getStockStatus(size.stock)}`}>
                          {size.stock} units
                        </span>
                        <span className={`stock-status-badge ${getStockStatus(size.stock)}`}>
                          {size.stock === 0 ? 'Out of Stock' : 
                           size.stock <= 5 ? 'Low Stock' : 
                           size.stock <= 15 ? 'Medium' : 'In Stock'}
                        </span>
                        <span className="popular-indicator">
                          {size.popular ? (
                            <span className="popular-badge">⭐ Popular</span>
                          ) : (
                            <span className="not-popular">-</span>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Range Summary */}
                <div className="price-summary">
                  <h4>Price Range</h4>
                  <div className="price-range-display">
                    <div className="price-item">
                      <span className="price-label">Minimum Price</span>
                      <span className="price-value">₹{Math.min(...selectedProduct.sizes.map(s => s.price))}</span>
                    </div>
                    <div className="price-item">
                      <span className="price-label">Maximum Price</span>
                      <span className="price-value">₹{Math.max(...selectedProduct.sizes.map(s => s.price))}</span>
                    </div>
                    <div className="price-item">
                      <span className="price-label">Popular Sizes</span>
                      <div className="popular-sizes-list">
                        {selectedProduct.sizes.filter(s => s.popular).map((size, idx) => (
                          <span key={idx} className="popular-size-item">
                            {size.size} (₹{size.price})
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button 
                  className="edit-product-btn"
                  onClick={() => {
                    setShowDetailsModal(false);
                    openEditModal(selectedProduct);
                  }}
                >
                  ✏️ Edit Product
                </button>
                <button 
                  className="close-details-btn"
                  onClick={() => setShowDetailsModal(false)}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
