'use client';

import Link from 'next/link';
import { formatPreco } from '@/lib/formatPrice';
import { Product } from '@/lib/fetchProducts';
import { WHATSAPP_NUMERO } from '@/lib/whatsapp';
import { useTaxa } from '@/app/context/TaxaContext';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const imagem = product.imagemPrincipal || '/fallback.png';
    const precoBase = product.promocao || product.valor;

    const precoNum = typeof precoBase === 'string'
        ? parseFloat(precoBase.replace(/[^\d,]/g, '').replace(',', '.'))
        : precoBase;

    const { taxa12x } = useTaxa();

    const mostrarParcelamento = precoNum > 50 && taxa12x !== null;
    const totalComJuros = precoNum * (1 + (taxa12x || 0) / 100);
    const parcela12x = totalComJuros / 12;

    const linkZap = `https://wa.me/${WHATSAPP_NUMERO}?text=Tenho%20interesse%20no%20produto%20${encodeURIComponent(product.titulo)}`;

    return (
        <div className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition bg-white flex flex-col h-full">
            <Link href={`/produto/${product.slug}`} className="block flex-1">
                <div className="relative aspect-square w-full bg-gray-100 flex items-center justify-center">
                    {/* Selo flutuante de promoção */}
                    {product.promocao && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-md flex items-center gap-1">
                            <span>🏷️</span> Promoção
                        </div>
                    )}
                    <img
                        src={imagem}
                        alt={product.titulo}
                        className="max-h-full max-w-full object-contain"
                    />
                </div>

                <div className="p-4">
                    <h2 className="text-lg font-semibold text-black mb-1">{product.titulo}</h2>

                    {product.cor && (
                        <p className="text-sm text-gray-700 mb-1">Cor: {product.cor}</p>
                    )}

                    <p className="text-sm text-gray-700 mb-2">{product.categoria}</p>

                    <p className="text-xl font-bold text-green-600">
                        {product.promocao ? (
                            <>
                                {formatPreco(product.promocao)} <span className="text-sm">no pix</span>{' '}
                                <span className="text-sm line-through text-gray-500">
                                    {formatPreco(product.valor)}
                                </span>
                            </>
                        ) : (
                            <>
                                {formatPreco(product.valor)} <span className="text-sm">no pix</span>
                            </>
                        )}
                    </p>

                    {mostrarParcelamento && (
                        <p className="mt-1 text-sm text-gray-800 flex items-center gap-1">
                            <span>💳</span>12x de <strong>{formatPreco(parcela12x)}</strong>
                        </p>
                    )}
                </div>
            </Link>

            <div className="p-4 pt-0">
                <a
                    href={linkZap}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center bg-green-500 hover:bg-green-600 text-white text-sm font-medium py-2 px-4 rounded transition"
                >
                    Comprar no WhatsApp
                </a>
            </div>
        </div>
    );
}
