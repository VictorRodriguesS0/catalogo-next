'use client';

import { fetchProducts } from '@/lib/fetchProducts';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function ListaPageClient() {
    const [produtos, setProdutos] = useState<Awaited<ReturnType<typeof fetchProducts>>>([]);

    useEffect(() => {
        fetchProducts().then(setProdutos);
    }, []);

    const produtosPorCategoria: Record<string, Record<string, typeof produtos>> = {};
    for (const produto of produtos) {
        const categoria = produto.categoria || 'Outros';
        const sub = produto.subcategoria || 'Geral';
        if (!produtosPorCategoria[categoria]) {
            produtosPorCategoria[categoria] = {};
        }
        if (!produtosPorCategoria[categoria][sub]) {
            produtosPorCategoria[categoria][sub] = [];
        }
        produtosPorCategoria[categoria][sub].push(produto);
    }

    const categoriasOrdenadas = Object.keys(produtosPorCategoria).sort();

    return (
        <main className="max-w-6xl mx-auto p-4 font-sans">
            <h1 className="text-3xl font-bold mb-6">Lista de Produtos por Categoria</h1>
            <div className="space-y-6">
                {categoriasOrdenadas.map((categoria) => (
                    <DropdownCategoria
                        key={categoria}
                        categoria={categoria}
                        subcategorias={produtosPorCategoria[categoria]}
                    />
                ))}
            </div>
        </main>
    );
}

function DropdownCategoria({
    categoria,
    subcategorias,
}: {
    categoria: string;
    subcategorias: Record<string, Awaited<ReturnType<typeof fetchProducts>>>;
}) {
    const [aberta, setAberta] = useState(false);

    return (
        <div className="border rounded-md bg-white">
            <button
                onClick={() => setAberta(!aberta)}
                className="w-full text-left px-4 py-3 font-semibold bg-gray-100 hover:bg-gray-200 transition"
            >
                {aberta ? '▼' : '▶'} {categoria}
            </button>
            {aberta && (
                <div className="divide-y">
                    {Object.keys(subcategorias).sort().map((sub) => (
                        <div key={sub} className="p-4">
                            <h3 className="text-lg font-semibold text-blue-700 mb-3 border-b pb-1 border-gray-200">
                                {sub}
                            </h3>
                            <ul className="space-y-4">
                                {subcategorias[sub].map((produto) => (
                                    <li
                                        key={produto.slug}
                                        className="flex items-center gap-4 border rounded-md p-3 hover:shadow-md transition"
                                    >
                                        <Link href={`/${produto.slug}`} className="flex items-center gap-4 w-full">
                                            <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded overflow-hidden">
                                                {produto.imagemPrincipal && (
                                                    <Image
                                                        src={produto.imagemPrincipal}
                                                        alt={produto.titulo}
                                                        width={64}
                                                        height={64}
                                                        className="object-contain w-full h-full"
                                                    />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-800 line-clamp-2">{produto.titulo}</p>
                                                <p className="text-sm text-gray-500">
                                                    {produto.marca || 'Sem marca'} - {produto.cor || 'Sem cor'}
                                                </p>
                                            </div>
                                            <div className="text-right text-sm font-bold text-green-600 min-w-[80px]">
                                                {produto.promocao ? (
                                                    <>
                                                        <p>{produto.promocao}</p>
                                                        <p className="line-through text-gray-400 text-xs">{produto.valor}</p>
                                                    </>
                                                ) : (
                                                    <p>{produto.valor}</p>
                                                )}
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}