
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface OptionGroup {
  label: string;
  options: (string | { label: string; value: string; description?: string })[];
}

interface CustomGroupedSelectProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  groups: OptionGroup[];
  placeholder: string;
}

const CustomGroupedSelect: React.FC<CustomGroupedSelectProps> = ({ label, value, onChange, groups, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, width: 0 });
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0); // Default open first group
  
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Handle click outside and scroll/resize
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      // Check if click is inside the main container OR the portal menu
      const inContainer = containerRef.current?.contains(target);
      const inMenu = menuRef.current?.contains(target);
      
      if (!inContainer && !inMenu) {
        setIsOpen(false);
      }
    };
    
    const handleScroll = (event: Event) => {
        if (menuRef.current && (event.target === menuRef.current || menuRef.current.contains(event.target as Node))) {
            return;
        }
        if (isOpen) setIsOpen(false);
    };

    if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
        window.addEventListener('scroll', handleScroll, true); 
    }

    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('touchstart', handleClickOutside);
        window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen]);

  // Update position when opening
  useEffect(() => {
      if (isOpen && buttonRef.current) {
          const rect = buttonRef.current.getBoundingClientRect();
          setMenuPosition({
              top: rect.bottom + 5,
              left: rect.left,
              width: rect.width
          });
          setSearchQuery('');
      }
  }, [isOpen]);

  // Helper to get display label for current value with Safety Checks
  const getDisplayValue = () => {
    if (!value) return placeholder;
    for (const group of groups) {
      for (const opt of group.options) {
        if (typeof opt === 'string') {
          if (opt === value) return opt;
        } else {
          if (opt.value === value) {
             const lbl = opt.label;
             // Guard against object labels
             if (typeof lbl === 'object' && lbl !== null) {
                 return (lbl as any).ar || (lbl as any).en || String(lbl);
             }
             return lbl;
          }
        }
      }
    }
    return value;
  };

  const toggleAccordion = (index: number, e: React.MouseEvent) => {
      e.stopPropagation();
      setExpandedIndex(expandedIndex === index ? null : index);
  };

  // Filter logic with Safety Checks
  const filteredGroups = groups.map(group => {
      let groupLabel = typeof group.label === 'string' ? group.label : '';
      if (typeof group.label === 'object' && group.label !== null) {
          groupLabel = (group.label as any).ar || (group.label as any).en || String(group.label);
      }
      const groupMatches = String(groupLabel).toLowerCase().includes(searchQuery.toLowerCase());
      
      const filteredOptions = group.options.filter(opt => {
          let text = typeof opt === 'string' ? opt : opt.label;
          if (typeof text === 'object' && text !== null) {
              text = (text as any).ar || (text as any).en || String(text);
          }
          const textStr = String(text || '');
          return textStr.toLowerCase().includes(searchQuery.toLowerCase());
      });

      if (groupMatches) return group;
      if (filteredOptions.length > 0) return { ...group, options: filteredOptions };
      return null;
  }).filter(Boolean) as OptionGroup[];

  const dropdownMenu = (
      <div 
        ref={menuRef}
        className="fixed z-[9999] bg-[#0a1e3c] border border-white/20 rounded-lg shadow-2xl max-h-80 overflow-y-auto animate-fade-in custom-scrollbar flex flex-col p-2"
        style={{ 
            top: menuPosition.top, 
            left: menuPosition.left, 
            width: menuPosition.width 
        }}
      >
          {/* SEARCH INPUT */}
          <div className="sticky top-0 bg-[#0a1e3c] pb-2 z-10 pt-1 px-1">
              <input 
                type="text" 
                className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-[#bf8339] outline-none placeholder-white/30"
                placeholder="بحث..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
          </div>

          {/* RESET OPTION */}
          <div 
            onClick={() => { onChange(""); setIsOpen(false); }} 
            className="text-white/50 text-xs text-center p-2 cursor-pointer hover:text-white mb-2 border-b border-white/5"
          >
            -- {placeholder} --
          </div>

          {/* LIST WITH ACCORDION */}
          {filteredGroups.length > 0 ? filteredGroups.map((group, idx) => {
             const isExpanded = searchQuery.length > 0 || expandedIndex === idx;
             
             // Safe Group Label Render
             let safeGroupLabel = group.label;
             if (typeof safeGroupLabel === 'object' && safeGroupLabel !== null) {
                 safeGroupLabel = (safeGroupLabel as any).ar || (safeGroupLabel as any).en || String(safeGroupLabel);
             }

             return (
                <div key={idx} className="accordion-section">
                  <div 
                    className="accordion-header" 
                    onClick={(e) => toggleAccordion(idx, e)}
                  >
                    <span>{safeGroupLabel as string}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  
                  {isExpanded && (
                    <div className="accordion-content">
                      {group.options.map((opt, optIdx) => {
                        const optValue = typeof opt === 'string' ? opt : opt.value;
                        let optLabel = typeof opt === 'string' ? opt : opt.label;
                        const optDesc = typeof opt === 'object' ? opt.description : undefined;
                        
                        // Safe Option Label Render
                        if (typeof optLabel === 'object' && optLabel !== null) {
                             optLabel = (optLabel as any).ar || (optLabel as any).en || String(optLabel);
                        }
                        
                        return (
                          <div
                            key={optIdx}
                            onClick={() => { onChange(optValue); setIsOpen(false); }}
                            className={`accordion-item ${value === optValue ? 'selected' : ''}`}
                          >
                            <div className="flex-1">
                                <div className="font-medium">{optLabel as string}</div>
                                {optDesc && <div className="text-[10px] text-white/50 mt-0.5 leading-tight">{optDesc}</div>}
                            </div>
                            {value === optValue && <span className="text-[#bf8339] text-lg font-bold">✓</span>}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
             );
          }) : (
              <div className="p-3 text-center text-white/40 text-xs">لا توجد نتائج</div>
          )}
      </div>
  );

  return (
    <div className="relative" ref={containerRef}>
      {label && <label className="block text-xs text-white/60 mb-1">{label}</label>}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white/5 border border-white/20 rounded-lg p-2.5 text-sm text-right flex justify-between items-center focus:outline-none focus:border-[#bf8339] hover:bg-white/10 transition group"
      >
        <span className="truncate font-medium text-white/90">{getDisplayValue() as string}</span>
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform text-white/60 group-hover:text-[#bf8339] ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && createPortal(dropdownMenu, document.body)}
    </div>
  );
};

export default CustomGroupedSelect;
