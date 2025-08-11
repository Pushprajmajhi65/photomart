import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import TemplateSelector from './components/editor/TemplateSelector';
import SlotControls from './components/editor/SlotControls';
import PreviewHeaderActions from './components/common/PreviewHeaderActions';
import TransformControls from './components/editor/TransformControls';
import ColorEffects from './components/editor/ColorEffects';
import CropTool from './components/editor/CropTool';
import ThreeCanvasPreview from './ThreeCanvasPreview';
import './ImageEditor.css';

function ImageEditor({ onBack }) {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [selectedFrame, setSelectedFrame] = useState('black-wood');
  const [selectedSize, setSelectedSize] = useState('30x40');
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [imageScale, setImageScale] = useState(0.10);
  const [imageRotation, setImageRotation] = useState(0);
  const [imageBrightness, setImageBrightness] = useState(100);
  const [imageContrast, setImageContrast] = useState(100);
  const [imageSaturation, setImageSaturation] = useState(100);
  const [imageBlur, setImageBlur] = useState(0);
  const [cropMode, setCropMode] = useState(false);
  const [cropArea, setCropArea] = useState({ x: 10, y: 10, width: 80, height: 80 });
  const [isDraggingCrop, setIsDraggingCrop] = useState(false);
  const [dragHandle, setDragHandle] = useState(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showFrameSelector, setShowFrameSelector] = useState(false);
  const [showSizeSelector, setShowSizeSelector] = useState(false);
  const [showImageAdjustments, setShowImageAdjustments] = useState(false);
  const [showColorAdjustments, setShowColorAdjustments] = useState(false);
  const [showCropTool, setShowCropTool] = useState(false);
  const [showBackView, setShowBackView] = useState(false);
  const [canvasRotationY, setCanvasRotationY] = useState(0);
  const [useThreePreview, setUseThreePreview] = useState(true);
  const [useSimple2D, setUseSimple2D] = useState(false);

  // Collage templates (percent-based slots)
  const SLOT_DEFAULT_SCALE = 1.0; // fit entire image initially
  const templates = [
    { id: 'single', name: 'Single Photo', slots: [{ x: 5, y: 5, w: 90, h: 90 }] },
    { id: 'two-vertical', name: '2 Photos (Vertical Split)', slots: [
      { x: 5, y: 5, w: 42.5, h: 90 }, { x: 52.5, y: 5, w: 42.5, h: 90 }
    ]},
    { id: 'two-horizontal', name: '2 Photos (Horizontal Split)', slots: [
      { x: 5, y: 5, w: 90, h: 42.5 }, { x: 5, y: 52.5, w: 90, h: 42.5 }
    ]},
    { id: 'three-1-2', name: '3 Photos (1 Top, 2 Bottom)', slots: [
      { x: 8, y: 6, w: 84, h: 48 }, { x: 8, y: 58, w: 40, h: 32 }, { x: 52, y: 58, w: 40, h: 32 }
    ]},
    { id: 'four-grid', name: '4 Photos (Grid)', slots: [
      { x: 6, y: 6, w: 42, h: 42 }, { x: 52, y: 6, w: 42, h: 42 }, { x: 6, y: 52, w: 42, h: 42 }, { x: 52, y: 52, w: 42, h: 42 }
    ]},
    { id: 'five-mosaic', name: '5 Photos (Mosaic)', slots: [
      { x: 6, y: 6, w: 56, h: 56 }, { x: 64, y: 6, w: 30, h: 26 }, { x: 64, y: 36, w: 30, h: 26 }, { x: 6, y: 66, w: 42, h: 28 }, { x: 50, y: 66, w: 44, h: 28 }
    ]},
    { id: 'six-grid', name: '6 Photos (Grid)', slots: [
      { x: 5, y: 5, w: 28.5, h: 42 }, { x: 35.75, y: 5, w: 28.5, h: 42 }, { x: 66.5, y: 5, w: 28.5, h: 42 },
      { x: 5, y: 53, w: 28.5, h: 42 }, { x: 35.75, y: 53, w: 28.5, h: 42 }, { x: 66.5, y: 53, w: 28.5, h: 42 }
    ]}
  ];
  const [selectedTemplate, setSelectedTemplate] = useState('single');
  const [activeSlot, setActiveSlot] = useState(0);
  const [isCollageMode, setIsCollageMode] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [slotStates, setSlotStates] = useState(() => ({
    0: { src: null, pos: { x: 0, y: 0 }, scale: SLOT_DEFAULT_SCALE, rot: 0 }
  }));
  
  const fileInputRef = useRef(null);
  const slotFileInputRef = useRef(null);
  const previewRef = useRef(null);
  const captureRef = useRef(null);

  // Frame options similar to Whitewall
  const frameOptions = [
    {
      id: 'black-wood',
      name: 'Black Wood Frame',
      type: 'wood',
      color: '#2C2C2C',
      thickness: 25,
      price: 0,
      preview: 'linear-gradient(135deg, #2C2C2C, #1A1A1A)'
    },
    {
      id: 'white-wood',
      name: 'White Wood Frame',
      type: 'wood',
      color: '#F8F8F8',
      thickness: 25,
      price: 100,
      preview: 'linear-gradient(135deg, #F8F8F8, #E8E8E8)'
    },
    {
      id: 'natural-wood',
      name: 'Natural Wood Frame',
      type: 'wood',
      color: '#8B5E3C',
      thickness: 25,
      price: 150,
      preview: 'linear-gradient(135deg, #8B5E3C, #6B3E2E)'
    },
    {
      id: 'gold-frame',
      name: 'Gold Frame',
      type: 'metal',
      color: '#D4AF37',
      thickness: 20,
      price: 300,
      preview: 'linear-gradient(135deg, #D4AF37, #B8860B)'
    },
    {
      id: 'silver-frame',
      name: 'Silver Frame',
      type: 'metal',
      color: '#C0C0C0',
      thickness: 20,
      price: 250,
      preview: 'linear-gradient(135deg, #C0C0C0, #A0A0A0)'
    },
    {
      id: 'no-frame',
      name: 'No Frame',
      type: 'none',
      color: 'transparent',
      thickness: 0,
      price: -200,
      preview: 'transparent'
    }
  ];

  // Size options with pricing
  const sizeOptions = [
    { id: '20x30', name: '20×30 cm', width: 200, height: 300, price: 400, popular: false },
    { id: '30x40', name: '30×40 cm', width: 300, height: 400, price: 800, popular: true },
    { id: '40x50', name: '40×50 cm', width: 400, height: 500, price: 1200, popular: false },
    { id: '50x70', name: '50×70 cm', width: 500, height: 700, price: 1800, popular: false },
    { id: '60x80', name: '60×80 cm', width: 600, height: 800, price: 2500, popular: false }
  ];

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;
      const isMulti = (getCurrentTemplate()?.slots?.length || 1) > 1;
      if (isMulti) {
        setSlotStates(prev => ({
          ...prev,
          [activeSlot]: { ...(prev[activeSlot] || {}), src: data, pos: { x: 0, y: 0 }, scale: SLOT_DEFAULT_SCALE, rot: 0 }
        }));
      } else {
        setUploadedImage(data);
        resetAllAdjustments();
      }
    };
    reader.readAsDataURL(file);
  };

  const handleImageDrag = (event, info) => {
    setImagePosition({
      x: imagePosition.x + info.delta.x,
      y: imagePosition.y + info.delta.y
    });
  };

  const handleSlotDrag = (slotIndex, event, info) => {
    setSlotStates(prev => ({
      ...prev,
      [slotIndex]: {
        ...prev[slotIndex],
        pos: {
          x: (prev[slotIndex]?.pos?.x || 0) + info.delta.x,
          y: (prev[slotIndex]?.pos?.y || 0) + info.delta.y
        }
      }
    }));
  };

  const initSlotsForTemplate = (tplId) => {
    const tpl = templates.find(t => t.id === tplId);
    if (!tpl) return;
    const next = {};
    tpl.slots.forEach((_, idx) => {
      const prev = slotStates[idx];
      next[idx] = prev || { src: null, pos: { x: 0, y: 0 }, scale: SLOT_DEFAULT_SCALE, rot: 0 };
    });
    setSlotStates(next);
    setActiveSlot(0);
  };

  const getCurrentFrame = () => {
    return frameOptions.find(frame => frame.id === selectedFrame);
  };

  const getCurrentSize = () => {
    return sizeOptions.find(size => size.id === selectedSize);
  };

  const getTotalPrice = () => {
    const sizePrice = getCurrentSize()?.price || 0;
    const framePrice = getCurrentFrame()?.price || 0;
    return sizePrice + framePrice;
  };

  const getCurrentTemplate = () => templates.find(t => t.id === selectedTemplate);

  const resetImagePosition = () => {
    setImagePosition({ x: 0, y: 0 });
    setImageScale(0.10);
    setImageRotation(0);
  };

  const resetAllAdjustments = () => {
    setImagePosition({ x: 0, y: 0 });
    setImageScale(0.10);
    setImageRotation(0);
    setImageBrightness(100);
    setImageContrast(100);
    setImageSaturation(100);
    setImageBlur(0);
    setCropArea({ x: 0, y: 0, width: 100, height: 100 });
    setCropMode(false);
  };

  const handleZoomIn = () => {
    setImageScale(prev => Math.min(prev + 0.2, 5));
  };

  const handleZoomOut = () => {
    setImageScale(prev => Math.max(prev - 0.2, 0.1));
  };

  const handleRotateLeft = () => {
    setImageRotation(prev => prev - 90);
  };

  const handleRotateRight = () => {
    setImageRotation(prev => prev + 90);
  };

  const handleFlipHorizontal = () => {
    setImageScale(prev => -prev);
  };

  const handleSlotZoom = (delta) => {
    setSlotStates(prev => ({
      ...prev,
      [activeSlot]: {
        ...prev[activeSlot],
        scale: Math.max(0.1, Math.min((prev[activeSlot]?.scale || 0.1) + delta, 5))
      }
    }));
  };

  const handleSlotRotate = (delta) => {
    setSlotStates(prev => ({
      ...prev,
      [activeSlot]: {
        ...prev[activeSlot],
        rot: ((prev[activeSlot]?.rot || 0) + delta)
      }
    }));
  };

  const handleSlotImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Compute a scale that fits the image inside the slot (assuming slot container size available via CSS %).
        // Since we do not know the rendered slot px size here, default to 1.0 and allow user zoom if needed.
        setSlotStates(prev => ({
          ...prev,
          [activeSlot]: { ...(prev[activeSlot] || {}), src: e.target.result, pos: { x: 0, y: 0 }, scale: 1.0, rot: 0 }
        }));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const applyCrop = () => {
    // In a real implementation, this would crop the actual image
    setCropMode(false);
    setShowCropTool(false);
  };

  const cancelCrop = () => {
    setCropMode(false);
    setShowCropTool(false);
    setCropArea({ x: 10, y: 10, width: 80, height: 80 });
    setIsDraggingCrop(false);
    setDragHandle(null);
  };

  const handleCropMouseDown = (e, handle) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingCrop(true);
    setDragHandle(handle);
    setDragStart({
      x: e.clientX,
      y: e.clientY
    });
  };

  const handleCropMouseMove = useCallback((e) => {
    if (!isDraggingCrop || !dragHandle) return;

    const rect = previewRef.current?.getBoundingClientRect();
    if (!rect) return;

    const deltaX = ((e.clientX - dragStart.x) / rect.width) * 100;
    const deltaY = ((e.clientY - dragStart.y) / rect.height) * 100;

    setCropArea(prev => {
      let newArea = { ...prev };

      switch (dragHandle) {
        case 'move':
          // Move the entire crop area
          newArea.x = Math.max(0, Math.min(100 - prev.width, prev.x + deltaX));
          newArea.y = Math.max(0, Math.min(100 - prev.height, prev.y + deltaY));
          break;
        case 'top-left':
          newArea.x = Math.max(0, Math.min(prev.x + prev.width - 5, prev.x + deltaX));
          newArea.y = Math.max(0, Math.min(prev.y + prev.height - 5, prev.y + deltaY));
          newArea.width = prev.width - deltaX;
          newArea.height = prev.height - deltaY;
          break;
        case 'top-right':
          newArea.y = Math.max(0, Math.min(prev.y + prev.height - 5, prev.y + deltaY));
          newArea.width = Math.max(5, Math.min(100 - prev.x, prev.width + deltaX));
          newArea.height = prev.height - deltaY;
          break;
        case 'bottom-left':
          newArea.x = Math.max(0, Math.min(prev.x + prev.width - 5, prev.x + deltaX));
          newArea.width = prev.width - deltaX;
          newArea.height = Math.max(5, Math.min(100 - prev.y, prev.height + deltaY));
          break;
        case 'bottom-right':
          newArea.width = Math.max(5, Math.min(100 - prev.x, prev.width + deltaX));
          newArea.height = Math.max(5, Math.min(100 - prev.y, prev.height + deltaY));
          break;
        default:
          break;
      }

      // Ensure crop area stays within bounds
      newArea.width = Math.max(5, Math.min(100 - newArea.x, newArea.width));
      newArea.height = Math.max(5, Math.min(100 - newArea.y, newArea.height));

      return newArea;
    });

    setDragStart({
      x: e.clientX,
      y: e.clientY
    });
  }, [isDraggingCrop, dragHandle, dragStart]);

  const handleCropMouseUp = () => {
    setIsDraggingCrop(false);
    setDragHandle(null);
  };

  // Add mouse event listeners for crop dragging
  React.useEffect(() => {
    if (isDraggingCrop) {
      document.addEventListener('mousemove', handleCropMouseMove);
      document.addEventListener('mouseup', handleCropMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleCropMouseMove);
        document.removeEventListener('mouseup', handleCropMouseUp);
      };
    }
  }, [isDraggingCrop, handleCropMouseMove]);

  const getImageFilters = () => {
    return `brightness(${imageBrightness}%) contrast(${imageContrast}%) saturate(${imageSaturation}%) blur(${imageBlur}px)`;
  };

  const capturePreview = async () => {
    const node = captureRef.current || previewRef.current;
    if (!node) return null;
    const canvas = await html2canvas(node, { backgroundColor: null, useCORS: true, scale: 2 });
    return canvas.toDataURL('image/png');
  };

  const downloadCurrentFrame = async () => {
    const dataUrl = await capturePreview();
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'photomart-frame.png';
    a.click();
  };

  const shareOnWhatsApp = async () => {
    const dataUrl = await capturePreview();
    if (!dataUrl) return;
    try {
      // Try navigator.share with data URL (some browsers may not support files from data URLs)
      if (navigator.share && navigator.canShare) {
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        const file = new File([blob], 'frame.png', { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], title: 'My Photomart Frame' });
          return;
        }
      }
    } catch (_) {}
    // Fallback: open WhatsApp with message and instruct user to attach image
    const msg = encodeURIComponent('Hi! I designed this frame on Photomart. Please check the attached image.');
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  };

  return (
    <div className="whitewall-editor">
      {/* Header */}
      <PreviewHeaderActions price={getTotalPrice()} onDownload={downloadCurrentFrame} onShare={shareOnWhatsApp} onBack={onBack} />

      <div className="editor-content">
        {/* Left Sidebar - Controls */}
        <div className="editor-sidebar">
          {/* Templates */}
          <TemplateSelector
            templates={templates}
            selectedTemplate={selectedTemplate}
            onSelect={(tpl)=>{ setSelectedTemplate(tpl.id); initSlotsForTemplate(tpl.id); setIsCollageMode(tpl.slots.length>1); }}
            showTemplateSelector={showTemplateSelector}
            setShowTemplateSelector={setShowTemplateSelector}
            getCurrentTemplate={getCurrentTemplate}
          />

          {/* Active Slot Controls */}
          {getCurrentTemplate()?.slots?.length > 1 && (
            <>
              <SlotControls
                activeSlot={activeSlot}
                onUploadClick={()=> slotFileInputRef.current?.click()}
                onZoomIn={()=>handleSlotZoom(+0.1)}
                onZoomOut={()=>handleSlotZoom(-0.1)}
                onRotateLeft={()=>handleSlotRotate(-5)}
                onRotateRight={()=>handleSlotRotate(+5)}
              />
              <input ref={slotFileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleSlotImageUpload} />
            </>
          )}
          {/* Image Upload Section */}
          <div className="editor-section">
            <h3>1. Upload Image</h3>
            <motion.button 
              className="upload-btn"
              onClick={() => fileInputRef.current?.click()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21,15 16,10 5,21"/>
              </svg>
              {uploadedImage ? 'Change Image' : 'Upload Image'}
            </motion.button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
          </div>

          {/* Frame Selection */}
          <div className="editor-section">
            <h3>2. Choose Frame</h3>
            <motion.button 
              className="selector-btn"
              onClick={() => setShowFrameSelector(!showFrameSelector)}
              whileHover={{ scale: 1.02 }}
            >
              <div className="selector-preview">
                <div 
                  className="frame-preview-small"
                  style={{ background: getCurrentFrame()?.preview }}
                ></div>
                <span>{getCurrentFrame()?.name}</span>
                {getCurrentFrame()?.price > 0 && (
                  <span className="price-tag">+₹{getCurrentFrame()?.price}</span>
                )}
              </div>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6,9 12,15 18,9"/>
              </svg>
            </motion.button>

            <AnimatePresence>
              {showFrameSelector && (
                <motion.div 
                  className="frame-selector"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  {frameOptions.map((frame) => (
                    <motion.button
                      key={frame.id}
                      className={`frame-option ${selectedFrame === frame.id ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedFrame(frame.id);
                        setShowFrameSelector(false);
                      }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div 
                        className="frame-preview"
                        style={{ background: frame.preview }}
                      ></div>
                      <div className="frame-info">
                        <span className="frame-name">{frame.name}</span>
                        <span className="frame-price">
                          {frame.price === 0 ? 'Included' : 
                           frame.price > 0 ? `+₹${frame.price}` : `₹${frame.price}`}
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Size Selection */}
          <div className="editor-section">
            <h3>3. Select Size</h3>
            <motion.button 
              className="selector-btn"
              onClick={() => setShowSizeSelector(!showSizeSelector)}
              whileHover={{ scale: 1.02 }}
            >
              <div className="selector-preview">
                <span>{getCurrentSize()?.name}</span>
                <span className="price-tag">₹{getCurrentSize()?.price}</span>
              </div>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6,9 12,15 18,9"/>
              </svg>
            </motion.button>

            <AnimatePresence>
              {showSizeSelector && (
                <motion.div 
                  className="size-selector"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  {sizeOptions.map((size) => (
                    <motion.button
                      key={size.id}
                      className={`size-option ${selectedSize === size.id ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedSize(size.id);
                        setShowSizeSelector(false);
                      }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="size-info">
                        <span className="size-name">{size.name}</span>
                        {size.popular && <span className="popular-badge">Popular</span>}
                      </div>
                      <span className="size-price">₹{size.price}</span>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Image Adjustments */}
          {uploadedImage && (
            <>
              <div className="editor-section">
                <h3>4. Transform Image</h3>
                
                {/* Quick Action Buttons */}
                <div className="quick-actions">
                  <motion.button
                    className="quick-action-btn"
                    onClick={handleZoomIn}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="Zoom In"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8"/>
                      <path d="M21 21l-4.35-4.35"/>
                      <line x1="11" y1="8" x2="11" y2="14"/>
                      <line x1="8" y1="11" x2="14" y2="11"/>
                    </svg>
                  </motion.button>
                  
                  <motion.button
                    className="quick-action-btn"
                    onClick={handleZoomOut}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="Zoom Out"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8"/>
                      <path d="M21 21l-4.35-4.35"/>
                      <line x1="8" y1="11" x2="14" y2="11"/>
                    </svg>
                  </motion.button>
                  
                  <motion.button
                    className="quick-action-btn"
                    onClick={handleRotateLeft}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="Rotate Left"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2.5 2v6h6"/>
                      <path d="M2.5 8a10 10 0 1 0 2.5-5.5"/>
                    </svg>
                  </motion.button>
                  
                  <motion.button
                    className="quick-action-btn"
                    onClick={handleRotateRight}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="Rotate Right"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21.5 2v6h-6"/>
                      <path d="M21.5 8a10 10 0 1 1-2.5-5.5"/>
                    </svg>
                  </motion.button>
                  
                  <motion.button
                    className="quick-action-btn"
                    onClick={handleFlipHorizontal}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="Flip Horizontal"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M8 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h3"/>
                      <path d="M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3"/>
                      <path d="M12 20v2"/>
                      <path d="M12 14v2"/>
                      <path d="M12 8v2"/>
                      <path d="M12 2v2"/>
                    </svg>
                  </motion.button>
                </div>

                {/* Position & Scale Controls */}
                <motion.button 
                  className="selector-btn"
                  onClick={() => setShowImageAdjustments(!showImageAdjustments)}
                  whileHover={{ scale: 1.02 }}
                >
                  <span>Position & Scale</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6,9 12,15 18,9"/>
                  </svg>
                </motion.button>

                <AnimatePresence>
                  {showImageAdjustments && (
                    <motion.div 
                      className="image-adjustments"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <div className="adjustment-group">
                        <label>Scale: {imageScale.toFixed(2)}x</label>
                        <input
                          type="range"
                          min="0.1"
                          max="5"
                          step="0.1"
                          value={imageScale}
                          onChange={(e) => setImageScale(parseFloat(e.target.value))}
                          className="adjustment-slider"
                        />
                      </div>

                      <div className="adjustment-group">
                        <label>Rotation: {imageRotation}°</label>
                        <input
                          type="range"
                          min="-180"
                          max="180"
                          step="1"
                          value={imageRotation}
                          onChange={(e) => setImageRotation(parseInt(e.target.value))}
                          className="adjustment-slider"
                        />
                      </div>

                      <motion.button
                        className="reset-btn"
                        onClick={resetImagePosition}
                        whileHover={{ scale: 1.02 }}
                      >
                        Reset Transform
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Color Adjustments */}
              <div className="editor-section">
                <h3>5. Color & Effects</h3>
                <motion.button 
                  className="selector-btn"
                  onClick={() => setShowColorAdjustments(!showColorAdjustments)}
                  whileHover={{ scale: 1.02 }}
                >
                  <span>Brightness, Contrast & More</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6,9 12,15 18,9"/>
                  </svg>
                </motion.button>

                <AnimatePresence>
                  {showColorAdjustments && (
                    <motion.div 
                      className="image-adjustments"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <div className="adjustment-group">
                        <label>Brightness: {imageBrightness}%</label>
                        <input
                          type="range"
                          min="0"
                          max="200"
                          step="5"
                          value={imageBrightness}
                          onChange={(e) => setImageBrightness(parseInt(e.target.value))}
                          className="adjustment-slider"
                        />
                      </div>

                      <div className="adjustment-group">
                        <label>Contrast: {imageContrast}%</label>
                        <input
                          type="range"
                          min="0"
                          max="200"
                          step="5"
                          value={imageContrast}
                          onChange={(e) => setImageContrast(parseInt(e.target.value))}
                          className="adjustment-slider"
                        />
                      </div>

                      <div className="adjustment-group">
                        <label>Saturation: {imageSaturation}%</label>
                        <input
                          type="range"
                          min="0"
                          max="200"
                          step="5"
                          value={imageSaturation}
                          onChange={(e) => setImageSaturation(parseInt(e.target.value))}
                          className="adjustment-slider"
                        />
                      </div>

                      <div className="adjustment-group">
                        <label>Blur: {imageBlur}px</label>
                        <input
                          type="range"
                          min="0"
                          max="10"
                          step="0.5"
                          value={imageBlur}
                          onChange={(e) => setImageBlur(parseFloat(e.target.value))}
                          className="adjustment-slider"
                        />
                      </div>

                      <motion.button
                        className="reset-btn"
                        onClick={() => {
                          setImageBrightness(100);
                          setImageContrast(100);
                          setImageSaturation(100);
                          setImageBlur(0);
                        }}
                        whileHover={{ scale: 1.02 }}
                      >
                        Reset Colors
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Crop Tool */}
              <div className="editor-section">
                <h3>6. Crop Image</h3>
                <motion.button 
                  className="selector-btn crop-btn"
                  onClick={() => {
                    setShowCropTool(!showCropTool);
                    setCropMode(!cropMode);
                  }}
                  whileHover={{ scale: 1.02 }}
                >
                  <span>{cropMode ? 'Exit Crop Mode' : 'Start Cropping'}</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 2v14a2 2 0 0 0 2 2h14"/>
                    <path d="M18 6H8a2 2 0 0 1-2-2V2"/>
                  </svg>
                </motion.button>

                <AnimatePresence>
                  {showCropTool && (
                    <motion.div 
                      className="crop-controls"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <div className="crop-presets">
                        <h4>Crop Presets:</h4>
                        <div className="preset-buttons">
                          <motion.button
                            className="preset-btn"
                            onClick={() => setCropArea({ x: 10, y: 10, width: 80, height: 80 })}
                            whileHover={{ scale: 1.02 }}
                          >
                            Square (1:1)
                          </motion.button>
                          <motion.button
                            className="preset-btn"
                            onClick={() => setCropArea({ x: 5, y: 20, width: 90, height: 60 })}
                            whileHover={{ scale: 1.02 }}
                          >
                            16:9
                          </motion.button>
                          <motion.button
                            className="preset-btn"
                            onClick={() => setCropArea({ x: 15, y: 5, width: 70, height: 90 })}
                            whileHover={{ scale: 1.02 }}
                          >
                            4:5
                          </motion.button>
                          <motion.button
                            className="preset-btn"
                            onClick={() => setCropArea({ x: 10, y: 15, width: 80, height: 70 })}
                            whileHover={{ scale: 1.02 }}
                          >
                            3:2
                          </motion.button>
                          <motion.button
                            className="preset-btn"
                            onClick={() => setCropArea({ x: 5, y: 10, width: 90, height: 80 })}
                            whileHover={{ scale: 1.02 }}
                          >
                            Full Width
                          </motion.button>
                          <motion.button
                            className="preset-btn"
                            onClick={() => setCropArea({ x: 5, y: 5, width: 90, height: 90 })}
                            whileHover={{ scale: 1.02 }}
                          >
                            Reset
                          </motion.button>
                        </div>
                        
                        <div className="manual-crop-info">
                          <h4>Manual Crop:</h4>
                          <p>• Drag corners to resize</p>
                          <p>• Drag center to move</p>
                          <p>• Use presets for common ratios</p>
                        </div>
                      </div>

                      <div className="crop-actions">
                        <motion.button
                          className="apply-crop-btn"
                          onClick={applyCrop}
                          whileHover={{ scale: 1.02 }}
                        >
                          Apply Crop
                        </motion.button>
                        <motion.button
                          className="cancel-crop-btn"
                          onClick={cancelCrop}
                          whileHover={{ scale: 1.02 }}
                        >
                          Cancel
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Reset All */}
              <div className="editor-section">
                <motion.button
                  className="reset-all-btn"
                  onClick={resetAllAdjustments}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Reset All Adjustments
                </motion.button>
              </div>
            </>
          )}
        </div>

        {/* Main Preview Area */}
        <div className="editor-preview">
          <div className="preview-container" ref={previewRef}>
            {useThreePreview ? (
              (() => {
                const isMulti = (getCurrentTemplate()?.slots?.length || 1) > 1;
                const hasAnySlot = Object.values(slotStates || {}).some(s => s && s.src);
                if (isMulti && hasAnySlot) {
                  return (
                    <ThreeCanvasPreview
                      imageSrc={''}
                      width={getCurrentSize()?.width}
                      height={getCurrentSize()?.height}
                      depth={24}
                      rotationY={canvasRotationY}
                      showBack={showBackView}
                      collageSlots={getCurrentTemplate()?.slots}
                      collageStates={slotStates}
                    />
                  );
                }
                if (!isMulti && uploadedImage) {
                  return (
                    <ThreeCanvasPreview
                      imageSrc={uploadedImage}
                      width={getCurrentSize()?.width}
                      height={getCurrentSize()?.height}
                      depth={24}
                      rotationY={canvasRotationY}
                      showBack={showBackView}
                    />
                  );
                }
                return <div style={{ width: '100%', height: '520px' }} />;
              })()
            ) : useSimple2D ? (
              <div 
                className="preview-frame"
                style={{
                  width: `${getCurrentSize()?.width}px`,
                  height: `${getCurrentSize()?.height}px`,
                  border: getCurrentFrame()?.thickness > 0 ? 
                    `${getCurrentFrame()?.thickness}px solid ${getCurrentFrame()?.color}` : 'none',
                  background: getCurrentFrame()?.preview,
                  boxShadow: getCurrentFrame()?.id !== 'no-frame' ? 
                    '0 10px 30px rgba(0, 0, 0, 0.3)' : 'none'
                }}
                ref={captureRef}
              >
                  <div className="image-container" onClick={() => {
                    if ((getCurrentTemplate()?.slots?.length || 1) > 1 && !slotStates[activeSlot]?.src) {
                      slotFileInputRef.current?.click();
                    }
                  }}>
                  { (getCurrentTemplate()?.slots?.length || 1) > 1 ? (
                    <>
                      {getCurrentTemplate().slots.map((slot, idx) => {
                        const st = slotStates[idx] || {};
                        return (
                          <div
                            key={idx}
                            className={`collage-slot ${activeSlot === idx ? 'active' : ''}`}
                            style={{ left: `${slot.x}%`, top: `${slot.y}%`, width: `${slot.w}%`, height: `${slot.h}%` }}
                            onClick={() => setActiveSlot(idx)}
                          >
                            {st.src ? (
                              <motion.img
                                src={st.src}
                                alt={`slot-${idx}`}
                                className="slot-image"
                                drag
                                onDrag={(e, info)=>handleSlotDrag(idx, e, info)}
                                style={{ transform: `translate(${st.pos?.x||0}px, ${st.pos?.y||0}px) scale(${st.scale||0.10}) rotate(${st.rot||0}deg)` }}
                                whileDrag={{ cursor: 'grabbing' }}
                              />
                            ) : (
                              <div className="slot-placeholder">Click to select and upload</div>
                            )}
                          </div>
                        );
                      })}
                    </>
                  ) : uploadedImage ? (
                    <>
                      <motion.img
                        src={uploadedImage}
                        alt="Preview"
                        className="preview-image"
                        drag={!cropMode}
                        onDrag={handleImageDrag}
                        style={{
                          transform: `translate(${imagePosition.x}px, ${imagePosition.y}px) scale(${imageScale}) rotate(${imageRotation}deg)`,
                          filter: getImageFilters(),
                        }}
                        whileDrag={{ cursor: 'grabbing' }}
                      />
                      {cropMode && (
                        <div className="crop-overlay">
                          <div 
                            className="crop-area"
                            style={{
                              left: `${cropArea.x}%`,
                              top: `${cropArea.y}%`,
                              width: `${cropArea.width}%`,
                              height: `${cropArea.height}%`,
                            }}
                            onMouseDown={(e) => handleCropMouseDown(e, 'move')}
                          >
                            <div className="crop-center">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3"/>
                              </svg>
                            </div>
                            <div className="crop-handles">
                              <div className="crop-handle top-left" onMouseDown={(e) => handleCropMouseDown(e, 'top-left')}></div>
                              <div className="crop-handle top-right" onMouseDown={(e) => handleCropMouseDown(e, 'top-right')}></div>
                              <div className="crop-handle bottom-left" onMouseDown={(e) => handleCropMouseDown(e, 'bottom-left')}></div>
                              <div className="crop-handle bottom-right" onMouseDown={(e) => handleCropMouseDown(e, 'bottom-right')}></div>
                            </div>
                            <div className="crop-dimensions">{Math.round(cropArea.width)}% × {Math.round(cropArea.height)}%</div>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="placeholder-image">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21,15 16,10 5,21"/>
                      </svg>
                      <p>Upload an image to see preview</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
            <div className="canvas-3d-container" ref={captureRef}>
              <div 
                className="canvas-front"
                style={{
                  width: `${getCurrentSize()?.width}px`,
                  height: `${getCurrentSize()?.height}px`,
                  transform: `perspective(1000px) rotateY(${canvasRotationY}deg) ${showBackView ? 'rotateY(180deg)' : ''}`,
                  transformStyle: 'preserve-3d',
                  position: 'relative'
                }}
              >
                {/* Canvas frame structure */}
                <div className="canvas-frame-structure">
                  {/* Wooden frame edges */}
                  <div className="frame-edge frame-top"></div>
                  <div className="frame-edge frame-right"></div>
                  <div className="frame-edge frame-bottom"></div>
                  <div className="frame-edge frame-left"></div>
                  
                  {/* Canvas wrapped edges */}
                  <div className="canvas-wrap canvas-wrap-top"></div>
                  <div className="canvas-wrap canvas-wrap-right"></div>
                  <div className="canvas-wrap canvas-wrap-bottom"></div>
                  <div className="canvas-wrap canvas-wrap-left"></div>
                  
                  {/* Staples */}
                  <div className="staples">
                    {/* Top staples */}
                    <div className="staple staple-top" style={{left: '20%'}}></div>
                    <div className="staple staple-top" style={{left: '40%'}}></div>
                    <div className="staple staple-top" style={{left: '60%'}}></div>
                    <div className="staple staple-top" style={{left: '80%'}}></div>
                    
                    {/* Right staples */}
                    <div className="staple staple-right" style={{top: '20%'}}></div>
                    <div className="staple staple-right" style={{top: '40%'}}></div>
                    <div className="staple staple-right" style={{top: '60%'}}></div>
                    <div className="staple staple-right" style={{top: '80%'}}></div>
                    
                    {/* Bottom staples */}
                    <div className="staple staple-bottom" style={{left: '20%'}}></div>
                    <div className="staple staple-bottom" style={{left: '40%'}}></div>
                    <div className="staple staple-bottom" style={{left: '60%'}}></div>
                    <div className="staple staple-bottom" style={{left: '80%'}}></div>
                    
                    {/* Left staples */}
                    <div className="staple staple-left" style={{top: '20%'}}></div>
                    <div className="staple staple-left" style={{top: '40%'}}></div>
                    <div className="staple staple-left" style={{top: '60%'}}></div>
                    <div className="staple staple-left" style={{top: '80%'}}></div>
                  </div>
                </div>
                
                {/* Main canvas surface */}
                <div 
                  className="preview-frame"
                  style={{
                    width: `${getCurrentSize()?.width}px`,
                    height: `${getCurrentSize()?.height}px`,
                    background: getCurrentFrame()?.preview || '#f8f9fa',
                    position: 'relative',
                    zIndex: 10,
                    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.2), inset 0 0 0 1px rgba(0, 0, 0, 0.1)'
                  }}
                >
                                 {/* Image Container */}
                 <div className="image-container">
                   { (getCurrentTemplate()?.slots?.length || 1) > 1 ? (
                     <>
                       {getCurrentTemplate().slots.map((slot, idx) => {
                         const st = slotStates[idx] || {};
                         return (
                           <div
                             key={`cslot-${idx}`}
                             className={`collage-slot ${activeSlot === idx ? 'active' : ''}`}
                             style={{ left: `${slot.x}%`, top: `${slot.y}%`, width: `${slot.w}%`, height: `${slot.h}%` }}
                             onClick={() => setActiveSlot(idx)}
                           >
                             {st.src ? (
                              <motion.img
                                 src={st.src}
                                 alt={`slot-${idx}`}
                                 className="slot-image"
                                 drag
                                 onDrag={(e, info)=>handleSlotDrag(idx, e, info)}
                                style={{ maxWidth: '100%', maxHeight: '100%', transform: `translate(${st.pos?.x||0}px, ${st.pos?.y||0}px) scale(${st.scale||SLOT_DEFAULT_SCALE}) rotate(${st.rot||0}deg)`, transformOrigin: 'center center' }}
                                 whileDrag={{ cursor: 'grabbing' }}
                               />
                             ) : (
                               <div className="slot-placeholder">Click to select and upload</div>
                             )}
                           </div>
                         );
                       })}
                     </>
                   ) : uploadedImage ? (
                     <>
                       <motion.img
                         src={uploadedImage}
                         alt="Preview"
                         className="preview-image"
                         drag={!cropMode}
                         onDrag={handleImageDrag}
                         style={{
                           transform: `translate(${imagePosition.x}px, ${imagePosition.y}px) scale(${imageScale}) rotate(${imageRotation}deg)`,
                           filter: getImageFilters(),
                         }}
                         whileDrag={{ cursor: 'grabbing' }}
                       />
                       {cropMode && (
                         <div className="crop-overlay">
                           <div 
                             className="crop-area"
                             style={{
                               left: `${cropArea.x}%`,
                               top: `${cropArea.y}%`,
                               width: `${cropArea.width}%`,
                               height: `${cropArea.height}%`,
                             }}
                             onMouseDown={(e) => handleCropMouseDown(e, 'move')}
                           >
                             <div className="crop-center">
                               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                 <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3"/>
                               </svg>
                             </div>
                             <div className="crop-handles">
                               <div className="crop-handle top-left" onMouseDown={(e) => handleCropMouseDown(e, 'top-left')}></div>
                               <div className="crop-handle top-right" onMouseDown={(e) => handleCropMouseDown(e, 'top-right')}></div>
                               <div className="crop-handle bottom-left" onMouseDown={(e) => handleCropMouseDown(e, 'bottom-left')}></div>
                               <div className="crop-handle bottom-right" onMouseDown={(e) => handleCropMouseDown(e, 'bottom-right')}></div>
                             </div>
                             <div className="crop-dimensions">{Math.round(cropArea.width)}% × {Math.round(cropArea.height)}%</div>
                           </div>
                         </div>
                       )}
                     </>
                   ) : (
                     <div className="placeholder-image">
                       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                         <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                         <circle cx="8.5" cy="8.5" r="1.5"/>
                         <polyline points="21,15 16,10 5,21"/>
                       </svg>
                       <p>Upload an image to see preview</p>
                     </div>
                   )}
                 </div>
                </div>
              </div>
            </div>
            )}
            {/* Floating Disclaimer (only for 3D mode) */}
            {useThreePreview && (
              <div className="preview-disclaimer" aria-live="polite">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12" y2="16" />
                </svg>
                <span>Preview is for visualization. Actual product may vary slightly.</span>
              </div>
            )}
          </div>

            {/* Preview Controls */}
            <div className="preview-controls">
              <div className="preview-info">
                <span className="size-display">{getCurrentSize()?.name}</span>
                <span className="frame-display">{getCurrentFrame()?.name}</span>
              </div>
              
              {/* Canvas View Controls */}
              <div className="canvas-view-controls">
                <motion.button
                  className={`view-toggle-btn ${!showBackView ? 'active' : ''}`}
                  onClick={() => setShowBackView(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <path d="M21 15l-5-5L5 21"/>
                  </svg>
                  Front View
                </motion.button>
                
                <motion.button
                  className={`view-toggle-btn ${showBackView ? 'active' : ''}`}
                  onClick={() => setShowBackView(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                    <line x1="8" y1="21" x2="16" y2="21"/>
                    <line x1="12" y1="17" x2="12" y2="21"/>
                  </svg>
                  Back Frame
                </motion.button>
                
                <div className="rotation-controls">
                  <motion.button
                    className="rotate-btn"
                    onClick={() => setCanvasRotationY(prev => prev - 15)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 4v6h6"/>
                      <path d="m1 10 3.51-3.51a9 9 0 0 1 12.86-1.22L21 8"/>
                    </svg>
                  </motion.button>
                  
                  <span className="rotation-display">{canvasRotationY}°</span>
                  
                  <motion.button
                    className="rotate-btn"
                    onClick={() => setCanvasRotationY(prev => prev + 15)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M23 4v6h-6"/>
                      <path d="m23 10-3.51-3.51a9 9 0 0 0-12.86-1.22L3 8"/>
                    </svg>
                  </motion.button>
                  
                  <motion.button
                    className="reset-rotation-btn"
                    onClick={() => setCanvasRotationY(0)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Reset
                  </motion.button>

                  <motion.button
                    className="view-toggle-btn"
                    onClick={() => setUseThreePreview((v) => !v)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ marginLeft: 8 }}
                  >
                    {useThreePreview ? 'Switch to 2D' : 'Switch to 3D'}
                  </motion.button>

                  <motion.button
                    className={`view-toggle-btn ${useSimple2D ? 'active' : ''}`}
                    onClick={() => setUseSimple2D((v) => !v)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {useSimple2D ? 'Normal View: ON' : 'Normal View'}
                  </motion.button>
                </div>
              </div>
              
              {uploadedImage && (
                <div className="preview-hints">
                  <p>💡 Drag the image to reposition</p>
                  <p>🔧 Use controls on the left to adjust</p>
                  <p>🎨 Toggle front/back view to see frame structure</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
  );
}

export default ImageEditor;