import React from 'react';
import { motion } from 'framer-motion';

export default function PreviewHeaderActions({ price, onDownload, onShare, onBack }) {
  return (
    <div className="editor-header">
      <motion.button 
        className="back-btn"
        onClick={onBack}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5"/>
          <path d="M12 19l-7-7 7-7"/>
        </svg>
        Back
      </motion.button>

      <h1>Photo Editor</h1>

      <div className="header-actions">
        <span className="price-display">₹{price}</span>
        <motion.button className="download-btn" onClick={onDownload} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>Download</motion.button>
        <motion.button className="share-btn" onClick={onShare} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>Share on WhatsApp</motion.button>
      </div>
    </div>
  );
}

