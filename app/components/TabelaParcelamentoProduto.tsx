'use client';

import { useRef, useState } from 'react';
import * as htmlToImage from 'html-to-image';
import { Camera } from 'lucide-react';
import { Product } from '@/lib/fetchProductsWoo';
import { useCatalogo } from '@/app/context/CatalogoContext';
import { MdMemory } from 'react-icons/md';
import { RiSdCardMiniLine } from 'react-icons/ri';
import { motion, AnimatePresence } from 'framer-motion';
import aliasesCores from '@/lib/aliasesCores';
import Image from 'next/image';
import TabelaParcelamento from './TabelaParcelamento';

interface Props {
    product: Product;
    preco: number;
    mostrarTaxa: boolean;
    verMais: boolean;
    onToggleVerMais: () => void;
    onToggleMostrarTaxa: () => void;
}

export default function TabelaParcelamentoProduto({
    product,
    preco,
    mostrarTaxa,
    verMais,
    onToggleVerMais,
    onToggleMostrarTaxa,
}: Props) {
    const ref = useRef<HTMLDivElement>(null);
    const { todasTaxas } = useCatalogo();
    const [copiado, setCopiado] = useState<null | 'texto' | 'imagem'>(null);

    const isMobile =
        typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const suportaClipboard =
        typeof navigator !== 'undefined' && !!navigator.clipboard && !!window.ClipboardItem;
    const taxasVisiveis = verMais ? todasTaxas : todasTaxas.slice(0, 12);

    const gerarImagem = async () => {
        if (!ref.current) return;
        try {
            const { width, height } = ref.current.getBoundingClientRect();
            const blob = await htmlToImage.toBlob(ref.current, {
                backgroundColor: '#ffffff',
                pixelRatio: window.devicePixelRatio || 2,
                width,
                height,
            });
            if (!blob) return alert('Erro ao gerar imagem');

            if (!suportaClipboard || isMobile) {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `${product.titulo}-parcelamento.png`;
                link.click();
            } else {
                await navigator.clipboard.write([
                    new ClipboardItem({ 'image/png': blob }),
                ]);
                setCopiado('imagem');
                setTimeout(() => setCopiado(null), 2000);
            }
        } catch (err) {
            console.error('Erro ao gerar imagem:', err);
            alert('Erro ao gerar o print da tabela. Tente novamente.');
        }
    };

    const copiarTexto = async (texto: string) => {
        try {
            if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(texto);
                setCopiado('texto');
                setTimeout(() => setCopiado(null), 2000);
            } else {
                console.warn('Clipboard API não disponível');
            }
        } catch (err) {
            console.error('Erro ao copiar texto:', err);
        }
    };

    const corSlug = product.cor?.toLowerCase().replace(/[^a-z0-9]/g, '') ?? '';
    const corClasse = aliasesCores[corSlug as keyof typeof aliasesCores] || 'bg-gray-400';
    const imagem = product.imagemPrincipal;

    return (
        <div className="overflow-x-auto -mx-2 sm:mx-0">
            <div ref={ref} className="bg-white p-4 rounded-xl shadow-md border text-center">
                {/* CABEÇALHO COM PRODUTO */}
                <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-center gap-4 text-sm text-[#2e1065]">
                    {imagem && (
                        <div className="relative w-20 h-20 flex-shrink-0 mx-auto">
                            <Image src={imagem} alt={product.titulo} fill className="object-contain rounded" />
                        </div>
                    )}

                    <div className="flex flex-col items-center justify-center gap-2">
                        <h2 className="text-lg font-bold">{product.titulo}</h2>
                        <div className="flex flex-wrap justify-center items-center gap-2">
                            {product.armazenamento && (
                                <span className="bg-gray-100 px-2 py-0.5 rounded inline-flex items-center gap-1">
                                    <RiSdCardMiniLine size={14} /> {product.armazenamento}
                                </span>
                            )}
                            {product.ram && (
                                <span className="bg-gray-100 px-2 py-0.5 rounded inline-flex items-center gap-1">
                                    <MdMemory size={14} /> {product.ram}
                                </span>
                            )}
                            {product.cor && (
                                <span className="bg-gray-100 px-2 py-0.5 rounded inline-flex items-center gap-1">
                                    <span className={`w-3 h-3 rounded-full border border-gray-300 ${corClasse}`} />
                                    {product.cor}
                                </span>
                            )}
                            {product.tem5g && <span className="bg-purple-100 text-purple-600 px-2 py-0.5 rounded">5G</span>}
                            {product.temNFC && <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded">NFC</span>}
                        </div>
                    </div>
                </div>

                {/* TABELA DE PARCELAMENTO */}
                <div className="overflow-x-auto -mx-2 sm:mx-0">
                    <TabelaParcelamento
                        preco={preco}
                        taxas={taxasVisiveis}
                        mostrarTaxa={mostrarTaxa}
                        textoTotal="Total no Cartão"
                        onCopiarTexto={copiarTexto}
                    />
                </div>

                <div className="py-4 flex justify-center border-t mt-4">
                    <img src="/logo.png" alt="Logo" className="h-8" />
                </div>
            </div>

            {/* AÇÕES */}
            <div className="mt-4 text-center flex flex-wrap justify-center gap-4 items-center text-[#2e1065]">
                <button onClick={onToggleVerMais} className="text-xs underline hover:text-blue-800">
                    {verMais ? 'Mostrar menos parcelas' : 'Ver mais parcelas'}
                </button>
                {verMais && (
                    <button onClick={onToggleMostrarTaxa} className="text-xs underline hover:text-gray-800">
                        {mostrarTaxa ? 'Ocultar taxas' : 'Mostrar taxas'}
                    </button>
                )}
                <button
                    onClick={gerarImagem}
                    className="text-[10px] underline hover:text-black flex items-center gap-1"
                >
                    <Camera size={12} /> {isMobile ? 'Baixar imagem' : 'Copiar print'}
                </button>
            </div>

            <AnimatePresence>
                {copiado && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-md z-50"
                    >
                        {copiado === 'imagem' ? 'Imagem copiada!' : 'Texto copiado!'}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
