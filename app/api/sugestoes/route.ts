import { fetchProducts } from '@/lib/fetchProductsWoo';
import { isProdutoAtivo } from '@/lib/isProdutoAtivo';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const busca = searchParams.get('busca')?.toLowerCase().trim() || '';

    if (busca.length < 2) {
        return NextResponse.json([]);
    }

    const todosProdutos = await fetchProducts();
    const produtosAtivos = todosProdutos.filter(isProdutoAtivo);

    const filtrados = produtosAtivos
        .filter((p) => p.titulo.toLowerCase().includes(busca))
        .slice(0, 10)
        .map(({ slug, titulo, imagemPrincipal }) => ({
            slug,
            titulo,
            imagemPrincipal,
        }));

    return NextResponse.json(filtrados);
}
