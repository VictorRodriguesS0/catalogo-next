'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const SearchBox = dynamic(() => import('./SearchBox'), { ssr: false });

export default function Header() {
    const [categorias, setCategorias] = useState<string[]>([]);

    useEffect(() => {
        async function fetchCategorias() {
            try {
                const res = await fetch('/api/categorias');
                const data = await res.json();
                setCategorias(data);
            } catch (error) {
                console.error('Erro ao buscar categorias:', error);
            }
        }

        fetchCategorias();
    }, []);

    return (
        <>
            <header className="bg-white text-black shadow-md py-4 px-6 flex flex-col md:flex-row md:items-center md:justify-between z-50 relative">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <Link href="/">
                        <img src="/logo.png" alt="Lojinha Eletrônicos" className="h-10" />
                    </Link>
                    <SearchBox />
                </div>
            </header>

            <nav className="bg-white text-black shadow-sm px-6 py-2 overflow-x-auto whitespace-nowrap">
                <ul className="flex gap-4 text-sm">
                    {categorias.map((categoria) => (
                        <li key={categoria}>
                            <Link
                                href={`/?categoria=${encodeURIComponent(categoria)}`}
                                className="text-black hover:underline"
                            >
                                {categoria}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </>
    );
}
