import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TransformControls({
  onZoomIn,
  onZoomOut,
  onRotateLeft,
  onRotateRight,
  onFlip,
  imageScale,
  setImageScale,
  imageRotation,
  setImageRotation,
  resetImagePosition,
  showImageAdjustments,
  setShowImageAdjustments,
}) {
  return (
    <div className="editor-section">
      <h3>4. Transform Image</h3>
      <div className="quick-actions">
        <motion.button className="quick-action-btn" onClick={onZoomIn} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} title="Zoom In">+</motion.button>
        <motion.button className="quick-action-btn" onClick={onZoomOut} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} title="Zoom Out">−</motion.button>
        <motion.button className="quick-action-btn" onClick={onRotateLeft} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} title="Rotate Left">⟲</motion.button>
        <motion.button className="quick-action-btn" onClick={onRotateRight} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} title="Rotate Right">⟳</motion.button>
        <motion.button className="quick-action-btn" onClick={onFlip} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} title="Flip Horizontal">⇋</motion.button>
      </div>

      <motion.button className="selector-btn" onClick={() => setShowImageAdjustments(!showImageAdjustments)} whileHover={{ scale: 1.02 }}>
        <span>Position & Scale</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6,9 12,15 18,9"/>
        </svg>
      </motion.button>

      <AnimatePresence>
        {showImageAdjustments && (
          <motion.div className="image-adjustments" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <div className="adjustment-group">
              <label>Scale: {imageScale.toFixed(2)}x</label>
              <input type="range" min="0.1" max="5" step="0.1" value={imageScale} onChange={(e)=> setImageScale(parseFloat(e.target.value))} className="adjustment-slider" />
            </div>
            <div className="adjustment-group">
              <label>Rotation: {imageRotation}°</label>
              <input type="range" min="-180" max="180" step="1" value={imageRotation} onChange={(e)=> setImageRotation(parseInt(e.target.value))} className="adjustment-slider" />
            </div>
            <motion.button className="reset-btn" onClick={resetImagePosition} whileHover={{ scale: 1.02 }}>Reset Transform</motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

