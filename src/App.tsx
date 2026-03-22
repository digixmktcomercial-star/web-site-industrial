import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { AIChat } from './components/chat/AIChat';
import { QuickChat } from './components/chat/QuickChat';
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { About } from './pages/About';
import { QuotePage } from './pages/QuotePage';
import { Contactos } from './pages/Contactos';
import { Careers } from './pages/Careers';
import { Partners } from './pages/Partners';
import TechnicalInfo from './pages/TechnicalInfo';
import { LeadModal } from './components/forms/LeadModal';

import { FloatingContactButtons } from './components/layout/FloatingContactButtons';

export default function App() {
  const [isLeadModalOpen, setIsLeadModalOpen] = React.useState(false);

  React.useEffect(() => {
    const handleOpenLeadModal = () => setIsLeadModalOpen(true);
    window.addEventListener('openLeadModal', handleOpenLeadModal);
    return () => window.removeEventListener('openLeadModal', handleOpenLeadModal);
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
        <Header />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/produtos" element={<Products />} />
            <Route path="/empresa" element={<About />} />
            <Route path="/orcamento" element={<QuotePage />} />
            <Route path="/contactos" element={<Contactos />} />
            <Route path="/carreiras" element={<Careers />} />
            <Route path="/parceiros" element={<Partners />} />
            <Route path="/informacao-tecnica" element={<TechnicalInfo />} />
          </Routes>
        </main>

        <Footer />
        
        {/* Floating Contacts & AI Assistant */}
        <FloatingContactButtons />
        <AIChat />

        {/* Lead Capture Modal */}
        <LeadModal isOpen={isLeadModalOpen} onClose={() => setIsLeadModalOpen(false)} />
      </div>
    </Router>
  );
}
