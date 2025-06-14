'use client';

import Link from 'next/link';
import Image from 'next/image';
import { formatPreco } from '@/lib/formatPrice';
import { Product } from '@/lib/fetchProductsWoo';
import { useCatalogo } from '@/app/context/CatalogoContext';
import { useComparar } from '@/app/context/CompararContext';
import { motion } from 'framer-motion';
import { loja } from '../config/lojaConfig';
import aliasesCores from '@/lib/aliasesCores';
import { RiSdCardMiniLine } from 'react-icons/ri';
import { MdMemory } from 'react-icons/md';
import { useMemo } from 'react';

interface ProductCardProps {
    product: Product;
    visualizacao?: 'grade' | 'lista';
}

export default function ProductCard({ product, visualizacao = 'grade' }: ProductCardProps) {
    const imagem = product.imagemPrincipal || '/fallback.png';
    const precoNum = product.promocao ?? product.valor ?? 0;
    const { taxa12x } = useCatalogo();
    const { comparar, adicionar, remover, modoComparar } = useComparar();
    const jaComparado = useMemo(
        () => comparar.some((p) => p.slug === product.slug),
        [comparar, product.slug]
    );


    const mostrarParcelamento = precoNum > 50 && taxa12x !== null;
    const totalComJuros = precoNum * (1 + (taxa12x || 0) / 100);
    const parcela12x = totalComJuros / 12;

    const linkZap = `https://wa.me/${loja.whatsapp}?text=Tenho%20interesse%20no%20produto%20${encodeURIComponent(product.titulo)}`;

    const isLista = visualizacao === 'lista';
    const corSlug = product.cor?.toLowerCase().replace(/[^a-z0-9]/g, '') ?? '';
    const corClasse = aliasesCores[corSlug as keyof typeof aliasesCores];

    const tituloLimitado = product.titulo.length > 70
        ? product.titulo.slice(0, 67) + '...'
        : product.titulo;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            className={`group border border-gray-200 hover:border-gray-400 rounded-2xl overflow-hidden shadow-sm bg-white transition cursor-pointer ${isLista ? 'flex flex-row w-full min-h-[160px]' : 'flex flex-col h-full w-full'} flex-grow`}
            style={{ height: '100%' }}
        >
            <Link href={`/produtos/${product.slug}`} className="block h-full w-full">
                <div className={`relative overflow-hidden ${isLista ? 'w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0 self-center' : 'w-full h-48 sm:h-56'} bg-gray-50 flex items-center justify-center`}>
                    {product.emPromocao && (
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
                        className={`transition-all duration-300 group-hover:scale-110 ${isLista ? 'object-cover' : 'object-contain'}`}
                    />
                </div>

                <div className="flex flex-col justify-between p-4 flex-1 min-w-0">
                    <h2 className="text-base font-semibold text-black leading-snug min-h-[3.5rem] sm:min-h-fit overflow-hidden">
                        {tituloLimitado}
                    </h2>

                    <div className="flex flex-wrap gap-2 text-[11px] font-medium text-gray-700 mt-2 items-center min-h-[1.5rem]">
                        {product.cor && (
                            <span className="bg-gray-100 px-2 py-0.5 rounded inline-flex items-center gap-1">
                                <span className={[
                                    'w-3 h-3 rounded-full border border-gray-300',
                                    corClasse || 'bg-gray-400'
                                ].join(' ')}></span>
                                {product.cor}
                            </span>
                        )}
                        {product.ram && (
                            <span className="bg-gray-100 px-2 py-0.5 rounded inline-flex items-center gap-1">
                                <MdMemory size={12} /> {product.ram}
                            </span>
                        )}
                        {product.armazenamento && (
                            <span className="bg-gray-100 px-2 py-0.5 rounded inline-flex items-center gap-1">
                                <RiSdCardMiniLine size={12} /> {product.armazenamento}
                            </span>
                        )}
                        {product.temNFC && <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded">NFC</span>}
                        {product.tem5g && <span className="bg-purple-100 text-purple-600 px-2 py-0.5 rounded">5G</span>}
                    </div>

                    <p className="text-xs text-gray-500 mt-1">{product.marca || ' '}</p>

                    <div className="mt-1 min-h-[4.5rem]">
                        {product.emPromocao && (
                            <p className="text-xs text-gray-400 line-through">
                                {formatPreco(product.valor)}
                            </p>
                        )}
                        <p className="text-lg font-bold text-green-600">
                            {formatPreco(precoNum)} <span className="text-sm">no pix</span>
                        </p>
                        {mostrarParcelamento && (
                            <p className="text-xs text-[#5e17eb] flex items-center gap-1 mt-1">
                                💳 12x de <strong>{formatPreco(parcela12x)}</strong>
                            </p>
                        )}
                    </div>
                </div>
            </Link>

            <div className="px-4 pb-4 mt-auto">
                <a
                    href={linkZap}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Fale agora no WhatsApp"
                    className="block w-full text-center bg-green-500 hover:bg-green-600 text-white text-sm font-medium py-2 px-4 rounded-md transition"
                >
                    Comprar no WhatsApp
                </a>

                {modoComparar && (
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            if (jaComparado) {
                                remover(product.slug);
                            } else {
                                adicionar(product);
                            }
                        }}
                        className={`w-full text-center border text-sm font-medium py-2 px-4 rounded-md mt-2 transition ${jaComparado ? 'border-red-500 text-red-600 hover:bg-red-100' : 'border-blue-500 text-blue-600 hover:bg-blue-100'}`}
                        aria-label={jaComparado ? 'Remover da comparação' : 'Selecionar para comparar'}
                    >
                        {jaComparado ? '✓ Remover da comparação' : '+ Selecionar para comparar'}
                    </button>
                )}
            </div>
        </motion.div>
    );
}
