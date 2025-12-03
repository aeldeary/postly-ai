
import React, { useState, useRef, useEffect, useContext } from 'react';
import { ProjectContext } from '../contexts/ProjectContext';
import { jsPDF } from 'jspdf';

interface ExportMenuProps {
  content: string;
  type: 'text' | 'image';
  filename?: string;
  className?: string;
  label?: string;
}

const ExportMenu: React.FC<ExportMenuProps> = ({ content, type, filename = 'postly-export', className, label }) => {
  const { appLanguage } = useContext(ProjectContext);
  const isAr = appLanguage === 'ar';
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const downloadBlob = (blob: Blob, ext: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportText = async (format: 'txt' | 'doc' | 'pdf') => {
    setIsProcessing(true);
    try {
        if (format === 'txt') {
          const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
          downloadBlob(blob, 'txt');
        } else if (format === 'doc') {
          // Create HTML content for Word with basic RTL support
          const htmlContent = `
            <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
            <head><meta charset='utf-8'><title>${filename}</title></head>
            <body style="font-family: 'Arial', sans-serif; direction: rtl; text-align: right;">
              ${content.replace(/\n/g, '<br>')}
            </body></html>
          `;
          const blob = new Blob(['\ufeff', htmlContent], {
            type: 'application/msword'
          });
          downloadBlob(blob, 'doc');
        } else if (format === 'pdf') {
            const doc = new jsPDF({
                orientation: 'p',
                unit: 'mm',
                format: 'a4'
            });

            try {
                // Using Cairo or Amiri as an "Arial" alternative for Arabic support.
                // Standard Arial does not support Arabic in jsPDF without a custom font file.
                // We provide multiple reliable sources.
                const fontUrls = [
                    // Primary: Cairo (Modern Sans-Serif)
                    'https://raw.githubusercontent.com/google/fonts/main/ofl/cairo/Cairo-Regular.ttf',
                    // Secondary: Amiri (Classic Naskh)
                    'https://raw.githubusercontent.com/google/fonts/main/ofl/amiri/Amiri-Regular.ttf',
                    // Fallbacks via JSDelivr CDN
                    'https://cdn.jsdelivr.net/gh/google/fonts/ofl/cairo/Cairo-Regular.ttf',
                    'https://cdn.jsdelivr.net/gh/google/fonts/ofl/amiri/Amiri-Regular.ttf'
                ];
                
                let fontBuffer: ArrayBuffer | null = null;

                // Try fetching from mirrors sequentially
                for (const url of fontUrls) {
                    try {
                        const response = await fetch(url, { cache: 'force-cache' });
                        if (response.ok) {
                            fontBuffer = await response.arrayBuffer();
                            break; 
                        }
                    } catch (e) {
                        console.warn(`Failed to fetch font from ${url}`, e);
                    }
                }

                if (!fontBuffer) {
                    throw new Error("Could not load font from any source.");
                }
                
                // Convert to Base64 string for jsPDF
                let binary = '';
                const bytes = new Uint8Array(fontBuffer);
                const len = bytes.byteLength;
                for (let i = 0; i < len; i++) {
                    binary += String.fromCharCode(bytes[i]);
                }
                const base64Font = window.btoa(binary);
                
                // Add font to VFS and register it as 'Arial' to satisfy user request for Arial look-alike or override default
                doc.addFileToVFS('CustomArabic.ttf', base64Font);
                doc.addFont('CustomArabic.ttf', 'Arial', 'normal');
                doc.setFont('Arial');
            } catch (err) {
                console.error("Font load error, falling back to standard font:", err);
                // Fallback to standard font (Arabic text might be garbled, but PDF will generate)
                doc.setFont("helvetica");
                if ((window as any).toast) {
                    (window as any).toast(isAr ? "تحذير: تعذر تحميل الخط العربي، قد تظهر النصوص بشكل غير صحيح." : "Warning: Arabic font failed to load, text may render incorrectly.", "error");
                }
            }
            
            // Configure styling for PDF
            doc.setFontSize(12);
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const margin = 20;
            const maxWidth = pageWidth - (margin * 2);
            
            // Determine if content is mainly Arabic to align correctly
            const isArabicContent = /[\u0600-\u06FF]/.test(content);
            const align = isArabicContent ? 'right' : 'left';
            const xPos = isArabicContent ? pageWidth - margin : margin;
            
            // Split text into lines that fit the page width
            const lines = doc.splitTextToSize(content, maxWidth);
            
            let cursorY = margin;
            
            lines.forEach((line: string) => {
                if (cursorY > pageHeight - margin) {
                    doc.addPage();
                    cursorY = margin;
                }
                // 'align' option helps with text direction
                doc.text(line, xPos, cursorY, { align: align });
                cursorY += 7; // Line height
            });

            doc.save(`${filename}.pdf`);
        }
    } catch (err: any) {
        console.error("Export error", err);
        alert(isAr ? "حدث خطأ أثناء التصدير." : "Export failed.");
    } finally {
        setIsProcessing(false);
        setIsOpen(false);
    }
  };

  const handleExportImage = (format: 'png' | 'jpeg' | 'pdf') => {
    if (format === 'pdf') {
        const doc = new jsPDF();
        const img = new Image();
        img.src = content;
        img.onload = () => {
            const imgProps = doc.getImageProperties(content);
            const pdfWidth = doc.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            
            // Determine if the source content is PNG or JPEG based on the data URL
            const isPng = content.includes('image/png');
            doc.addImage(content, isPng ? 'PNG' : 'JPEG', 0, 0, pdfWidth, pdfHeight);
            
            doc.save(`${filename}.pdf`);
        };
    } else {
        // Convert if needed or just download
        // Assume content is base64 data url
        const a = document.createElement('a');
        a.href = content;
        a.download = `${filename}.${format}`;
        a.click();
    }
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button
        onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
        className={`flex items-center gap-2 px-3 py-1.5 bg-[#bf8339] text-[#0a1e3c] rounded-lg text-xs font-bold hover:bg-white transition shadow-sm ${className || ''}`}
        title={isAr ? "تصدير" : "Export"}
        disabled={isProcessing}
      >
        {isProcessing ? (
            <svg className="animate-spin h-4 w-4 text-[#0a1e3c]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
        )}
        {label || (isAr ? "تصدير" : "Export")}
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 w-32 bg-[#0a1e3c] border border-white/20 rounded-lg shadow-xl z-50 overflow-hidden animate-fade-in right-0">
          {type === 'text' ? (
            <>
              <button onClick={() => handleExportText('txt')} className="block w-full text-left px-4 py-2 text-xs text-white hover:bg-[#bf8339] hover:text-[#0a1e3c] transition border-b border-white/5">
                Text (.txt)
              </button>
              <button onClick={() => handleExportText('doc')} className="block w-full text-left px-4 py-2 text-xs text-white hover:bg-[#bf8339] hover:text-[#0a1e3c] transition border-b border-white/5">
                Word (.doc)
              </button>
              <button onClick={() => handleExportText('pdf')} className="block w-full text-left px-4 py-2 text-xs text-white hover:bg-[#bf8339] hover:text-[#0a1e3c] transition">
                PDF (Arial)
              </button>
            </>
          ) : (
            <>
              <button onClick={() => handleExportImage('png')} className="block w-full text-left px-4 py-2 text-xs text-white hover:bg-[#bf8339] hover:text-[#0a1e3c] transition border-b border-white/5">
                PNG (.png)
              </button>
              <button onClick={() => handleExportImage('jpeg')} className="block w-full text-left px-4 py-2 text-xs text-white hover:bg-[#bf8339] hover:text-[#0a1e3c] transition border-b border-white/5">
                JPEG (.jpg)
              </button>
              <button onClick={() => handleExportImage('pdf')} className="block w-full text-left px-4 py-2 text-xs text-white hover:bg-[#bf8339] hover:text-[#0a1e3c] transition">
                PDF (.pdf)
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ExportMenu;
