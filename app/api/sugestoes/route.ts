import { fetchProducts } from '@/lib/fetchProducts';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const busca = searchParams.get('busca')?.toLowerCase().trim() || '';

    // Rejeita buscas com menos de 2 caracteres
    if (busca.length < 2) {
        return NextResponse.json([]);
    }

    const produtos = await fetchProducts();

    const filtrados = produtos
        .filter((p) =>
            p.titulo.toLowerCase().includes(busca)
        )
        .slice(0, 10) // Limita a 10 sugestões
        .map(({ slug, titulo, imagemPrincipal }) => ({
            slug,
            titulo,
            imagemPrincipal,
        }));

    return NextResponse.json(filtrados);
}
