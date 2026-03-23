import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, 
  Trash2, 
  FileText, 
  Image as ImageIcon, 
  LogOut, 
  Plus, 
  Search, 
  Filter,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  X,
  ShieldCheck,
  Calendar,
  BarChart3,
  Edit3,
  Save
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { ManagedFile } from '../types';

export const Admin: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [files, setFiles] = useState<ManagedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'image' | 'pdf'>('image');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [uploadCategory, setUploadCategory] = useState('Geral');
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [editingFile, setEditingFile] = useState<ManagedFile | null>(null);
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState('');

  const categories = ['Geral', 'Lixívias', 'Detergentes', 'Industrial', 'Catálogo', 'Segurança'];

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      fetchFiles();
    }
  }, [session, activeTab]);

  const fetchFiles = async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from('managed_files')
        .select('*')
        .eq('type', activeTab)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFiles(data || []);
    } catch (error: any) {
      console.error('Error fetching files:', error.message);
    }
  };

  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setLoading(true);
    setStatus(null);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setStatus({ type: 'success', message: 'Conta criada com sucesso! Verifique o seu email para confirmar.' });
        setIsSignUp(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (error: any) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!supabase || !email) {
      setStatus({ type: 'error', message: 'Por favor, insira o seu email primeiro.' });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin`,
      });
      if (error) throw error;
      setStatus({ type: 'success', message: 'Email de recuperação enviado!' });
    } catch (error: any) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!supabase || !e.target.files || e.target.files.length === 0) return;
    
    setUploading(true);
    setStatus(null);
    
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${activeTab}s/${fileName}`;

    try {
      // 1. Upload to Storage
      const { error: uploadError } = await supabase.storage
        .from('managed_files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('managed_files')
        .getPublicUrl(filePath);

      // 3. Save to Database
      const { error: dbError } = await supabase
        .from('managed_files')
        .insert([
          {
            name: file.name,
            type: activeTab,
            url: publicUrl,
            storage_path: filePath,
            category: uploadCategory
          }
        ]);

      if (dbError) throw dbError;

      setStatus({ type: 'success', message: 'Ficheiro enviado com sucesso!' });
      fetchFiles();
    } catch (error: any) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  const handleDelete = async (file: ManagedFile) => {
    if (!supabase || !window.confirm('Tem a certeza que deseja eliminar este ficheiro?')) return;

    try {
      // 1. Delete from Storage
      const { error: storageError } = await supabase.storage
        .from('managed_files')
        .remove([file.storage_path]);

      if (storageError) throw storageError;

      // 2. Delete from Database
      const { error: dbError } = await supabase
        .from('managed_files')
        .delete()
        .eq('id', file.id);

      if (dbError) throw dbError;

      setStatus({ type: 'success', message: 'Ficheiro eliminado com sucesso!' });
      fetchFiles();
    } catch (error: any) {
      setStatus({ type: 'error', message: error.message });
    }
  };

  const handleEdit = (file: ManagedFile) => {
    setEditingFile(file);
    setEditName(file.name);
    setEditCategory(file.category || 'Geral');
  };

  const handleUpdateFile = async () => {
    if (!supabase || !editingFile) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from('managed_files')
        .update({ 
          name: editName, 
          category: editCategory 
        })
        .eq('id', editingFile.id);

      if (error) throw error;
      setStatus({ type: 'success', message: 'Ficheiro atualizado com sucesso!' });
      setEditingFile(null);
      fetchFiles();
    } catch (error: any) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    return {
      total: files.length,
      images: files.filter(f => f.type === 'image').length,
      pdfs: files.filter(f => f.type === 'pdf').length,
      categories: new Set(files.map(f => f.category)).size
    };
  }, [files]);

  const getPasswordStrength = (pass: string) => {
    if (!pass) return 0;
    let strength = 0;
    if (pass.length >= 8) strength += 25;
    if (/[A-Z]/.test(pass)) strength += 25;
    if (/[0-9]/.test(pass)) strength += 25;
    if (/[^A-Za-z0-9]/.test(pass)) strength += 25;
    return strength;
  };

  const passwordStrength = useMemo(() => getPasswordStrength(password), [password]);

  const filteredFiles = files.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || f.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-30" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-xl p-12 rounded-[3rem] shadow-2xl border border-white w-full max-w-md relative z-10"
        >
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-blue-200 rotate-3">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Portal</h1>
            <p className="text-slate-500 text-sm mt-3 font-medium">Gestão de Ativos Clorosol</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            <div className="flex p-1 bg-slate-100 rounded-2xl mb-8">
              <button 
                type="button"
                onClick={() => setIsSignUp(false)}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!isSignUp ? 'bg-white text-blue-600 shadow-lg' : 'text-slate-500'}`}
              >
                Entrar
              </button>
              <button 
                type="button"
                onClick={() => setIsSignUp(true)}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isSignUp ? 'bg-white text-blue-600 shadow-lg' : 'text-slate-500'}`}
              >
                Registar
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Corporativo</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm font-medium"
                placeholder="admin@clorosol.pt"
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Palavra-passe</label>
                {!isSignUp && (
                  <button 
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-700 transition-colors"
                  >
                    Esqueceu-se?
                  </button>
                )}
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm font-medium"
                placeholder="••••••••"
                required
              />
              {isSignUp && password && (
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Segurança</span>
                    <span className={`text-[8px] font-black uppercase tracking-widest ${
                      passwordStrength <= 25 ? 'text-red-500' :
                      passwordStrength <= 50 ? 'text-amber-500' :
                      passwordStrength <= 75 ? 'text-blue-500' : 'text-emerald-500'
                    }`}>
                      {passwordStrength <= 25 ? 'Fraca' :
                       passwordStrength <= 50 ? 'Média' :
                       passwordStrength <= 75 ? 'Forte' : 'Excelente'}
                    </span>
                  </div>
                  <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${passwordStrength}%` }}
                      className={`h-full transition-colors ${
                        passwordStrength <= 25 ? 'bg-red-500' :
                        passwordStrength <= 50 ? 'bg-amber-500' :
                        passwordStrength <= 75 ? 'bg-blue-500' : 'bg-emerald-500'
                      }`}
                    />
                  </div>
                </div>
              )}
            </div>
            
            <AnimatePresence>
              {status && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className={`p-4 rounded-2xl text-xs font-bold flex items-center space-x-3 border ${
                    status.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'
                  }`}
                >
                  {status.type === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
                  <span>{status.message}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center space-x-3 group"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>{isSignUp ? 'Criar Conta' : 'Autenticar'}</span>
                  <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-200">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Painel de Controlo</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Gestão de Ativos</h1>
            <p className="text-slate-500 mt-2 font-medium">Administre as imagens e PDFs do ecossistema Clorosol</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Sessão Ativa</p>
              <p className="text-sm font-bold text-slate-900">{session.user.email}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:text-red-600 hover:border-red-100 hover:bg-red-50 transition-all font-black text-[10px] uppercase tracking-widest shadow-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>Terminar Sessão</span>
            </button>
          </div>
        </div>

        {/* Status Messages */}
        <AnimatePresence>
          {status && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mb-8 p-6 rounded-3xl flex items-center justify-between shadow-lg ${
                status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-xl ${status.type === 'success' ? 'bg-emerald-100' : 'bg-red-100'}`}>
                  {status.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                </div>
                <span className="font-bold text-sm">{status.message}</span>
              </div>
              <button onClick={() => setStatus(null)} className="p-2 hover:bg-black/5 rounded-lg transition-colors">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <div className="space-y-8">
          {/* Dashboard Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total de Ativos', value: stats.total, icon: BarChart3, bg: 'bg-blue-50', text: 'text-blue-600' },
            { label: 'Imagens', value: stats.images, icon: ImageIcon, bg: 'bg-emerald-50', text: 'text-emerald-600' },
            { label: 'Documentos PDF', value: stats.pdfs, icon: FileText, bg: 'bg-amber-50', text: 'text-amber-600' },
            { label: 'Categorias', value: stats.categories, icon: Filter, bg: 'bg-purple-50', text: 'text-purple-600' }
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-5"
            >
              <div className={`p-4 rounded-2xl ${stat.bg} ${stat.text}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-2xl font-black text-slate-900">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action Bar - Specialist Tool Style */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="flex flex-col xl:flex-row gap-8 items-center justify-between">
              {/* Type Tabs */}
              <div className="flex p-1.5 bg-slate-100 rounded-2xl w-full xl:w-auto">
                <button 
                  onClick={() => setActiveTab('image')}
                  className={`flex-1 xl:flex-none px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                    activeTab === 'image' ? 'bg-white text-blue-600 shadow-lg' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>Imagens</span>
                </button>
                <button 
                  onClick={() => setActiveTab('pdf')}
                  className={`flex-1 xl:flex-none px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                    activeTab === 'pdf' ? 'bg-white text-blue-600 shadow-lg' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>PDFs</span>
                </button>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto flex-grow max-w-3xl">
                <div className="relative flex-grow">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder={`Procurar em ${activeTab === 'image' ? 'Imagens' : 'PDFs'}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium"
                  />
                </div>
                
                <div className="relative min-w-[200px]">
                  <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-[10px] font-black uppercase tracking-widest text-slate-500 appearance-none cursor-pointer"
                  >
                    <option value="all">Todas as Categorias</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Upload Action */}
              <div className="flex items-center gap-3 w-full xl:w-auto">
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  className="px-6 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-[10px] font-black uppercase tracking-widest text-slate-700"
                  title="Categoria para o novo ficheiro"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <label className="flex-grow xl:flex-grow-0 flex items-center justify-center space-x-3 px-8 py-3.5 rounded-2xl bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 cursor-pointer group">
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />}
                  <span>Carregar Novo</span>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept={activeTab === 'image' ? 'image/*' : 'application/pdf'}
                    onChange={handleFileUpload}
                    disabled={uploading}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-50">
                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ficheiro</th>
                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Categoria</th>
                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Data de Upload</th>
                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredFiles.length > 0 ? (
                    filteredFiles.map((file) => (
                      <tr key={file.id} className="group hover:bg-blue-50/20 transition-colors">
                        <td className="px-10 py-6">
                          <div className="flex items-center space-x-5">
                            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-100 group-hover:border-blue-200 transition-colors shadow-sm">
                              {file.type === 'image' ? (
                                <img src={file.url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              ) : (
                                <FileText className="w-8 h-8 text-slate-400" />
                              )}
                            </div>
                            <div className="max-w-[300px]">
                              <p className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors truncate">{file.name}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 truncate">{file.url}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-6">
                          <span className="px-4 py-1.5 rounded-xl bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
                            {file.category || 'Geral'}
                          </span>
                        </td>
                        <td className="px-10 py-6">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                            <Calendar className="w-4 h-4" />
                            {new Date(file.created_at).toLocaleDateString('pt-PT')}
                          </div>
                        </td>
                        <td className="px-10 py-6">
                          <div className="flex items-center justify-end space-x-3">
                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleEdit(file)}
                              className="p-3 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all border border-transparent hover:border-blue-100 shadow-sm hover:shadow-md bg-white"
                              title="Editar Metadados"
                            >
                              <Edit3 className="w-5 h-5" />
                            </motion.button>
                            <motion.a 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              href={file.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="p-3 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all border border-transparent hover:border-blue-100 shadow-sm hover:shadow-md bg-white"
                              title="Ver Ficheiro"
                            >
                              <ExternalLink className="w-5 h-5" />
                            </motion.a>
                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDelete(file)}
                              className="p-3 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all border border-transparent hover:border-red-100 shadow-sm hover:shadow-md bg-white"
                              title="Eliminar"
                            >
                              <Trash2 className="w-5 h-5" />
                            </motion.button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-10 py-32 text-center">
                        <div className="max-w-xs mx-auto space-y-6">
                          <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200 mx-auto border border-slate-100">
                            {activeTab === 'image' ? <ImageIcon className="w-10 h-10" /> : <FileText className="w-10 h-10" />}
                          </div>
                          <div>
                            <p className="text-slate-900 font-black uppercase tracking-widest text-xs">Nenhum ficheiro encontrado</p>
                            <p className="text-slate-400 text-xs mt-2 font-medium">Tente ajustar os seus filtros ou carregar um novo ficheiro.</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Instructions & Help */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-blue-600 rounded-[2.5rem] p-10 text-white shadow-xl shadow-blue-200 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 transition-transform group-hover:scale-110" />
              <div className="relative z-10">
                <h3 className="text-xl font-black uppercase tracking-widest mb-6 flex items-center gap-3">
                  <AlertCircle className="w-6 h-6" />
                  <span>Guia de Operação</span>
                </h3>
                <ul className="space-y-4 text-sm font-medium text-blue-50">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">01</div>
                    <span>Selecione o tipo de ficheiro (Imagem ou PDF) antes de carregar ou pesquisar.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">02</div>
                    <span>Atribua sempre uma categoria para manter a organização do ecossistema.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">03</div>
                    <span>A eliminação de um ficheiro é permanente e remove-o tanto da base de dados como do armazenamento.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <span>Estado do Sistema</span>
              </h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Base de Dados</span>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-[10px] font-black uppercase tracking-widest">Conectado</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Armazenamento</span>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-[10px] font-black uppercase tracking-widest">Ativo</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Segurança RLS</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-[10px] font-black uppercase tracking-widest">Protegido</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingFile && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingFile(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[3rem] shadow-2xl w-full max-w-lg relative z-10 overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-600 rounded-2xl text-white">
                    <Edit3 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Editar Ativo</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Atualizar metadados do ficheiro</p>
                  </div>
                </div>
                <button 
                  onClick={() => setEditingFile(null)}
                  className="p-2 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              <div className="p-10 space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome do Ficheiro</label>
                  <input 
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm font-medium"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Categoria</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm font-medium appearance-none cursor-pointer"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="pt-4 flex gap-4">
                  <button
                    onClick={() => setEditingFile(null)}
                    className="flex-1 px-8 py-4 rounded-2xl border border-slate-200 text-slate-600 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleUpdateFile}
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>Guardar Alterações</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
