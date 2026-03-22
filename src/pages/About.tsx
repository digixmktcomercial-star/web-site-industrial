import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { History, Award, Users, Globe, Play, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export const About: React.FC = () => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  return (
    <div className="pt-32 pb-24 space-y-24">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[45px] font-normal text-slate-900 tracking-tight"
        >
          Mais de 40 anos de <br /><span className="text-blue-600">Excelência e Confiança</span>
        </motion.h1>
        <p className="text-lg text-slate-500 max-w-3xl mx-auto leading-relaxed">
          Fundada em 1974, a Clorosol nasceu com a missão de elevar os padrões de higiene em Portugal. Hoje, somos uma referência no fabrico de lixívias e detergentes, combinando tradição com inovação tecnológica.
        </p>
      </section>

      {/* Timeline/Values */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: History, title: 'Desde 1974', desc: 'Décadas de experiência no mercado de produtos de limpeza.' },
              { icon: Award, title: 'Qualidade ISO', desc: 'Certificação rigorosa que garante a eficácia de cada produto.' },
              { icon: Users, title: 'Equipa Especializada', desc: 'Profissionais dedicados à inovação e apoio ao cliente.' },
              { icon: Globe, title: 'Exportação', desc: 'Presença consolidada em mercados internacionais.' }
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl shadow-sm space-y-4">
                <item.icon className="h-8 w-8 text-blue-600" />
                <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission/Vision */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest">O Nosso Compromisso</h2>
            <h3 className="text-4xl font-bold text-slate-900">Missão e Visão</h3>
          </div>
          <div className="space-y-6 text-slate-600 leading-relaxed">
            <p>
              A nossa missão é fornecer soluções de limpeza e desinfecção que garantam a segurança e o bem-estar dos nossos clientes, através de produtos inovadores e sustentáveis.
            </p>
            <p>
              Ambicionamos ser o parceiro preferencial na indústria de detergentes, reconhecidos pela nossa integridade, qualidade superior e compromisso com o meio ambiente.
            </p>
          </div>
        </div>
        <div className="rounded-[3rem] overflow-hidden shadow-2xl">
          <img
            src="https://picsum.photos/seed/clorosol-about/800/600"
            alt="Clorosol Facilities"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
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
              <h4 className="text-2xl font-bold">Conheça as Nossas Instalações</h4>
              <p className="text-white/80 font-medium">Excelência industrial em cada detalhe.</p>
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
            <h2 className="text-white text-4xl font-bold">Precisa de entrar em contacto?</h2>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
              A nossa equipa está pronta para responder às suas questões e fornecer o apoio necessário para o seu negócio.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link 
              to="/contactos" 
              className="bg-white text-blue-600 px-8 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-50 transition-all shadow-xl"
            >
              Ir para Contactos
            </Link>
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('openLeadModal'))}
              className="bg-blue-700 text-white border border-blue-500 px-8 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-800 transition-all"
            >
              Falar com um Especialista
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
