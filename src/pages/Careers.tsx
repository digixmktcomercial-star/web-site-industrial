import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Briefcase, Send, CheckCircle2, AlertCircle, FileText, User, Mail, Phone, GraduationCap, Upload, X, File } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function Careers() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    desiredRole: '',
    experience: '',
    gdprAccepted: false
  });

  const [cvFile, setCvFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Por favor, selecione um ficheiro PDF.');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('O ficheiro é demasiado grande. O limite máximo é 10MB.');
        return;
      }
      setCvFile(file);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!supabase) {
      setError('Supabase não configurado. Por favor, adicione VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY aos segredos.');
      setIsSubmitting(false);
      return;
    }

    if (!cvFile) {
      setError('Por favor, anexe o seu currículo em formato PDF.');
      setIsSubmitting(false);
      return;
    }

    try {
      // 1. Upload do CV para o Storage do Supabase
      const fileExt = cvFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `cvs/${fileName}`;

      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('careers')
        .upload(filePath, cvFile);

      if (uploadError) throw uploadError;

      // Obter URL pública do ficheiro
      const { data: { publicUrl } } = supabase.storage
        .from('careers')
        .getPublicUrl(filePath);

      // 2. Inserir dados na tabela
      const { error: supabaseError } = await supabase
        .from('job_applications')
        .insert([
          {
            full_name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            desired_role: formData.desiredRole,
            experience: formData.experience,
            gdpr_accepted: formData.gdprAccepted,
            cv_url: publicUrl,
            created_at: new Date().toISOString()
          }
        ]);

      if (supabaseError) throw supabaseError;

      // Simulação de envio de emails
      console.log('Enviando email para RH: rh-provisorio@clorosol.pt com anexo:', publicUrl);
      console.log('Enviando cópia de agradecimento para:', formData.email);

      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Erro ao submeter candidatura:', err);
      setError('Ocorreu um erro ao enviar a sua candidatura. Por favor, verifique os dados e tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="pt-32 pb-20 min-h-screen flex items-center justify-center bg-slate-50">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full mx-4 bg-white p-10 rounded-3xl shadow-xl text-center border border-slate-100"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Obrigado</h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Sua mensagem foi enviada com sucesso. Entraremos em contacto assim que possível!
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full bg-[#1e3a8a] text-white font-bold py-2.5 rounded-lg hover:bg-blue-800 transition-all shadow-lg shadow-blue-200 text-sm"
          >
            Voltar ao Início
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-[#1e3a8a] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Carreiras</span>
          </div>
          <h1 className="text-4xl font-black text-[#1e3a8a] mb-4 tracking-tight">Trabalhe Connosco</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Junte-se a uma equipa dinâmica e inovadora no setor da higiene industrial. Aceitamos candidaturas espontâneas para diversas áreas.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 p-8 md:p-12 border border-slate-100"
        >
          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center space-x-3 text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Nome Completo */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-bold text-slate-700 ml-1">
                  <User className="w-4 h-4 text-blue-500" />
                  <span>Nome Completo</span>
                </label>
                <input 
                  required
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all text-slate-800 font-medium"
                  placeholder="Ex: João Silva"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-bold text-slate-700 ml-1">
                  <Mail className="w-4 h-4 text-blue-500" />
                  <span>Email de Contacto</span>
                </label>
                <input 
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all text-slate-800 font-medium"
                  placeholder="exemplo@email.com"
                />
              </div>

              {/* Telefone */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-bold text-slate-700 ml-1">
                  <Phone className="w-4 h-4 text-blue-500" />
                  <span>Telemóvel / Telefone</span>
                </label>
                <input 
                  required
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all text-slate-800 font-medium"
                  placeholder="+351 912 345 678"
                />
              </div>

              {/* Função Desejada */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-bold text-slate-700 ml-1">
                  <GraduationCap className="w-4 h-4 text-blue-500" />
                  <span>Função Desejada</span>
                </label>
                <select 
                  required
                  value={formData.desiredRole}
                  onChange={(e) => setFormData({...formData, desiredRole: e.target.value})}
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all text-slate-800 font-medium bg-white appearance-none"
                >
                  <option value="">Selecione uma área...</option>
                  <option value="Produção">Produção / Fábrica</option>
                  <option value="Logística">Logística / Armazém</option>
                  <option value="Comercial">Comercial / Vendas</option>
                  <option value="Administrativo">Administrativo / Financeiro</option>
                  <option value="Qualidade">Qualidade / Laboratório</option>
                  <option value="Outra">Outra (Candidatura Espontânea)</option>
                </select>
              </div>
            </div>

            {/* Upload CV */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-bold text-slate-700 ml-1">
                <Upload className="w-4 h-4 text-blue-500" />
                <span>Anexar Currículo (PDF até 10MB)</span>
              </label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`relative group cursor-pointer border-2 border-dashed rounded-2xl p-8 transition-all flex flex-col items-center justify-center space-y-3 ${
                  cvFile ? 'border-blue-200 bg-blue-50' : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50'
                }`}
              >
                <input 
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf"
                  className="hidden"
                />
                
                {cvFile ? (
                  <div className="flex items-center space-x-4 w-full">
                    <div className="bg-blue-600 p-3 rounded-xl text-white">
                      <File className="w-6 h-6" />
                    </div>
                    <div className="flex-grow overflow-hidden">
                      <p className="text-sm font-bold text-slate-800 truncate">{cvFile.name}</p>
                      <p className="text-xs text-slate-500">{(cvFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCvFile(null);
                      }}
                      className="p-2 hover:bg-blue-100 rounded-lg text-slate-400 hover:text-red-500 transition-all"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                      <Upload className="w-6 h-6 text-slate-400 group-hover:text-blue-600" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-slate-700">Clique para carregar ou arraste o ficheiro</p>
                      <p className="text-xs text-slate-400 mt-1">Apenas formato PDF (Máx. 10MB)</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Experiência / Resumo */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-bold text-slate-700 ml-1">
                <FileText className="w-4 h-4 text-blue-500" />
                <span>Resumo de Experiência / Motivação</span>
              </label>
              <textarea 
                required
                rows={4}
                value={formData.experience}
                onChange={(e) => setFormData({...formData, experience: e.target.value})}
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all text-slate-800 font-medium resize-none"
                placeholder="Conte-nos um pouco sobre o seu percurso profissional..."
              ></textarea>
            </div>

            {/* GDPR */}
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
              <label className="flex items-start space-x-3 cursor-pointer group">
                <div className="relative flex items-center mt-1">
                  <input 
                    required
                    type="checkbox"
                    checked={formData.gdprAccepted}
                    onChange={(e) => setFormData({...formData, gdprAccepted: e.target.checked})}
                    className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-300 transition-all checked:bg-blue-600 checked:border-blue-600"
                  />
                  <CheckCircle2 className="absolute h-5 w-5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none p-0.5" />
                </div>
                <span className="text-xs text-slate-600 leading-relaxed">
                  Autorizo o tratamento dos meus dados pessoais para efeitos de recrutamento, nos termos do <strong>Regulamento Geral sobre a Proteção de Dados (RGPD)</strong>. Os dados serão conservados pela Clorosol durante o período necessário para o processo de seleção.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex items-center justify-center space-x-3 py-2.5 rounded-xl font-bold transition-all shadow-xl ${
                isSubmitting 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                  : 'bg-[#1e3a8a] text-white hover:bg-blue-800 shadow-blue-200/50 hover:scale-[1.01] active:scale-[0.99]'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                  <span className="text-sm">A enviar...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span className="text-sm">Enviar</span>
                </>
              )}
            </button>
          </form>
        </motion.div>

        <div className="mt-12 text-center text-slate-400 text-sm">
          <p>© 2026 Clorosol — Higiene Industrial. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  );
}
