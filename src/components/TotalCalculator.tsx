'use client';

import React from 'react';
import { usePCBuilder } from '@/context/PCBuilderContext';

export default function TotalCalculator() {
  const { getTotal, clearBuild, selectedComponents } = usePCBuilder();
  const total = getTotal();
  const hasComponents = Object.keys(selectedComponents).length > 0;

  return (
    <div className="rounded-2xl bg-gradient-to-br from-brand to-brand-dark shadow-brand p-6 text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Total</h2>
        {hasComponents && (
          <button
            type="button"
            onClick={clearBuild}
            className="text-sm bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-lg transition-colors font-medium"
          >
            Limpiar
          </button>
        )}
      </div>
      
      <div className="text-4xl font-bold mb-2">
        ${total.toLocaleString('es-CL')}
      </div>
      
      <div className="text-sm opacity-90 mb-4">
        {Object.keys(selectedComponents).length} componente(s) seleccionado(s)
      </div>
      
      {hasComponents && (
        <button
          type="button"
          className="w-full bg-white text-brand-dark font-semibold py-3 rounded-xl hover:bg-brand-surface transition-colors shadow-sm"
        >
          Agregar al Carrito
        </button>
      )}
    </div>
  );
}

