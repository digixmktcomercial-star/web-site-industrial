/* 
  SQL for Supabase:
  
  -- Create table for partner applications
  create table partner_applications (
    id uuid default uuid_generate_v4() primary key,
    type text not null check (type in ('Representante', 'Revendedor')),
    name text not null,
    email text not null,
    phone text not null,
    location text not null,
    experience_years text,
    previous_brands text,
    strongest_segment text,
    preferred_gama text,
    has_vehicle boolean,
    has_warehouse boolean,
    contacts_network_desc text,
    monthly_volume text,
    strategy_desc text,
    safety_knowledge text,
    training_availability boolean,
    reseller_purchase_volume text,
    reseller_fleet boolean,
    reseller_channels text,
    reseller_active_portfolio boolean,
    reseller_exclusivity boolean,
    fiscal_type text,
    credit_history text,
    file_url text,
    observations text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
  );

  -- Enable RLS
  alter table partner_applications enable row level security;

  -- Allow public inserts
  create policy "Enable insert for everyone" on partner_applications for insert with check (true);

  -- Create storage bucket for partner files
  -- Note: You must create the 'partners' bucket in the Supabase dashboard manually if not using SQL for storage.
*/

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Send, CheckCircle2, AlertCircle, FileText, User, Mail, Phone, 
  MapPin, Building2, Briefcase, GraduationCap, Truck, Warehouse, 
  Target, ShieldAlert, Upload, X, File, CreditCard, BarChart3
} from 'lucide-react';
import { supabase } from '../lib/supabase';

const SECTORS = [
  "Grande Distribuição (Supermercados/Hipermercados)",
  "Retalho Local/Lojas de proximidade",
  "Canal Horeca (Hotéis e Restaurantes)",
  "Outros"
];

const GAMAS = [
  "Gama Tanto (Detergentes e Amaciadores)",
  "Gama de Lixívias (Super Blanch, Ferili, Pavão, Louro)",
  "Produtos Auto (Carprotec ou R9Auto)",
  "Água Destilada"
];

export function Partners() {
  const [type, setType] = useState<'Representante' | 'Revendedor'>('Representante');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    experienceYears: '',
    previousBrands: '',
    strongestSegment: '',
    preferredGama: '',
    hasVehicle: false,
    hasWarehouse: false,
    contactsNetworkDesc: '',
    monthlyVolume: '',
    strategyDesc: '',
    safetyKnowledge: '',
    trainingAvailability: false,
    resellerPurchaseVolume: '',
    resellerFleet: false,
    resellerChannels: '',
    resellerActivePortfolio: false,
    resellerExclusivity: false,
    fiscalType: '',
    creditHistory: '',
    observations: '',
    gdprAccepted: false
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('O ficheiro é demasiado grande. Limite máximo: 10MB.');
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!supabase) throw new Error('Supabase não configurado.');

      let fileUrl = '';
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `applications/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('partners')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('partners')
          .getPublicUrl(filePath);
        
        fileUrl = publicUrl;
      }

      const { error: insertError } = await supabase
        .from('partner_applications')
        .insert([{
          type,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          location: formData.location,
          experience_years: formData.experienceYears,
          previous_brands: formData.previousBrands,
          strongest_segment: formData.strongestSegment,
          preferred_gama: formData.preferredGama,
          has_vehicle: formData.hasVehicle,
          has_warehouse: formData.hasWarehouse,
          contacts_network_desc: formData.contactsNetworkDesc,
          monthly_volume: formData.monthlyVolume,
          strategy_desc: formData.strategyDesc,
          safety_knowledge: formData.safetyKnowledge,
          training_availability: formData.trainingAvailability,
          reseller_purchase_volume: formData.resellerPurchaseVolume,
          reseller_fleet: formData.resellerFleet,
          reseller_channels: formData.resellerChannels,
          reseller_active_portfolio: formData.resellerActivePortfolio,
          reseller_exclusivity: formData.resellerExclusivity,
          fiscal_type: formData.fiscalType,
          credit_history: formData.creditHistory,
          file_url: fileUrl,
          observations: formData.observations,
          created_at: new Date().toISOString()
        }]);

      if (insertError) throw insertError;

      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error(err);
      setError('Ocorreu um erro ao enviar a sua candidatura. Por favor, tente novamente.');
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
            className="w-full bg-[#1e3a8a] text-white font-bold py-4 rounded-xl hover:bg-blue-800 transition-all shadow-lg"
          >
            Voltar ao Início
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-20 bg-slate-50 min-h-screen">
      {/* Hero Section with Background Image */}
      <section className="relative h-[50vh] flex items-center overflow-hidden mb-12">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=1920"
            alt="Partners Background"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center space-x-2 bg-blue-500/20 border border-blue-500/30 text-blue-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 backdrop-blur-sm">
              <Users className="w-3.5 h-3.5" />
              <span>Parcerias Clorosol</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">Seja Nosso Parceiro</h1>
            <p className="text-xl text-blue-50 leading-relaxed font-medium">
              A Clorosol aposta na modernização constante e na qualidade superior. Procuramos parceiros que valorizem produtos certificados, competitivos e uma marca com mais de 50 anos de história em Portugal.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Type Selector */}
        <div className="flex justify-center mb-12">
          <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200 flex space-x-1">
            <button
              onClick={() => setType('Representante')}
              className={`px-8 py-3 rounded-xl font-bold transition-all ${
                type === 'Representante' 
                  ? 'bg-[#1e3a8a] text-white shadow-lg' 
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              Representante
            </button>
            <button
              onClick={() => setType('Revendedor')}
              className={`px-8 py-3 rounded-xl font-bold transition-all ${
                type === 'Revendedor' 
                  ? 'bg-[#1e3a8a] text-white shadow-lg' 
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              Revendedor
            </button>
          </div>
        </div>

        <motion.div 
          key={type}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 p-8 md:p-12 border border-slate-100"
        >
          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center space-x-3 text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-12">
            {/* Section 1: Identificação */}
            <div className="space-y-8">
              <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">1. Identificação e Experiência Base</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Nome / Nome da Empresa</label>
                  <input 
                    required
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all"
                    placeholder="Ex: João Silva ou Empresa Lda"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Email de Contacto</label>
                  <input 
                    required
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all"
                    placeholder="exemplo@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Telemóvel / Telefone</label>
                  <input 
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all"
                    placeholder="+351 ..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Zona Geográfica de Atuação</label>
                  <input 
                    required
                    type="text"
                    value={formData.location}
                    onChange={e => setFormData({...formData, location: e.target.value})}
                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all"
                    placeholder="Ex: Distrito ou Região"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Anos de experiência no mercado?</label>
                  <input 
                    type="text"
                    value={formData.experienceYears}
                    onChange={e => setFormData({...formData, experienceYears: e.target.value})}
                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all"
                    placeholder="Ex: 5 anos"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Já trabalhou no setor de limpeza? Quais marcas?</label>
                  <input 
                    type="text"
                    value={formData.previousBrands}
                    onChange={e => setFormData({...formData, previousBrands: e.target.value})}
                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all"
                    placeholder="Marcas anteriores..."
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Segmentação */}
            <div className="space-y-8">
              <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Target className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">2. Segmentação e Foco</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Segmento com carteira mais forte?</label>
                  <select 
                    value={formData.strongestSegment}
                    onChange={e => setFormData({...formData, strongestSegment: e.target.value})}
                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all bg-white"
                  >
                    <option value="">Selecione...</option>
                    {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Gama preferencial para início?</label>
                  <select 
                    value={formData.preferredGama}
                    onChange={e => setFormData({...formData, preferredGama: e.target.value})}
                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all bg-white"
                  >
                    <option value="">Selecione...</option>
                    {GAMAS.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Section 3: Logística */}
            <div className="space-y-8">
              <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Truck className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">3. Logística e Capacidade Operacional</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex-grow">
                    <p className="text-sm font-bold text-slate-700">Possui viatura própria?</p>
                    <p className="text-xs text-slate-500">Para visitas comerciais ou entregas.</p>
                  </div>
                  <input 
                    type="checkbox"
                    checked={formData.hasVehicle}
                    onChange={e => setFormData({...formData, hasVehicle: e.target.checked})}
                    className="h-6 w-6 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex-grow">
                    <p className="text-sm font-bold text-slate-700">Possui armazém próprio?</p>
                    <p className="text-xs text-slate-500">Fundamental para stock físico.</p>
                  </div>
                  <input 
                    type="checkbox"
                    checked={formData.hasWarehouse}
                    onChange={e => setFormData({...formData, hasWarehouse: e.target.checked})}
                    className="h-6 w-6 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Descreva a sua rede de contactos atual no setor do retalho</label>
                  <textarea 
                    rows={3}
                    value={formData.contactsNetworkDesc}
                    onChange={e => setFormData({...formData, contactsNetworkDesc: e.target.value})}
                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all resize-none"
                    placeholder="Experiência com clientes atuais..."
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Volume médio de faturação mensal gerido noutras representações?</label>
                  <input 
                    type="text"
                    value={formData.monthlyVolume}
                    onChange={e => setFormData({...formData, monthlyVolume: e.target.value})}
                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all"
                    placeholder="Ex: 10.000€ - 20.000€"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Specific for Revendedor or Representative Strategy */}
            {type === 'Representante' ? (
              <div className="space-y-8">
                <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">4. Estratégia de Venda Clorosol</h3>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Como pretende introduzir a marca Clorosol em novos clientes?</label>
                    <textarea 
                      rows={3}
                      value={formData.strategyDesc}
                      onChange={e => setFormData({...formData, strategyDesc: e.target.value})}
                      className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all resize-none"
                      placeholder="Sua abordagem comercial..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Conhecimento sobre normas de segurança de produtos químicos?</label>
                    <input 
                      type="text"
                      value={formData.safetyKnowledge}
                      onChange={e => setFormData({...formData, safetyKnowledge: e.target.value})}
                      className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all"
                      placeholder="Ex: Manuseamento de lixívias, fichas técnicas..."
                    />
                  </div>
                  <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                    <div className="flex-grow">
                      <p className="text-sm font-bold text-blue-900">Disponibilidade para formações técnicas?</p>
                      <p className="text-xs text-blue-700">Sobre produção e padrões de qualidade Clorosol.</p>
                    </div>
                    <input 
                      type="checkbox"
                      checked={formData.trainingAvailability}
                      onChange={e => setFormData({...formData, trainingAvailability: e.target.checked})}
                      className="h-6 w-6 rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-8">
                  <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <BarChart3 className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">4. Perfil de Revenda e Capacidade</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Volume médio de compra mensal estimado?</label>
                      <input 
                        type="text"
                        value={formData.resellerPurchaseVolume}
                        onChange={e => setFormData({...formData, resellerPurchaseVolume: e.target.value})}
                        className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all"
                        placeholder="Ex: 5 paletes / mês"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Onde pretende revender os produtos?</label>
                      <input 
                        type="text"
                        value={formData.resellerChannels}
                        onChange={e => setFormData({...formData, resellerChannels: e.target.value})}
                        className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all"
                        placeholder="Ex: Loja física, Online, Cash & Carry..."
                      />
                    </div>
                    <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex-grow">
                        <p className="text-sm font-bold text-slate-700">Possui frota de entrega própria?</p>
                      </div>
                      <input 
                        type="checkbox"
                        checked={formData.resellerFleet}
                        onChange={e => setFormData({...formData, resellerFleet: e.target.checked})}
                        className="h-6 w-6 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex-grow">
                        <p className="text-sm font-bold text-slate-700">Carteira de clientes ativa no setor?</p>
                      </div>
                      <input 
                        type="checkbox"
                        checked={formData.resellerActivePortfolio}
                        onChange={e => setFormData({...formData, resellerActivePortfolio: e.target.checked})}
                        className="h-6 w-6 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex-grow">
                        <p className="text-sm font-bold text-slate-700">Solicita exclusividade na zona?</p>
                      </div>
                      <input 
                        type="checkbox"
                        checked={formData.resellerExclusivity}
                        onChange={e => setFormData({...formData, resellerExclusivity: e.target.checked})}
                        className="h-6 w-6 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">5. Dados Fiscais e Crédito</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Tipo de Entidade</label>
                      <select 
                        value={formData.fiscalType}
                        onChange={e => setFormData({...formData, fiscalType: e.target.value})}
                        className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all bg-white"
                      >
                        <option value="">Selecione...</option>
                        <option value="Empresa (Lda/SA)">Pessoa Coletiva (Empresa)</option>
                        <option value="ENI">Empresário em Nome Individual</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Preferência de Pagamento</label>
                      <select 
                        value={formData.creditHistory}
                        onChange={e => setFormData({...formData, creditHistory: e.target.value})}
                        className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all bg-white"
                      >
                        <option value="">Selecione...</option>
                        <option value="Pronto-pagamento">Pronto-pagamento</option>
                        <option value="Crédito 30/60 dias">Análise de Crédito (30/60 dias)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Finalização */}
            <div className="space-y-8">
              <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Upload className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">{type === 'Representante' ? '5' : '6'}. Finalização</h3>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">
                    {type === 'Representante' ? 'Currículo ou Apresentação' : 'Apresentação da Empresa'} (PDF até 10MB)
                  </label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative group cursor-pointer border-2 border-dashed rounded-2xl p-8 transition-all flex flex-col items-center justify-center space-y-3 ${
                      file ? 'border-blue-200 bg-blue-50' : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50'
                    }`}
                  >
                    <input 
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".pdf"
                      className="hidden"
                    />
                    {file ? (
                      <div className="flex items-center space-x-4 w-full">
                        <div className="bg-blue-600 p-3 rounded-xl text-white">
                          <File className="w-6 h-6" />
                        </div>
                        <div className="flex-grow overflow-hidden">
                          <p className="text-sm font-bold text-slate-800 truncate">{file.name}</p>
                          <p className="text-xs text-slate-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                        </div>
                        <button 
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setFile(null); }}
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
                          <p className="text-sm font-bold text-slate-700">Clique para carregar o ficheiro</p>
                          <p className="text-xs text-slate-400 mt-1">Apenas formato PDF (Máx. 10MB)</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Observações Adicionais</label>
                  <textarea 
                    rows={4}
                    value={formData.observations}
                    onChange={e => setFormData({...formData, observations: e.target.value})}
                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all resize-none"
                    placeholder="Alguma informação relevante que queira partilhar..."
                  />
                </div>

                {/* GDPR */}
                <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                  <label className="flex items-start space-x-4 cursor-pointer group">
                    <div className="relative flex items-center mt-1">
                      <input 
                        required
                        type="checkbox"
                        checked={formData.gdprAccepted}
                        onChange={(e) => setFormData({...formData, gdprAccepted: e.target.checked})}
                        className="peer h-6 w-6 cursor-pointer appearance-none rounded-lg border-2 border-slate-300 transition-all checked:bg-blue-600 checked:border-blue-600"
                      />
                      <CheckCircle2 className="absolute h-6 w-6 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none p-1" />
                    </div>
                    <span className="text-sm text-slate-600 leading-relaxed">
                      Autorizo o tratamento dos dados pessoais fornecidos neste formulário para efeitos de análise de candidatura a parceiro Clorosol, nos termos do <strong>Regulamento Geral sobre a Proteção de Dados (RGPD)</strong>. Os dados serão conservados durante o período necessário para a avaliação da parceria.
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex items-center justify-center space-x-3 py-5 rounded-2xl font-bold text-lg transition-all shadow-xl ${
                isSubmitting 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                  : 'bg-[#1e3a8a] text-white hover:bg-blue-800 shadow-blue-200/50 hover:scale-[1.01] active:scale-[0.99]'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-6 h-6 border-3 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                  <span>A enviar...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Enviar</span>
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
