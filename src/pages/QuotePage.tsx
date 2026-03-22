import React from 'react';
import { B2BForm } from '../components/forms/B2BForm';

export const QuotePage: React.FC = () => {
  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-slate-900">Pedido de Orçamento</h1>
        <p className="text-slate-500 text-sm">
          Preencha os dados da empresa, selecione os produtos e envie o seu pedido.
        </p>
      </div>
      <B2BForm />
    </div>
  );
};
