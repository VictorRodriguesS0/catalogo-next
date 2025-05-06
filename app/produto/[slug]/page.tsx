/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { fetchProducts } from '@/lib/fetchProducts';
import { notFound } from 'next/navigation';
import GaleriaProduto from '@/app/components/GaleriaProduto';
import { formatPreco } from '@/lib/formatPrice';

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
        <main className="p-6 max-w-5xl mx-auto font-sans">
            <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 max-w-md md:max-w-lg">
                    <GaleriaProduto imagens={imagens} titulo={product.titulo} />
                </div>
                <div className="flex-1">
                    <h1 className="text-4xl font-extrabold mb-4 text-gray-900 leading-tight">{product.titulo}</h1>
                    {product.cor && (
                        <p className="text-sm text-gray-500 mb-1">Cor: {product.cor}</p>
                    )}
                    <p className="text-sm text-gray-500 mb-4">
                        Categoria: {product.categoria}
                    </p>
                    <p className="text-3xl font-bold text-green-600 mb-6">
                        {product.promocao ? (
                            <>
                                {formatPreco(product.promocao)}{' '}
                                <span className="text-base line-through text-gray-400">
                                    {formatPreco(product.valor)}
                                </span>
                            </>
                        ) : (
                            formatPreco(product.valor)
                        )}
                    </p>
                    {product.descricao && (
                        <div
                            className="prose prose-sm md:prose lg:prose-lg max-w-none leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: product.descricao }}
                        />
                    )}

                    <a
                        href={`https://wa.me/5561983453409?text=Tenho interesse no produto ${encodeURIComponent(product.titulo)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-6 inline-block w-full bg-green-600 hover:bg-green-700 text-white text-center font-semibold py-3 px-4 rounded-xl transition"
                    >
                        Comprar no WhatsApp
                    </a>
                </div>
            </div>
        </main>
    );
};

export default ProductPage;
