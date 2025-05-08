import { fetchProducts } from '@/lib/fetchProducts';
import { NextResponse } from 'next/server';

export async function GET() {
    const produtos = await fetchProducts();

    const categorias = Array.from(
        new Set(produtos.map((p) => p.categoria).filter(Boolean))
    );

    const temPromocao = produtos.some((p) => !!p.promocao);
    if (temPromocao) categorias.unshift('Promoções'); // Adiciona no topo

    return NextResponse.json(categorias);
}
