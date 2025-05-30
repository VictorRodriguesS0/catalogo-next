// lib/getCatalogoData.ts
import { fetchProducts } from './fetchProducts';
import { fetchTaxas } from './fetchTaxas';

export async function getCatalogoData() {
    const produtos = await fetchProducts();
    const ativos = produtos.filter(
        (p) => p.disponivel !== false && String(p.inativo).toLowerCase() !== 'true'
    );

    const categorias = Array.from(new Set(ativos.map(p => p.categoria).filter(Boolean))).sort();
    const marcas = Array.from(new Set(ativos.map(p => p.marca).filter(Boolean))) as string[];
    const cores = Array.from(new Set(ativos.map(p => p.cor).filter(Boolean))) as string[];


    const taxas = await fetchTaxas();
    const t12 = taxas.find((t) => t.parcelas.replace('x', '') === '12');

    return {
        produtos: ativos,
        categorias,
        marcas,
        cores,
        todasTaxas: taxas,
        taxa12x: t12?.taxa || null,
    };
}
