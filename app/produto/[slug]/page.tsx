/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { fetchProducts } from '@/lib/fetchProducts';
import { notFound } from 'next/navigation';
import GaleriaProduto from '@/app/components/GaleriaProduto';
import { formatPreco } from '@/lib/formatPrice';

interface PageProps {
    params: {
        slug: string;
    };
}

const ProductPage = async (...args) => {
    const { params } = await args[0];
    const { slug } = params;

    const products = await fetchProducts();
    const product = products.find((p) => p.slug === slug);

    if (!product) return notFound();

    const imagens = [
        product.imagemPrincipal,
        product.imagem2,
        product.imagem3,
        product.imagem4,
    ].filter(Boolean);

    return (
        <main className="px-4 py-10 max-w-6xl mx-auto font-sans">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                <GaleriaProduto imagens={imagens} titulo={product.titulo} />

                <div className="space-y-4">
                    <h1 className="text-3xl font-bold text-gray-900">{product.titulo}</h1>

                    {product.cor && (
                        <p className="text-sm text-gray-500">Cor: {product.cor}</p>
                    )}

                    <p className="text-sm text-gray-500">Categoria: {product.categoria}</p>

                    <div className="text-3xl font-bold text-green-600">
                        {product.promocao ? (
                            <>
                                {formatPreco(product.promocao)}{' '}
                                <span className="text-base line-through text-gray-400 ml-2">
                                    {formatPreco(product.valor)}
                                </span>
                            </>
                        ) : (
                            formatPreco(product.valor)
                        )}
                    </div>

                    {product.descricao && (
                        <div
                            className="prose prose-sm md:prose lg:prose-lg max-w-none text-gray-700"
                            dangerouslySetInnerHTML={{ __html: product.descricao }}
                        />
                    )}

                    <a
                        href={`https://wa.me/5561983453409?text=Tenho interesse no produto ${encodeURIComponent(product.titulo)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block w-full bg-green-600 hover:bg-green-700 text-white text-center font-semibold py-3 px-4 rounded-xl transition"
                    >
                        Comprar no WhatsApp
                    </a>
                </div>
            </div>
        </main>
    );
};

export default ProductPage;
