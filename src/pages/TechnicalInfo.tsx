import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Download, Search, Lock, CheckCircle, AlertCircle, Loader2, Calendar } from 'lucide-react';
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
  const [isUnlocked, setIsUnlocked] = useState(false);
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

  const filteredProducts = PRODUCTS.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFiles = technicalFiles.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (file.product_name && file.product_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
          message: `Solicitação de acesso a Informação Técnica. Empresa: ${formData.company}`,
          subject: 'Acesso a Documentação Técnica',
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

  const handleDownload = async (url: string | undefined, filename: string) => {
    if (!isUnlocked) {
      setShowUnlockForm(true);
      return;
    }
    if (!url) return;

    try {
      // Tentar download direto via fetch para forçar o comportamento de download
      const response = await fetch(url);
      if (!response.ok) throw new Error('Falha ao descarregar o ficheiro');
      
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      // Garantir que o nome termina em .pdf se não tiver extensão
      const downloadName = filename.toLowerCase().endsWith('.pdf') ? filename : `${filename}.pdf`;
      link.download = downloadName;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Limpar o URL do blob
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100);
    } catch (error) {
      console.error('Erro no download direto:', error);
      // Fallback: abrir em novo separador se o fetch falhar (ex: CORS)
      window.open(url, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Informação Técnica
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Aceda às fichas técnicas e de segurança de todos os nossos produtos. 
            Mantenha-se informado sobre as especificações e recomendações de utilização.
          </motion.p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto mb-12">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Pesquisar por produto, marca ou documento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        {/* Section: Catálogo de Produtos */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <CheckCircle className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Catálogo de Produtos</h2>
          </div>
          
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-bottom border-gray-100">
                    <th className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Produto</th>
                    <th className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Marca</th>
                    <th className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Categoria</th>
                    <th className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Documento</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.map((product) => (
                    <motion.tr 
                      key={product.id}
                      layout
                      className="hover:bg-gray-50/50 transition-colors group"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500">{product.volume}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                          {product.brand}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-sm text-gray-600">
                        {product.category}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <motion.button
                          whileHover={{ scale: 1.05, y: -2, boxShadow: "0 10px 15px -3px rgba(59, 130, 246, 0.2)" }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ type: "spring", stiffness: 400, damping: 17 }}
                          onClick={() => handleDownload(product.technical_sheet_url, `Ficha_Tecnica_${product.name}`)}
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                            isUnlocked 
                              ? 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white shadow-sm hover:shadow-md' 
                              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                          }`}
                        >
                          {isUnlocked ? (
                            <>
                              <Download className="w-3.5 h-3.5" />
                              Download PDF
                            </>
                          ) : (
                            <>
                              <Lock className="w-3.5 h-3.5" />
                              Solicitar Acesso
                            </>
                          )}
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredProducts.length === 0 && (
              <div className="px-8 py-12 text-center text-gray-500">
                Nenhum produto encontrado para a sua pesquisa.
              </div>
            )}
          </div>
        </div>

        {/* Section: Arquivos Técnicos e de Segurança */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <FileText className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Arquivos Técnicos e de Segurança</h2>
          </div>

          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-bottom border-gray-100">
                    <th className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Nome do Documento</th>
                    <th className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Produto Associado</th>
                    <th className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Data de Publicação</th>
                    <th className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Download</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {isLoadingFiles ? (
                    <tr>
                      <td colSpan={4} className="px-8 py-12 text-center">
                        <div className="flex items-center justify-center gap-2 text-gray-500">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>A carregar arquivos...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredFiles.length > 0 ? (
                    filteredFiles.map((file) => (
                      <motion.tr 
                        key={file.id}
                        layout
                        className="hover:bg-gray-50/50 transition-colors group"
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-blue-500" />
                            <span className="font-bold text-gray-900">{file.name}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-sm text-gray-600">
                          {file.product_name || 'Geral'}
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            {new Date(file.publication_date).toLocaleDateString('pt-PT')}
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <motion.button
                            whileHover={{ scale: 1.05, y: -2, boxShadow: "0 10px 15px -3px rgba(59, 130, 246, 0.2)" }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            onClick={() => handleDownload(file.download_url, file.name)}
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                              isUnlocked 
                                ? 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white shadow-sm hover:shadow-md' 
                                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                            }`}
                          >
                            {isUnlocked ? (
                              <>
                                <Download className="w-3.5 h-3.5" />
                                Download
                              </>
                            ) : (
                              <>
                                <Lock className="w-3.5 h-3.5" />
                                Bloqueado
                              </>
                            )}
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-8 py-12 text-center text-gray-500">
                        Nenhum arquivo técnico encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Sempre Atualizado</h3>
            <p className="text-gray-600 text-sm">Garantimos que todos os documentos técnicos estão na sua versão mais recente.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Fichas de Segurança</h3>
            <p className="text-gray-600 text-sm">Documentação completa em conformidade com as normas europeias de segurança.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Acesso Exclusivo</h3>
            <p className="text-gray-600 text-sm">Área dedicada a profissionais e parceiros B2B para consulta rápida.</p>
          </div>
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
