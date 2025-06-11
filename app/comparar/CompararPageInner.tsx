'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatPreco } from '@/lib/formatPrice';
import { useComparar } from '@/app/context/CompararContext';
import { useCatalogo } from '@/app/context/CatalogoContext';
import { useSearchParams, usePathname } from 'next/navigation';
import { Product } from '@/lib/fetchProductsWoo';

export default function CompararPageInner() {
    const { comparar, adicionar, remover, limpar } = useComparar();
    const { produtos: todosProdutos } = useCatalogo();
    const pathname = usePathname();
    const [buscas, setBuscas] = useState<string[]>(['', '', '']);
    const [visivel, setVisivel] = useState<number | null>(null);

    const wrapperRefs: React.RefObject<HTMLDivElement | null>[] = [
        useRef(null),
        useRef(null),
        useRef(null),
    ];

    const searchParams = useSearchParams();

    const substituirProduto = (index: number, produto: Product) => {
        const atual = [...comparar];
        const existente = atual.find((p) => p.slug === produto.slug);
        if (existente) return;

        limpar();
        const atualizados = [...atual];
        atualizados[index] = produto;
        atualizados.forEach((p) => p && adicionar(p));

        const novasBuscas = [...buscas];
        novasBuscas[index] = produto.titulo;
        setBuscas(novasBuscas);
    };

    useEffect(() => {
        const slugs = searchParams.get('produtos')?.split(',') || [];
        if (slugs.length > 0 && comparar.length === 0 && todosProdutos.length > 0) {
            const buscasTemp = ['', '', ''];
            slugs.slice(0, 3).forEach((slug, i) => {
                const p = todosProdutos.find((prod) => prod.slug === slug);
                if (p) {
                    adicionar(p);
                    buscasTemp[i] = p.titulo;
                }
            });
            setBuscas(buscasTemp);
        }
    }, [searchParams, todosProdutos]);

    useEffect(() => {
        const fecharSugestoes = (e: MouseEvent) => {
            if (!wrapperRefs.some((ref) => ref.current?.contains(e.target as Node))) {
                setVisivel(null);
            }
        };
        document.addEventListener('mousedown', fecharSugestoes);
        return () => document.removeEventListener('mousedown', fecharSugestoes);
    }, []);

    useEffect(() => {
        atualizarURL();
    }, [comparar]);

    const atualizarURL = () => {
        const slugs = comparar.map((p) => p?.slug).filter((slug, i, arr) => slug && arr.indexOf(slug) === i);
        const newUrl = slugs.length > 0 ? `${pathname}?produtos=${slugs.join(',')}` : pathname;
        window.history.replaceState({}, '', newUrl);
    };

    const gerarLinkCompartilhamento = () => {
        const slugs = comparar.map((p) => p.slug).filter(Boolean);
        const url = new URL(window.location.href);
        url.searchParams.set('produtos', slugs.join(','));
        return url.toString();
    };

    const handleCompartilhar = () => {
        const link = gerarLinkCompartilhamento();
        navigator.clipboard.writeText(link).then(() => {
            alert('Link de comparação copiado para a área de transferência!');
        });
    };

    return (
        <div className="font-sans max-w-7xl mx-auto p-4 space-y-6">
            <h1 className="text-2xl font-bold mb-2">Comparar Produtos</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[0, 1, 2].map((i) => (
                    <div key={i} ref={wrapperRefs[i]} className="relative">
                        <input
                            type="text"
                            placeholder={`Produto ${i + 1}`}
                            className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition duration-200 focus:border-blue-400"
                            value={buscas[i]}
                            onChange={(e) => {
                                const novas = [...buscas];
                                novas[i] = e.target.value;
                                setBuscas(novas);
                                setVisivel(i);
                                atualizarURL();
                            }}
                            onFocus={() => {
                                setVisivel(i);
                                atualizarURL();
                            }}
                        />

                        {visivel === i && buscas[i] && (
                            <ul className="absolute z-30 mt-1 bg-white border border-gray-200 rounded shadow max-h-60 overflow-y-auto w-full text-sm">
                                {todosProdutos
                                    .filter(
                                        (p) =>
                                            p.titulo.toLowerCase().includes(buscas[i].toLowerCase()) &&
                                            !comparar.some((c) => c.slug === p.slug)
                                    )
                                    .slice(0, 10)
                                    .map((p) => (
                                        <li
                                            key={p.slug}
                                            onClick={() => substituirProduto(i, p)}
                                            className="px-3 py-2 hover:bg-blue-50 cursor-pointer flex items-center gap-2"
                                        >
                                            <div className="w-8 h-8 relative flex-shrink-0">
                                                <Image
                                                    src={p.imagemPrincipal || '/fallback.png'}
                                                    alt={p.titulo}
                                                    fill
                                                    sizes="32px"
                                                    className="object-contain rounded-sm"
                                                    loading="lazy"
                                                />
                                            </div>
                                            <span className="truncate">{p.titulo}</span>
                                        </li>
                                    ))}
                            </ul>
                        )}

                        {comparar[i] && (
                            <div className="mt-1 text-right">
                                <button
                                    onClick={() => {
                                        remover(comparar[i]!.slug);
                                        const next = [...buscas];
                                        next[i] = '';
                                        setBuscas(next);
                                        atualizarURL();
                                    }}
                                    className="text-xs text-red-600 hover:underline transition duration-150"
                                >
                                    Limpar
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="flex gap-4 pt-6 overflow-x-auto">
                {[0, 1, 2].map((i) => {
                    const produto = comparar[i];
                    return (
                        <div key={produto?.slug || `vazio-${i}`} className="w-[320px] snap-start shrink-0">
                            {produto ? (
                                <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm flex flex-col h-full">
                                    <div className="relative w-full h-40 mb-4 bg-gray-50">
                                        <Image
                                            src={produto.imagemPrincipal || '/fallback.png'}
                                            alt={produto.titulo}
                                            fill
                                            className="object-contain"
                                            sizes="100%"
                                            loading="lazy"
                                        />
                                    </div>

                                    <h2 className="text-sm font-semibold mb-2 line-clamp-2">
                                        <Link href={`/produtos/${produto.slug}`} className="hover:underline">
                                            {produto.titulo}
                                        </Link>
                                    </h2>

                                    <ul className="text-xs text-gray-700 space-y-1">
                                        {produto.marca && <li><strong>Marca:</strong> {produto.marca}</li>}
                                        {produto.cor && <li><strong>Cor:</strong> {produto.cor}</li>}
                                        {produto.armazenamento && <li><strong>Armazenamento:</strong> {produto.armazenamento}</li>}
                                        {produto.ram && <li><strong>RAM:</strong> {produto.ram}</li>}
                                        <li><strong>5G:</strong> {produto.tem5g ? 'Sim' : 'Não'}</li>
                                        <li><strong>NFC:</strong> {produto.temNFC ? 'Sim' : 'Não'}</li>
                                        <li><strong>Preço no Pix:</strong> {formatPreco(produto.promocao ?? produto.valor)}</li>
                                    </ul>

                                    {produto.descricao && (
                                        <div
                                            className="text-xs text-gray-600 mt-3 prose prose-sm max-w-none max-h-48 overflow-y-auto scroll-thin pr-2"
                                            dangerouslySetInnerHTML={{ __html: produto.descricao }}
                                        />
                                    )}
                                </div>
                            ) : (
                                <div className="border border-dashed border-gray-300 rounded-lg p-4 text-sm text-gray-400 flex items-center justify-center h-[360px] bg-white">
                                    Nenhum produto selecionado
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {comparar.length > 0 && (
                <div className="text-center mt-6 flex flex-col items-center space-y-4">
                    <button
                        onClick={limpar}
                        className="text-sm text-red-600 hover:underline transition duration-150"
                    >
                        Limpar comparação
                    </button>
                    <button
                        onClick={handleCompartilhar}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-5 py-2 rounded shadow transition duration-200"
                    >
                        Compartilhar comparação
                    </button>
                </div>
            )}
        </div>
    );
}
