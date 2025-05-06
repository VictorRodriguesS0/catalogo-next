// app/components/ProductCard.tsx

import Link from 'next/link';
import { formatPreco } from '@/lib/formatPrice';
import { Product } from '@/lib/fetchProducts';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const imagem = product.imagemPrincipal || '/fallback.png';

    return (
        <Link
            href={`/produto/${product.slug}`}
            className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition block"
        >
            <img
                src={imagem}
                alt={product.titulo}
                className="w-full h-48 object-cover bg-gray-100"
            />
            <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-1">
                    {product.titulo}
                </h2>
                {product.cor && (
                    <p className="text-sm text-gray-500 mb-1">Cor: {product.cor}</p>
                )}
                <p className="text-sm text-gray-500 mb-2">{product.categoria}</p>
                <p className="text-xl font-bold text-green-600">
                    {product.promocao ? (
                        <>
                            {formatPreco(product.promocao)}{' '}
                            <span className="text-sm line-through text-gray-400">
                                {formatPreco(product.valor)}
                            </span>
                        </>
                    ) : (
                        formatPreco(product.valor)
                    )}
                </p>
            </div>
        </Link>
    );
}
