
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Button from './Button';

interface ImageCropperModalProps {
  imageSrc: string;
  onCrop: (croppedBase64: string) => void;
  onCancel: () => void;
  aspectRatio?: number; // Initial aspect ratio
  isAr?: boolean;
}

const ImageCropperModal: React.FC<ImageCropperModalProps> = ({ imageSrc, onCrop, onCancel, aspectRatio = 1, isAr = false }) => {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0, naturalWidth: 0, naturalHeight: 0 });
  
  // Aspect Ratio State
  const [currentRatio, setCurrentRatio] = useState(aspectRatio);
  const [customRatioValue, setCustomRatioValue] = useState(aspectRatio);
  const [activeRatioName, setActiveRatioName] = useState('custom'); // '1:1', '16:9', 'custom'

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Crop Area Config
  const BASE_SIZE = 350;
  
  const getCropDimensions = () => {
      const r = currentRatio;
      let w, h;
      if (r >= 1) {
          w = BASE_SIZE;
          h = BASE_SIZE / r;
      } else {
          h = BASE_SIZE;
          w = BASE_SIZE * r;
      }
      return { width: w, height: h };
  };

  const { width: cropWidth, height: cropHeight } = getCropDimensions();

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height, naturalWidth, naturalHeight } = e.currentTarget;
    setImageSize({ width, height, naturalWidth, naturalHeight });
    setOffset({ x: 0, y: 0 });
    setZoom(1);
    
    // Default to the passed prop, but allow changing immediately
    // If aspect ratio was not strictly provided (e.g. 1 default), we might want to default to original? 
    // Keeping prop priority for now to respect context (e.g. Profile Pic must be 1:1 initially)
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

  const setPresetRatio = (ratio: number, name: string) => {
      setCurrentRatio(ratio);
      setCustomRatioValue(ratio);
      setActiveRatioName(name);
  };

  const handleCustomRatioChange = (val: number) => {
      setCustomRatioValue(val);
      setCurrentRatio(val);
      setActiveRatioName('custom');
  };

  const executeCrop = async () => {
    if (!imageRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scale = zoom;
    const naturalScaleX = imageSize.naturalWidth / imageSize.width;
    const naturalScaleY = imageSize.naturalHeight / imageSize.height;

    // Use current dynamic dimensions
    const { width: displayW, height: displayH } = getCropDimensions();

    const cropNaturalWidth = (displayW / scale) * naturalScaleX;
    const cropNaturalHeight = (displayH / scale) * naturalScaleY;

    canvas.width = cropNaturalWidth;
    canvas.height = cropNaturalHeight;

    const naturalCenterX = imageSize.naturalWidth / 2;
    const naturalCenterY = imageSize.naturalHeight / 2;

    const displacementX = (offset.x / scale) * naturalScaleX;
    const displacementY = (offset.y / scale) * naturalScaleY;

    const cropCenterX = naturalCenterX - displacementX;
    const cropCenterY = naturalCenterY - displacementY;

    const sourceX = cropCenterX - (cropNaturalWidth / 2);
    const sourceY = cropCenterY - (cropNaturalHeight / 2);

    // Fill background if image doesn't cover
    ctx.fillStyle = 'black'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.drawImage(
        imageRef.current,
        sourceX, sourceY, cropNaturalWidth, cropNaturalHeight,
        0, 0, canvas.width, canvas.height
    );

    onCrop(canvas.toDataURL('image/jpeg', 0.95));
  };

  const ratios = [
      { label: '1:1', value: 1 },
      { label: '9:16', value: 9/16 },
      { label: '16:9', value: 16/9 },
      { label: '4:5', value: 4/5 },
      { label: '3:4', value: 3/4 },
      { label: '2:1', value: 2 },
  ];

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in">
        <div className="bg-[#0a1e3c] border border-white/10 rounded-2xl w-full max-w-xl shadow-2xl flex flex-col max-h-[95vh]">
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex justify-between items-center shrink-0">
                <h3 className="font-bold text-white text-lg">{isAr ? 'تعديل وقص الصورة' : 'Crop & Adjust'}</h3>
                <button onClick={onCancel} className="text-white/50 hover:text-white transition">✕</button>
            </div>

            {/* Viewport */}
            <div className="relative flex-1 bg-black/50 overflow-hidden flex items-center justify-center select-none w-full" 
                 style={{ minHeight: '300px', cursor: isDragging ? 'grabbing' : 'grab' }}
                 onMouseDown={handleMouseDown} onTouchStart={handleMouseDown}>
                
                {/* Image Layer */}
                <div 
                    className="absolute flex items-center justify-center transition-transform duration-75"
                    style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})` }}
                >
                    <img 
                        ref={imageRef}
                        src={imageSrc} 
                        className="max-w-[1000px] pointer-events-none" 
                        style={{ maxHeight: 'none', maxWidth: 'none', width: 'auto', height: 'auto', display: 'block' }}
                        onLoad={handleImageLoad}
                        alt="Crop target"
                        draggable={false}
                    />
                </div>

                {/* Mask Overlay */}
                <div className="absolute inset-0 pointer-events-none bg-black/60 transition-all duration-300">
                    <div 
                        className="absolute top-1/2 left-1/2 border-2 border-[#bf8339] shadow-[0_0_0_9999px_rgba(0,0,0,0.7)] transition-all duration-300"
                        style={{ 
                            width: `${cropWidth}px`, 
                            height: `${cropHeight}px`,
                            transform: 'translate(-50%, -50%)'
                        }}
                    >
                        {/* Grid */}
                        <div className="absolute inset-0 flex flex-col opacity-30">
                            <div className="flex-1 border-b border-white"></div>
                            <div className="flex-1 border-b border-white"></div>
                            <div className="flex-1"></div>
                        </div>
                        <div className="absolute inset-0 flex opacity-30">
                            <div className="flex-1 border-r border-white"></div>
                            <div className="flex-1 border-r border-white"></div>
                            <div className="flex-1"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="p-5 bg-[#0a1e3c] border-t border-white/10 space-y-5 shrink-0">
                
                {/* 1. Ratio Presets */}
                <div>
                    <label className="text-[10px] text-white/50 mb-2 block uppercase tracking-wider font-bold">{isAr ? 'نسبة الأبعاد (Ratio)' : 'Aspect Ratio'}</label>
                    <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
                        <button 
                            onClick={() => {
                                const originalRatio = imageSize.naturalWidth / imageSize.naturalHeight || 1;
                                setPresetRatio(originalRatio, 'original');
                            }}
                            className={`px-3 py-1.5 rounded text-xs whitespace-nowrap border transition ${activeRatioName === 'original' ? 'bg-[#bf8339] text-[#0a1e3c] border-[#bf8339] font-bold' : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'}`}
                        >
                            {isAr ? 'الأصل' : 'Original'}
                        </button>
                        {ratios.map(r => (
                            <button 
                                key={r.label}
                                onClick={() => setPresetRatio(r.value, r.label)}
                                className={`px-3 py-1.5 rounded text-xs whitespace-nowrap border transition ${activeRatioName === r.label ? 'bg-[#bf8339] text-[#0a1e3c] border-[#bf8339] font-bold' : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'}`}
                            >
                                {r.label}
                            </button>
                        ))}
                        <button 
                            onClick={() => setActiveRatioName('custom')}
                            className={`px-3 py-1.5 rounded text-xs whitespace-nowrap border transition ${activeRatioName === 'custom' ? 'bg-[#bf8339] text-[#0a1e3c] border-[#bf8339] font-bold' : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'}`}
                        >
                            {isAr ? 'حر (Free)' : 'Free'}
                        </button>
                    </div>
                </div>

                {/* 2. Custom Ratio Slider (Only if Custom/Free) */}
                {activeRatioName === 'custom' && (
                    <div className="animate-fade-in bg-white/5 p-3 rounded-lg border border-white/5">
                        <div className="flex justify-between text-[10px] text-white/50 mb-1">
                            <span>{isAr ? 'طولي (Portrait)' : 'Portrait'}</span>
                            <span>{isAr ? 'عرضي (Landscape)' : 'Landscape'}</span>
                        </div>
                        <input 
                            type="range" 
                            min="0.4" 
                            max="2.5" 
                            step="0.01" 
                            value={customRatioValue} 
                            onChange={(e) => handleCustomRatioChange(parseFloat(e.target.value))} 
                            className="w-full accent-[#bf8339]"
                        />
                    </div>
                )}

                {/* 3. Zoom */}
                <div className="flex items-center gap-4">
                    <span className="text-xs text-white/50 w-12">{isAr ? 'تقريب' : 'Zoom'}</span>
                    <input 
                        type="range" 
                        min="0.5" 
                        max="3" 
                        step="0.05" 
                        value={zoom} 
                        onChange={(e) => setZoom(parseFloat(e.target.value))} 
                        className="flex-1 accent-[#bf8339]"
                    />
                    <span className="text-xs text-white/50 w-8 text-right">{Math.round(zoom * 100)}%</span>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2 border-t border-white/10">
                    <button 
                        onClick={onCancel}
                        className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition border border-white/10"
                    >
                        {isAr ? 'إلغاء' : 'Cancel'}
                    </button>
                    
                    <button 
                        onClick={() => onCrop(imageSrc)}
                        className="px-4 py-3 bg-white/5 hover:bg-white/10 text-[#bf8339] rounded-xl font-bold transition border border-[#bf8339]/30 text-xs"
                    >
                        {isAr ? 'بدون قص' : 'Skip'}
                    </button>

                    <Button onClick={executeCrop} className="flex-1 shadow-lg shadow-[#bf8339]/20">
                        {isAr ? 'تأكيد القص' : 'Confirm Crop'}
                    </Button>
                </div>
            </div>
        </div>
    </div>,
    document.body
  );
};

export default ImageCropperModal;
    