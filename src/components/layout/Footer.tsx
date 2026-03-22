import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Facebook, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

export const Footer: React.FC = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-slate-950 text-slate-400 py-20 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <img 
                src="https://storage.googleapis.com/static.antigravity.dev/67df044b-4861-4560-8452-f54f9d6594f8.png" 
                alt="Clorosol Logo" 
                className="h-12 w-auto object-contain brightness-0 invert"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="text-sm leading-relaxed font-light">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              <motion.a 
                href="http://www.facebook.com/clorosol" 
                target="_blank" 
                rel="noopener noreferrer" 
                whileHover={{ scale: 1.2, color: '#60a5fa' }}
                className="transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </motion.a>
              <motion.a 
                href="http://www.twitter.com/clorosol" 
                target="_blank" 
                rel="noopener noreferrer" 
                whileHover={{ scale: 1.2, color: '#60a5fa' }}
                className="transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </motion.a>
              <motion.a 
                href="http://www.linkedin.com/in/Clorosol" 
                target="_blank" 
                rel="noopener noreferrer" 
                whileHover={{ scale: 1.2, color: '#60a5fa' }}
                className="transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </motion.a>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-white font-bold text-xs uppercase tracking-widest">{t('footer.quick_links')}</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="hover:text-blue-500 transition-colors">{t('nav.home')}</Link></li>
              <li><Link to="/empresa" className="hover:text-blue-500 transition-colors">{t('nav.about')}</Link></li>
              <li><Link to="/contactos" className="hover:text-blue-500 transition-colors">{t('nav.contact')}</Link></li>
              <li><Link to="/produtos" className="hover:text-blue-500 transition-colors">{t('nav.products')}</Link></li>
              <li><Link to="/informacao-tecnica" className="hover:text-blue-500 transition-colors">{t('nav.technical')}</Link></li>
              <li><Link to="/parceiros" className="hover:text-blue-500 transition-colors">{t('nav.partners')}</Link></li>
              <li><Link to="/carreiras" className="hover:text-blue-500 transition-colors">{t('nav.careers')}</Link></li>
              <li><Link to="/orcamento" className="hover:text-blue-500 transition-colors">{t('nav.quote')}</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-white font-bold text-xs uppercase tracking-widest">{t('footer.contacts')}</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start space-x-3">
                <Phone className="h-4 w-4 text-blue-500 mt-1" />
                <a href="tel:+351252376222" className="hover:text-blue-500 transition-colors">+351 252 376 222</a>
              </li>
              <li className="flex items-start space-x-3">
                <Mail className="h-4 w-4 text-blue-500 mt-1" />
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('openLeadModal'))}
                  className="hover:text-blue-500 transition-colors"
                >
                  geral@clorosol.com
                </button>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-blue-500 mt-1" />
                <div className="flex flex-col">
                  <span>Zona Industrial do Salgueiro, Mouquim</span>
                  <span>4770-360 Vila Nova de Famalicão, Portugal</span>
                  <a 
                    href="https://www.google.com/maps/search/?api=1&query=Clorosol+Zona+Industrial+do+Salgueiro+Mouquim+4770-360+Vila+Nova+de+Famalicão" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline mt-1 text-[11px] font-bold"
                  >
                    Abrir no Google Maps
                  </a>
                </div>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-white font-bold text-xs uppercase tracking-widest">Newsletter</h4>
            <p className="text-xs font-light">Subscreva para receber novidades e fichas técnicas de segurança.</p>
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
              <input
                type="email"
                placeholder="Email profissional"
                className="bg-transparent border-none px-3 py-2 text-xs w-full focus:ring-0 text-white"
              />
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-500 transition-colors">
                OK
              </button>
            </div>
          </div>
        </div>
        <div className="mt-20 pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-widest font-bold">
          <p>&copy; {new Date().getFullYear()} Clorosol - Fabrico de Lixívias e Detergentes, Lda. {t('footer.rights')}</p>
          <div className="flex space-x-6 items-center">
            <a href="#" className="hover:text-white transition-colors">{t('footer.privacy')}</a>
            <a href="#" className="hover:text-white transition-colors">{t('footer.terms')}</a>
            <div className="relative group">
              <a 
                href="/Documentação/ficha_projeto_clorosol.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                <img 
                  src="https://picsum.photos/seed/portugal-2020/120/40" 
                  alt="Cofinanciado por Portugal 2020 e União Europeia" 
                  className="h-8 bg-white p-1 rounded"
                />
              </a>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-800 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap shadow-xl border border-slate-700 z-10">
                Ficha do Projeto - Portugal 2020
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
              </div>
            </div>
            <a 
              href="https://www.livroreclamacoes.pt/inicio/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <img 
                src="https://www.livroreclamacoes.pt/assets/img/logo-livro-reclamacoes.png" 
                alt="Livro de Reclamações" 
                className="h-8 bg-white p-1 rounded"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
