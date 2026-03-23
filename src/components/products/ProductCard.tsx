import React from 'react';
import { Check, ShoppingCart, Plus, ArrowRight, FileText, Share2, Facebook, Linkedin, Heart } from 'lucide-react';
import { Product } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface ProductCardProps {
  product: Product;
  onSelect?: (id: string) => void;
  layout?: 'grid' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect, layout = 'grid' }) => {
  const { t } = useTranslation();
  const [showShare, setShowShare] = React.useState(false);
  const [zoomPos, setZoomPos] = React.useState({ x: 50, y: 50 });
  const [isZoomed, setIsZoomed] = React.useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  const [isWishlisted, setIsWishlisted] = React.useState(() => {
    const saved = localStorage.getItem('clorosol_wishlist');
    if (!saved) return false;
    try {
      const wishlist = JSON.parse(saved);
      return Array.isArray(wishlist) && wishlist.includes(product.id);
    } catch {
      return false;
    }
  });

  React.useEffect(() => {
    const checkWishlist = () => {
      const saved = localStorage.getItem('clorosol_wishlist');
      if (saved) {
        try {
          const wishlist = JSON.parse(saved);
          setIsWishlisted(Array.isArray(wishlist) && wishlist.includes(product.id));
        } catch {
          setIsWishlisted(false);
        }
      } else {
        setIsWishlisted(false);
      }
    };

    window.addEventListener('wishlistUpdated', checkWishlist);
    return () => window.removeEventListener('wishlistUpdated', checkWishlist);
  }, [product.id]);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const saved = localStorage.getItem('clorosol_wishlist');
    let wishlist = [];
    try {
      wishlist = saved ? JSON.parse(saved) : [];
      if (!Array.isArray(wishlist)) wishlist = [];
    } catch {
      wishlist = [];
    }
    
    if (isWishlisted) {
      wishlist = wishlist.filter((id: string) => id !== product.id);
    } else {
      wishlist.push(product.id);
    }
    
    localStorage.setItem('clorosol_wishlist', JSON.stringify(wishlist));
    setIsWishlisted(!isWishlisted);
    
    // Notify other components (like Header) to update count
    window.dispatchEvent(new Event('wishlistUpdated'));
  };

  const shareUrl = `${window.location.origin}/produtos?id=${product.id}`;
  const shareTitle = `Confira o produto ${product.name} da Clorosol`;

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!product.technical_sheet_url) return;

    // Download direto sem bloqueio
    const link = document.createElement('a');
    link.href = product.technical_sheet_url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    
    // Nome do ficheiro preservando a designação original
    const filename = `Ficha_Tecnica_${product.name.replace(/\s+/g, '_')}.pdf`;
    link.download = filename;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper to translate product data
  const productName = t(`products.items.${product.id}.name`, product.name);
  const productDescription = t(`products.items.${product.id}.description`, product.description);
  const productCategory = t(`products.categories.${product.category.toLowerCase()}`, product.category);

  if (layout === 'list') {
    return (
      <motion.div
        whileHover={{ 
          x: 8, 
          scale: 1.01,
          borderColor: 'rgba(59, 130, 246, 0.2)'
        }}
        whileTap={{ scale: 0.99 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-900/5 transition-all group flex flex-col md:flex-row h-full relative"
      >
        {/* Brand Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-white/90 backdrop-blur-md border border-slate-100 text-[#1e3a8a] text-[9px] font-black px-2.5 py-1 rounded-full shadow-sm uppercase tracking-widest">
            {product.brand}
          </span>
        </div>

        {/* Image Container */}
        <div 
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          className="relative w-full md:w-64 h-64 md:h-auto overflow-hidden bg-gradient-to-b from-slate-50 to-white p-6 flex items-center justify-center flex-shrink-0 cursor-zoom-in"
        >
          <motion.img
            src={product.image}
            alt={productName}
            className="max-w-full max-h-full object-contain"
            animate={{
              scale: isZoomed ? 2 : 1,
              transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            referrerPolicy="no-referrer"
          />
          
          {product.inStock && (
            <div className="absolute top-4 right-4 group/stock relative z-10">
              <div className="bg-emerald-500 text-white p-1.5 rounded-full shadow-lg shadow-emerald-500/20 cursor-help">
                <Check className="h-3 w-3 stroke-[3]" />
              </div>
            </div>
          )}
          {/* Action Buttons (Top Right) */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
            {/* Share Button */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowShare(!showShare);
                }}
                className={`p-2 rounded-full backdrop-blur-md border transition-all duration-300 ${
                  showShare 
                    ? 'bg-blue-50 border-blue-100 text-blue-600 shadow-sm' 
                    : 'bg-white/80 border-slate-100 text-slate-400 hover:text-blue-600 hover:bg-white shadow-sm'
                }`}
              >
                <Share2 className="w-4 h-4" />
              </button>
              <AnimatePresence>
                {showShare && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    className="absolute top-full right-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-xl p-2 flex flex-col gap-1 z-30 min-w-[120px]"
                  >
                    <button
                      onClick={(e) => { e.stopPropagation(); shareOnFacebook(); }}
                      className="flex items-center gap-2 px-3 py-2 text-[10px] font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors w-full text-left"
                    >
                      <Facebook className="w-3.5 h-3.5" />
                      Facebook
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); shareOnLinkedIn(); }}
                      className="flex items-center gap-2 px-3 py-2 text-[10px] font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors w-full text-left"
                    >
                      <Linkedin className="w-3.5 h-3.5" />
                      LinkedIn
                    </button>
                    <div className="absolute bottom-full right-4 border-4 border-transparent border-b-white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 flex flex-col flex-grow justify-between gap-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em]">
                {productCategory}
              </span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {product.volume || '1L'}
              </span>
            </div>
            
            <div>
              <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-700 transition-colors leading-tight mb-2">
                {productName}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                {productDescription}
              </p>
            </div>

            <div className="flex items-center gap-6">
              <button 
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 text-[10px] font-bold text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-widest"
              >
                <FileText className="w-3.5 h-3.5" />
                {t('common.technical_sheet')}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onSelect?.(product.id)}
              className="flex-1 max-w-[180px] bg-[#1e3a8a] text-white px-6 py-3 rounded-xl text-[10px] font-black hover:bg-blue-800 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-blue-900/20 active:scale-95 group/btn"
            >
              <Plus className="w-3.5 h-3.5 transition-transform group-hover/btn:rotate-90" />
              <span>{t('common.add')}</span>
            </button>
            
            <div className="flex items-center gap-2">
              {/* Wishlist Button */}
              <div className="relative group/wishlist">
                <button
                  onClick={toggleWishlist}
                  className={`p-3 rounded-xl border transition-all duration-300 ${
                    isWishlisted 
                      ? 'bg-red-50 border-red-100 text-red-500 shadow-sm' 
                      : 'bg-white border-slate-100 text-slate-400 hover:text-red-400 hover:bg-red-50 shadow-sm'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
                {/* Tooltip */}
                <div className="absolute bottom-full right-0 mb-2 w-32 bg-slate-900 text-white text-[10px] font-bold py-2 px-3 rounded-lg opacity-0 group-hover/wishlist:opacity-100 transition-opacity pointer-events-none shadow-xl z-20 text-center leading-tight">
                  {isWishlisted ? t('products.wishlist_remove') : t('products.wishlist_add')}
                  <div className="absolute top-full right-3 border-4 border-transparent border-t-slate-900" />
                </div>
              </div>

              <button 
                onClick={() => window.location.href = `/orcamento?add=${product.id}`}
                className="w-10 h-10 rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-100 hover:bg-blue-50 transition-all"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ 
        y: -12, 
        scale: 1.02,
        borderColor: 'rgba(59, 130, 246, 0.2)'
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-900/8 transition-all group flex flex-col h-full relative"
    >
      {/* Brand Badge */}
      <div className="absolute top-6 left-6 z-10">
        <span className="bg-white/80 backdrop-blur-md border border-slate-100 text-[#1e3a8a] text-[10px] font-black px-3 py-1.5 rounded-full shadow-sm uppercase tracking-widest">
          {product.brand}
        </span>
      </div>

      {/* Image Container */}
      <div 
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        className="relative h-60 overflow-hidden bg-gradient-to-b from-slate-50 to-white p-6 flex items-center justify-center cursor-zoom-in"
      >
        <motion.img
          src={product.image}
          alt={productName}
          className="max-w-full max-h-full object-contain"
          animate={{
            scale: isZoomed ? 2 : 1,
            transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          referrerPolicy="no-referrer"
        />
        
        {product.inStock && (
          <div className="absolute top-4 left-auto right-16 group/stock relative z-10">
            <div className="bg-emerald-500 text-white p-1.5 rounded-full shadow-lg shadow-emerald-500/20 cursor-help">
              <Check className="h-3 w-3 stroke-[3]" />
            </div>
            {/* Tooltip */}
            <div className="absolute bottom-full right-0 mb-2 w-40 bg-slate-900 text-white text-[10px] font-bold py-2 px-3 rounded-lg opacity-0 group-hover/stock:opacity-100 transition-opacity pointer-events-none shadow-xl z-20 text-center leading-tight">
              {t('products.in_stock')}
              <span className="block text-[9px] font-medium text-slate-400 mt-1 uppercase tracking-wider">{t('products.available_now')}</span>
              <div className="absolute top-full right-3 border-4 border-transparent border-t-slate-900" />
            </div>
          </div>
        )}
        {/* Action Buttons (Top Right) */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
          {/* Share Button */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowShare(!showShare);
              }}
              className={`p-2 rounded-full backdrop-blur-md border transition-all duration-300 ${
                showShare 
                  ? 'bg-blue-50 border-blue-100 text-blue-600 shadow-sm' 
                  : 'bg-white/80 border-slate-100 text-slate-400 hover:text-blue-600 hover:bg-white shadow-sm'
              }`}
            >
              <Share2 className="w-4 h-4" />
            </button>
            <AnimatePresence>
              {showShare && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  className="absolute top-full right-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-xl p-2 flex flex-col gap-1 z-30 min-w-[120px]"
                >
                  <button
                    onClick={(e) => { e.stopPropagation(); shareOnFacebook(); }}
                    className="flex items-center gap-2 px-3 py-2 text-[10px] font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors w-full text-left"
                  >
                    <Facebook className="w-3.5 h-3.5" />
                    Facebook
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); shareOnLinkedIn(); }}
                    className="flex items-center gap-2 px-3 py-2 text-[10px] font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors w-full text-left"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                    LinkedIn
                  </button>
                  <div className="absolute bottom-full right-4 border-4 border-transparent border-b-white" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Quick Action Overlay */}
        <div className="absolute inset-0 bg-[#1e3a8a]/0 group-hover:bg-[#1e3a8a]/5 transition-colors duration-500" />
      </div>

      {/* Content */}
      <div className="p-6 space-y-4 flex flex-col flex-grow">
        <div className="space-y-2 flex-grow">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em]">
              {productCategory}
            </span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {product.volume || '1L'}
            </span>
          </div>
          
          <h3 className="text-base font-black text-slate-900 group-hover:text-blue-700 transition-colors leading-tight">
            {productName}
          </h3>
          
          <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed font-medium">
            {productDescription}
          </p>

          <div className="flex items-center pt-2">
            <button 
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 text-[10px] font-bold text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-widest"
            >
              <FileText className="w-3 h-3" />
              {t('common.technical_sheet')}
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-50 flex items-center justify-between gap-2">
          <button
            onClick={() => onSelect?.(product.id)}
            className="flex-1 bg-[#1e3a8a] text-white px-4 py-3 rounded-xl text-[10px] font-black hover:bg-blue-800 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-blue-900/20 active:scale-95 group/btn"
          >
            <Plus className="w-3.5 h-3.5 transition-transform group-hover/btn:rotate-90" />
            <span>{t('common.add')}</span>
          </button>
          
          <div className="flex items-center gap-2">
            {/* Wishlist Button */}
            <div className="relative group/wishlist">
              <button
                onClick={toggleWishlist}
                className={`p-3 rounded-xl border transition-all duration-300 ${
                  isWishlisted 
                    ? 'bg-red-50 border-red-100 text-red-500 shadow-sm' 
                    : 'bg-white border-slate-100 text-slate-400 hover:text-red-400 hover:bg-red-50 shadow-sm'
                }`}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
              {/* Tooltip */}
              <div className="absolute bottom-full right-0 mb-2 w-32 bg-slate-900 text-white text-[10px] font-bold py-2 px-3 rounded-lg opacity-0 group-hover/wishlist:opacity-100 transition-opacity pointer-events-none shadow-xl z-20 text-center leading-tight">
                {isWishlisted ? t('products.wishlist_remove') : t('products.wishlist_add')}
                <div className="absolute top-full right-3 border-4 border-transparent border-t-slate-900" />
              </div>
            </div>

            <button 
              onClick={() => window.location.href = `/orcamento?add=${product.id}`}
              className="w-10 h-10 rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-100 hover:bg-blue-50 transition-all"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
