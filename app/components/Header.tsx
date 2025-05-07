'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Menu } from 'lucide-react';

const SearchBox = dynamic(() => import('./SearchBox'), { ssr: false });

export default function Header() {
    const [categorias, setCategorias] = useState<string[]>([]);
    const [menuAberto, setMenuAberto] = useState(false);

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

    const principaisCategorias = categorias.slice(0, 8);

    return (
        <>
            {/* Header principal */}
            <header className="bg-white text-black shadow-md px-6 py-4 flex items-center justify-between gap-4 relative z-50">
                {/* Logo */}
                <Link href="/">
                    <img src="/logo.png" alt="Logo" className="h-10" />
                </Link>

                {/* Barra de pesquisa centralizada */}
                <div className="flex-1 flex justify-center">
                    <SearchBox />
                </div>

                {/* Menu mobile toggle */}
                <button
                    onClick={() => setMenuAberto(true)}
                    className="md:hidden p-2"
                    aria-label="Abrir menu"
                >
                    <Menu size={28} />
                </button>

                {/* Dropdown de categorias (desktop) */}
                <div className="hidden md:block relative group">
                    <button className="text-sm font-medium hover:text-blue-600 transition">
                        Categorias
                    </button>
                    <ul className="absolute right-0 left-auto mt-2 w-56 bg-white border rounded shadow-md opacity-0 group-hover:opacity-100 group-hover:visible invisible transition duration-200 z-50 max-h-96 overflow-y-auto">
                        {categorias.map((categoria) => (
                            <li key={categoria}>
                                <Link
                                    href={`/?categoria=${encodeURIComponent(categoria)}`}
                                    className="block px-4 py-2 hover:bg-gray-100 text-sm"
                                >
                                    {categoria}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </header>

            {/* Menu horizontal de até 8 categorias no desktop, centralizado */}
            {principaisCategorias.length > 0 && (
                <nav className="hidden md:flex bg-white text-black shadow-sm px-6 py-2 justify-center">
                    <ul className="flex gap-6 text-sm">
                        {principaisCategorias.map((categoria) => (
                            <li key={categoria}>
                                <Link
                                    href={`/?categoria=${encodeURIComponent(categoria)}`}
                                    className="hover:underline"
                                >
                                    {categoria}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            )}

            {/* Menu lateral (somente no mobile) */}
            {menuAberto && (
                <aside
                    className="fixed inset-0 z-50 bg-black bg-opacity-40 md:hidden"
                    onClick={() => setMenuAberto(false)}
                >
                    <div
                        className="bg-white w-64 h-full p-6 shadow-md"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-lg font-semibold mb-4">Categorias</h2>
                        <ul className="space-y-2">
                            {categorias.map((categoria) => (
                                <li key={categoria}>
                                    <Link
                                        href={`/?categoria=${encodeURIComponent(categoria)}`}
                                        className="block hover:underline"
                                        onClick={() => setMenuAberto(false)}
                                    >
                                        {categoria}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>
            )}
        </>
    );
}
