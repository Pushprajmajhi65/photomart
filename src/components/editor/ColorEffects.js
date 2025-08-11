import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ColorEffects({
  imageBrightness, setImageBrightness,
  imageContrast, setImageContrast,
  imageSaturation, setImageSaturation,
  imageBlur, setImageBlur,
  showColorAdjustments, setShowColorAdjustments,
}) {
  return (
    <div className="editor-section">
      <h3>5. Color & Effects</h3>
      <motion.button className="selector-btn" onClick={()=> setShowColorAdjustments(!showColorAdjustments)} whileHover={{ scale: 1.02 }}>
        <span>Brightness, Contrast & More</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6,9 12,15 18,9"/></svg>
      </motion.button>
      <AnimatePresence>
        {showColorAdjustments && (
          <motion.div className="image-adjustments" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <div className="adjustment-group">
              <label>Brightness: {imageBrightness}%</label>
              <input type="range" min="0" max="200" step="5" value={imageBrightness} onChange={(e)=> setImageBrightness(parseInt(e.target.value))} className="adjustment-slider" />
            </div>
            <div className="adjustment-group">
              <label>Contrast: {imageContrast}%</label>
              <input type="range" min="0" max="200" step="5" value={imageContrast} onChange={(e)=> setImageContrast(parseInt(e.target.value))} className="adjustment-slider" />
            </div>
            <div className="adjustment-group">
              <label>Saturation: {imageSaturation}%</label>
              <input type="range" min="0" max="200" step="5" value={imageSaturation} onChange={(e)=> setImageSaturation(parseInt(e.target.value))} className="adjustment-slider" />
            </div>
            <div className="adjustment-group">
              <label>Blur: {imageBlur}px</label>
              <input type="range" min="0" max="10" step="0.5" value={imageBlur} onChange={(e)=> setImageBlur(parseFloat(e.target.value))} className="adjustment-slider" />
            </div>
            <motion.button className="reset-btn" onClick={()=> { setImageBrightness(100); setImageContrast(100); setImageSaturation(100); setImageBlur(0); }} whileHover={{ scale: 1.02 }}>Reset Colors</motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

