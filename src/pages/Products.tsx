import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PRODUCTS } from '../constants';
import { ProductCard } from '../components/products/ProductCard';
import { Search, Filter, X, LayoutGrid, List, SlidersHorizontal, FileText, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const CATEGORIES = ['Todos', 'Lixívias', 'Detergentes', 'Industrial'] as const;
const BRANDS = ['Todas', 'Tanto', 'Ferili', 'Pavão', 'Louro', 'Super Blanch', 'Clorosol'] as const;

const CATEGORY_BANNERS: Record<typeof CATEGORIES[number], { image: string; title: string; subtitle: string }> = {
  'Todos': {
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1920',
    title: 'Catálogo Completo Clorosol',
    subtitle: 'Soluções de higiene e limpeza para todas as necessidades, desde o lar até à indústria.'
  },
  'Lixívias': {
    image: 'https://images.unsplash.com/photo-1585421514738-ee184bb3c300?auto=format&fit=crop&q=80&w=1920',
    title: 'Lixívias de Alta Eficácia',
    subtitle: 'Desinfecção profunda e brancura impecável com a confiança de décadas de experiência.'
  },
  'Detergentes': {
    image: 'https://images.unsplash.com/photo-1626806819282-2c1dc61a0e05?auto=format&fit=crop&q=80&w=1920',
    title: 'Detergentes de Performance',
    subtitle: 'Fórmulas avançadas para uma limpeza brilhante em todas as superfícies e tecidos.'
  },
  'Industrial': {
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=1920',
    title: 'Soluções Industriais',
    subtitle: 'Produtos de alta concentração e eficácia para os desafios mais exigentes do setor profissional.'
  }
};

export const Products: React.FC = () => {
  const { t } = useTranslation();
  const [category, setCategory] = useState<typeof CATEGORIES[number]>('Todos');
  const [brand, setBrand] = useState<typeof BRANDS[number]>('Todas');
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      const matchesCategory = category === 'Todos' || p.category === category;
      const matchesBrand = brand === 'Todas' || p.brand === brand;
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                           p.description.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesBrand && matchesSearch;
    });
  }, [category, brand, search]);

  const clearFilters = () => {
    setCategory('Todos');
    setBrand('Todas');
    setSearch('');
  };

  return (
    <div className="pt-20 pb-24 bg-slate-50 min-h-screen">
      {/* Dynamic Hero Banner - Editorial Style */}
      <section className="relative h-[60vh] flex items-center overflow-hidden mb-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={category}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <img 
              src={CATEGORY_BANNERS[category].image} 
              alt={category}
              className="w-full h-full object-cover opacity-60"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
          </motion.div>
        </AnimatePresence>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-3xl space-y-8"
            >
              <div className="inline-flex items-center space-x-3 bg-blue-500/20 border border-blue-500/30 rounded-full px-4 py-1.5 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur-md">
                <LayoutGrid className="h-3.5 w-3.5" />
                <span>{category === 'Todos' ? 'Catálogo Clorosol' : category}</span>
              </div>
              <h1 className="text-[64px] md:text-[88px] font-normal text-white tracking-tighter leading-[0.9] mb-4">
                {CATEGORY_BANNERS[category].title.split(' ').map((word, i) => (
                  <span key={i} className={i % 2 === 1 ? 'italic text-slate-400' : ''}>
                    {word}{' '}
                  </span>
                ))}
              </h1>
              <p className="text-slate-300 text-xl md:text-2xl font-medium leading-relaxed max-w-xl">
                {CATEGORY_BANNERS[category].subtitle}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Decorative Element */}
        <div className="absolute bottom-0 right-0 w-1/3 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Control Panel - Specialist Tool Style */}
        <div className="sticky top-24 z-30 bg-white/80 backdrop-blur-xl p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto flex-grow max-w-4xl">
            <div className="relative flex-grow w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="text"
                placeholder={t('products.search_placeholder')}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all text-slate-700 font-medium"
              />
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`flex-1 sm:flex-none px-6 py-4 rounded-2xl border transition-all flex items-center justify-center space-x-3 font-black text-[10px] uppercase tracking-widest ${
                  showFilters || category !== 'Todos' || brand !== 'Todas'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>{t('products.filters')}</span>
                {(category !== 'Todos' || brand !== 'Todas') && (
                  <span className="bg-white text-blue-600 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black">
                    {(category !== 'Todos' ? 1 : 0) + (brand !== 'Todas' ? 1 : 0)}
                  </span>
                )}
              </button>
              
              <div className="flex p-1 bg-slate-100 rounded-2xl">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-xl transition-all ${viewMode === 'grid' ? 'text-blue-600 bg-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <LayoutGrid className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-3 rounded-xl transition-all ${viewMode === 'list' ? 'text-blue-600 bg-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="hidden xl:block h-10 w-px bg-slate-100 mx-4" />

          <div className="flex items-center gap-6 w-full lg:w-auto justify-between lg:justify-end">
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Resultados</p>
              <p className="text-sm font-bold text-slate-900">{filteredProducts.length} Produtos</p>
            </div>
            <Link
              to="/sustentabilidade"
              className="flex items-center space-x-3 px-6 py-4 rounded-2xl bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 group"
            >
              <FileText className="w-4 h-4" />
              <span>Documentação</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              className="overflow-hidden"
            >
              <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                    <Filter className="w-5 h-5 text-blue-600" />
                    <span>Refinar Pesquisa</span>
                  </h3>
                  <button 
                    onClick={clearFilters}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center space-x-1"
                  >
                    <X className="w-3 h-3" />
                    <span>Limpar Tudo</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-4">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Categoria</label>
                    <div className="flex flex-wrap gap-2">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setCategory(cat)}
                          className={`px-6 py-3 rounded-xl text-sm font-bold transition-all border ${
                            category === cat 
                              ? 'bg-blue-50 text-blue-700 border-blue-200' 
                              : 'bg-white text-slate-600 border-slate-100 hover:border-slate-300'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Marca</label>
                    <div className="flex flex-wrap gap-2">
                      {BRANDS.map((b) => (
                        <button
                          key={b}
                          onClick={() => setBrand(b)}
                          className={`px-6 py-3 rounded-xl text-sm font-bold transition-all border ${
                            brand === b 
                              ? 'bg-blue-50 text-blue-700 border-blue-200' 
                              : 'bg-white text-slate-600 border-slate-100 hover:border-slate-300'
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active Filters Bar */}
        {(category !== 'Todos' || brand !== 'Todas' || search) && (
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mr-2">Ativos:</span>
            {category !== 'Todos' && (
              <span className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-2">
                <span>{category}</span>
                <button onClick={() => setCategory('Todos')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {brand !== 'Todas' && (
              <span className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-2">
                <span>{brand}</span>
                <button onClick={() => setBrand('Todas')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {search && (
              <span className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-2">
                <span>"{search}"</span>
                <button onClick={() => setSearch('')}><X className="w-3 h-3" /></button>
              </span>
            )}
          </div>
        )}

        {/* Results Info */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-6">
          <p className="text-slate-500 font-medium">
            {t('products.results', { count: filteredProducts.length })}
          </p>
        </div>

        {/* Products Grid/List */}
        <motion.div 
          layout
          className={viewMode === 'grid' ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4" : "flex flex-col gap-6"}
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <ProductCard 
                  product={product} 
                  layout={viewMode}
                  onSelect={(id) => {
                    window.location.href = `/orcamento?add=${id}`;
                  }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProducts.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32 space-y-6"
          >
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
              <Search className="w-10 h-10 text-slate-300" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900">Nenhum produto encontrado</h3>
              <p className="text-slate-500">Tente ajustar os filtros ou a sua pesquisa para encontrar o que procura.</p>
            </div>
            <button 
              onClick={clearFilters}
              className="bg-[#1e3a8a] text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-800 transition-all shadow-lg"
            >
              Limpar Todos os Filtros
            </button>
          </motion.div>
        )}
      </div>

      {/* Technical Information Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 skew-x-12 translate-x-1/4 group-hover:translate-x-1/3 transition-transform duration-1000" />
          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 bg-blue-500/20 border border-blue-500/30 rounded-full px-4 py-1.5 text-blue-400 text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm">
                  <FileText className="h-3.5 w-3.5" />
                  <span>Documentação Técnica</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black leading-tight tracking-tighter">
                  Fichas Técnicas e <br />
                  de Segurança.
                </h2>
                <p className="text-slate-400 text-lg leading-relaxed max-w-md">
                  Aceda a toda a documentação técnica necessária para o uso seguro e eficaz dos nossos produtos.
                </p>
              </div>
              <Link
                to="/sustentabilidade"
                className="inline-flex items-center space-x-4 bg-white text-slate-900 px-8 py-4 rounded-2xl font-bold hover:bg-blue-500 hover:text-white transition-all shadow-xl group/btn"
              >
                <span>Ver Documentação</span>
                <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
