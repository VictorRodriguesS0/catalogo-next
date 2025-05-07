import { fetchProducts } from '@/lib/fetchProducts';
import ProductCard from '@/app/components/ProductCard';
import Link from 'next/link';

export default async function Home({
    searchParams,
}: {
    searchParams?: { categoria?: string; busca?: string };
}) {
    const produtos = await fetchProducts();

    const categoria = typeof searchParams?.categoria === 'string'
        ? searchParams.categoria.toLowerCase()
        : '';

    const busca = typeof searchParams?.busca === 'string'
        ? searchParams.busca.toLowerCase()
        : '';

    const produtosFiltrados = produtos.filter((produto) => {
        const matchCategoria = categoria
            ? produto.categoria?.toLowerCase() === categoria
            : true;
        const matchBusca = busca
            ? produto.titulo.toLowerCase().includes(busca) ||
            produto.descricao?.toLowerCase().includes(busca) ||
            produto.categoria?.toLowerCase().includes(busca)
            : true;
        return matchCategoria && matchBusca;
    });

    return (
        <main className="max-w-6xl mx-auto p-4 font-sans text-black">
            {produtosFiltrados.length === 0 ? (
                <div className="text-center mt-20 space-y-4">
                    <p className="text-lg">
                        Nenhum produto encontrado para os filtros selecionados.
                    </p>
                    <Link
                        href="/"
                        className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                        Limpar filtros
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
            )}
        </main>
    );
}
