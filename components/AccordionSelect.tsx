
import React, { useState, useRef, useEffect } from 'react';

interface OptionGroup {
  label: string;
  options: (string | { label: string; value: string })[];
}

interface AccordionSelectProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  groups: OptionGroup[];
  placeholder: string;
}

const AccordionSelect: React.FC<AccordionSelectProps> = ({ label, value, onChange, groups, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0); // Default open first group
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Helper to get display label for current value
  const getDisplayValue = () => {
    if (!value) return placeholder;
    for (const group of groups) {
      for (const opt of group.options) {
        if (typeof opt === 'string') {
          if (opt === value) return opt;
        } else {
          if (opt.value === value) return opt.label;
        }
      }
    }
    return value;
  };

  const toggleAccordion = (index: number, e: React.MouseEvent) => {
      e.stopPropagation();
      setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleSelect = (val: string) => {
      onChange(val);
      setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {label && <label className="block text-xs text-white/60 mb-1">{label}</label>}
      
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white/5 border border-white/20 rounded-lg p-2.5 text-sm text-right flex justify-between items-center focus:outline-none focus:border-[#bf8339] hover:bg-white/10 transition-colors group"
      >
        <span className="truncate font-medium text-white/90">{getDisplayValue()}</span>
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} text-white/60 group-hover:text-[#bf8339]`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Container */}
      {isOpen && (
        <div className="absolute z-[999] mt-2 w-full md:w-80 bg-[#0a1e3c] border border-white/20 rounded-lg shadow-2xl max-h-96 overflow-y-auto p-2 left-0 custom-scrollbar animate-fade-in">
          {/* Reset Option */}
          <div 
            onClick={() => handleSelect("")} 
            className="text-center p-2 text-white/50 text-xs hover:text-white cursor-pointer border-b border-white/10 mb-2"
          >
            -- إعادة تعيين الاختيار --
          </div>

          {/* Accordion Groups */}
          {groups.map((group, idx) => (
            <div key={idx} className="accordion-section">
              <div 
                className="accordion-header" 
                onClick={(e) => toggleAccordion(idx, e)}
              >
                <span>{group.label}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform duration-200 ${expandedIndex === idx ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              
              {expandedIndex === idx && (
                <div className="accordion-content">
                  {group.options.map((opt, optIdx) => {
                    const optValue = typeof opt === 'string' ? opt : opt.value;
                    const optLabel = typeof opt === 'string' ? opt : opt.label;
                    return (
                      <div
                        key={optIdx}
                        onClick={() => handleSelect(optValue)}
                        className={`accordion-item ${value === optValue ? 'selected' : ''}`}
                      >
                        <span className="flex-1">{optLabel}</span>
                        {value === optValue && <span className="text-[#bf8339] font-bold">✓</span>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AccordionSelect;
