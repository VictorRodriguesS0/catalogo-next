// app/api/categorias/route.ts
import { fetchProducts } from '@/lib/fetchProducts';
import { NextResponse } from 'next/server';

export async function GET() {
    const produtos = await fetchProducts();
    const categorias = Array.from(new Set(produtos.map((p) => p.categoria).filter(Boolean)));
    return NextResponse.json(categorias);
}
