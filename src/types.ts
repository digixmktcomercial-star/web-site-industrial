export interface Lead {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  department?: string;
  location?: string;
  postal_code?: string;
  subject: string;
  message: string;
  source?: string;
  created_at?: string;
}

export interface PartnerApplication {
  id?: string;
  type: 'Representante' | 'Revendedor';
  name: string;
  email: string;
  phone: string;
  location: string;
  experience_years?: string;
  previous_brands?: string;
  strongest_segment?: string;
  preferred_gama?: string;
  has_vehicle?: boolean;
  has_warehouse?: boolean;
  contacts_network_desc?: string;
  monthly_volume?: string;
  strategy_desc?: string;
  safety_knowledge?: string;
  training_availability?: boolean;
  reseller_purchase_volume?: string;
  reseller_fleet?: boolean;
  reseller_channels?: string;
  reseller_active_portfolio?: boolean;
  reseller_exclusivity?: boolean;
  fiscal_type?: string;
  credit_history?: string;
  file_url?: string;
  observations?: string;
  created_at?: string;
}
export interface Product {
  id: string;
  name: string;
  brand: 'Tanto' | 'Ferili' | 'Pavão' | 'Louro' | 'Super Blanch' | 'Clorosol';
  category: 'Lixívias' | 'Detergentes' | 'Industrial';
  description: string;
  image: string;
  technical_sheet_url?: string;
  features: string[];
  volume?: string;
  inStock?: boolean;
}

export interface QuoteRequest {
  id?: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  nif?: string;
  address?: string;
  internal_reference?: string;
  products: { product_id: string; quantity: number }[];
  message: string;
  status: 'Pendente' | 'Em Análise' | 'Concluído';
  created_at?: string;
}

export interface ManagedFile {
  id: string;
  name: string;
  type: 'image' | 'pdf';
  url: string;
  storage_path: string;
  category?: string;
  created_at: string;
}
