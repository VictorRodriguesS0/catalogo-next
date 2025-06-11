// app/context/CatalogoContext.tsx
"use client";

import { createContext, useContext } from "react";
import { Product } from "@/lib/fetchProducts";
import { Taxa } from "@/lib/fetchTaxas";

// Tipo final com estrutura hierárquica
interface CategoriaComFilhos {
  id: number;
  nome: string;
  slug: string;
  parent: number;
  imagem: string | null;
  filhos: CategoriaComFilhos[];
}

interface CatalogoContextProps {
  produtos: Product[];
  categorias: CategoriaComFilhos[]; // ✅ tipo corrigido aqui
  marcas: string[];
  cores: string[];
  taxa12x: number | null;
  todasTaxas: Taxa[];
  carregando: boolean;
}

const CatalogoContext = createContext<CatalogoContextProps>({
  produtos: [],
  categorias: [],
  marcas: [],
  cores: [],
  taxa12x: null,
  todasTaxas: [],
  carregando: true,
});

type CatalogoInitialData = Omit<CatalogoContextProps, "carregando">;

export function CatalogoProvider({
  children,
  initialData,
}: {
  children: React.ReactNode;
  initialData: CatalogoInitialData;
}) {
  return (
    <CatalogoContext.Provider value={{ ...initialData, carregando: false }}>
      {children}
    </CatalogoContext.Provider>
  );
}

export function useCatalogo() {
  return useContext(CatalogoContext);
}
