'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/lib/fetchProducts';

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
    const [comparar, setComparar] = useState<Product[]>([]);
    const [modoComparar, setModoComparar] = useState(false);

    useEffect(() => {
        const local = localStorage.getItem('comparar');
        if (local) {
            try {
                const parsed: Product[] = JSON.parse(local);
                setComparar(parsed);
            } catch (e) {
                console.error('Erro ao carregar comparação do localStorage:', e);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('comparar', JSON.stringify(comparar));
    }, [comparar]);

    const adicionar = (produto: Product) => {
        setComparar((prev) => {
            if (prev.find((p) => p.slug === produto.slug)) return prev;
            if (prev.length >= 3) return prev;
            return [...prev, produto];
        });
    };

    const remover = (slug: string) => {
        setComparar((prev) => prev.filter((p) => p.slug !== slug));
    };

    const limpar = () => setComparar([]);

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
