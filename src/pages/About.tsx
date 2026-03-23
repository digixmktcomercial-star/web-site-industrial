import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { History, Award, Users, Globe, Play, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';

export const About: React.FC = () => {
  const { t } = useTranslation();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const timelineItems = [
    { icon: History, title: t('about.timeline.since_1974.title'), desc: t('about.timeline.since_1974.desc') },
    { icon: Award, title: t('about.timeline.iso_quality.title'), desc: t('about.timeline.iso_quality.desc') },
    { icon: Users, title: t('about.timeline.specialized_team.title'), desc: t('about.timeline.specialized_team.desc') },
    { icon: Globe, title: t('about.timeline.export.title'), desc: t('about.timeline.export.desc') }
  ];

  return (
    <div className="pt-20 pb-24 space-y-24">
      {/* Hero Section with Background Image */}
      <section className="relative h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1565034946487-077786996e27?auto=format&fit=crop&q=80&w=1920"
            alt="Clorosol Industrial Aerial View"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight"
            >
              <Trans i18nKey="about.hero.title">
                Mais de 40 anos de <br /><span className="text-blue-400">Excelência e Confiança</span>
              </Trans>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-blue-50 leading-relaxed font-medium"
            >
              {t('about.hero.subtitle')}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Timeline/Values */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {timelineItems.map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl shadow-sm space-y-4">
                <item.icon className="h-8 w-8 text-blue-600" />
                <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission/Vision - Redesigned to be more integrated */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4">{t('about.mission_vision.commitment')}</h2>
            <h3 className="text-4xl font-bold text-slate-900">{t('about.mission_vision.title')}</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-slate-50 p-10 rounded-[2rem] border border-slate-100">
              <h4 className="text-xl font-bold text-slate-900 mb-4">A Nossa Missão</h4>
              <p className="text-slate-600 leading-relaxed">
                {t('about.mission_vision.mission_text')}
              </p>
            </div>
            <div className="bg-slate-50 p-10 rounded-[2rem] border border-slate-100">
              <h4 className="text-xl font-bold text-slate-900 mb-4">A Nossa Visão</h4>
              <p className="text-slate-600 leading-relaxed">
                {t('about.mission_vision.vision_text')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative group cursor-pointer" onClick={() => setIsVideoModalOpen(true)}>
          <div className="aspect-video rounded-[3rem] overflow-hidden shadow-2xl relative">
            <img
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1920"
              alt="Clorosol Facilities Video Thumbnail"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/30 transition-colors duration-500" />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-2xl shadow-blue-600/50 relative z-10"
              >
                <Play className="h-10 w-10 fill-current ml-1" />
              </motion.div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute bottom-12 left-12 text-white space-y-2 z-10">
              <h4 className="text-2xl font-bold">{t('about.video.title')}</h4>
              <p className="text-white/80 font-medium">{t('about.video.subtitle')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      <AnimatePresence>
        {isVideoModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-5xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl"
            >
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="absolute top-6 right-6 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="Clorosol Facilities Video"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Contact Section */}
      <section className="bg-blue-600 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-white text-4xl font-bold">{t('about.contact_section.title')}</h2>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
              {t('about.contact_section.subtitle')}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link 
              to="/contactos" 
              className="bg-white text-blue-600 px-8 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-50 transition-all shadow-xl"
            >
              {t('about.contact_section.cta_contacts')}
            </Link>
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('openLeadModal'))}
              className="bg-blue-700 text-white border border-blue-500 px-8 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-800 transition-all"
            >
              {t('about.contact_section.cta_expert')}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
