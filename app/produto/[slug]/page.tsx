import { fetchProducts } from '@/lib/fetchProducts';
import { notFound } from 'next/navigation';
import GaleriaProduto from '@/app/components/GaleriaProduto';
import ProductPageClient from './ProductPageClient';

export default async function ProductPage({
    params,
}: {
    params: { slug: string };
}) {
    const products = await fetchProducts();
    const product = products.find((p) => p.slug === params.slug);

    if (!product) return notFound();

    const imagens = [
        product.imagemPrincipal,
        product.imagem2,
        product.imagem3,
        product.imagem4,
    ].filter(Boolean);

    return <ProductPageClient product={product} imagens={imagens} />;
}
