'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { fetchProducts, Product } from '@/lib/fetchProducts';
import { fetchTaxas, Taxa } from '@/lib/fetchTaxas';

interface CatalogoContextProps {
    produtos: Product[];
    categorias: string[];
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

export function CatalogoProvider({ children }: { children: React.ReactNode }) {
    const [produtos, setProdutos] = useState<Product[]>([]);
    const [todasTaxas, setTodasTaxas] = useState<Taxa[]>([]);
    const [taxa12x, setTaxa12x] = useState<number | null>(null);

    const [categorias, setCategorias] = useState<string[]>([]);
    const [marcas, setMarcas] = useState<string[]>([]);
    const [cores, setCores] = useState<string[]>([]);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        async function carregarDados() {
            const produtos = await fetchProducts();
            setProdutos(produtos);

            const categoriasUnicas = Array.from(
                new Set(produtos.map((p) => p.categoria).filter((c): c is string => !!c))
            );
            const marcasUnicas = Array.from(
                new Set(produtos.map((p) => p.marca).filter((m): m is string => !!m))
            );
            const coresUnicas = Array.from(
                new Set(produtos.map((p) => p.cor).filter((c): c is string => !!c))
            );

            setCategorias(categoriasUnicas.sort());
            setMarcas(marcasUnicas.sort());
            setCores(coresUnicas.sort());
        }

        async function carregarTaxas() {
            const taxas = await fetchTaxas();
            setTodasTaxas(taxas);
            const t12 = taxas.find((t) => t.parcelas.replace('x', '') === '12');
            if (t12) setTaxa12x(t12.taxa);
        }

        Promise.all([carregarDados(), carregarTaxas()]).finally(() => setCarregando(false));
    }, []);

    return (
        <CatalogoContext.Provider
            value={{ produtos, categorias, marcas, cores, taxa12x, todasTaxas, carregando }}
        >
            {children}
        </CatalogoContext.Provider>
    );
}

export function useCatalogo() {
    return useContext(CatalogoContext);
}
