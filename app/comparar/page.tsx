'use client';

import { useComparar } from '@/app/context/CompararContext';
import Image from 'next/image';
import { formatPreco } from '@/lib/formatPrice';
import { useCatalogo } from '@/app/context/CatalogoContext';
import Link from 'next/link';

export default function CompararPage() {
    const { comparar, remover, limpar } = useComparar();
    const { taxa12x } = useCatalogo();

    if (comparar.length === 0) {
        return (
            <div className="text-center text-gray-500 mt-10">
                Nenhum produto selecionado para comparação.
            </div>
        );
    }

    return (
        <div className="space-y-6 font-sans">
            <h1 className="text-2xl font-bold">Comparar Produtos</h1>

            <div className="overflow-x-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 min-w-[640px]">
                    {comparar.map((produto) => {
                        const precoPix = produto.promocao ?? produto.valor;
                        const total = precoPix * (1 + (taxa12x || 0) / 100);
                        const parcela = total / 12;

                        return (
                            <div
                                key={produto.slug}
                                className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm flex flex-col h-full"
                            >
                                <div className="relative w-full h-40 mb-4 bg-gray-50">
                                    <Image
                                        src={produto.imagemPrincipal || '/fallback.png'}
                                        alt={produto.titulo}
                                        fill
                                        className="object-contain"
                                    />
                                </div>

                                <h2 className="text-sm font-semibold mb-2 line-clamp-2">
                                    <Link href={`/produtos/${produto.slug}`} className="hover:underline">
                                        {produto.titulo}
                                    </Link>
                                </h2>

                                <ul className="text-xs text-gray-700 space-y-1 flex-1">
                                    {produto.marca && <li><strong>Marca:</strong> {produto.marca}</li>}
                                    {produto.cor && <li><strong>Cor:</strong> {produto.cor}</li>}
                                    {produto.armazenamento && <li><strong>Armazenamento:</strong> {produto.armazenamento}</li>}
                                    {produto.ram && <li><strong>RAM:</strong> {produto.ram}</li>}
                                    <li><strong>5G:</strong> {produto.tem5g ? 'Sim' : 'Não'}</li>
                                    <li><strong>NFC:</strong> {produto.temNFC ? 'Sim' : 'Não'}</li>
                                    <li><strong>Pix:</strong> {formatPreco(precoPix)}</li>
                                    <li><strong>12x:</strong> {formatPreco(parcela)}</li>
                                </ul>

                                <button
                                    onClick={() => remover(produto.slug)}
                                    className="mt-4 text-xs text-red-500 hover:underline"
                                >
                                    Remover da comparação
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="text-center">
                <button
                    onClick={limpar}
                    className="text-sm text-red-600 hover:underline"
                >
                    Limpar comparação
                </button>
            </div>
        </div>
    );
}
