import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TemplateSelector({
  templates,
  selectedTemplate,
  onSelect,
  showTemplateSelector,
  setShowTemplateSelector,
  getCurrentTemplate
}) {
  return (
    <div className="editor-section">
      <h3>0. Layout Templates</h3>
      <motion.button
        className="selector-btn"
        onClick={() => setShowTemplateSelector(v => !v)}
        whileHover={{ scale: 1.02 }}
      >
        <div className="selector-preview">
          <span>{getCurrentTemplate()?.name}</span>
        </div>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6,9 12,15 18,9"/>
        </svg>
      </motion.button>

      <AnimatePresence>
        {showTemplateSelector && (
          <motion.div
            className="template-selector"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="template-list">
              {templates.map(t => (
                <button
                  key={t.id}
                  className={`template-btn ${selectedTemplate === t.id ? 'active' : ''}`}
                  onClick={() => onSelect(t)}
                  title={t.name}
                >
                  {t.slots.length}
                </button>
              ))}
            </div>
            <div className="template-hint">Choose a layout, then select a slot to upload and adjust. Collage mode enables per-slot uploads.</div>
            <div className="template-previews">
              {templates.map(t => (
                <div key={`prev-${t.id}`} className={`template-preview ${selectedTemplate===t.id?'active':''}`} onClick={() => onSelect(t)}>
                  <div className="preview-box">
                    {t.slots.map((s, i)=> (
                      <div key={i} className="preview-slot" style={{ left:`${s.x}%`, top:`${s.y}%`, width:`${s.w}%`, height:`${s.h}%` }} />
                    ))}
                  </div>
                  <div className="preview-caption">{t.name}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

