import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Globe, ChevronDown, Check, Search, X } from 'lucide-react';
import { LanguageMeta } from '../../locales/regionalLanguages';

interface LanguageSelectorProps {
  variant?: 'header' | 'landing' | 'citizen';
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ variant = 'header' }) => {
  const { language, setLanguage, languages, currentLanguageMeta, tr } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredLanguages = languages.filter(l => 
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isDark = variant === 'landing' || variant === 'header';

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Selector Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-md text-xs font-semibold transition border ${
          isDark
            ? 'bg-slate-800/90 hover:bg-slate-700 text-white border-slate-700 shadow-xs'
            : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300 shadow-2xs'
        }`}
        title={tr("Select Regional Language (22 Official Languages)", "भाषा चुनें (भारत की 22 आधिकारिक भाषाएं)")}
      >
        <span className="font-bold shrink-0">{currentLanguageMeta.flag || '🇮🇳'}</span>
        <span className="max-w-[65px] xs:max-w-[85px] sm:max-w-[120px] truncate">{currentLanguageMeta.nativeName}</span>
        <ChevronDown className="w-3.5 h-3.5 opacity-60 ml-0.5 shrink-0" />
      </button>

      {/* Dropdown Modal / List */}
      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-72 sm:w-80 max-w-[calc(100vw-24px)] bg-[#111c38] rounded-lg shadow-2xl border border-slate-700 py-2 z-50 animate-in fade-in zoom-in-95 duration-150 text-slate-100">
          
          {/* Header & Search */}
          <div className="px-3 pb-2 border-b border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                <span>Regional Languages ({languages.length})</span>
              </span>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search language or state..."
                className="w-full pl-8 pr-2 py-1 text-xs border border-slate-700 rounded-md bg-[#0b1329] text-white focus:ring-1 focus:ring-blue-500 outline-none"
                autoFocus
              />
            </div>
          </div>

          {/* Language Options List */}
          <div className="max-h-64 overflow-y-auto py-1 divide-y divide-slate-800/60">
            {filteredLanguages.map(lang => {
              const isSelected = lang.code === language;
              return (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code as any);
                    setIsOpen(false);
                    setSearchQuery('');
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-800/80 transition ${
                    isSelected ? 'bg-blue-950/80 font-bold text-blue-300' : 'text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{lang.flag || '🇮🇳'}</span>
                    <div>
                      <div className="font-semibold text-slate-100 leading-tight">
                        {lang.nativeName} <span className="text-slate-400 font-normal text-[11px]">({lang.name})</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-normal">
                        {lang.region} • {lang.script}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <span className="p-1 rounded-full bg-gov-blue text-white">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </button>
              );
            })}

            {filteredLanguages.length === 0 && (
              <div className="p-4 text-center text-xs text-slate-400">
                No language found matching "{searchQuery}"
              </div>
            )}
          </div>

          {/* Quick Note */}
          <div className="px-3 pt-2 border-t border-slate-100 text-[10px] text-slate-400 text-center">
            Recognized under 8th Schedule of Indian Constitution
          </div>
        </div>
      )}
    </div>
  );
};
