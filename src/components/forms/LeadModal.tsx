/* 
  SQL for Supabase:
  
  create table leads (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    email text not null,
    phone text,
    department text,
    location text,
    postal_code text,
    subject text,
    message text,
    source text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
  );

  -- Enable RLS
  alter table leads enable row level security;

  -- Allow public inserts
  create policy "Enable insert for everyone" on leads for insert with check (true);
*/

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, CheckCircle2, AlertCircle, Loader2, Mail, User, MessageSquare, Phone, MapPin, Building2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEPARTMENTS = [
  "Compras e Aprovisionamento",
  "Departamento Comercial (Vendas)",
  "Departamento de Produção",
  "Departamento Financeiro e Contabilidade",
  "Investigação e Desenvolvimento (I&D)",
  "Laboratório e Controlo de Qualidade",
  "Logística e Distribuição",
  "Manutenção Industrial",
  "Marketing e Publicidade",
  "Segurança, Higiene e Ambiente (SHA)",
  "Sistemas de Informação (TI)",
  "Outro"
].sort((a, b) => a.localeCompare(b, 'pt'));

export const LeadModal: React.FC<LeadModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    location: '',
    postalCode: '',
    subject: 'Contacto via Site',
    message: '',
    gdprAccepted: false
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      if (!supabase) throw new Error('Supabase não configurado.');

      const { error } = await supabase
        .from('leads')
        .insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          department: formData.department,
          location: formData.location,
          postal_code: formData.postalCode,
          subject: formData.subject,
          message: formData.message,
          source: 'Modal Contacto',
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;
      
      // Store contact info in session to avoid redundant forms
      sessionStorage.setItem('clorosol_user_name', formData.name);
      sessionStorage.setItem('clorosol_user_email', formData.email);
      sessionStorage.setItem('clorosol_user_company', formData.department || ''); // Using department as company context if needed
      sessionStorage.setItem('clorosol_docs_unlocked', 'true');

      setStatus('success');
      setTimeout(() => {
        onClose();
        setStatus('idle');
        setFormData({ 
          name: '', 
          email: '', 
          phone: '', 
          department: '', 
          location: '', 
          postalCode: '', 
          subject: 'Contacto via Site', 
          message: '' 
        });
      }, 3000);
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden my-8"
          >
            <div className="bg-[#1e3a8a] p-6 text-white flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <Mail className="h-6 w-6 text-blue-300" />
                <h3 className="text-xl font-black tracking-tight">Contacto</h3>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
              {status === 'success' ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </div>
                  <h4 className="text-2xl font-bold text-slate-900">Obrigado</h4>
                  <p className="text-slate-600">Sua mensagem foi enviada com sucesso. Entraremos em contacto assim que possível!</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nome</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          required
                          type="text"
                          value={formData.name}
                          onChange={e => setFormData({ ...formData, name: e.target.value })}
                          className="w-full pl-12 pr-5 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all"
                          placeholder="Seu nome"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email Profissional</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          required
                          type="email"
                          value={formData.email}
                          onChange={e => setFormData({ ...formData, email: e.target.value })}
                          className="w-full pl-12 pr-5 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all"
                          placeholder="email@empresa.com"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Telefone / Telemóvel</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          required
                          type="tel"
                          value={formData.phone}
                          onChange={e => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full pl-12 pr-5 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all"
                          placeholder="+351 ..."
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Departamento</label>
                      <div className="relative">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <select
                          required
                          value={formData.department}
                          onChange={e => setFormData({ ...formData, department: e.target.value })}
                          className="w-full pl-12 pr-5 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all bg-white appearance-none"
                        >
                          <option value="">Selecione o departamento...</option>
                          {DEPARTMENTS.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Localidade</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          required
                          type="text"
                          value={formData.location}
                          onChange={e => setFormData({ ...formData, location: e.target.value })}
                          className="w-full pl-12 pr-5 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all"
                          placeholder="Ex: Vila Nova de Famalicão"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Código Postal</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          required
                          type="text"
                          value={formData.postalCode}
                          onChange={e => setFormData({ ...formData, postalCode: e.target.value })}
                          className="w-full pl-12 pr-5 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all"
                          placeholder="0000-000"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Mensagem</label>
                    <div className="relative">
                      <MessageSquare className="absolute left-4 top-4 h-4 w-4 text-slate-400" />
                      <textarea
                        required
                        rows={4}
                        value={formData.message}
                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                        className="w-full pl-12 pr-5 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all resize-none"
                        placeholder="Como podemos ajudar a sua empresa?"
                      />
                    </div>
                  </div>

                  {/* GDPR */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
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
                      <span className="text-[10px] text-slate-600 leading-relaxed">
                        Autorizo o tratamento dos meus dados para efeitos de contacto comercial e resposta à minha solicitação, nos termos do <strong>RGPD</strong>.
                      </span>
                    </label>
                  </div>

                  {status === 'error' && (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center space-x-3 text-red-700">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <p className="text-sm font-medium">Erro ao enviar. Tente novamente.</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full bg-[#1e3a8a] text-white py-2.5 rounded-lg font-bold text-sm hover:bg-blue-800 transition-all shadow-lg flex items-center justify-center space-x-3 disabled:opacity-50"
                  >
                    {status === 'loading' ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Send className="h-3.5 w-3.5" />
                        <span>Enviar</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
