import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Download, Search, Lock, CheckCircle, AlertCircle, Loader2, Calendar, Filter } from 'lucide-react';
import { PRODUCTS } from '../constants';
import { Product } from '../types';
import { supabase } from '../lib/supabase';

interface TechnicalFile {
  id: string;
  name: string;
  publication_date: string;
  download_url: string;
  product_name?: string;
}

export default function TechnicalInfo() {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState<'catalog' | 'technical'>('catalog');
  const [isUnlocked, setIsUnlocked] = useState(true);
  const [showUnlockForm, setShowUnlockForm] = useState(false);
  const [formData, setFormData] = useState({
    name: sessionStorage.getItem('clorosol_user_name') || '',
    email: sessionStorage.getItem('clorosol_user_email') || '',
    company: sessionStorage.getItem('clorosol_user_company') || '',
    rgpd: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [technicalFiles, setTechnicalFiles] = useState<TechnicalFile[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(true);

  // Check if already unlocked or if user has already provided contact details in this session
  useEffect(() => {
    const unlocked = sessionStorage.getItem('clorosol_docs_unlocked');
    const userEmail = sessionStorage.getItem('clorosol_user_email');
    
    if (unlocked === 'true' || userEmail) {
      setIsUnlocked(true);
      // If we have the email but not the explicit unlock flag, set it for consistency
      if (userEmail && unlocked !== 'true') {
        sessionStorage.setItem('clorosol_docs_unlocked', 'true');
      }
    }
  }, []);

  // Fetch technical files from Supabase
  useEffect(() => {
    const fetchFiles = async () => {
      if (!supabase) {
        setIsLoadingFiles(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('technical_files')
          .select('*')
          .order('publication_date', { ascending: false });

        if (error) throw error;
        setTechnicalFiles(data || []);
      } catch (error) {
        console.error('Error fetching technical files:', error);
      } finally {
        setIsLoadingFiles(false);
      }
    };

    fetchFiles();
  }, []);

  const filteredProducts = PRODUCTS.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredFiles = technicalFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (file.product_name && file.product_name.toLowerCase().includes(searchTerm.toLowerCase()));
    // For technical files, we don't have a category field yet, so we'll just filter by search for now
    return matchesSearch;
  });

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.rgpd) return;

    setIsSubmitting(true);
    try {
      if (!supabase) throw new Error('Supabase not configured');
      
      // Save lead to Supabase
      const { error } = await supabase.from('leads').insert([
        {
          name: formData.name,
          email: formData.email,
          message: `Solicitação de acesso a informações de Sustentabilidade. Empresa: ${formData.company}`,
          subject: 'Acesso a Sustentabilidade e Documentação',
          source: 'Centro de Documentação'
        }
      ]);

      if (error) throw error;

      sessionStorage.setItem('clorosol_docs_unlocked', 'true');
      sessionStorage.setItem('clorosol_user_name', formData.name);
      sessionStorage.setItem('clorosol_user_email', formData.email);
      sessionStorage.setItem('clorosol_user_company', formData.company);
      
      setIsUnlocked(true);
      setShowUnlockForm(false);
      setSubmitStatus('success');
    } catch (error) {
      console.error('Error unlocking docs:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = (url: string | undefined, filename: string) => {
    if (!isUnlocked) {
      setShowUnlockForm(true);
      return;
    }
    if (!url) return;

    // Criar um elemento de link temporário para o download/abertura
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    
    // O atributo 'download' funciona melhor em URLs da mesma origem, 
    // mas serve como sugestão para o browser.
    const downloadName = filename.toLowerCase().endsWith('.pdf') ? filename : `${filename}.pdf`;
    link.setAttribute('download', downloadName);
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">
      {/* Hero Section - Editorial Style */}
      <section className="relative h-[60vh] flex items-center overflow-hidden mb-12">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1920"
            alt="Sustainability Background"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/40 via-blue-900/60 to-gray-50" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <span className="inline-block px-4 py-1.5 bg-blue-600/20 backdrop-blur-md text-blue-100 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-white/10">
              Compromisso Ambiental
            </span>
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 tracking-tighter leading-none">
              Sustentabilidade <br/>
              <span className="text-blue-200 italic font-serif">& Documentação</span>
            </h1>
            <p className="text-xl text-blue-50 leading-relaxed font-medium max-w-2xl mx-auto">
              Aceda às nossas práticas de sustentabilidade e documentação técnica. Transparência e rigor em cada processo.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20">
        {/* Control Panel - Specialist Tool Style */}
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl border border-white/20 mb-12">
          <div className="flex flex-col lg:flex-row gap-8 items-center justify-between">
            {/* Tab Switcher */}
            <div className="flex p-1.5 bg-gray-100/80 rounded-2xl w-full lg:w-auto">
              <button 
                onClick={() => setActiveTab('catalog')}
                className={`flex-1 lg:flex-none px-8 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'catalog' ? 'bg-white text-blue-600 shadow-lg' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                <span>Catálogo de Produtos</span>
              </button>
              <button 
                onClick={() => setActiveTab('technical')}
                className={`flex-1 lg:flex-none px-8 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'technical' ? 'bg-white text-blue-600 shadow-lg' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Documentos Técnicos</span>
              </button>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <div className="relative flex-grow min-w-[300px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Pesquisar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                />
              </div>
              
              <div className="relative min-w-[200px]">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-12 pr-10 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none cursor-pointer font-bold text-xs uppercase tracking-widest text-gray-600"
                >
                  <option value="all">Categorias</option>
                  <option value="Lixívias">Lixívias</option>
                  <option value="Detergentes">Detergentes</option>
                  <option value="Industrial">Industrial</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <AnimatePresence mode="wait">
          {activeTab === 'catalog' ? (
            <motion.div
              key="catalog"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-100"
            >
              <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Centro de Documentação</h2>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  {filteredProducts.length} Produtos Encontrados
                </span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Produto</th>
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Marca</th>
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Categoria</th>
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Documento</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredProducts.map((product) => (
                      <motion.tr 
                        key={product.id}
                        layout
                        className="hover:bg-blue-50/30 transition-colors group"
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100 group-hover:border-blue-200 transition-colors">
                              <img 
                                src={product.image} 
                                alt={product.name}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <div>
                              <div className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{product.name}</div>
                              <div className="text-xs font-medium text-gray-400 uppercase tracking-wider">{product.volume}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                            {product.brand}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-xs font-bold text-gray-500 uppercase tracking-widest">
                          {product.category}
                        </td>
                        <td className="px-8 py-6 text-right">
                          <motion.button
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDownload(product.technical_sheet_url, `Ficha_Tecnica_${product.name}`)}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white shadow-sm"
                          >
                            <Download className="w-3.5 h-3.5" />
                            PDF
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {filteredProducts.length === 0 && (
                <div className="px-8 py-20 text-center">
                  <Search className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">Nenhum produto encontrado para a sua pesquisa.</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="technical"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-100"
            >
              <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Arquivos Técnicos e de Segurança</h2>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  {filteredFiles.length} Documentos Disponíveis
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Documento</th>
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Assunto</th>
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Publicação</th>
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {isLoadingFiles ? (
                      <tr>
                        <td colSpan={4} className="px-8 py-20 text-center">
                          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                          <span className="text-gray-500 font-medium">A carregar arquivos...</span>
                        </td>
                      </tr>
                    ) : filteredFiles.length > 0 ? (
                      filteredFiles.map((file) => (
                        <motion.tr 
                          key={file.id}
                          layout
                          className="hover:bg-blue-50/30 transition-colors group"
                        >
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <FileText className="w-6 h-6" />
                              </div>
                              <span className="font-bold text-gray-900">{file.name}</span>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-xs font-bold text-gray-500 uppercase tracking-widest">
                            {file.product_name || 'Geral'}
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                              <Calendar className="w-4 h-4" />
                              {new Date(file.publication_date).toLocaleDateString('pt-PT')}
                            </div>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <motion.button
                              whileHover={{ scale: 1.05, y: -2 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleDownload(file.download_url, file.name)}
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white shadow-sm"
                            >
                              <Download className="w-3.5 h-3.5" />
                              Download
                            </motion.button>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-8 py-20 text-center">
                          <FileText className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                          <p className="text-gray-500 font-medium">Nenhum arquivo técnico encontrado.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Benefits Section - Bento Style */}
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
            <div className="relative z-10">
              <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-200">
                <CheckCircle className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Sempre Atualizado</h3>
              <p className="text-gray-600 leading-relaxed">Garantimos que todos os documentos técnicos estão na sua versão mais recente, cumprindo as normas vigentes.</p>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-blue-600 p-10 rounded-[2.5rem] shadow-xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
            <div className="relative z-10">
              <div className="w-14 h-14 bg-white text-blue-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg">
                <FileText className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Fichas de Segurança</h3>
              <p className="text-blue-50 leading-relaxed">Documentação completa em conformidade com as normas europeias de segurança e higiene industrial.</p>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
            <div className="relative z-10">
              <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-200">
                <Lock className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Acesso Exclusivo</h3>
              <p className="text-gray-600 leading-relaxed">Área dedicada a profissionais e parceiros B2B para consulta rápida de especificações técnicas.</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Unlock Modal */}
      <AnimatePresence>
        {showUnlockForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUnlockForm(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-4">
                    <Lock className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Desbloquear Acesso</h2>
                  <p className="text-gray-600 mt-2">
                    Preencha os seus dados para aceder a toda a documentação técnica da Clorosol.
                  </p>
                </div>

                <form onSubmit={handleUnlock} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Nome Completo</label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      placeholder="Ex: João Silva"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Email Profissional</label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      placeholder="Ex: joao@empresa.pt"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Empresa</label>
                    <input
                      required
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      placeholder="Nome da sua empresa"
                    />
                  </div>

                  <div className="flex items-start gap-3 py-2">
                    <input
                      required
                      type="checkbox"
                      id="rgpd-unlock"
                      checked={formData.rgpd}
                      onChange={(e) => setFormData({ ...formData, rgpd: e.target.checked })}
                      className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="rgpd-unlock" className="text-xs text-gray-500 leading-relaxed">
                      Aceito que os meus dados sejam processados para fins de contacto comercial e acesso à documentação técnica, conforme o RGPD.
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        A processar...
                      </>
                    ) : (
                      'Desbloquear Documentos'
                    )}
                  </button>
                </form>

                {submitStatus === 'error' && (
                  <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-2 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    Ocorreu um erro. Por favor, tente novamente.
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
