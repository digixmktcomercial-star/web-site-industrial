import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ShieldCheck, Zap, Globe, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PRODUCTS } from '../constants';
import { ProductCard } from '../components/products/ProductCard';
import { useTranslation } from 'react-i18next';

export const Home: React.FC = () => {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);

  const HERO_SLIDES = [
    {
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1920',
      title: t('hero.title'),
      subtitle: t('hero.subtitle'),
      badge: t('hero.badge')
    },
    {
      image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1920',
      title: t('hero.title_2', 'Soluções para Todos os Setores.'),
      subtitle: t('hero.subtitle_2', 'Da desinfecção hospitalar à manutenção industrial pesada, garantimos a máxima eficácia.'),
      badge: t('hero.badge_2', 'Setores de Atuação')
    },
    {
      image: 'https://images.unsplash.com/photo-1583947581924-860bda6a26df?auto=format&fit=crop&q=80&w=1920',
      title: t('hero.title_3', 'Inovação em Cada Fórmula.'),
      subtitle: t('hero.subtitle_3', 'Produtos desenvolvidos em laboratório próprio para resultados impecáveis e seguros.'),
      badge: t('hero.badge_3', 'Nossos Produtos')
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [currentSlide]); // Re-run effect when currentSlide changes to reset timer

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

  return (
    <div className="space-y-24 pb-24">
      {/* Hero Carousel Section */}
      <section className="relative h-[90vh] overflow-hidden bg-slate-900">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <img
              src={HERO_SLIDES[currentSlide].image}
              alt={HERO_SLIDES[currentSlide].badge}
              className="w-full h-full object-cover opacity-50"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/60 to-transparent" />
          </motion.div>
        </AnimatePresence>

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <motion.div
            key={`content-${currentSlide}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl space-y-10"
          >
            <div className="inline-flex items-center space-x-3 bg-blue-500/20 border border-blue-500/30 rounded-full px-4 py-1.5 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur-md">
              <Zap className="h-3.5 w-3.5" />
              <span>{HERO_SLIDES[currentSlide].badge}</span>
            </div>
            <h1 className="text-[64px] md:text-[100px] font-normal text-white leading-[0.9] tracking-tighter">
              {HERO_SLIDES[currentSlide].title.split(' ').map((word, i) => (
                <span key={i} className={i % 2 === 1 ? 'italic text-slate-400' : ''}>
                  {word}{' '}
                </span>
              ))}
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 leading-relaxed max-w-2xl font-medium">
              {HERO_SLIDES[currentSlide].subtitle}
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-10">
              <Link
                to="/produtos"
                className="group relative bg-blue-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-500 transition-all flex items-center space-x-4 shadow-[0_20px_50px_rgba(37,99,235,0.3)] hover:-translate-y-1 active:scale-95 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <span className="relative z-10">{t('hero.cta_products')}</span>
                <ArrowRight className="relative z-10 h-4 w-4 group-hover:translate-x-2 transition-transform" />
              </Link>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('openLeadModal'))}
                className="group relative bg-white/5 backdrop-blur-2xl text-white border border-white/10 px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all hover:border-white/30 hover:-translate-y-1 active:scale-95 shadow-xl"
              >
                <span>{t('hero.cta_quote')}</span>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-blue-500 group-hover:w-1/2 transition-all duration-300" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Carousel Controls - Editorial Style */}
        <div className="absolute bottom-12 right-4 sm:right-6 lg:right-8 flex flex-col items-end space-y-8 z-20">
          <div className="flex items-center space-x-8">
            <div className="flex flex-col items-end">
              <span className="text-blue-500 font-mono text-sm font-bold tracking-tighter">0{currentSlide + 1}</span>
              <div className="w-12 h-px bg-white/20 relative overflow-hidden">
                <motion.div 
                  initial={{ x: '-100%' }}
                  animate={{ x: '0%' }}
                  key={currentSlide}
                  transition={{ duration: 6, ease: "linear" }}
                  className="absolute inset-0 bg-blue-500"
                />
              </div>
              <span className="text-white/40 font-mono text-sm font-bold tracking-tighter">0{HERO_SLIDES.length}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={prevSlide}
                className="w-14 h-14 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all backdrop-blur-md flex items-center justify-center group"
              >
                <ChevronLeft className="h-6 w-6 group-hover:-translate-x-1 transition-transform" />
              </button>
              <button
                onClick={nextSlide}
                className="w-14 h-14 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all backdrop-blur-md flex items-center justify-center group"
              >
                <ChevronRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="flex space-x-3">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`group relative h-1 transition-all duration-500 ${
                  currentSlide === i ? 'w-16 bg-blue-500' : 'w-8 bg-white/20 hover:bg-white/40'
                }`}
              >
                <span className={`absolute -top-6 left-0 text-[10px] font-bold transition-opacity duration-300 ${currentSlide === i ? 'opacity-100 text-blue-500' : 'opacity-0'}`}>
                  0{i + 1}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center space-y-2"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-blue-500 to-transparent" />
        </motion.div>
      </section>

      {/* Stats/Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: ShieldCheck, title: 'Qualidade Certificada', desc: 'Processos rigorosos e certificação ISO 9001 em toda a produção.' },
            { icon: Globe, title: 'Presença Global', desc: 'Exportamos para mais de 15 países na Europa e África.' },
            { icon: Zap, title: 'Inovação Constante', desc: 'Laboratório próprio para desenvolvimento de novas fórmulas eco-friendly.' }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all"
            >
              <feature.icon className="h-10 w-10 text-blue-600 mb-6" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Sectors Section - Redesigned to be more integrated */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4">Sectores</h2>
            <h3 className="text-4xl font-bold text-slate-900">Soluções para todos os Desafios</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Horeca', desc: 'Higiene rigorosa para hotéis e restaurantes.', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400' },
              { title: 'Saúde', desc: 'Desinfecção hospitalar de alto nível.', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400' },
              { title: 'Indústria', desc: 'Detergentes técnicos para manutenção pesada.', image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=400' },
              { title: 'Doméstico', desc: 'A qualidade profissional no seu lar.', image: 'https://images.unsplash.com/photo-1583947581924-860bda6a26df?auto=format&fit=crop&q=80&w=400' }
            ].map((sector, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 group"
              >
                <div className="h-48 overflow-hidden">
                  <img src={sector.image} alt={sector.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                </div>
                <div className="p-6">
                  <h4 className="font-bold text-slate-900 mb-2">{sector.title}</h4>
                  <p className="text-sm text-slate-500">{sector.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div className="space-y-2">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest">Destaques</h2>
            <h3 className="text-4xl font-bold text-slate-900">Os Nossos Produtos</h3>
          </div>
          <Link to="/produtos" className="text-blue-600 font-bold hover:underline flex items-center space-x-1">
            <span>Ver todos</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PRODUCTS.slice(0, 3).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Documentation Center Section - Refined Visual */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0a0f1e] rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden group border border-white/5 shadow-2xl">
          {/* Background Glows */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/5 blur-[120px] -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-1/3 h-full bg-blue-400/5 blur-[100px] translate-y-1/2 -translate-x-1/4" />
          
          <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10">
              <div className="space-y-6">
                <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-md">
                  <FileText className="h-3.5 w-3.5" />
                  <span>Centro de Documentação</span>
                </div>
                <h2 className="text-[56px] font-normal leading-[1.1] tracking-tighter">
                  Sustentabilidade <br />
                  <span className="text-slate-400 italic">ao seu Alcance.</span>
                </h2>
                <p className="text-slate-400 text-lg leading-relaxed max-w-md font-medium">
                  Aceda a fichas técnicas, fichas de segurança e especificações detalhadas de toda a nossa gama de produtos.
                </p>
              </div>
              <Link
                to="/sustentabilidade"
                className="inline-flex items-center space-x-4 bg-white text-slate-950 px-8 py-3.5 rounded-2xl font-black text-sm hover:bg-blue-500 hover:text-white transition-all shadow-xl group/btn active:scale-95"
              >
                <span>Aceder à Documentação</span>
                <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-2 transition-transform" />
              </Link>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6 pt-12">
                  <motion.div 
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="bg-white/5 backdrop-blur-2xl p-8 rounded-[2rem] border border-white/10 hover:bg-white/10 transition-all cursor-default group/card"
                  >
                    <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 mb-6 group-hover/card:scale-110 transition-transform">
                      <FileText className="w-6 h-6" />
                    </div>
                    <p className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Fichas Técnicas</p>
                  </motion.div>
                  <motion.div 
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="bg-white/5 backdrop-blur-2xl p-8 rounded-[2rem] border border-white/10 hover:bg-white/10 transition-all cursor-default group/card"
                  >
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 mb-6 group-hover/card:scale-110 transition-transform">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <p className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Segurança</p>
                  </motion.div>
                </div>
                <div className="space-y-6">
                  <motion.div 
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="bg-white/5 backdrop-blur-2xl p-8 rounded-[2rem] border border-white/10 hover:bg-white/10 transition-all cursor-default group/card"
                  >
                    <div className="w-12 h-12 bg-orange-500/20 rounded-2xl flex items-center justify-center text-orange-400 mb-6 group-hover/card:scale-110 transition-transform">
                      <Zap className="w-6 h-6" />
                    </div>
                    <p className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Especificações</p>
                  </motion.div>
                  <motion.div 
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="bg-white/5 backdrop-blur-2xl p-8 rounded-[2rem] border border-white/10 hover:bg-white/10 transition-all cursor-default group/card"
                  >
                    <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center text-purple-400 mb-6 group-hover/card:scale-110 transition-transform">
                      <Globe className="w-6 h-6" />
                    </div>
                    <p className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Normas EU</p>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-blue-600 rounded-[3rem] p-12 md:p-24 text-center text-white space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-50" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-[45px] font-normal leading-tight">Pronto para elevar o padrão de limpeza da sua empresa?</h2>
            <p className="text-blue-100 text-lg">
              Junte-se a centenas de empresas que confiam na Clorosol para as suas necessidades de higiene e desinfecção.
            </p>
            <Link
              to="/orcamento"
              className="inline-block bg-white text-blue-600 px-8 py-2.5 rounded-lg font-bold hover:bg-blue-50 transition-all shadow-lg text-sm"
            >
              Começar Agora
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
