import { fetchProducts } from '@/lib/fetchProductsWoo';
import { notFound } from 'next/navigation';
import ProductPageClient from './ProductPageClient';
import type { Metadata } from 'next';
import { formatPrecoToNumber } from '@/lib/formatPrice';

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;

    const produtos = await fetchProducts();
    const produto = produtos.find((p) => p.slug === slug);

    if (!produto) {
        return { title: 'Produto não encontrado' };
    }

    const preco = produto.promocao || produto.valor;
    const precoNumerico = formatPrecoToNumber(preco);

    function stripHTML(html: string) {
        return html.replace(/<[^>]*>?/gm, '').trim();
    }

    const tituloLimpo = stripHTML(produto.titulo);
    const descricaoLimpa = stripHTML(produto.descricao || '');


    return {
        metadataBase: new URL('https://lojinhaeletronicos.com'),
        title: `${tituloLimpo} | Lojinha Eletrônicos`,
        description:
            descricaoLimpa || 'Confira este produto incrível com envio para o DF.',
        openGraph: {
            title: tituloLimpo,
            description: descricaoLimpa,
            images: [
                {
                    url: produto.imagemPrincipal || '/fallback.png',
                    width: 800,
                    height: 600,
                    alt: tituloLimpo,
                },
            ],
            url: `https://lojinhaeletronicos.com/produtos/${produto.slug}`,
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
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const produtos = await fetchProducts();
    const produto = produtos.find((p) => p.slug === slug);

    if (!produto) return notFound();

    const imagens = [
        produto.imagemPrincipal,
        produto.imagem2,
        produto.imagem3,
        produto.imagem4,
    ].filter(Boolean) as string[];

    return (
        <main className="max-w-6xl mx-auto px-4 py-6 space-y-12">
            <ProductPageClient product={produto} imagens={imagens} todosProdutos={produtos} />
        </main>
    );
}
