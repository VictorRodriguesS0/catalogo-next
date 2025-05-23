import { fetchProducts } from '@/lib/fetchProducts';
import { NextResponse } from 'next/server';

export async function GET() {
    const produtos = await fetchProducts();

    const estrutura: Record<string, Set<string>> = {};

    for (const p of produtos) {
        if (!p.categoria || String(p.inativo).toLowerCase() === 'true') continue;

        const categoria = p.categoria.trim();
        const subcategoria = p.subcategoria?.trim();

        if (!estrutura[categoria]) {
            estrutura[categoria] = new Set();
        }

        if (subcategoria) {
            estrutura[categoria].add(subcategoria);
        }
    }

    const resultado: Record<string, string[]> = {};
    for (const [categoria, subcategorias] of Object.entries(estrutura)) {
        resultado[categoria] = Array.from(subcategorias).sort();
    }

    return NextResponse.json(resultado);
}
