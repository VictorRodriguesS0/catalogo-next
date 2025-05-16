'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Menu, X } from 'lucide-react';

const SearchBox = dynamic(() => import('./SearchBox'), { ssr: false });

export default function Header() {
    const [categorias, setCategorias] = useState<string[]>([]);
    const [menuAberto, setMenuAberto] = useState(false);

    useEffect(() => {
        let mounted = true;

        async function fetchCategorias() {
            try {
                const res = await fetch('/api/categorias');
                const data = await res.json();
                if (mounted) setCategorias(data);
            } catch (error) {
                console.error('Erro ao buscar categorias:', error);
            }
        }

        fetchCategorias();
        return () => {
            mounted = false;
        };
    }, []);

    const principaisCategorias = categorias.slice(0, 8);

    return (
        <>
            {/* Header principal */}
            <header className="bg-white text-black shadow-md px-6 py-4 flex items-center justify-between gap-4 relative z-50 transition-all duration-300 ease-in-out">
                {/* Logo */}
                <Link href="/" aria-label="Página inicial">
                    <img src="/logo.png" alt="Logo da loja" className="h-10 transition-transform duration-300 hover:scale-105" />
                </Link>

                {/* Barra de pesquisa */}
                <div className="flex-1 flex justify-center">
                    <SearchBox />
                </div>

                {/* Botão menu mobile */}
                <button
                    onClick={() => setMenuAberto(true)}
                    className="md:hidden p-2 transition-colors hover:text-blue-600"
                    aria-label="Abrir menu de categorias"
                >
                    <Menu size={28} />
                </button>

                {/* Dropdown de categorias (desktop) */}
                <div className="hidden md:block relative group">
                    <button
                        className="text-sm font-medium hover:text-blue-600 transition"
                        aria-haspopup="true"
                        aria-expanded="false"
                    >
                        Categorias
                    </button>
                    <ul className="absolute right-0 mt-2 w-56 bg-white border rounded shadow-md opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible invisible transition-all duration-200 ease-out z-50 max-h-96 overflow-y-auto">
                        {categorias.map((categoria) => (
                            <li key={categoria}>
                                <Link
                                    href={`/produtos?categoria=${encodeURIComponent(categoria)}`}
                                    className="block px-4 py-2 hover:bg-gray-100 text-sm transition-colors duration-200"
                                >
                                    {categoria}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </header>

            {/* Lista horizontal de categorias */}
            {principaisCategorias.length > 0 && (
                <nav
                    className="hidden md:flex bg-white text-black shadow-sm px-6 py-2 justify-center transition-all duration-300 ease-in-out"
                    aria-label="Menu de categorias"
                >
                    <ul className="flex gap-6 text-sm">
                        {principaisCategorias.map((categoria) => (
                            <li key={categoria}>
                                <Link
                                    href={`produtos?categoria=${encodeURIComponent(categoria)}`}
                                    className="hover:underline transition-colors duration-200"
                                >
                                    {categoria}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            )}

            {/* Menu lateral mobile */}
            {menuAberto && (
                <aside
                    className="fixed inset-0 z-50 bg-black bg-opacity-40 md:hidden transition-opacity duration-300 ease-in-out"
                    onClick={() => setMenuAberto(false)}
                    aria-modal="true"
                    role="dialog"
                >
                    <div
                        className="bg-white w-64 h-full p-6 shadow-md flex flex-col animate-slide-in"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Categorias</h2>
                            <button
                                onClick={() => setMenuAberto(false)}
                                className="text-gray-600 hover:text-black transition"
                                aria-label="Fechar menu"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <ul className="space-y-2">
                            {categorias.map((categoria) => (
                                <li key={categoria}>
                                    <Link
                                        href={`/produtos?categoria=${encodeURIComponent(categoria)}`}
                                        className="block hover:underline transition-colors duration-200"
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
