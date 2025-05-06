import { fetchProducts } from '@/lib/fetchProducts';
import { notFound } from 'next/navigation';
import GaleriaProduto from '../../components/GaleriaProduto';
import { formatPreco } from '@/lib/formatPrice';

interface Props {
    params: { slug: string };
}

export default async function ProductPage({ params }: Props) {
    const products = await fetchProducts();
    const product = products.find((p) => p.slug === params.slug);

    if (!product) return notFound();

    const galeria = [
        product.imagemPrincipal,
        product.imagem2,
        product.imagem3,
        product.imagem4,
    ].filter(Boolean) as string[];

    return (
        <main className="p-6 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                    <GaleriaProduto imagens={galeria} titulo={product.titulo} />
                </div>

                <div className="flex-1">
                    <h1 className="text-3xl font-bold mb-2">{product.titulo}</h1>
                    {product.cor && (
                        <p className="text-sm text-gray-500 mb-1">Cor: {product.cor}</p>
                    )}
                    <p className="text-md text-gray-500 mb-4">
                        Categoria: {product.categoria}
                    </p>

                    <p className="text-2xl font-bold text-green-600 mb-4">
                        {product.promocao ? (
                            <>
                                {formatPreco(product.promocao)}{' '}
                                <span className="text-sm line-through text-gray-500">
                                    {formatPreco(product.valor)}
                                </span>
                            </>
                        ) : (
                            <>{formatPreco(product.valor)}</>
                        )}
                    </p>

                    {product.descricao && (
                        <div
                            className="prose prose-sm md:prose lg:prose-lg max-w-none"
                            dangerouslySetInnerHTML={{ __html: product.descricao }}
                        />
                    )}
                </div>
            </div>
        </main>
    );
}
