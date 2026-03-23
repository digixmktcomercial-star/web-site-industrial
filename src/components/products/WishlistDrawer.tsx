import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, ShoppingCart, Trash2, ArrowRight, Package } from 'lucide-react';
import { PRODUCTS } from '../../constants';
import { Product } from '../../types';
import { useTranslation } from 'react-i18next';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);

  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem('clorosol_wishlist');
      if (saved) {
        try {
          const ids = JSON.parse(saved);
          if (Array.isArray(ids)) {
            const items = PRODUCTS.filter(p => ids.includes(p.id));
            setWishlistItems(items);
          }
        } catch (e) {
          console.error('Error parsing wishlist', e);
        }
      }
    }
  }, [isOpen]);

  const removeFromWishlist = (id: string) => {
    const saved = localStorage.getItem('clorosol_wishlist');
    if (saved) {
      try {
        let ids = JSON.parse(saved);
        if (Array.isArray(ids)) {
          ids = ids.filter((itemId: string) => itemId !== id);
          localStorage.setItem('clorosol_wishlist', JSON.stringify(ids));
          setWishlistItems(prev => prev.filter(item => item.id !== id));
          
          // Dispatch a custom event to notify other components (like ProductCard)
          window.dispatchEvent(new Event('wishlistUpdated'));
        }
      } catch (e) {
        console.error('Error updating wishlist', e);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center space-x-3">
                <div className="bg-red-100 p-2 rounded-xl">
                  <Heart className="w-5 h-5 text-red-600 fill-current" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 leading-none">Favoritos</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    {wishlistItems.length} {wishlistItems.length === 1 ? 'Item' : 'Itens'} Guardados
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-slate-900 transition-all border border-transparent hover:border-slate-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-grow overflow-y-auto p-6 space-y-4">
              {wishlistItems.length > 0 ? (
                wishlistItems.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group bg-white border border-slate-100 rounded-2xl p-4 flex gap-4 hover:border-blue-100 hover:shadow-lg hover:shadow-blue-900/5 transition-all"
                  >
                    <div className="w-20 h-20 bg-slate-50 rounded-xl flex-shrink-0 p-2">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-grow min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest truncate">
                            {product.brand}
                          </span>
                          <button
                            onClick={() => removeFromWishlist(product.id)}
                            className="text-slate-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 truncate mt-0.5">
                          {product.name}
                        </h3>
                        <p className="text-[10px] text-slate-400 font-medium">
                          {product.volume}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <button
                          onClick={() => {
                            window.location.href = `/orcamento?add=${product.id}`;
                            onClose();
                          }}
                          className="text-[10px] font-bold text-[#1e3a8a] hover:text-blue-600 flex items-center gap-1 transition-colors"
                        >
                          <span>Pedir Orçamento</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-60">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                    <Heart className="w-10 h-10 text-slate-200" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-slate-900">A sua lista está vazia</h3>
                    <p className="text-xs text-slate-500 max-w-[200px] mx-auto">
                      Explore o nosso catálogo e guarde os produtos que mais lhe interessam.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      window.location.href = '/produtos';
                      onClose();
                    }}
                    className="bg-[#1e3a8a] text-white px-6 py-3 rounded-xl text-xs font-bold hover:bg-blue-800 transition-all shadow-lg"
                  >
                    Explorar Produtos
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            {wishlistItems.length > 0 && (
              <div className="p-6 border-t border-slate-100 bg-slate-50/50 space-y-3">
                <button
                  onClick={() => {
                    const ids = wishlistItems.map(i => i.id).join(',');
                    window.location.href = `/orcamento?add=${ids}`;
                    onClose();
                  }}
                  className="w-full bg-[#1e3a8a] text-white py-4 rounded-2xl font-bold text-sm flex items-center justify-center space-x-3 shadow-xl shadow-blue-900/20 hover:bg-blue-800 transition-all active:scale-[0.98]"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Pedir Orçamento de Todos</span>
                </button>
                <p className="text-[10px] text-center text-slate-400 font-medium">
                  Adicione todos os favoritos ao seu pedido de orçamento de uma só vez.
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
