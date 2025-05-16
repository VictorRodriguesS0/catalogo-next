import { fetchProducts } from '@/lib/fetchProducts';
import { notFound } from 'next/navigation';
import ProductPageClient from './ProductPageClient';
import type { Metadata } from 'next';
import { formatPrecoToNumber } from '@/lib/formatPrice';

export async function generateMetadata({
    params,
}: {
    params: { slug?: string };
}): Promise<Metadata> {
    if (!params?.slug) return { title: 'Produto não encontrado' };

    const produtos = await fetchProducts();
    const produto = produtos.find((p) => p.slug === params.slug);

    if (!produto) return { title: 'Produto não encontrado' };

    const preco = produto.promocao || produto.valor;
    const precoNumerico = formatPrecoToNumber(preco);

    return {
        title: `${produto.titulo} | Lojinha Eletrônicos`,
        description:
            produto.descricao ||
            'Confira este produto incrível com envio para o DF, nota fiscal e garantia.',
        openGraph: {
            title: produto.titulo,
            description: produto.descricao || '',
            images: [
                {
                    url: produto.imagemPrincipal || '/fallback.png',
                    width: 800,
                    height: 600,
                    alt: produto.titulo,
                },
            ],
            url: `https://catalogo-next.netlify.app/produtos/${produto.slug}`,
            type: 'website',
        },
        other: {
            'product:availability': 'in stock',
            'product:price:amount': precoNumerico.toFixed(2),
            'product:price:currency': 'BRL',
        },
    };
}

export default async function ProductPage({
    params,
}: {
    params: { slug?: string };
}) {
    if (!params?.slug) return notFound();

    const produtos = await fetchProducts();
    const produto = produtos.find((p) => p.slug === params.slug);

    if (!produto) return notFound();

    const imagens = [
        produto.imagemPrincipal,
        produto.imagem2,
        produto.imagem3,
        produto.imagem4,
    ].filter(Boolean) as string[];

    return <ProductPageClient product={produto} imagens={imagens} />;
}
