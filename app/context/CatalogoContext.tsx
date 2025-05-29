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
            const todos: Product[] = await fetchProducts();
            const ativos: Product[] = todos.filter(
                (p) => p.disponivel !== false && String(p.inativo).toLowerCase() !== 'true'
            );

            setProdutos(ativos);

            const categoriasSet = new Set<string>();
            const marcasSet = new Set<string>();
            const coresSet = new Set<string>();

            ativos.forEach((p) => {
                if (p.categoria) categoriasSet.add(p.categoria);
                if (p.marca) marcasSet.add(p.marca);
                if (p.cor) coresSet.add(p.cor);
            });

            setCategorias(Array.from(categoriasSet).sort());
            setMarcas(Array.from(marcasSet).sort());
            setCores(Array.from(coresSet).sort());
        }

        async function carregarTaxas() {
            const taxas = await fetchTaxas();
            setTodasTaxas(taxas);

            const t12 = taxas.find((t) => t.parcelas.replace('x', '') === '12');
            if (t12) setTaxa12x(t12.taxa);
        }

        Promise.all([carregarDados(), carregarTaxas()]).finally(() => {
            setCarregando(false);
        });
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
