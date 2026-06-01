"use client";

import React, { createContext, useContext, useState, type ReactNode } from "react";
import { PCComponent, SelectedComponents } from "@/types/pc-components";

interface PCBuilderContextType {
  selectedComponents: SelectedComponents;
  selectComponent: (component: PCComponent) => void;
  removeComponent: (category: keyof SelectedComponents) => void;
  removeComponentById: (component: PCComponent) => void;
  getTotal: () => number;
  clearBuild: () => void;
}

const PCBuilderContext = createContext<PCBuilderContextType | undefined>(undefined);

export function PCBuilderProvider({ children }: { children: ReactNode }) {
  const [selectedComponents, setSelectedComponents] = useState<SelectedComponents>({});

  const selectComponent = (component: PCComponent) => {
    setSelectedComponents(prev => {
      const newComponents = { ...prev };
      
      if (component.category === 'otros') {
        // Para "otros", permitir múltiples selecciones
        const otros = newComponents.otros || [];
        if (!otros.find(c => c.id === component.id)) {
          newComponents.otros = [...otros, component];
        }
      } else {
        // Para otras categorías, solo una selección
        newComponents[component.category] = component;
      }
      
      return newComponents;
    });
  };

  const removeComponent = (category: keyof SelectedComponents) => {
    setSelectedComponents(prev => {
      const newComponents = { ...prev };
      delete newComponents[category];
      return newComponents;
    });
  };

  const removeComponentById = (component: PCComponent) => {
    setSelectedComponents((prev) => {
      const newComponents = { ...prev };

      if (component.category === "otros") {
        const others = newComponents.otros ?? [];
        const filtered = others.filter((item) => item.id !== component.id);
        if (filtered.length === 0) {
          delete newComponents.otros;
        } else {
          newComponents.otros = filtered;
        }
        return newComponents;
      }

      const selectedInCategory = newComponents[component.category];
      if (
        selectedInCategory &&
        !Array.isArray(selectedInCategory) &&
        selectedInCategory.id === component.id
      ) {
        delete newComponents[component.category];
      }
      return newComponents;
    });
  };

  const getTotal = () => {
    let total = 0;
    
    Object.values(selectedComponents).forEach(componentOrArray => {
      if (Array.isArray(componentOrArray)) {
        componentOrArray.forEach(comp => {
          total += comp.price;
        });
      } else if (componentOrArray) {
        total += componentOrArray.price;
      }
    });
    
    return total;
  };

  const clearBuild = () => {
    setSelectedComponents({});
  };

  return (
    <PCBuilderContext.Provider
      value={{
        selectedComponents,
        selectComponent,
        removeComponent,
        removeComponentById,
        getTotal,
        clearBuild,
      }}
    >
      {children}
    </PCBuilderContext.Provider>
  );
}

export function usePCBuilder() {
  const context = useContext(PCBuilderContext);
  if (context === undefined) {
    throw new Error('usePCBuilder must be used within a PCBuilderProvider');
  }
  return context;
}

