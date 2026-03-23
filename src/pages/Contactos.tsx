import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function Contactos() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const validateField = (name: string, value: string) => {
    let error = '';
    switch (name) {
      case 'name':
        if (!value.trim()) {
          error = 'O nome é obrigatório';
        } else if (value.trim().length < 3) {
          error = 'O nome deve ter pelo menos 3 caracteres';
        }
        break;
      case 'email':
        if (!value.trim()) {
          error = 'O email é obrigatório';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Insira um email válido';
        }
        break;
      case 'subject':
        if (!value.trim()) {
          error = 'O assunto é obrigatório';
        } else if (value.trim().length < 5) {
          error = 'O assunto deve ter pelo menos 5 caracteres';
        }
        break;
      case 'message':
        if (!value.trim()) {
          error = 'A mensagem é obrigatória';
        } else if (value.trim().length < 10) {
          error = 'A mensagem deve ter pelo menos 10 caracteres';
        }
        break;
      default:
        break;
    }
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Re-validar todos os campos antes de submeter
    Object.keys(formData).forEach(key => {
      const value = formData[key as keyof typeof formData];
      let error = '';
      if (key === 'name') {
        if (!value.trim()) error = 'O nome é obrigatório';
        else if (value.trim().length < 3) error = 'O nome deve ter pelo menos 3 caracteres';
      } else if (key === 'email') {
        if (!value.trim()) error = 'O email é obrigatório';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Insira um email válido';
      } else if (key === 'subject') {
        if (!value.trim()) error = 'O assunto é obrigatório';
        else if (value.trim().length < 5) error = 'O assunto deve ter pelo menos 5 caracteres';
      } else if (key === 'message') {
        if (!value.trim()) error = 'A mensagem é obrigatória';
        else if (value.trim().length < 10) error = 'A mensagem deve ter pelo menos 10 caracteres';
      }
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setStatus('loading');

    try {
      if (!supabase) throw new Error('Supabase não configurado. Adicione VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY aos segredos.');

      const { error } = await supabase
        .from('leads')
        .insert([{
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          source: 'Página Contactos',
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;

      // Simulação de envio de email para geral@clorosol.com
      console.log('Enviando notificação para: geral@clorosol.com');

      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
      setStatus('error');
    }
  };

  return (
    <div className="pt-20 pb-20 bg-slate-50 min-h-screen">
      {/* Hero Section with Background Image */}
      <section className="relative h-[50vh] flex items-center overflow-hidden mb-16">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1523966211575-eb4a01e7dd51?auto=format&fit=crop&q=80&w=1920"
            alt="Contact Us Background"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-2xl"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">Contactos</h1>
            <p className="text-xl text-blue-50 leading-relaxed font-medium">
              Estamos à sua disposição para qualquer esclarecimento. Entre em contacto connosco através dos canais abaixo.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 space-y-8">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-50 p-3 rounded-xl">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Morada</h3>
                  <div className="flex flex-col">
                    <p className="text-slate-600 text-sm mt-1 leading-relaxed">Zona Industrial do Salgueiro, Mouquim</p>
                    <p className="text-slate-600 text-sm leading-relaxed">4770-360 Vila Nova de Famalicão, Portugal</p>
                    <a 
                      href="https://www.google.com/maps/search/?api=1&query=Clorosol+Zona+Industrial+do+Salgueiro+Mouquim+4770-360+Vila+Nova+de+Famalicão" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline mt-2 text-xs font-bold inline-flex items-center"
                    >
                      Abrir no Google Maps
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-50 p-3 rounded-xl">
                  <Phone className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Telefone</h3>
                  <a href="tel:+351252376222" className="text-slate-600 text-sm mt-1 hover:text-blue-600 transition-colors">+351 252 376 222</a>
                  <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold">Chamada para a rede fixa nacional</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-50 p-3 rounded-xl">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Email</h3>
                  <button 
                    onClick={() => window.dispatchEvent(new CustomEvent('openLeadModal'))}
                    className="text-slate-600 text-sm mt-1 font-medium hover:text-blue-600 transition-colors"
                  >
                    geral@clorosol.com
                  </button>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-50 p-3 rounded-xl">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Horário</h3>
                  <p className="text-slate-600 text-sm mt-1">Segunda a Sexta: 09:00 - 18:00</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 p-8 md:p-12 border border-slate-100">
              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12 space-y-6"
                  >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold text-slate-900">Obrigado</h2>
                      <p className="text-slate-600">Sua mensagem foi enviada com sucesso. Entraremos em contacto assim que possível!</p>
                    </div>
                    <button 
                      onClick={() => setStatus('idle')}
                      className="bg-[#1e3a8a] text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-800 transition-all"
                    >
                      Enviar Nova Mensagem
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nome Completo</label>
                        <input 
                          type="text" 
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className={`w-full px-5 py-4 rounded-2xl border ${errors.name ? 'border-red-500 bg-red-50/30' : 'border-slate-200'} focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all text-slate-800 font-medium`}
                          placeholder="O seu nome"
                        />
                        {errors.name && (
                          <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider ml-1">{errors.name}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email</label>
                        <input 
                          type="email" 
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full px-5 py-4 rounded-2xl border ${errors.email ? 'border-red-500 bg-red-50/30' : 'border-slate-200'} focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all text-slate-800 font-medium`}
                          placeholder="o-seu@email.com"
                        />
                        {errors.email && (
                          <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider ml-1">{errors.email}</p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Assunto</label>
                      <input 
                        type="text" 
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className={`w-full px-5 py-4 rounded-2xl border ${errors.subject ? 'border-red-500 bg-red-50/30' : 'border-slate-200'} focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all text-slate-800 font-medium`}
                        placeholder="Como podemos ajudar?"
                      />
                      {errors.subject && (
                        <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider ml-1">{errors.subject}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Mensagem</label>
                      <textarea 
                        rows={5}
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        className={`w-full px-5 py-4 rounded-2xl border ${errors.message ? 'border-red-500 bg-red-50/30' : 'border-slate-200'} focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all text-slate-800 font-medium resize-none`}
                        placeholder="Escreva aqui a sua mensagem..."
                      ></textarea>
                      {errors.message && (
                        <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider ml-1">{errors.message}</p>
                      )}
                    </div>

                    {status === 'error' && (
                      <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center space-x-3 text-red-700">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p className="text-sm font-medium">
                          {!supabase 
                            ? 'Supabase não configurado. Adicione as credenciais nas definições (Secrets).' 
                            : 'Erro ao enviar mensagem. Tente novamente.'}
                        </p>
                      </div>
                    )}

                    <button 
                      type="submit"
                      disabled={status === 'loading'}
                      className={`w-full flex items-center justify-center space-x-3 py-2.5 rounded-xl font-bold transition-all shadow-xl ${
                        status === 'loading' 
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                          : 'bg-[#1e3a8a] text-white hover:bg-blue-800 shadow-blue-200/50 hover:scale-[1.01] active:scale-[0.99]'
                      }`}
                    >
                      {status === 'loading' ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Enviar</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
