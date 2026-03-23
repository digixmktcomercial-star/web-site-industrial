import React, { useState, useEffect } from 'react';
import { Send, CheckCircle, AlertCircle, Loader2, User, Building2, Package, Search, Trash2, Plus } from 'lucide-react';
import { PRODUCTS } from '../../constants';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'motion/react';

export const B2BForm: React.FC = () => {
  const [formData, setFormData] = useState({
    company_name: '',
    contact_name: '',
    email: '',
    phone: '',
    nif: '',
    address: '',
    internal_reference: '',
    message: '',
    selectedProducts: [] as { id: string; quantity: number }[]
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Handle "add" from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const addIds = params.get('add');
    if (addIds) {
      const ids = addIds.split(',');
      ids.forEach(id => {
        if (PRODUCTS.find(p => p.id === id)) {
          addProduct(id);
        }
      });
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const validateField = (name: string, value: string) => {
    let error = '';
    switch (name) {
      case 'company_name':
        if (!value.trim()) error = 'O nome da empresa é obrigatório';
        break;
      case 'contact_name':
        if (!value.trim()) error = 'O nome do contacto é obrigatório';
        break;
      case 'email':
        if (!value.trim()) {
          error = 'O email é obrigatório';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Insira um email válido';
        }
        break;
      case 'phone':
        if (!value.trim()) {
          error = 'O telefone é obrigatório';
        } else if (!/^\+?[\d\s-]{9,}$/.test(value)) {
          error = 'Telefone inválido (mín. 9 dígitos)';
        }
        break;
      case 'nif':
        if (value.trim() && !/^\d{9}$/.test(value)) {
          error = 'O NIF deve ter exatamente 9 dígitos';
        }
        break;
    }
    setErrors(prev => ({ ...prev, [name]: error }));
    return !error;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all required fields
    const fieldsToValidate = ['company_name', 'contact_name', 'email', 'phone', 'nif'];
    let isValid = true;
    fieldsToValidate.forEach(field => {
      if (!validateField(field, (formData as any)[field])) {
        isValid = false;
      }
    });

    if (!isValid) return;

    if (formData.selectedProducts.length === 0) {
      alert('Por favor, selecione pelo menos um produto.');
      return;
    }
    setStatus('loading');

    try {
      if (!supabase) {
        throw new Error('Supabase não configurado. Por favor, adicione VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY aos segredos.');
      }
      const { error } = await supabase
        .from('quotes')
        .insert([{
          company_name: formData.company_name,
          contact_name: formData.contact_name,
          email: formData.email,
          phone: formData.phone,
          nif: formData.nif,
          address: formData.address,
          internal_reference: formData.internal_reference,
          message: formData.message,
          products: formData.selectedProducts.map(p => ({ product_id: p.id, quantity: p.quantity })),
          status: 'Pendente'
        }]);

      if (error) throw error;
      setStatus('success');
      setFormData({ 
        company_name: '', contact_name: '', email: '', phone: '', 
        nif: '', address: '', internal_reference: '', message: '', selectedProducts: [] 
      });
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  const addProduct = (id: string) => {
    setFormData(prev => {
      const exists = prev.selectedProducts.find(p => p.id === id);
      if (exists) {
        return {
          ...prev,
          selectedProducts: prev.selectedProducts.map(p => 
            p.id === id ? { ...p, quantity: p.quantity + 1 } : p
          )
        };
      }
      return {
        ...prev,
        selectedProducts: [...prev.selectedProducts, { id, quantity: 1 }]
      };
    });
  };

  const removeProduct = (id: string) => {
    setFormData(prev => ({
      ...prev,
      selectedProducts: prev.selectedProducts.filter(p => p.id !== id)
    }));
  };

  const updateQuantity = (id: string, delta: number) => {
    setFormData(prev => ({
      ...prev,
      selectedProducts: prev.selectedProducts.map(p => 
        p.id === id ? { ...p, quantity: Math.max(1, p.quantity + delta) } : p
      )
    }));
  };

  const filteredProducts = PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-12 text-center shadow-xl border border-blue-50 space-y-6"
          >
            <div className="bg-emerald-100 p-6 rounded-full text-emerald-600 w-24 h-24 mx-auto flex items-center justify-center">
              <CheckCircle className="h-12 w-12" />
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-bold text-slate-900">Pedido Enviado com Sucesso!</h3>
              <p className="text-slate-500">A nossa equipa comercial irá analisar o seu pedido e responder em breve.</p>
            </div>
            <button
              onClick={() => setStatus('idle')}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all"
            >
              Novo Pedido
            </button>
          </motion.div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left: Company Data */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-slate-50 px-6 py-4 border-bottom border-slate-200 flex items-center space-x-2">
                  <Building2 className="h-5 w-5 text-slate-400" />
                  <h3 className="font-bold text-slate-800">Dados da Empresa</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">Nome da Empresa *</label>
                    <input
                      required
                      type="text"
                      name="company_name"
                      placeholder="Ex: Distribuidora ABC"
                      value={formData.company_name}
                      onChange={handleInputChange}
                      className={`w-full bg-white border ${errors.company_name ? 'border-red-500 bg-red-50/30' : 'border-slate-200'} rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500`}
                    />
                    {errors.company_name && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">{errors.company_name}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">Nome do Contacto *</label>
                    <input
                      required
                      type="text"
                      name="contact_name"
                      placeholder="Nome completo"
                      value={formData.contact_name}
                      onChange={handleInputChange}
                      className={`w-full bg-white border ${errors.contact_name ? 'border-red-500 bg-red-50/30' : 'border-slate-200'} rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500`}
                    />
                    {errors.contact_name && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">{errors.contact_name}</p>}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500">Email *</label>
                      <input
                        required
                        type="email"
                        name="email"
                        placeholder="email@empresa.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full bg-white border ${errors.email ? 'border-red-500 bg-red-50/30' : 'border-slate-200'} rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500`}
                      />
                      {errors.email && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">{errors.email}</p>}
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500">Telefone *</label>
                      <input
                        required
                        type="tel"
                        name="phone"
                        placeholder="+351 ..."
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full bg-white border ${errors.phone ? 'border-red-500 bg-red-50/30' : 'border-slate-200'} rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500`}
                      />
                      {errors.phone && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">{errors.phone}</p>}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">NIF</label>
                    <input
                      type="text"
                      name="nif"
                      placeholder="Número de contribuinte"
                      value={formData.nif}
                      onChange={handleInputChange}
                      className={`w-full bg-white border ${errors.nif ? 'border-red-500 bg-red-50/30' : 'border-slate-200'} rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500`}
                    />
                    {errors.nif && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">{errors.nif}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">Morada de Entrega</label>
                    <input
                      type="text"
                      name="address"
                      placeholder="Morada completa..."
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full bg-white border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">Referência Interna de Produto (Opcional)</label>
                    <input
                      type="text"
                      name="internal_reference"
                      placeholder="Ex: REF-2024-001"
                      value={formData.internal_reference}
                      onChange={handleInputChange}
                      className="w-full bg-white border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">Observações</label>
                    <textarea
                      rows={3}
                      name="message"
                      placeholder="Informações adicionais..."
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full bg-white border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Right: Selected Products */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="bg-slate-50 px-6 py-4 border-bottom border-slate-200 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Package className="h-5 w-5 text-slate-400" />
                    <h3 className="font-bold text-slate-800">Produtos Selecionados ({formData.selectedProducts.length})</h3>
                  </div>
                </div>
                <div className="p-6 flex-grow overflow-y-auto max-h-[500px] space-y-4">
                  {formData.selectedProducts.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2 py-12">
                      <Package className="h-12 w-12 opacity-20" />
                      <p className="text-sm">Selecione produtos do catálogo abaixo.</p>
                    </div>
                  ) : (
                    formData.selectedProducts.map(item => {
                      const product = PRODUCTS.find(p => p.id === item.id);
                      if (!product) return null;
                      return (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-white rounded-lg p-1 flex items-center justify-center border border-slate-200">
                              <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain" />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-slate-800 leading-tight">{product.name}</h4>
                              <span className="text-[10px] text-blue-600 font-bold uppercase">{product.category}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden">
                              <button 
                                onClick={() => updateQuantity(item.id, -1)}
                                className="px-2 py-1 hover:bg-slate-50 text-slate-500"
                              >-</button>
                              <span className="px-3 py-1 text-xs font-bold border-x border-slate-200">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, 1)}
                                className="px-2 py-1 hover:bg-slate-50 text-slate-500"
                              >+</button>
                            </div>
                            <button 
                              onClick={() => removeProduct(item.id)}
                              className="text-slate-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Bottom: Add Products Section */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-slate-50 px-6 py-4 border-bottom border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="font-bold text-slate-800">Adicionar Produtos</h3>
                <div className="flex items-center space-x-2 bg-white border border-slate-200 px-3 py-1.5 rounded-lg w-full sm:w-64">
                  <Search className="h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Pesquisar..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="bg-transparent border-none focus:ring-0 text-xs w-full p-0"
                  />
                </div>
              </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredProducts.map(product => (
                  <div key={product.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors group">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white rounded-lg p-1 flex items-center justify-center border border-slate-100">
                        <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain" />
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="text-xs font-bold text-slate-800 truncate w-32">{product.name}</h4>
                        <span className="text-[9px] text-blue-500 font-bold uppercase">{product.category}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => addProduct(product.id)}
                      className="bg-slate-100 text-slate-600 p-1.5 rounded-lg hover:bg-blue-600 hover:text-white transition-all active:scale-90"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                onClick={handleSubmit}
                disabled={status === 'loading'}
                className="w-full bg-[#0ea5e9] text-white py-3 rounded-lg font-bold hover:bg-blue-600 transition-all flex items-center justify-center space-x-3 shadow-lg disabled:opacity-50 active:scale-[0.99]"
              >
                {status === 'loading' ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Enviar Pedido de Orçamento</span>
                  </>
                )}
              </button>
              {status === 'error' && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-4 mt-4 flex items-center space-x-3 text-red-700">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <p className="text-sm font-medium">
                    {!supabase 
                      ? 'Supabase não configurado. Adicione as credenciais nas definições (Secrets).' 
                      : 'Erro ao enviar o pedido. Por favor, tente novamente.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
