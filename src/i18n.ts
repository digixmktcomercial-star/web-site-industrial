import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  pt: {
    translation: {
      nav: {
        home: 'Início',
        about: 'Empresa',
        products: 'Produtos',
        tech: 'Informação Técnica',
        contact: 'Contactos',
        quote: 'Orçamento'
      },
      hero: {
        badge: 'Líderes em Portugal desde 1974',
        title: 'A Ciência da Limpeza Pura.',
        subtitle: 'Líderes em Portugal desde 1974 na fabricação de soluções químicas de alta performance.',
        badge_2: 'Setores de Atuação',
        title_2: 'Soluções para Todos os Setores.',
        subtitle_2: 'Da desinfecção hospitalar à manutenção industrial pesada, garantimos a máxima eficácia.',
        badge_3: 'Nossos Produtos',
        title_3: 'Inovação em Cada Fórmula.',
        subtitle_3: 'Produtos desenvolvidos em laboratório próprio para resultados impecáveis e seguros.',
        cta_products: 'Explorar Produtos',
        cta_quote: 'Pedir Orçamento'
      },
      products: {
        all: 'Todos',
        bleach: 'Lixívias',
        detergents: 'Detergentes',
        industrial: 'Industrial',
        search_placeholder: 'O que procura hoje?',
        filters: 'Filtros',
        results: 'Mostrando {{count}} produtos',
        no_results: 'Nenhum produto encontrado',
        clear_filters: 'Limpar Tudo'
      },
      common: {
        learn_more: 'Saber Mais',
        contact_us: 'Contacte-nos',
        share: 'Partilhar',
        add: 'Adicionar',
        technical_sheet: 'Ficha Técnica'
      },
      footer: {
        description: 'Excelência química e inovação em soluções de higiene e limpeza desde 1974.',
        quick_links: 'Links Rápidos',
        contacts: 'Contactos',
        legal: 'Legal',
        rights: 'Todos os direitos reservados.',
        privacy: 'Privacidade',
        terms: 'Termos'
      },
      contacts: {
        whatsapp: 'Fale connosco agora',
        email: 'Envie-nos um email',
        chat: 'Chat em direto'
      }
    }
  },
  en: {
    translation: {
      nav: {
        home: 'Home',
        about: 'Company',
        products: 'Products',
        tech: 'Technical Info',
        contact: 'Contacts',
        quote: 'Quote'
      },
      hero: {
        badge: 'Leaders in Portugal since 1974',
        title: 'The Science of Pure Cleaning.',
        subtitle: 'Leaders in Portugal since 1974 in the manufacture of high-performance chemical solutions.',
        badge_2: 'Sectors of Activity',
        title_2: 'Solutions for All Sectors.',
        subtitle_2: 'From hospital disinfection to heavy industrial maintenance, we guarantee maximum efficacy.',
        badge_3: 'Our Products',
        title_3: 'Innovation in Every Formula.',
        subtitle_3: 'Products developed in our own laboratory for impeccable and safe results.',
        cta_products: 'Explore Products',
        cta_quote: 'Request Quote'
      },
      products: {
        all: 'All',
        bleach: 'Bleach',
        detergents: 'Detergents',
        industrial: 'Industrial',
        search_placeholder: 'What are you looking for today?',
        filters: 'Filters',
        results: 'Showing {{count}} products',
        no_results: 'No products found',
        clear_filters: 'Clear All'
      },
      common: {
        learn_more: 'Learn More',
        contact_us: 'Contact Us',
        share: 'Share',
        add: 'Add',
        technical_sheet: 'Technical Sheet'
      },
      footer: {
        description: 'Chemical excellence and innovation in hygiene and cleaning solutions since 1974.',
        quick_links: 'Quick Links',
        contacts: 'Contacts',
        legal: 'Legal',
        rights: 'All rights reserved.',
        privacy: 'Privacy',
        terms: 'Terms'
      },
      contacts: {
        whatsapp: 'Chat with us now',
        email: 'Send us an email',
        chat: 'Live chat'
      }
    }
  },
  es: {
    translation: {
      nav: {
        home: 'Inicio',
        about: 'Empresa',
        products: 'Productos',
        tech: 'Información Técnica',
        contact: 'Contactos',
        quote: 'Presupuesto'
      },
      hero: {
        badge: 'Líderes en Portugal desde 1974',
        title: 'La Ciencia de la Limpieza Pura.',
        subtitle: 'Líderes en Portugal desde 1974 en la fabricación de soluciones químicas de alto rendimiento.',
        badge_2: 'Sectores de Actuación',
        title_2: 'Soluciones para Todos los Sectores.',
        subtitle_2: 'Desde la desinfección hospitalaria hasta el mantenimiento industrial pesado, garantizamos la máxima eficacia.',
        badge_3: 'Nuestros Productos',
        title_3: 'Innovación en Cada Fórmula.',
        subtitle_3: 'Productos desarrollados en laboratorio propio para resultados impecables y seguros.',
        cta_products: 'Explorar Productos',
        cta_quote: 'Solicitar Presupuesto'
      },
      products: {
        all: 'Todos',
        bleach: 'Lejías',
        detergents: 'Detergentes',
        industrial: 'Industrial',
        search_placeholder: '¿Qué buscas hoy?',
        filters: 'Filtros',
        results: 'Mostrando {{count}} productos',
        no_results: 'No se encontraron productos',
        clear_filters: 'Limpiar Todo'
      },
      common: {
        learn_more: 'Saber Más',
        contact_us: 'Contáctenos',
        share: 'Compartir',
        add: 'Añadir',
        technical_sheet: 'Ficha Técnica'
      },
      footer: {
        description: 'Excelencia química e innovación en soluciones de higiene y limpieza desde 1974.',
        quick_links: 'Enlaces Rápidos',
        contacts: 'Contactos',
        legal: 'Legal',
        rights: 'Todos los derechos reservados.',
        privacy: 'Privacidad',
        terms: 'Términos'
      },
      contacts: {
        whatsapp: 'Hable con nosotros ahora',
        email: 'Envíenos un email',
        chat: 'Chat en vivo'
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'pt',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
