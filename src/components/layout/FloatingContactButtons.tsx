import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, Mail, MessageSquare, X, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const FloatingContactButtons: React.FC = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = React.useState(false);

  const contacts = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-[#25D366]',
      href: 'https://wa.me/351252376222',
      label: t('contacts.whatsapp')
    },
    {
      name: 'Email',
      icon: Mail,
      color: 'bg-blue-600',
      action: () => window.dispatchEvent(new CustomEvent('openLeadModal')),
      label: t('contacts.email')
    },
    {
      name: 'Chat',
      icon: MessageSquare,
      color: 'bg-slate-900',
      action: () => {
        window.dispatchEvent(new CustomEvent('openAIChat'));
        setIsOpen(false);
      },
      label: t('contacts.chat')
    }
  ];

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end space-y-4">
      <AnimatePresence>
        {isOpen && (
          <div className="flex flex-col items-end space-y-3 mb-2">
            {contacts.map((contact, index) => (
              <motion.div
                key={contact.name}
                initial={{ opacity: 0, x: 20, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center space-x-3 group"
              >
                <span className="bg-white text-slate-900 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-xl opacity-0 group-hover:opacity-100 transition-opacity border border-slate-100">
                  {contact.label}
                </span>
                {contact.href ? (
                  <a
                    href={contact.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${contact.color} text-white p-4 rounded-2xl shadow-2xl hover:scale-110 transition-transform active:scale-95 flex items-center justify-center`}
                  >
                    <contact.icon className="w-6 h-6" />
                  </a>
                ) : (
                  <button
                    onClick={contact.action}
                    className={`${contact.color} text-white p-4 rounded-2xl shadow-2xl hover:scale-110 transition-transform active:scale-95 flex items-center justify-center`}
                  >
                    <contact.icon className="w-6 h-6" />
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-3xl flex items-center justify-center text-white shadow-2xl transition-all duration-500 hover:scale-105 active:scale-95 ${
          isOpen ? 'bg-slate-900 rotate-90' : 'bg-[#1e3a8a]'
        }`}
      >
        {isOpen ? <X className="w-8 h-8" /> : <Phone className="w-8 h-8" />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500 border-2 border-white"></span>
          </span>
        )}
      </button>
    </div>
  );
};
