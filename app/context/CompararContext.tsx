'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Product } from '@/lib/fetchProducts';
import { useCatalogo } from './CatalogoContext';

interface CompararContextType {
    comparar: Product[];
    adicionar: (produto: Product) => void;
    remover: (slug: string) => void;
    limpar: () => void;
    modoComparar: boolean;
    setModoComparar: (ativo: boolean) => void;
}

const CompararContext = createContext<CompararContextType | undefined>(undefined);

export const CompararProvider = ({ children }: { children: React.ReactNode }) => {
    const { produtos } = useCatalogo();
    const [slugsComparar, setSlugsComparar] = useState<string[]>([]);
    const [modoComparar, setModoComparar] = useState(false);

    // Reconstrói a lista de produtos a partir dos slugs + contexto
    const comparar = produtos.filter((p) => slugsComparar.includes(p.slug));

    useEffect(() => {
        const local = localStorage.getItem('comparar');
        if (local) {
            try {
                const parsed: string[] = JSON.parse(local);
                setSlugsComparar(parsed);
            } catch (e) {
                console.error('Erro ao carregar comparação do localStorage:', e);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('comparar', JSON.stringify(slugsComparar));
    }, [slugsComparar]);

    const adicionar = (produto: Product) => {
        setSlugsComparar((prev) => {
            if (prev.includes(produto.slug)) return prev;
            if (prev.length >= 3) return prev;
            return [...prev, produto.slug];
        });
    };

    const remover = (slug: string) => {
        setSlugsComparar((prev) => prev.filter((s) => s !== slug));
    };

    const limpar = () => setSlugsComparar([]);

    return (
        <CompararContext.Provider
            value={{
                comparar,
                adicionar,
                remover,
                limpar,
                modoComparar,
                setModoComparar,
            }}
        >
            {children}
        </CompararContext.Provider>
    );
};

export const useComparar = (): CompararContextType => {
    const context = useContext(CompararContext);
    if (!context) {
        throw new Error('useComparar deve ser usado dentro de CompararProvider');
    }
    return context;
};
