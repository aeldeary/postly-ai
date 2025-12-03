
import React, { useState, useEffect } from 'react';
import { SwatchIcon } from './Icons';

interface AdvancedColorPickerProps {
  onColorChange: (colors: string[]) => void;
  label: string;
  defaultColors?: string[];
  isAr?: boolean;
}

type HarmonyMode = 
  | 'manual' 
  | 'monochromatic' 
  | 'analogous' 
  | 'complementary' 
  | 'split-complementary' 
  | 'triad' 
  | 'tetrad' 
  | 'compound' 
  | 'shades' 
  | 'tints' 
  | 'tones';

export const AdvancedColorPicker: React.FC<AdvancedColorPickerProps> = ({ onColorChange, label, defaultColors, isAr = false }) => {
  const [baseColor, setBaseColor] = useState(defaultColors?.[0] || '#bf8339');
  const [palette, setPalette] = useState<string[]>(defaultColors || ['#bf8339']);
  const [mode, setMode] = useState<HarmonyMode>('manual');
  const [isOpen, setIsOpen] = useState(false);

  // Helper: Hex to HSL
  const hexToHSL = (hex: string) => {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
      r = parseInt("0x" + hex[1] + hex[1]);
      g = parseInt("0x" + hex[2] + hex[2]);
      b = parseInt("0x" + hex[3] + hex[3]);
    } else if (hex.length === 7) {
      r = parseInt("0x" + hex[1] + hex[2]);
      g = parseInt("0x" + hex[3] + hex[4]);
      b = parseInt("0x" + hex[5] + hex[6]);
    }
    r /= 255; g /= 255; b /= 255;
    let cmin = Math.min(r,g,b), cmax = Math.max(r,g,b), delta = cmax - cmin;
    let h = 0, s = 0, l = 0;

    if (delta === 0) h = 0;
    else if (cmax === r) h = ((g - b) / delta) % 6;
    else if (cmax === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;

    h = Math.round(h * 60);
    if (h < 0) h += 360;
    l = (cmax + cmin) / 2;
    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return { h, s, l };
  };

  // Helper: HSL to Hex
  const hslToHex = (h: number, s: number, l: number) => {
    s /= 100; l /= 100;
    let c = (1 - Math.abs(2 * l - 1)) * s;
    let x = c * (1 - Math.abs((h / 60) % 2 - 1));
    let m = l - c/2;
    let r = 0, g = 0, b = 0;

    if (0 <= h && h < 60) { r = c; g = x; b = 0; }
    else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
    else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
    else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
    else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
    else if (300 <= h && h < 360) { r = c; g = 0; b = x; }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    const toHex = (n: number) => {
      const hex = n.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };
    return "#" + toHex(r) + toHex(g) + toHex(b);
  };

  const generateHarmony = (color: string, type: HarmonyMode) => {
    const { h, s, l } = hexToHSL(color);
    let newPalette = [color];

    switch (type) {
        case 'monochromatic':
            // Variations in Lightness and Saturation
            newPalette.push(hslToHex(h, s, Math.min(95, l + 25))); // Lighter
            newPalette.push(hslToHex(h, s, Math.max(5, l - 25)));  // Darker
            newPalette.push(hslToHex(h, Math.max(0, s - 30), l));  // Desaturated
            break;
        case 'analogous':
            // Adjacent hues (+/- 30deg)
            newPalette.push(hslToHex((h + 30) % 360, s, l));
            newPalette.push(hslToHex((h - 30 + 360) % 360, s, l));
            newPalette.push(hslToHex((h + 60) % 360, s, l));
            break;
        case 'complementary':
            // Opposite hue (+180deg)
            newPalette.push(hslToHex((h + 180) % 360, s, l));
            newPalette.push(hslToHex(h, s, Math.max(10, l - 30))); // Shade of base
            newPalette.push(hslToHex((h + 180) % 360, s, Math.min(90, l + 30))); // Tint of comp
            break;
        case 'split-complementary':
            // Opposite +/- 30deg
            newPalette.push(hslToHex((h + 150) % 360, s, l));
            newPalette.push(hslToHex((h + 210) % 360, s, l));
            break;
        case 'triad':
            // +120deg, +240deg
            newPalette.push(hslToHex((h + 120) % 360, s, l));
            newPalette.push(hslToHex((h + 240) % 360, s, l));
            break;
        case 'tetrad':
            // Double Complementary (Square/Rect)
            newPalette.push(hslToHex((h + 90) % 360, s, l));
            newPalette.push(hslToHex((h + 180) % 360, s, l));
            newPalette.push(hslToHex((h + 270) % 360, s, l));
            break;
        case 'compound':
            // Mix of Analogous and Complementary
            newPalette.push(hslToHex((h + 30) % 360, s, l));
            newPalette.push(hslToHex((h + 180) % 360, s, l));
            newPalette.push(hslToHex((h + 210) % 360, s, l));
            break;
        case 'shades': 
            // Decrease Lightness (Mix with Black)
            newPalette.push(hslToHex(h, s, Math.max(0, l - 20)));
            newPalette.push(hslToHex(h, s, Math.max(0, l - 40)));
            newPalette.push(hslToHex(h, s, Math.max(0, l - 60)));
            break;
        case 'tints': 
            // Increase Lightness (Mix with White)
            newPalette.push(hslToHex(h, s, Math.min(100, l + 20)));
            newPalette.push(hslToHex(h, s, Math.min(100, l + 40)));
            newPalette.push(hslToHex(h, s, Math.min(100, l + 60)));
            break;
        case 'tones': 
            // Decrease Saturation (Mix with Grey)
            newPalette.push(hslToHex(h, Math.max(0, s - 25), l));
            newPalette.push(hslToHex(h, Math.max(0, s - 50), l));
            newPalette.push(hslToHex(h, Math.max(0, s - 75), l));
            break;
        case 'manual':
        default:
            // Keep existing or fill with defaults
            if (palette.length > 1) return palette;
            newPalette.push('#ffffff');
            newPalette.push('#000000');
    }
    return newPalette;
  };

  useEffect(() => {
    if (mode !== 'manual') {
        const newPalette = generateHarmony(baseColor, mode);
        setPalette(newPalette);
        onColorChange(newPalette);
    }
  }, [baseColor, mode]);

  const handleManualColorChange = (index: number, color: string) => {
      const newPalette = [...palette];
      newPalette[index] = color;
      setPalette(newPalette);
      setBaseColor(newPalette[0]); // Assume first is base
      setMode('manual');
      onColorChange(newPalette);
  };

  const harmonies = [
      { id: 'manual', labelAr: 'يدوي', labelEn: 'Manual' },
      { id: 'monochromatic', labelAr: 'أحادي اللون', labelEn: 'Monochromatic' },
      { id: 'analogous', labelAr: 'متماثل', labelEn: 'Analogous' },
      { id: 'complementary', labelAr: 'مكمل', labelEn: 'Complementary' },
      { id: 'split-complementary', labelAr: 'مكمل منقسم', labelEn: 'Split Comp.' },
      { id: 'triad', labelAr: 'ثلاثي', labelEn: 'Triad' },
      { id: 'tetrad', labelAr: 'رباعي', labelEn: 'Tetrad' },
      { id: 'compound', labelAr: 'مركب', labelEn: 'Compound' },
      { id: 'shades', labelAr: 'ظلال (داكن)', labelEn: 'Shades' },
      { id: 'tints', labelAr: 'صبغات (فاتح)', labelEn: 'Tints' },
      { id: 'tones', labelAr: 'نغمات (باهت)', labelEn: 'Tones' },
  ];

  return (
    <div className="bg-black/20 p-4 rounded-xl border border-white/10">
      <div className="flex justify-between items-center mb-4 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <label className="text-sm font-bold text-white flex items-center gap-2">
            <SwatchIcon className="w-4 h-4 text-[#bf8339]" />
            {label}
        </label>
        <span className="text-xs text-[#bf8339]">{isOpen ? (isAr ? 'إخفاء' : 'Hide') : (isAr ? 'تخصيص' : 'Customize')}</span>
      </div>

      {isOpen && (
          <div className="animate-fade-in space-y-4">
              {/* Color Wheel Visualization (CSS Conic Gradient) */}
              <div className="flex justify-center mb-4">
                  <div className="relative w-32 h-32 rounded-full shadow-xl border-4 border-white/10" 
                       style={{ background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)' }}>
                       <div className="absolute inset-0 flex items-center justify-center">
                           <div className="w-16 h-16 bg-white rounded-full border-4 border-white/20 shadow-inner transition-colors duration-300" style={{backgroundColor: baseColor}}></div>
                       </div>
                  </div>
              </div>

              {/* Base Color Input */}
              <div className="flex items-center gap-2">
                  <span className="text-xs text-white/60 w-16">{isAr ? 'لون أساسي' : 'Base Color'}</span>
                  <div className="flex-1 h-8 rounded-lg overflow-hidden border border-white/20 flex relative">
                      <input 
                        type="color" 
                        value={baseColor} 
                        onChange={(e) => { setBaseColor(e.target.value); setMode('manual'); }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="w-full h-full" style={{backgroundColor: baseColor}}></div>
                  </div>
                  <input 
                    type="text" 
                    value={baseColor} 
                    onChange={(e) => { setBaseColor(e.target.value); setMode('manual'); }}
                    className="w-20 bg-black/30 border border-white/10 rounded-lg text-xs text-white text-center font-mono"
                  />
              </div>

              {/* Harmonies Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {harmonies.map(m => (
                      <button 
                        key={m.id}
                        onClick={() => setMode(m.id as HarmonyMode)}
                        className={`text-[10px] py-1.5 px-1 rounded-md border transition truncate ${mode === m.id ? 'bg-[#bf8339] border-[#bf8339] text-[#0a1e3c] font-bold' : 'bg-transparent border-white/10 text-white/60 hover:text-white'}`}
                        title={isAr ? m.labelAr : m.labelEn}
                      >
                          {isAr ? m.labelAr : m.labelEn}
                      </button>
                  ))}
              </div>

              {/* Active Palette Swatches */}
              <div className="space-y-2">
                  <label className="text-xs text-white/50 block">{isAr ? 'اللوحة الناتجة' : 'Resulting Palette'}</label>
                  <div className="flex gap-2 flex-wrap">
                      {palette.map((c, i) => (
                          <div key={i} className="flex-1 min-w-[30px] group relative">
                              <div className="h-10 rounded-md border border-white/10 shadow-sm transition-colors duration-300" style={{backgroundColor: c}}></div>
                              <input 
                                type="color" 
                                value={c} 
                                onChange={(e) => handleManualColorChange(i, e.target.value)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              />
                              <span className="absolute -bottom-4 left-0 right-0 text-[8px] text-center text-white/40 opacity-0 group-hover:opacity-100 font-mono">{c}</span>
                          </div>
                      ))}
                      {palette.length < 6 && (
                          <button onClick={() => {
                              const newP = [...palette, '#ffffff'];
                              setPalette(newP);
                              onColorChange(newP);
                          }} className="w-8 h-10 rounded-md border border-dashed border-white/20 flex items-center justify-center text-white/40 hover:text-white hover:border-white transition">+</button>
                      )}
                  </div>
              </div>
          </div>
      )}
      
      {/* Compact Preview when closed */}
      {!isOpen && (
          <div className="flex gap-2 mt-2">
              {palette.map((c, i) => (
                  <div key={i} className="w-6 h-6 rounded-full border border-white/10" style={{backgroundColor: c}}></div>
              ))}
          </div>
      )}
    </div>
  );
};
