'use client';

import { useSearchParams } from 'next/navigation';
import ProductCard from './ProductCard';
import { Product } from '@/lib/fetchProducts';

export default function ProductList({ produtos }: { produtos: Product[] }) {
    const searchParams = useSearchParams();
    const categoria = searchParams.get('categoria')?.toLowerCase() || '';
    const busca = searchParams.get('busca')?.toLowerCase() || '';

    const produtosFiltrados = produtos.filter((produto) => {
        const ehPromocao = categoria === 'promoções';
        const matchCategoria = ehPromocao
            ? !!produto.promocao
            : categoria
                ? produto.categoria?.toLowerCase() === categoria
                : true;

        const matchBusca = busca
            ? produto.titulo.toLowerCase().includes(busca) ||
            produto.descricao?.toLowerCase().includes(busca) ||
            produto.categoria?.toLowerCase().includes(busca)
            : true;

        return matchCategoria && matchBusca;
    });

    return produtosFiltrados.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 font-sans">
            {produtosFiltrados.map((produto) => (
                <ProductCard
                    key={produto.slug}
                    product={{
                        ...produto,
                        imagemPrincipal: produto.imagemPrincipal || '',
                    }}
                />
            ))}
        </div>
    ) : (
        <p className="text-center text-gray-600 text-sm">Nenhum produto encontrado.</p>
    );
}
