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
        tech: 'Sustentabilidade',
        contact: 'Contactos',
        quote: 'Orçamento',
        partners: 'Parceiros',
        careers: 'Carreiras',
        work_with_us: 'Trabalhe Connosco'
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
      about: {
        hero: {
          title: 'Mais de 40 anos de Excelência e Confiança',
          subtitle: 'Fundada em 1974, a Clorosol nasceu com a missão de elevar os padrões de higiene em Portugal. Hoje, somos uma referência no fabrico de lixívias e detergentes, combinando tradição com inovação tecnológica.'
        },
        timeline: {
          since_1974: {
            title: 'Desde 1974',
            desc: 'Décadas de experiência no mercado de produtos de limpeza.'
          },
          iso_quality: {
            title: 'Qualidade ISO',
            desc: 'Certificação rigorosa que garante a eficácia de cada produto.'
          },
          specialized_team: {
            title: 'Equipa Especializada',
            desc: 'Profissionais dedicados à inovação e apoio ao cliente.'
          },
          export: {
            title: 'Exportação',
            desc: 'Presença consolidada em mercados internacionais.'
          }
        },
        mission_vision: {
          commitment: 'O Nosso Compromisso',
          title: 'Missão e Visão',
          mission_text: 'A nossa missão é fornecer soluções de limpeza e desinfecção que garantam a segurança e o bem-estar dos nossos clientes, através de produtos inovadores e sustentáveis.',
          vision_text: 'Ambicionamos ser o parceiro preferencial na indústria de detergentes, reconhecidos pela nossa integridade, qualidade superior e compromisso com o meio ambiente.'
        },
        video: {
          title: 'Conheça as Nossas Instalações',
          subtitle: 'Excelência industrial em cada detalhe.'
        },
        contact_section: {
          title: 'Precisa de entrar em contacto?',
          subtitle: 'A nossa equipa está pronta para responder às suas questões e fornecer o apoio necessário para o seu negócio.',
          cta_contacts: 'Ir para Contactos',
          cta_expert: 'Falar com um Especialista'
        }
      },
      careers: {
        badge: 'Carreiras',
        title: 'Trabalhe Connosco',
        subtitle: 'Junte-se a uma equipa dinâmica e inovadora no setor da higiene industrial. Aceitamos candidaturas espontâneas para diversas áreas.',
        form: {
          full_name: 'Nome Completo',
          email: 'Email de Contacto',
          phone: 'Telemóvel / Telefone',
          role: 'Função Desejada',
          role_placeholder: 'Selecione uma área...',
          roles: {
            production: 'Produção / Fábrica',
            logistics: 'Logística / Armazém',
            commercial: 'Comercial / Vendas',
            admin: 'Administrativo / Financeiro',
            quality: 'Qualidade / Laboratório',
            other: 'Outra (Candidatura Espontânea)'
          },
          cv: 'Anexar Currículo (PDF até 10MB)',
          cv_hint: 'Clique para carregar ou arraste o ficheiro',
          cv_pdf_only: 'Apenas formato PDF (Máx. 10MB)',
          experience: 'Resumo de Experiência / Motivação',
          experience_placeholder: 'Conte-nos um pouco sobre o seu percurso profissional...',
          gdpr: 'Autorizo o tratamento dos meus dados pessoais para efeitos de recrutamento, nos termos do Regulamento Geral sobre a Proteção de Dados (RGPD). Os dados serão conservados pela Clorosol durante o período necessário para o processo de seleção.',
          submit: 'Enviar',
          submitting: 'A enviar...',
          success_title: 'Obrigado',
          success_message: 'Sua mensagem foi enviada com sucesso. Entraremos em contacto assim que possível!',
          back_home: 'Voltar ao Início'
        },
        errors: {
          pdf_only: 'Por favor, selecione um ficheiro PDF.',
          file_too_large: 'O ficheiro é demasiado grande. O limite máximo é 10MB.',
          supabase_not_configured: 'Supabase não configurado.',
          cv_required: 'Por favor, anexe o seu currículo em formato PDF.',
          submit_error: 'Ocorreu um erro ao enviar a sua candidatura. Por favor, verifique os dados e tente novamente.'
        }
      },
      partners: {
        badge: 'Parceiras Clorosol',
        title: 'Seja Nosso Parceiro',
        subtitle: 'A Clorosol aposta na modernização constante e na qualidade superior. Procuramos parceiros que valorizem produtos certificados, competitivos e uma marca com mais de 50 anos de história em Portugal.',
        representative: 'Representante',
        reseller: 'Revendedor',
        form: {
          section_1: '1. Identificação e Experiência Base',
          company_name: 'Nome / Nome da Empresa',
          email: 'Email de Contacto',
          phone: 'Telemóvel / Telefone',
          location: 'Zona Geográfica de Atuação',
          experience_years: 'Anos de experiência no mercado?',
          previous_brands: 'Já trabalhou no setor de limpeza? Quais marcas?',
          section_2: '2. Segmentação e Foco',
          strongest_segment: 'Segmento com carteira mais forte?',
          preferred_gama: 'Gama preferencial para início?',
          section_3: '3. Logística e Capacidade Operacional',
          has_vehicle: 'Possui viatura própria?',
          has_vehicle_hint: 'Para visitas comerciais ou entregas.',
          has_warehouse: 'Possui armazém próprio?',
          has_warehouse_hint: 'Fundamental para stock físico.',
          network_desc: 'Descreva a sua rede de contactos atual no setor do retalho',
          monthly_volume: 'Volume médio de faturação mensal gerido noutras representações?',
          section_4_rep: '4. Estratégia de Venda Clorosol',
          strategy_desc: 'Como pretende introduzir a marca Clorosol em novos clientes?',
          safety_knowledge: 'Conhecimento sobre normas de segurança de produtos químicos?',
          training_availability: 'Disponibilidade para formações técnicas?',
          training_hint: 'Sobre produção e padrões de qualidade Clorosol.',
          section_4_res: '4. Perfil de Revenda e Capacidade',
          purchase_volume: 'Volume médio de compra mensal estimado?',
          resale_channels: 'Onde pretende revender os produtos?',
          has_fleet: 'Possui frota de entrega própria?',
          active_portfolio: 'Carteira de clientes ativa no setor?',
          exclusivity: 'Solicita exclusividade na zona?',
          section_5_res: '5. Dados Fiscais e Crédito',
          fiscal_type: 'Tipo de Entidade',
          fiscal_types: {
            company: 'Pessoa Coletiva (Empresa)',
            individual: 'Empresário em Nome Individual'
          },
          payment_pref: 'Preferência de Pagamento',
          payment_prefs: {
            cash: 'Pronto-pagamento',
            credit: 'Análise de Crédito (30/60 dias)'
          },
          section_final: 'Finalização',
          presentation: 'Currículo ou Apresentação',
          presentation_res: 'Apresentação da Empresa',
          observations: 'Observações Adicional',
          gdpr: 'Autorizo o tratamento dos dados pessoais fornecidos neste formulário para efeitos de análise de candidatura a parceiro Clorosol, nos termos do Regulamento Geral sobre a Proteção de Dados (RGPD). Os dados serão conservados durante o período necessário para a avaliação da parceria.',
          submit: 'Enviar',
          submitting: 'A enviar...'
        }
      },
      quote: {
        title: 'Pedido de Orçamento',
        subtitle: 'Preencha os dados da empresa, selecione os produtos e envie o seu pedido.',
        form: {
          company_data: 'Dados da Empresa',
          company_name: 'Nome da Empresa *',
          contact_name: 'Nome do Contacto *',
          email: 'Email *',
          phone: 'Telefone *',
          nif: 'NIF',
          address: 'Morada de Entrega',
          internal_ref: 'Referência Interna de Produto (Opcional)',
          observations: 'Observações',
          selected_products: 'Produtos Selecionados',
          no_products: 'Selecione produtos do catálogo abaixo.',
          add_products: 'Adicionar Produtos',
          search: 'Pesquisar...',
          submit: 'Enviar Pedido de Orçamento',
          success_title: 'Pedido Enviado com Sucesso!',
          success_message: 'A nossa equipa comercial irá analisar o seu pedido e responder em breve.',
          new_quote: 'Novo Pedido',
          errors: {
            company_required: 'O nome da empresa é obrigatório',
            contact_required: 'O nome do contacto é obrigatório',
            email_required: 'O email é obrigatório',
            email_invalid: 'Insira um email válido',
            phone_required: 'O telefone é obrigatório',
            phone_invalid: 'Telefone inválido (mín. 9 dígitos)',
            nif_invalid: 'O NIF deve ter exatamente 9 dígitos',
            at_least_one: 'Por favor, selecione pelo menos um produto.'
          }
        }
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
        clear_filters: 'Limpar Tudo',
        in_stock: 'Produto em Stock',
        available_now: 'Disponível para entrega imediata',
        wishlist_add: 'Lista de Desejos',
        wishlist_remove: 'Remover da Lista'
      },
      common: {
        learn_more: 'Saber Mais',
        contact_us: 'Contacte-nos',
        share: 'Partilhar',
        add: 'Adicionar',
        technical_sheet: 'Ficha Técnica',
        back: 'Voltar',
        next: 'Próximo',
        send: 'Enviar',
        cancel: 'Cancelar'
      },
      footer: {
        description: 'Excelência química e inovação em soluções de higiene e limpeza desde 1974.',
        quick_links: 'Links Rápidos',
        contacts: 'Contactos',
        legal: 'Legal',
        rights: 'Todos os direitos reservados.',
        privacy: 'Privacidade',
        terms: 'Termos',
        newsletter_hint: 'Subscreva para receber novidades e fichas técnicas de segurança.',
        maps_link: 'Abrir no Google Maps'
      },
      contacts: {
        whatsapp: 'Fale connosco agora',
        email: 'Envie-nos um email',
        chat: 'Chat em direto',
        form: {
          title: 'Envie-nos uma Mensagem',
          name: 'Nome',
          email: 'Email',
          subject: 'Assunto',
          message: 'Mensagem',
          submit: 'Enviar Mensagem',
          submitting: 'A enviar...',
          success: 'Mensagem enviada com sucesso!',
          error: 'Erro ao enviar mensagem. Tente novamente.',
          validation: {
            name_min: 'O nome deve ter pelo menos 3 caracteres',
            email_invalid: 'Email inválido',
            subject_min: 'O assunto deve ter pelo menos 5 caracteres',
            message_min: 'A mensagem deve ter pelo menos 10 caracteres'
          }
        }
      }
    }
  },
  en: {
    translation: {
      nav: {
        home: 'Home',
        about: 'Company',
        products: 'Products',
        tech: 'Sustainability',
        contact: 'Contacts',
        quote: 'Quote',
        partners: 'Partners',
        careers: 'Careers',
        work_with_us: 'Work with Us'
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
      about: {
        hero: {
          title: 'Over 40 years of Excellence and Trust',
          subtitle: 'Founded in 1974, Clorosol was born with the mission to raise hygiene standards in Portugal. Today, we are a reference in the manufacture of bleaches and detergents, combining tradition with technological innovation.'
        },
        timeline: {
          since_1974: {
            title: 'Since 1974',
            desc: 'Decades of experience in the cleaning products market.'
          },
          iso_quality: {
            title: 'ISO Quality',
            desc: 'Rigorous certification that guarantees the effectiveness of each product.'
          },
          specialized_team: {
            title: 'Specialized Team',
            desc: 'Professionals dedicated to innovation and customer support.'
          },
          export: {
            title: 'Export',
            desc: 'Consolidated presence in international markets.'
          }
        },
        mission_vision: {
          commitment: 'Our Commitment',
          title: 'Mission and Vision',
          mission_text: 'Our mission is to provide cleaning and disinfection solutions that guarantee the safety and well-being of our customers, through innovative and sustainable products.',
          vision_text: 'We aim to be the preferred partner in the detergent industry, recognized for our integrity, superior quality, and commitment to the environment.'
        },
        video: {
          title: 'Meet Our Facilities',
          subtitle: 'Industrial excellence in every detail.'
        },
        contact_section: {
          title: 'Need to get in touch?',
          subtitle: 'Our team is ready to answer your questions and provide the necessary support for your business.',
          cta_contacts: 'Go to Contacts',
          cta_expert: 'Talk to an Expert'
        }
      },
      careers: {
        badge: 'Careers',
        title: 'Work with Us',
        subtitle: 'Join a dynamic and innovative team in the industrial hygiene sector. We accept spontaneous applications for various areas.',
        form: {
          full_name: 'Full Name',
          email: 'Contact Email',
          phone: 'Mobile / Phone',
          role: 'Desired Role',
          role_placeholder: 'Select an area...',
          roles: {
            production: 'Production / Factory',
            logistics: 'Logistics / Warehouse',
            commercial: 'Commercial / Sales',
            admin: 'Administrative / Financial',
            quality: 'Quality / Laboratory',
            other: 'Other (Spontaneous Application)'
          },
          cv: 'Attach CV (PDF up to 10MB)',
          cv_hint: 'Click to upload or drag the file',
          cv_pdf_only: 'PDF format only (Max. 10MB)',
          experience: 'Experience Summary / Motivation',
          experience_placeholder: 'Tell us a bit about your professional journey...',
          gdpr: 'I authorize the processing of my personal data for recruitment purposes, under the terms of the General Data Protection Regulation (GDPR). Data will be kept by Clorosol for the period necessary for the selection process.',
          submit: 'Send',
          submitting: 'Sending...',
          success_title: 'Thank You',
          success_message: 'Your message has been sent successfully. We will get in touch as soon as possible!',
          back_home: 'Back to Home'
        },
        errors: {
          pdf_only: 'Please select a PDF file.',
          file_too_large: 'The file is too large. The maximum limit is 10MB.',
          supabase_not_configured: 'Supabase not configured.',
          cv_required: 'Please attach your CV in PDF format.',
          submit_error: 'An error occurred while sending your application. Please check the data and try again.'
        }
      },
      partners: {
        badge: 'Clorosol Partnerships',
        title: 'Be Our Partner',
        subtitle: 'Clorosol bets on constant modernization and superior quality. We look for partners who value certified, competitive products and a brand with over 50 years of history in Portugal.',
        representative: 'Representative',
        reseller: 'Reseller',
        form: {
          section_1: '1. Identification and Base Experience',
          company_name: 'Name / Company Name',
          email: 'Contact Email',
          phone: 'Mobile / Phone',
          location: 'Geographic Area of Activity',
          experience_years: 'Years of experience in the market?',
          previous_brands: 'Have you worked in the cleaning sector? Which brands?',
          section_2: '2. Segmentation and Focus',
          strongest_segment: 'Strongest portfolio segment?',
          preferred_gama: 'Preferred range for start?',
          section_3: '3. Logistics and Operational Capacity',
          has_vehicle: 'Do you have your own vehicle?',
          has_vehicle_hint: 'For commercial visits or deliveries.',
          has_warehouse: 'Do you have your own warehouse?',
          has_warehouse_hint: 'Fundamental for physical stock.',
          network_desc: 'Describe your current contact network in the retail sector',
          monthly_volume: 'Average monthly billing volume managed in other representations?',
          section_4_rep: '4. Clorosol Sales Strategy',
          strategy_desc: 'How do you intend to introduce the Clorosol brand to new customers?',
          safety_knowledge: 'Knowledge about chemical product safety standards?',
          training_availability: 'Availability for technical training?',
          training_hint: 'About Clorosol production and quality standards.',
          section_4_res: '4. Resale Profile and Capacity',
          purchase_volume: 'Estimated average monthly purchase volume?',
          resale_channels: 'Where do you intend to resell the products?',
          has_fleet: 'Do you have your own delivery fleet?',
          active_portfolio: 'Active customer portfolio in the sector?',
          exclusivity: 'Do you request exclusivity in the area?',
          section_5_res: '5. Fiscal Data and Credit',
          fiscal_type: 'Entity Type',
          fiscal_types: {
            company: 'Legal Entity (Company)',
            individual: 'Individual Entrepreneur'
          },
          payment_pref: 'Payment Preference',
          payment_prefs: {
            cash: 'Cash payment',
            credit: 'Credit analysis (30/60 days)'
          },
          section_final: 'Finalization',
          presentation: 'CV or Presentation',
          presentation_res: 'Company Presentation',
          observations: 'Additional Observations',
          gdpr: 'I authorize the processing of the personal data provided in this form for the purpose of analyzing the Clorosol partner application, under the terms of the General Data Protection Regulation (GDPR). Data will be kept for the period necessary for the partnership evaluation.',
          submit: 'Send',
          submitting: 'Sending...'
        }
      },
      quote: {
        title: 'Request for Quote',
        subtitle: 'Fill in the company data, select the products and send your request.',
        form: {
          company_data: 'Company Data',
          company_name: 'Company Name *',
          contact_name: 'Contact Name *',
          email: 'Email *',
          phone: 'Phone *',
          nif: 'Tax ID (NIF)',
          address: 'Delivery Address',
          internal_ref: 'Internal Product Reference (Optional)',
          observations: 'Observations',
          selected_products: 'Selected Products',
          no_products: 'Select products from the catalog below.',
          add_products: 'Add Products',
          search: 'Search...',
          submit: 'Send Quote Request',
          success_title: 'Request Sent Successfully!',
          success_message: 'Our sales team will analyze your request and respond shortly.',
          new_quote: 'New Request',
          errors: {
            company_required: 'Company name is required',
            contact_required: 'Contact name is required',
            email_required: 'Email is required',
            email_invalid: 'Enter a valid email',
            phone_required: 'Phone is required',
            phone_invalid: 'Invalid phone (min. 9 digits)',
            nif_invalid: 'Tax ID must have exactly 9 digits',
            at_least_one: 'Please select at least one product.'
          }
        }
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
        clear_filters: 'Clear All',
        in_stock: 'In Stock',
        available_now: 'Available for immediate delivery',
        wishlist_add: 'Wishlist',
        wishlist_remove: 'Remove from List'
      },
      common: {
        learn_more: 'Learn More',
        contact_us: 'Contact Us',
        share: 'Share',
        add: 'Add',
        technical_sheet: 'Technical Sheet',
        back: 'Back',
        next: 'Next',
        send: 'Send',
        cancel: 'Cancel'
      },
      footer: {
        description: 'Chemical excellence and innovation in hygiene and cleaning solutions since 1974.',
        quick_links: 'Quick Links',
        contacts: 'Contacts',
        legal: 'Legal',
        rights: 'All rights reserved.',
        privacy: 'Privacy',
        terms: 'Terms',
        newsletter_hint: 'Subscribe to receive news and safety data sheets.',
        maps_link: 'Open in Google Maps'
      },
      contacts: {
        whatsapp: 'Chat with us now',
        email: 'Send us an email',
        chat: 'Live chat',
        form: {
          title: 'Send us a Message',
          name: 'Name',
          email: 'Email',
          subject: 'Subject',
          message: 'Message',
          submit: 'Send Message',
          submitting: 'Sending...',
          success: 'Message sent successfully!',
          error: 'Error sending message. Try again.',
          validation: {
            name_min: 'Name must be at least 3 characters',
            email_invalid: 'Invalid email',
            subject_min: 'Subject must be at least 5 characters',
            message_min: 'Message must be at least 10 characters'
          }
        }
      }
    }
  },
  es: {
    translation: {
      nav: {
        home: 'Inicio',
        about: 'Empresa',
        products: 'Productos',
        tech: 'Sostenibilidad',
        contact: 'Contactos',
        quote: 'Presupuesto',
        partners: 'Socios',
        careers: 'Carreras',
        work_with_us: 'Trabaja con Nosotros'
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
      about: {
        hero: {
          title: 'Más de 40 años de Excelencia y Confianza',
          subtitle: 'Fundada in 1974, Clorosol nació con la misión de elevar los estándares de higiene en Portugal. Hoy, somos una referencia en la fabricación de lejías y detergentes, combinando tradición con innovación tecnológica.'
        },
        timeline: {
          since_1974: {
            title: 'Desde 1974',
            desc: 'Décadas de experiencia en el mercado de productos de limpieza.'
          },
          iso_quality: {
            title: 'Calidad ISO',
            desc: 'Certificación rigorosa que garantiza la eficacia de cada producto.'
          },
          specialized_team: {
            title: 'Equipo Especializado',
            desc: 'Profesionales dedicados a la innovación y apoyo al cliente.'
          },
          export: {
            title: 'Exportación',
            desc: 'Presencia consolidada en mercados internacionales.'
          }
        },
        mission_vision: {
          commitment: 'Nuestro Compromiso',
          title: 'Misión y Visión',
          mission_text: 'Nuestra misión es proporcionar soluciones de limpieza y desinfección que garanticen la seguridad y el bienestar de nuestros clientes, a través de productos innovadores y sostenibles.',
          vision_text: 'Aspiramos a ser el socio preferido en la industria de detergentes, reconocidos por nuestra integridad, calidad superior y compromiso con el medio ambiente.'
        },
        video: {
          title: 'Conozca Nuestras Instalaciones',
          subtitle: 'Excelencia industrial en cada detalle.'
        },
        contact_section: {
          title: '¿Necesita ponerse en contacto?',
          subtitle: 'Nuestro equipo está listo para responder a sus preguntas y proporcionar el apoyo necesario para su negocio.',
          cta_contacts: 'Ir a Contactos',
          cta_expert: 'Hablar con um Especialista'
        }
      },
      careers: {
        badge: 'Carreras',
        title: 'Trabaja con Nosotros',
        subtitle: 'Únete a un equipo dinámico e innovador en el sector de la higiene industrial. Aceptamos candidaturas espontáneas para diversas áreas.',
        form: {
          full_name: 'Nombre Completo',
          email: 'Email de Contacto',
          phone: 'Móvil / Teléfono',
          role: 'Función Deseadas',
          role_placeholder: 'Seleccione un área...',
          roles: {
            production: 'Producción / Fábrica',
            logistics: 'Logística / Almacén',
            commercial: 'Comercial / Ventas',
            admin: 'Administrativo / Financiero',
            quality: 'Calidad / Laboratorio',
            other: 'Otra (Candidatura Espontánea)'
          },
          cv: 'Adjuntar Currículum (PDF hasta 10MB)',
          cv_hint: 'Haga clic para cargar o arrastre el archivo',
          cv_pdf_only: 'Solo formato PDF (Máx. 10MB)',
          experience: 'Resumen de Experiencia / Motivación',
          experience_placeholder: 'Cuéntenos un poco sobre su trayectoria profesional...',
          gdpr: 'Autorizo el tratamiento de mis datos personales para fines de reclutamiento, bajo los términos del Reglamento General de Protección de Datos (RGPD). Los datos serán conservados por Clorosol durante el período necesario para el proceso de selección.',
          submit: 'Enviar',
          submitting: 'Enviando...',
          success_title: 'Gracias',
          success_message: 'Su mensaje ha sido enviado con éxito. ¡Nos pondremos en contacto lo antes posible!',
          back_home: 'Volver al Inicio'
        },
        errors: {
          pdf_only: 'Por favor, seleccione un archivo PDF.',
          file_too_large: 'El archivo es demasiado grande. El límite máximo es 10MB.',
          supabase_not_configured: 'Supabase no configurado.',
          cv_required: 'Por favor, adjunte su currículum en formato PDF.',
          submit_error: 'Ocurrió un error al enviar su candidatura. Por favor, verifique los datos e intente nuevamente.'
        }
      },
      partners: {
        badge: 'Alianzas Clorosol',
        title: 'Sea Nuestro Socio',
        subtitle: 'Clorosol apuesta por la modernización constante y la calidad superior. Buscamos socios que valoren productos certificados, competitivos y una marca con más de 50 años de historia en Portugal.',
        representative: 'Representante',
        reseller: 'Revendedor',
        form: {
          section_1: '1. Identificación y Experiencia Base',
          company_name: 'Nombre / Nombre de la Empresa',
          email: 'Email de Contacto',
          phone: 'Móvil / Teléfono',
          location: 'Zona Geográfica de Actuación',
          experience_years: '¿Años de experiencia en el mercado?',
          previous_brands: '¿Ha trabajado en el sector de la limpieza? ¿Qué marcas?',
          section_2: '2. Segmentación y Enfoque',
          strongest_segment: '¿Segmento de cartera más fuerte?',
          preferred_gama: '¿Gama preferencial para el inicio?',
          section_3: '3. Logística y Capacidad Operativa',
          has_vehicle: '¿Tiene vehículo propio?',
          has_vehicle_hint: 'Para visitas comerciales ou entregas.',
          has_warehouse: '¿Tiene almacén propio?',
          has_warehouse_hint: 'Fundamental para el stock físico.',
          network_desc: 'Descreva a sua rede de contactos atual no setor do retalho',
          monthly_volume: '¿Volumen medio de facturación mensual gestionado en otras representaciones?',
          section_4_rep: '4. Estrategia de Venta Clorosol',
          strategy_desc: '¿Cómo pretende introducir la marca Clorosol en nuevos clientes?',
          safety_knowledge: '¿Conocimiento sobre normas de seguridad de productos químicos?',
          training_availability: '¿Disponibilidad para formaciones técnicas?',
          training_hint: 'Sobre producción y estándares de calidad Clorosol.',
          section_4_res: '4. Perfil de Reventa y Capacidad',
          purchase_volume: '¿Volumen medio de compra mensual estimado?',
          resale_channels: '¿Dónde pretende revender los productos?',
          has_fleet: '¿Tiene flota de entrega propia?',
          active_portfolio: '¿Cartera de clientes activa en el sector?',
          exclusivity: '¿Solicita exclusividad en la zona?',
          section_5_res: '5. Datos Fiscales y Crédito',
          fiscal_type: 'Tipo de Entidad',
          fiscal_types: {
            company: 'Persona Jurídica (Empresa)',
            individual: 'Empresario Individual'
          },
          payment_pref: 'Preferencia de Pago',
          payment_prefs: {
            cash: 'Pronto pago',
            credit: 'Análisis de Crédito (30/60 dias)'
          },
          section_final: 'Finalización',
          presentation: 'Currículum o Presentación',
          presentation_res: 'Presentación de la Empresa',
          observations: 'Observaciones Adicionales',
          gdpr: 'Autorizo el tratamiento de los datos personales facilitados en este formulario con el fin de analizar la solicitud de socio de Clorosol, bajo los términos del Reglamento General de Protección de Datos (RGPD). Los datos se conservarán durante el período necesario para la evaluación de la alianza.',
          submit: 'Enviar',
          submitting: 'Enviando...'
        }
      },
      quote: {
        title: 'Solicitud de Presupuesto',
        subtitle: 'Complete los datos de la empresa, seleccione los productos y envíe su solicitud.',
        form: {
          company_data: 'Datos de la Empresa',
          company_name: 'Nombre de la Empresa *',
          contact_name: 'Nombre del Contacto *',
          email: 'Email *',
          phone: 'Teléfono *',
          nif: 'NIF',
          address: 'Dirección de Entrega',
          internal_ref: 'Referencia Interna de Producto (Opcional)',
          observations: 'Observaciones',
          selected_products: 'Productos Seleccionados',
          no_products: 'Seleccione productos del catálogo a continuación.',
          add_products: 'Añadir Productos',
          search: 'Buscar...',
          submit: 'Enviar Solicitud de Presupuesto',
          success_title: '¡Solicitud Enviada con Éxito!',
          success_message: 'Nuestro equipo comercial analizará su solicitud y responderá en breve.',
          new_quote: 'Nueva Solicitud',
          errors: {
            company_required: 'El nombre da empresa es obligatorio',
            contact_required: 'El nombre del contacto es obligatorio',
            email_required: 'El email es obligatorio',
            email_invalid: 'Ingrese un email válido',
            phone_required: 'El teléfono es obligatorio',
            phone_invalid: 'Teléfono inválido (mín. 9 dígitos)',
            nif_invalid: 'El NIF debe tener exactamente 9 dígitos',
            at_least_one: 'Por favor, seleccione al menos un producto.'
          }
        }
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
        clear_filters: 'Limpiar Todo',
        in_stock: 'Producto en Stock',
        available_now: 'Disponible para entrega inmediata',
        wishlist_add: 'Lista de Deseos',
        wishlist_remove: 'Eliminar de la Lista'
      },
      common: {
        learn_more: 'Saber Más',
        contact_us: 'Contáctenos',
        share: 'Compartir',
        add: 'Añadir',
        technical_sheet: 'Ficha Técnica',
        back: 'Voltar',
        next: 'Siguiente',
        send: 'Enviar',
        cancel: 'Cancelar'
      },
      footer: {
        description: 'Excelencia química e innovación en soluciones de higiene e limpieza desde 1974.',
        quick_links: 'Enlaces Rápidos',
        contacts: 'Contactos',
        legal: 'Legal',
        rights: 'Todos los derechos reservados.',
        privacy: 'Privacidad',
        terms: 'Términos',
        newsletter_hint: 'Suscríbase para recibir noticias y fichas de datos de seguridad.',
        maps_link: 'Abrir en Google Maps'
      },
      contacts: {
        whatsapp: 'Hable con nosotros ahora',
        email: 'Envíenos un email',
        chat: 'Chat en vivo',
        form: {
          title: 'Envíenos un Mensaje',
          name: 'Nombre',
          email: 'Email',
          subject: 'Asunto',
          message: 'Mensaje',
          submit: 'Enviar Mensagem',
          submitting: 'Enviando...',
          success: '¡Mensaje enviado con éxito!',
          error: 'Error al enviar el mensaje. Inténtelo de nuevo.',
          validation: {
            name_min: 'El nombre debe tener al menos 3 caracteres',
            email_invalid: 'Email inválido',
            subject_min: 'El asunto debe tener al menos 5 caracteres',
            message_min: 'El mensaje debe tener al menos 10 caracteres'
          }
        }
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
