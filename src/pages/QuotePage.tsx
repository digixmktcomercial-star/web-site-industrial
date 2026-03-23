import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { B2BForm } from '../components/forms/B2BForm';

export const QuotePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="pt-20 pb-24 bg-slate-50 min-h-screen">
      {/* Hero Section with Background Image */}
      <section className="relative py-24 overflow-hidden mb-12">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?auto=format&fit=crop&q=80&w=1920"
            alt="Quote Background"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/80 to-white/95 backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-[#1e3a8a] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              <FileText className="w-3.5 h-3.5" />
              <span>{t('nav.quote')}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-[#1e3a8a] mb-6 tracking-tight">
              {t('quote.title')}
            </h1>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
              {t('quote.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <B2BForm />
      </div>
    </div>
  );
};
