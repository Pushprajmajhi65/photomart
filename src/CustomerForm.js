import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './CustomerForm.css';

function CustomerForm() {
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    canvasSize: 'medium',
    frameStyle: 'classic',
    imageFile: null,
    imagePreview: null,
    specialInstructions: '',
    quantity: 1
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        imageFile: file
      }));

      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          imagePreview: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      // Reset form after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
        setFormData({
          customerName: '',
          email: '',
          phone: '',
          canvasSize: 'medium',
          frameStyle: 'classic',
          imageFile: null,
          imagePreview: null,
          specialInstructions: '',
          quantity: 1
        });
      }, 3000);
    }, 2000);
  };

  const canvasSizes = [
    { value: 'small', label: 'Small (12" x 16")', price: '$49' },
    { value: 'medium', label: 'Medium (16" x 20")', price: '$79' },
    { value: 'large', label: 'Large (20" x 24")', price: '$119' },
    { value: 'xlarge', label: 'Extra Large (24" x 36")', price: '$179' },
    { value: 'custom', label: 'Custom Size', price: 'Contact Us' }
  ];

  const frameStyles = [
    { value: 'classic', label: 'Classic Black', image: '🖼️' },
    { value: 'golden', label: 'Golden Ornate', image: '✨' },
    { value: 'modern', label: 'Modern White', image: '⚪' },
    { value: 'vintage', label: 'Vintage Wood', image: '🪵' },
    { value: 'floating', label: 'Floating Frame', image: '🕳️' }
  ];

  return (
    <div className="customer-form-page">
      <div className="form-container">
        <motion.div
          className="form-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>Custom Canvas Order</h1>
          <p>Transform your artwork into a beautiful canvas masterpiece</p>
        </motion.div>

        <motion.form
          className="customer-form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Personal Information */}
          <div className="form-section">
            <h2>Personal Information</h2>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="customerName">Full Name *</label>
                <input
                  type="text"
                  id="customerName"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="your.email@example.com"
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div className="form-group">
                <label htmlFor="quantity">Quantity</label>
                <select
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                >
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="form-section">
            <h2>Upload Your Artwork</h2>
            <div className="image-upload-area">
              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                onChange={handleImageUpload}
                className="file-input"
              />
              <label htmlFor="imageUpload" className="upload-label">
                {formData.imagePreview ? (
                  <div className="image-preview">
                    <img src={formData.imagePreview} alt="Preview" />
                    <div className="preview-overlay">
                      <span>Click to change image</span>
                    </div>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <div className="upload-icon">📸</div>
                    <h3>Upload Your Image</h3>
                    <p>Drag and drop your image here or click to browse</p>
                    <span className="upload-hint">Supports: JPG, PNG, GIF (Max 10MB)</span>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Canvas Customization */}
          <div className="form-section">
            <h2>Canvas Customization</h2>
            
            {/* Canvas Size */}
            <div className="customization-group">
              <label>Canvas Size</label>
              <div className="size-options">
                {canvasSizes.map(size => (
                  <motion.div
                    key={size.value}
                    className={`size-option ${formData.canvasSize === size.value ? 'selected' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, canvasSize: size.value }))}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="size-preview">
                      <div className={`size-box ${size.value}`}></div>
                    </div>
                    <div className="size-details">
                      <span className="size-label">{size.label}</span>
                      <span className="size-price">{size.price}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Frame Style */}
            <div className="customization-group">
              <label>Frame Style</label>
              <div className="frame-options">
                {frameStyles.map(frame => (
                  <motion.div
                    key={frame.value}
                    className={`frame-option ${formData.frameStyle === frame.value ? 'selected' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, frameStyle: frame.value }))}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="frame-icon">{frame.image}</div>
                    <span>{frame.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Special Instructions */}
          <div className="form-section">
            <h2>Special Instructions</h2>
            <div className="form-group">
              <textarea
                name="specialInstructions"
                value={formData.specialInstructions}
                onChange={handleInputChange}
                placeholder="Any special requests, color adjustments, or specific requirements..."
                rows="4"
              ></textarea>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSubmitting ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <span>Processing...</span>
              </div>
            ) : (
              'Submit Order'
            )}
          </motion.button>
        </motion.form>

        {/* Success Message */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              className="success-message"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <div className="success-icon">✅</div>
              <h3>Order Submitted Successfully!</h3>
              <p>We'll review your artwork and contact you within 24 hours.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default CustomerForm; 