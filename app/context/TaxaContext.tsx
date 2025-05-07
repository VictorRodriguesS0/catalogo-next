'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { fetchTaxas, Taxa } from '@/lib/fetchTaxas';

interface TaxaContextProps {
    taxa12x: number | null;
}

const TaxaContext = createContext<TaxaContextProps>({ taxa12x: null });

export function TaxaProvider({ children }: { children: React.ReactNode }) {
    const [taxa12x, setTaxa12x] = useState<number | null>(null);

    useEffect(() => {
        fetchTaxas().then((taxas) => {
            const t = taxas.find((t) => t.parcelas.replace('x', '') === '12');
            if (t) setTaxa12x(t.taxa);
        });
    }, []);

    return (
        <TaxaContext.Provider value={{ taxa12x }}>
            {children}
        </TaxaContext.Provider>
    );
}

export function useTaxa() {
    return useContext(TaxaContext);
}
