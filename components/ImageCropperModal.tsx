
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Button from './Button';
import { ArrowsRightLeftIcon } from './Icons';

interface ImageCropperModalProps {
  imageSrc: string;
  onCrop: (croppedBase64: string) => void;
  onCancel: () => void;
  aspectRatio?: number; // width / height
  isAr?: boolean;
}

const ImageCropperModal: React.FC<ImageCropperModalProps> = ({ imageSrc, onCrop, onCancel, aspectRatio = 1, isAr = false }) => {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0, naturalWidth: 0, naturalHeight: 0 });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Constants
  const CROP_AREA_SIZE = 350;
  const CROP_WIDTH = CROP_AREA_SIZE;
  const CROP_HEIGHT = CROP_AREA_SIZE / aspectRatio;

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height, naturalWidth, naturalHeight } = e.currentTarget;
    setImageSize({ width, height, naturalWidth, naturalHeight });
    // Center image initially
    setOffset({ x: 0, y: 0 });
    setZoom(1);
  };

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    setDragStart({ x: clientX - offset.x, y: clientY - offset.y });
  };

  const handleMouseMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
    setOffset({
      x: clientX - dragStart.x,
      y: clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleMouseMove, { passive: false });
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, dragStart]);

  const executeCrop = async () => {
    if (!imageRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Logic:
    // The CropBox is fixed at center of the viewport (CROP_WIDTH, CROP_HEIGHT).
    // The Image is rendered at `imageSize.width` * `zoom`.
    // The Image is offset by `offset.x` and `offset.y` from the center.
    
    const scale = zoom;
    
    // Ratios to map Display Space -> Natural Space
    const naturalScaleX = imageSize.naturalWidth / imageSize.width;
    const naturalScaleY = imageSize.naturalHeight / imageSize.height;

    // Calculate dimensions in Natural Space
    // The crop area in natural pixels depends on the Zoom factor.
    // If zoom is 1 (fit to container), crop area covers a portion.
    // If zoom is 2, crop area covers a smaller portion of the original image (detail).
    const cropNaturalWidth = (CROP_WIDTH / scale) * naturalScaleX;
    const cropNaturalHeight = (CROP_HEIGHT / scale) * naturalScaleY;

    // Set canvas to the actual high-res cropped dimensions
    canvas.width = cropNaturalWidth;
    canvas.height = cropNaturalHeight;

    // Calculate Center of the Source Image in Natural Coordinates
    const naturalCenterX = imageSize.naturalWidth / 2;
    const naturalCenterY = imageSize.naturalHeight / 2;

    // Calculate Displacement from Center in Natural Coordinates
    // Offset is in display pixels. Divide by scale to get "unzoomed display pixels", then multiply by naturalScale.
    const displacementX = (offset.x / scale) * naturalScaleX;
    const displacementY = (offset.y / scale) * naturalScaleY;

    // The center of the crop area on the natural image
    // Note: If we drag image right (positive offset), the crop box moves left relative to image center.
    const cropCenterX = naturalCenterX - displacementX;
    const cropCenterY = naturalCenterY - displacementY;

    // Top-Left coordinate of the source rectangle
    const sourceX = cropCenterX - (cropNaturalWidth / 2);
    const sourceY = cropCenterY - (cropNaturalHeight / 2);

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw directly from the natural image resolution
    ctx.drawImage(
        imageRef.current,
        sourceX, sourceY, cropNaturalWidth, cropNaturalHeight, // Source Rect
        0, 0, canvas.width, canvas.height // Destination Rect
    );

    onCrop(canvas.toDataURL('image/jpeg', 0.95));
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in">
        <div className="bg-[#0a1e3c] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex justify-between items-center">
                <h3 className="font-bold text-white text-lg">{isAr ? 'قص وتعديل الصورة' : 'Crop Image'}</h3>
                <button onClick={onCancel} className="text-white/50 hover:text-white">✕</button>
            </div>

            {/* Viewport */}
            <div className="relative flex-1 bg-black overflow-hidden flex items-center justify-center select-none" style={{ minHeight: '400px', cursor: isDragging ? 'grabbing' : 'grab' }}
                 onMouseDown={handleMouseDown} onTouchStart={handleMouseDown}>
                
                {/* Image Layer */}
                <div 
                    className="absolute flex items-center justify-center transition-transform duration-75"
                    style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})` }}
                >
                    <img 
                        ref={imageRef}
                        src={imageSrc} 
                        className="max-w-[1000px] pointer-events-none" // Allow large overflow
                        style={{ maxHeight: 'none', maxWidth: 'none', width: 'auto', height: 'auto', display: 'block' }}
                        onLoad={handleImageLoad}
                        alt="Crop target"
                        draggable={false}
                    />
                </div>

                {/* Overlay / Mask Layer */}
                <div className="absolute inset-0 pointer-events-none bg-black/60">
                    {/* The "Hole" */}
                    <div 
                        className="absolute top-1/2 left-1/2 border-2 border-[#bf8339] shadow-[0_0_0_9999px_rgba(0,0,0,0.6)]"
                        style={{ 
                            width: `${CROP_WIDTH}px`, 
                            height: `${CROP_HEIGHT}px`,
                            transform: 'translate(-50%, -50%)'
                        }}
                    >
                        {/* Grid Lines */}
                        <div className="absolute inset-0 flex flex-col">
                            <div className="flex-1 border-b border-white/20"></div>
                            <div className="flex-1 border-b border-white/20"></div>
                            <div className="flex-1"></div>
                        </div>
                        <div className="absolute inset-0 flex">
                            <div className="flex-1 border-r border-white/20"></div>
                            <div className="flex-1 border-r border-white/20"></div>
                            <div className="flex-1"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="p-6 bg-[#0a1e3c] border-t border-white/10 space-y-4">
                <div className="flex items-center gap-4">
                    <span className="text-xs text-white/50">{isAr ? 'تصغير' : 'Zoom'}</span>
                    <input 
                        type="range" 
                        min="0.5" 
                        max="3" 
                        step="0.05" 
                        value={zoom} 
                        onChange={(e) => setZoom(parseFloat(e.target.value))} 
                        className="flex-1 accent-[#bf8339]"
                    />
                    <span className="text-xs text-white/50">{Math.round(zoom * 100)}%</span>
                </div>

                <div className="flex gap-3">
                    <button 
                        onClick={onCancel}
                        className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition border border-white/10"
                    >
                        {isAr ? 'إلغاء' : 'Cancel'}
                    </button>
                    
                    {/* Skip Button - Use original image */}
                    <button 
                        onClick={() => onCrop(imageSrc)}
                        className="px-4 py-3 bg-white/5 hover:bg-white/10 text-[#bf8339] rounded-xl font-bold transition border border-[#bf8339]/30 text-xs"
                    >
                        {isAr ? 'استخدام الأصل' : 'Skip Crop'}
                    </button>

                    <Button onClick={executeCrop} className="flex-1 shadow-lg shadow-[#bf8339]/20">
                        {isAr ? 'قص واستخدام' : 'Crop & Use'}
                    </Button>
                </div>
            </div>
        </div>
    </div>,
    document.body
  );
};

export default ImageCropperModal;
