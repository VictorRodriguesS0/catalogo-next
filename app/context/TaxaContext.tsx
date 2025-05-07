'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { fetchTaxas, Taxa } from '@/lib/fetchTaxas';

interface TaxaContextProps {
    taxa12x: number | null;
    todasTaxas: Taxa[];
}

const TaxaContext = createContext<TaxaContextProps>({ taxa12x: null, todasTaxas: [] });

export function TaxaProvider({ children }: { children: React.ReactNode }) {
    const [taxa12x, setTaxa12x] = useState<number | null>(null);
    const [todasTaxas, setTodasTaxas] = useState<Taxa[]>([]);

    useEffect(() => {
        fetchTaxas().then((taxas) => {
            setTodasTaxas(taxas);
            const t = taxas.find((t) => t.parcelas.replace('x', '') === '12');
            if (t) setTaxa12x(t.taxa);
        });
    }, []);

    return (
        <TaxaContext.Provider value={{ taxa12x, todasTaxas }}>
            {children}
        </TaxaContext.Provider>
    );
}

export function useTaxa() {
    return useContext(TaxaContext);
}
