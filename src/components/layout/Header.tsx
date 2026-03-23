import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Briefcase, ShoppingCart, MapPin, Phone, Mail, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';
import { WishlistDrawer } from '../products/WishlistDrawer';

export const Header: React.FC = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = React.useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const location = useLocation();

  const updateWishlistCount = () => {
    const saved = localStorage.getItem('clorosol_wishlist');
    if (saved) {
      try {
        const ids = JSON.parse(saved);
        if (Array.isArray(ids)) {
          setWishlistCount(ids.length);
        }
      } catch (e) {
        setWishlistCount(0);
      }
    } else {
      setWishlistCount(0);
    }
  };

  useEffect(() => {
    updateWishlistCount();
    window.addEventListener('wishlistUpdated', updateWishlistCount);
    return () => window.removeEventListener('wishlistUpdated', updateWishlistCount);
  }, []);

  const navItems = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.about'), path: '/empresa' },
    { name: t('nav.products'), path: '/produtos' },
    { name: t('nav.tech'), path: '/sustentabilidade' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Top Bar */}
      <div className="bg-[#1e3a8a] text-white py-2 text-[11px] font-medium">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <MapPin className="h-3 w-3 text-blue-300" />
            <span>Zona Industrial do Salgueiro, Mouquim — 4770-360 Vila Nova de Famalicão</span>
          </div>
          <div className="hidden sm:flex items-center space-x-6">
            <a href="tel:+351252376222" className="flex items-center space-x-2 hover:text-blue-300 transition-colors">
              <Phone className="h-3 w-3 text-blue-300" />
              <span>+351 252 376 222</span>
            </a>
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <img 
                src="https://storage.googleapis.com/static.antigravity.dev/67df044b-4861-4560-8452-f54f9d6594f8.png" 
                alt="Clorosol Logo" 
                className="h-16 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center space-x-10">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-bold transition-all hover:text-blue-600 relative py-2 group ${
                    location.pathname === item.path ? 'text-blue-600' : 'text-slate-700'
                  }`}
                >
                  {item.name}
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform origin-left transition-transform duration-300 ${
                    location.pathname === item.path ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`} />
                </Link>
              ))}
            </nav>

            {/* Right Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <button
                onClick={() => setIsWishlistOpen(true)}
                className="relative p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all group"
              >
                <Heart className={`h-5 w-5 ${wishlistCount > 0 ? 'fill-red-500 text-red-500' : ''}`} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm border-2 border-white">
                    {wishlistCount}
                  </span>
                )}
              </button>
              <Link
                to="/carreiras"
                className="flex items-center space-x-2 px-3 py-1 rounded-lg border border-blue-200 text-blue-700 text-[10px] font-bold hover:bg-blue-50 transition-all"
              >
                <Briefcase className="h-3.5 w-3.5 text-blue-400" />
                <span>Trabalhe Connosco</span>
              </Link>
              <Link
                to="/orcamento"
                className="flex items-center space-x-2 px-3 py-1 rounded-lg bg-[#1e3a8a] text-white text-[10px] font-bold hover:bg-blue-800 transition-all shadow-sm"
              >
                <ShoppingCart className="h-3.5 w-3.5 text-blue-200" />
                <span>{t('nav.quote')}</span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center space-x-2">
              <button
                onClick={() => setIsWishlistOpen(true)}
                className="relative p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
              >
                <Heart className={`h-5 w-5 ${wishlistCount > 0 ? 'fill-red-500 text-red-500' : ''}`} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm border-2 border-white">
                    {wishlistCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-slate-100 overflow-hidden"
          >
            <motion.div 
              initial="closed"
              animate="open"
              exit="closed"
              variants={{
                open: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
                closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } }
              }}
              className="px-4 pt-2 pb-6 space-y-1"
            >
              {navItems.map((item) => (
                <motion.div
                  key={item.path}
                  variants={{
                    open: { opacity: 1, x: 0 },
                    closed: { opacity: 0, x: -10 }
                  }}
                >
                  <Link
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-2.5 rounded-xl text-base font-bold transition-all ${
                      location.pathname === item.path 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                variants={{
                  open: { opacity: 1, y: 10 },
                  closed: { opacity: 0, y: 0 }
                }}
                className="pt-4 grid grid-cols-1 gap-2"
              >
                <Link
                  to="/carreiras"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl border border-blue-200 text-blue-700 text-sm font-bold"
                >
                  <Briefcase className="h-4 w-4" />
                  <span>Trabalhe Connosco</span>
                </Link>
                <Link
                  to="/orcamento"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-[#1e3a8a] text-white text-sm font-bold"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>{t('nav.quote')}</span>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wishlist Drawer */}
      <WishlistDrawer isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
    </header>
  );
};
