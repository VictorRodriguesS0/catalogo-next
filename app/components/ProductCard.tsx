'use client';

import Link from 'next/link';
import Image from 'next/image';
import { formatPreco } from '@/lib/formatPrice';
import { Product } from '@/lib/fetchProducts';
import { WHATSAPP_NUMERO } from '@/lib/whatsapp';
import { useCatalogo } from '@/app/context/CatalogoContext';
import { motion } from 'framer-motion';

interface ProductCardProps {
    product: Product;
    visualizacao?: 'grade' | 'lista';
}

export default function ProductCard({ product, visualizacao = 'grade' }: ProductCardProps) {
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

    const isLista = visualizacao === 'lista';

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className={`border border-gray-200 hover:border-gray-400 rounded-2xl overflow-hidden shadow-sm bg-white transition
        ${isLista ? 'flex flex-row w-full min-h-[160px]' : 'flex flex-col h-full w-full'}`}
        >
            {/* Imagem */}
            <div
                className={`relative ${isLista
                        ? 'w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0 self-center'
                        : 'w-full h-48 sm:h-56'
                    } bg-gray-50 flex items-center justify-center`}
            >
                {product.promocao && (
                    <div className="absolute top-2 right-2 z-10">
                        <div className="bg-red-600 text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded shadow-sm">
                            🏷️ Promoção
                        </div>
                    </div>
                )}

                <Image
                    src={imagem}
                    alt={product.titulo}
                    fill
                    sizes={isLista ? '160px' : '(max-width: 768px) 50vw, 25vw'}
                    className={`transition-all duration-200 ${isLista ? 'object-cover' : 'object-contain'}`}
                />
            </div>

            {/* Conteúdo */}
            <div className="flex flex-col justify-between p-4 flex-1 min-w-0">
                <Link href={`/produtos/${product.slug}`} className="block">
                    <h2 className="text-base font-semibold text-black line-clamp-2 min-h-[48px]">
                        {product.titulo}
                    </h2>

                    <p className="text-xs text-gray-600 mt-1">
                        {product.cor ? `Cor: ${product.cor}` : '\u00A0'}
                    </p>

                    <p className="text-xs text-gray-500">{product.categoria || '\u00A0'}</p>

                    <p className="text-lg font-bold text-green-600 mt-1">
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

                    {mostrarParcelamento && (
                        <p className="text-xs text-gray-700 flex items-center gap-1 mt-1">
                            💳 12x de <strong>{formatPreco(parcela12x)}</strong>
                        </p>
                    )}
                </Link>

                <div className="mt-4">
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
            </div>
        </motion.div>
    );
}
