'use client';

import Link from 'next/link';
import { formatPreco } from '@/lib/formatPrice';
import { Product } from '@/lib/fetchProducts';
import { WHATSAPP_NUMERO } from '@/lib/whatsapp';
import { useCatalogo } from '@/app/context/CatalogoContext';
import { motion } from 'framer-motion';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const imagem = product.imagemPrincipal || '/fallback.png';
    const precoBase = product.promocao || product.valor;

    const precoNum =
        typeof precoBase === 'string'
            ? parseFloat(precoBase.replace(/[^\d,]/g, '').replace(',', '.'))
            : precoBase;

    const { taxa12x } = useCatalogo();

    const mostrarParcelamento = precoNum > 50 && taxa12x !== null;
    const totalComJuros = precoNum * (1 + (taxa12x || 0) / 100);
    const parcela12x = totalComJuros / 12;

    const linkZap = `https://wa.me/${WHATSAPP_NUMERO}?text=Tenho%20interesse%20no%20produto%20${encodeURIComponent(
        product.titulo
    )}`;

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="flex flex-col h-full w-full border border-gray-200 hover:border-gray-400 rounded-2xl overflow-hidden shadow-sm bg-white transition"
        >
            <Link href={`/produto/${product.slug}`} className="flex-1 flex flex-col">
                <div className="relative aspect-[4/3] w-full bg-gray-50 flex items-center justify-center">
                    {product.promocao && (
                        <div className="absolute top-2 right-2 z-10">
                            <div className="bg-red-600 text-white text-[9px] sm:text-xs font-bold px-2 py-0.5 rounded shadow-sm">
                                🏷️ Promoção
                            </div>
                        </div>
                    )}

                    <img
                        src={imagem}
                        alt={product.titulo}
                        loading="lazy"
                        className="w-full h-full object-cover transition-all duration-200 rounded-t-xl"
                    />
                </div>

                <div className="p-4 flex flex-col gap-1">
                    <h2 className="text-base font-semibold text-black line-clamp-2 min-h-[48px]">
                        {product.titulo}
                    </h2>

                    <p className="text-xs text-gray-600 min-h-[18px]">
                        {product.cor ? `Cor: ${product.cor}` : '\u00A0'}
                    </p>

                    <p className="text-xs text-gray-500 min-h-[18px]">
                        {product.categoria || '\u00A0'}
                    </p>

                    <p className="text-lg font-bold text-green-600">
                        {product.promocao ? (
                            <>
                                {formatPreco(product.promocao)}{' '}
                                <span className="text-sm">no pix</span>{' '}
                                <span className="text-xs line-through text-gray-400 ml-1">
                                    {formatPreco(product.valor)}
                                </span>
                            </>
                        ) : (
                            <>
                                {formatPreco(product.valor)}{' '}
                                <span className="text-sm">no pix</span>
                            </>
                        )}
                    </p>

                    {mostrarParcelamento ? (
                        <p className="text-xs text-gray-700 flex items-center gap-1 min-h-[18px]">
                            💳 12x de <strong>{formatPreco(parcela12x)}</strong>
                        </p>
                    ) : (
                        <div className="min-h-[18px]" />
                    )}
                </div>
            </Link>

            <div className="p-4 pt-0">
                <a
                    href={linkZap}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Fale agora no WhatsApp"
                    className="block w-full text-center bg-green-500 hover:bg-green-600 text-white text-sm font-medium py-2 px-4 rounded-md transition"
                >
                    Comprar no WhatsApp
                </a>
            </div>
        </motion.div>
    );
}
