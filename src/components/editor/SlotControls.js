import React from 'react';
import { motion } from 'framer-motion';

export default function SlotControls({ activeSlot, onUploadClick, onZoomIn, onZoomOut, onRotateLeft, onRotateRight }) {
  return (
    <div className="editor-section">
      <h3>Active Slot: #{activeSlot + 1}</h3>
      <div className="slot-actions">
        <motion.button 
          className="upload-btn"
          onClick={onUploadClick}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Upload For This Slot
        </motion.button>
      </div>
      <div className="quick-actions">
        <motion.button className="quick-action-btn" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onZoomIn} title="Zoom In Slot">+</motion.button>
        <motion.button className="quick-action-btn" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onZoomOut} title="Zoom Out Slot">−</motion.button>
        <motion.button className="quick-action-btn" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onRotateLeft} title="Rotate Left Slot">⟲</motion.button>
        <motion.button className="quick-action-btn" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onRotateRight} title="Rotate Right Slot">⟳</motion.button>
      </div>
    </div>
  );
}

