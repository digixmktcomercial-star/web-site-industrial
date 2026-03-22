import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, ChevronDown } from 'lucide-react';

const LANGUAGES = [
  { code: 'pt', name: 'Português', flag: 'https://flagcdn.com/w40/pt.png' },
  { code: 'en', name: 'English', flag: 'https://flagcdn.com/w40/gb.png' },
  { code: 'es', name: 'Español', flag: 'https://flagcdn.com/w40/es.png' }
];

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = React.useState(false);

  const currentLanguage = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-all border border-white/10 group"
      >
        <img src={currentLanguage.flag} alt={currentLanguage.name} className="w-4 h-auto rounded-sm" />
        <span className="text-[10px] font-black text-white uppercase tracking-widest hidden sm:inline">
          {currentLanguage.code}
        </span>
        <ChevronDown className={`w-3 h-3 text-white/60 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-40 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
            >
              <div className="p-2 space-y-1">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl transition-all ${
                      i18n.language === lang.code 
                        ? 'bg-blue-600 text-white' 
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <img src={lang.flag} alt={lang.name} className="w-4 h-auto rounded-sm" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{lang.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
