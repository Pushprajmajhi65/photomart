import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CropTool({
  cropMode,
  setCropMode,
  showCropTool,
  setShowCropTool,
  setCropArea,
  applyCrop,
  cancelCrop,
}) {
  return (
    <div className="editor-section">
      <h3>6. Crop Image</h3>
      <motion.button className="selector-btn crop-btn" onClick={()=> { setShowCropTool(!showCropTool); setCropMode(!cropMode); }} whileHover={{ scale: 1.02 }}>
        <span>{cropMode ? 'Exit Crop Mode' : 'Start Cropping'}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2v14a2 2 0 0 0 2 2h14"/><path d="M18 6H8a2 2 0 0 1-2-2V2"/></svg>
      </motion.button>
      <AnimatePresence>
        {showCropTool && (
          <motion.div className="crop-controls" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <div className="crop-presets">
              <h4>Crop Presets:</h4>
              <div className="preset-buttons">
                <motion.button className="preset-btn" onClick={()=> setCropArea({ x: 10, y: 10, width: 80, height: 80 })} whileHover={{ scale: 1.02 }}>Square (1:1)</motion.button>
                <motion.button className="preset-btn" onClick={()=> setCropArea({ x: 5, y: 20, width: 90, height: 60 })} whileHover={{ scale: 1.02 }}>16:9</motion.button>
                <motion.button className="preset-btn" onClick={()=> setCropArea({ x: 15, y: 5, width: 70, height: 90 })} whileHover={{ scale: 1.02 }}>4:5</motion.button>
                <motion.button className="preset-btn" onClick={()=> setCropArea({ x: 10, y: 15, width: 80, height: 70 })} whileHover={{ scale: 1.02 }}>3:2</motion.button>
                <motion.button className="preset-btn" onClick={()=> setCropArea({ x: 5, y: 10, width: 90, height: 80 })} whileHover={{ scale: 1.02 }}>Full Width</motion.button>
                <motion.button className="preset-btn" onClick={()=> setCropArea({ x: 5, y: 5, width: 90, height: 90 })} whileHover={{ scale: 1.02 }}>Reset</motion.button>
              </div>
              <div className="manual-crop-info">
                <h4>Manual Crop:</h4>
                <p>• Drag corners to resize</p>
                <p>• Drag center to move</p>
                <p>• Use presets for common ratios</p>
              </div>
            </div>
            <div className="crop-actions">
              <motion.button className="apply-crop-btn" onClick={applyCrop} whileHover={{ scale: 1.02 }}>Apply Crop</motion.button>
              <motion.button className="cancel-crop-btn" onClick={cancelCrop} whileHover={{ scale: 1.02 }}>Cancel</motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

