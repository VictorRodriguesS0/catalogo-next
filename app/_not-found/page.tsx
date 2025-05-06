import { fetchProducts } from '@/lib/fetchProducts';
import ProductCard from '@/app/components/ProductCard';

export default async function Home({
    searchParams,
}: {
    searchParams?: { categoria?: string; busca?: string };
}) {
    const produtos = await fetchProducts();

    const categoria = searchParams?.categoria?.toLowerCase() || '';
    const busca = searchParams?.busca?.toLowerCase() || '';

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
        <main className="max-w-6xl mx-auto p-4">
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
        </main>
    );
}
