import React, { useState, useEffect } from 'react';

const ImageViewer = ({ 
  defaultImages, 
  selectedVariants, 
  productName,
  onImageChange 
}) => {
  const [currentImages, setCurrentImages] = useState(defaultImages || []);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [is360Mode, setIs360Mode] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);

  // Update images when color variant changes
  useEffect(() => {
    const colorVariant = selectedVariants?.color;
    if (colorVariant && colorVariant.images && colorVariant.images.length > 0) {
      setCurrentImages(colorVariant.images);
      setCurrentImageIndex(0);
      if (onImageChange) {
        onImageChange(colorVariant.images[0]);
      }
    } else {
      setCurrentImages(defaultImages || []);
      setCurrentImageIndex(0);
      if (onImageChange && defaultImages && defaultImages[0]) {
        onImageChange(defaultImages[0]);
      }
    }
  }, [selectedVariants?.color, defaultImages, onImageChange]);

  const handleMouseMove = (e) => {
    if (!isZoomed) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setZoomPosition({ x, y });
  };

  const handle360Drag = (e) => {
    if (!is360Mode) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const deltaX = e.clientX - centerX;
    const rotationDelta = deltaX * 0.5;
    
    setRotationAngle(prev => prev + rotationDelta);
  };

  const nextImage = () => {
    setCurrentImageIndex(prev => 
      prev === currentImages.length - 1 ? 0 : prev + 1
    );
  };

  const previousImage = () => {
    setCurrentImageIndex(prev => 
      prev === 0 ? currentImages.length - 1 : prev - 1
    );
  };

  const toggleFullscreen = () => {
    setIsFullscreen(prev => !prev);
  };

  const toggle360Mode = () => {
    setIs360Mode(prev => !prev);
    setRotationAngle(0);
  };

  if (currentImages.length === 0) {
    return (
      <div className="aspect-square bg-gray-100 rounded-2xl flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gray-500">No image available</p>
        </div>
      </div>
    );
  }

  const currentImage = currentImages[currentImageIndex];

  return (
    <>
      <div className="space-y-4">
        {/* Main Image */}
        <div 
          className={`relative aspect-square bg-white rounded-2xl overflow-hidden shadow-lg border group cursor-${isZoomed ? 'zoom-out' : 'zoom-in'}`}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setIsZoomed(false)}
          onClick={() => !is360Mode && setIsZoomed(!isZoomed)}
          onMouseDown={handle360Drag}
        >
          <img
            src={currentImage}
            alt={`${productName} ${currentImageIndex + 1}`}
            className={`w-full h-full object-cover transition-transform duration-300 ${
              isZoomed ? 'scale-150' : 'scale-100'
            } ${is360Mode ? 'cursor-grab active:cursor-grabbing' : ''}`}
            style={
              isZoomed 
                ? { 
                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    transform: `scale(2) rotate(${is360Mode ? rotationAngle : 0}deg)`
                  }
                : is360Mode 
                ? { transform: `rotate(${rotationAngle}deg)` }
                : {}
            }
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop';
            }}
          />
          
          {/* Navigation arrows */}
          {currentImages.length > 1 && !isZoomed && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); previousImage(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Control buttons */}
          <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => { e.stopPropagation(); toggle360Mode(); }}
              className={`p-2 rounded-full text-white transition-all ${
                is360Mode ? 'bg-brand-700' : 'bg-black/20 hover:bg-black/40'
              }`}
              title="360° View"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
              className="p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-all"
              title="Fullscreen"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>
          </div>

          {/* Zoom indicator */}
          {isZoomed && (
            <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
              Zoomed 2x
            </div>
          )}

          {/* 360 mode indicator */}
          {is360Mode && (
            <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 bg-brand-800 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium">
              <span className="hidden sm:inline">360° Mode - Drag to rotate</span>
              <span className="sm:hidden">360° Mode</span>
            </div>
          )}
        </div>

        {/* Thumbnail navigation */}
        {currentImages.length > 1 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 sm:gap-2">
            {currentImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                  currentImageIndex === index 
                    ? 'border-brand-700 ring-2 ring-brand-700 ring-opacity-20' 
                    : 'border-brand-200 hover:border-brand-300'
                }`}
              >
                <img
                  src={image}
                  alt={`${productName} ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=150&h=150&fit=crop';
                  }}
                />
              </button>
            ))}
          </div>
        )}

        {/* Image counter */}
        <div className="text-center text-sm text-brand-500">
          {currentImageIndex + 1} of {currentImages.length}
        </div>
      </div>

      {/* Fullscreen modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <button
            onClick={toggleFullscreen}
            className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full transition-colors z-10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="max-w-4xl max-h-full p-4">
            <img
              src={currentImage}
              alt={`${productName} fullscreen`}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ImageViewer;