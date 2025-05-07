import { fetchProducts } from '@/lib/fetchProducts';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const busca = searchParams.get('busca')?.toLowerCase() || '';

    const produtos = await fetchProducts();
    const filtrados = produtos
        .filter((p) =>
            p.titulo.toLowerCase().includes(busca)
        )
        .map(({ slug, titulo, imagemPrincipal }) => ({
            slug,
            titulo,
            imagemPrincipal,
        }));

    return NextResponse.json(filtrados);
}
