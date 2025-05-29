'use client';

import { Product } from '@/lib/fetchProducts';
import ProductCard from './ProductCard';
import { isProdutoAtivo } from '@/lib/isProdutoAtivo';

interface ProdutosRelacionadosProps {
    produtoAtual: Product;
    todosProdutos: Product[];
}

export default function ProdutosRelacionados({ produtoAtual, todosProdutos }: ProdutosRelacionadosProps) {
    const relacionados = todosProdutos
        .filter((p) =>
            p.slug !== produtoAtual.slug &&
            p.categoria === produtoAtual.categoria &&
            (p.marca === produtoAtual.marca || p.cor === produtoAtual.cor) &&
            isProdutoAtivo(p)
        )
        .slice(0, 6);

    if (relacionados.length === 0) return null;

    return (
        <section className="mt-10">
            <h2 className="text-xl font-semibold mb-4">Produtos relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {relacionados.map((p) => (
                    <ProductCard key={p.slug} product={p} />
                ))}
            </div>
        </section>
    );
}
