import React, { useState } from 'react';
import { MessageCircle, X, Phone, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const QuickChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-24 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: 20 }}
            className="bg-white rounded-2xl shadow-xl border border-slate-100 p-3 mb-4 space-y-2.5 w-56"
          >
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <span className="font-bold text-slate-900 text-sm">Contacto Direto</span>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            
            <a
              href="https://wa.me/351263730000"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 p-2.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
            >
              <Phone className="h-4 w-4" />
              <div className="text-[10px]">
                <p className="font-bold">WhatsApp</p>
                <p className="opacity-80">Resposta em minutos</p>
              </div>
            </a>

            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent('openLeadModal'));
                setIsOpen(false);
              }}
              className="w-full flex items-center space-x-3 p-2.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors text-left"
            >
              <Mail className="h-4 w-4" />
              <div className="text-[10px]">
                <p className="font-bold">Email</p>
                <p className="opacity-80">geral@clorosol.com</p>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-emerald-500 text-white p-3 rounded-full shadow-lg hover:bg-emerald-600 transition-all hover:scale-110 active:scale-95 flex items-center justify-center"
      >
        <MessageCircle className="h-5 w-5" />
      </button>
    </div>
  );
};
