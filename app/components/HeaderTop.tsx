'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Menu, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useEffect, useState, Dispatch, SetStateAction } from 'react';

const SearchBox = dynamic(() => import('./SearchBox'), { ssr: false });

type MenuEstrutura = Record<string, string[]>;

export default function HeaderTop({
    menuAberto,
    setMenuAberto,
}: {
    menuAberto: boolean;
    setMenuAberto: Dispatch<SetStateAction<boolean>>;
}) {
    const [menu, setMenu] = useState<MenuEstrutura>({});
    const [categoriaExpandida, setCategoriaExpandida] = useState<string | null>(null);

    useEffect(() => {
        async function fetchMenu() {
            const res = await fetch('/api/categorias');
            const data = await res.json();
            setMenu(data);
        }
        fetchMenu();
    }, []);

    const handleToggleCategoria = (categoria: string) => {
        setCategoriaExpandida((prev) => (prev === categoria ? null : categoria));
    };

    const fecharMenu = () => {
        setMenuAberto(false);
        setCategoriaExpandida(null);
    };

    return (
        <>
            {/* Topo do Header */}
            <div className="flex items-center justify-between px-6 py-4 gap-4">
                <Link href="/" aria-label="Página inicial">
                    <img
                        src="/logo.png"
                        alt="Logo"
                        className="h-10 w-auto transition-transform duration-200 hover:scale-105"
                    />
                </Link>

                <div className="flex-1 flex justify-center">
                    <SearchBox />
                </div>

                <button
                    onClick={() => setMenuAberto(true)}
                    className="md:hidden p-2 text-gray-600 hover:text-blue-600"
                    aria-label="Abrir menu"
                >
                    <Menu size={28} />
                </button>
            </div>

            {/* Menu lateral mobile */}
            {menuAberto && (
                <aside
                    className="fixed inset-0 z-50 bg-black bg-opacity-40 md:hidden"
                    onClick={fecharMenu}
                    aria-modal="true"
                    role="dialog"
                >
                    <div
                        className="bg-white w-72 h-full p-6 shadow-md flex flex-col overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Categorias</h2>
                            <button
                                onClick={fecharMenu}
                                className="text-gray-600 hover:text-black transition"
                                aria-label="Fechar menu"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <ul className="space-y-4">
                            {Object.entries(menu).map(([categoria, subcategorias]) => (
                                <li key={categoria}>
                                    <button
                                        onClick={() => handleToggleCategoria(categoria)}
                                        className="flex justify-between items-center w-full text-left text-sm font-semibold text-gray-800"
                                    >
                                        {categoria}
                                        {categoriaExpandida === categoria ? (
                                            <ChevronUp size={16} />
                                        ) : (
                                            <ChevronDown size={16} />
                                        )}
                                    </button>

                                    {categoriaExpandida === categoria && (
                                        <ul className="mt-2 pl-2 space-y-1">
                                            <li>
                                                <Link
                                                    href={`/produtos?categoria=${encodeURIComponent(categoria)}`}
                                                    onClick={fecharMenu}
                                                    className="block text-sm text-blue-600 font-medium hover:underline"
                                                >
                                                    Ver tudo
                                                </Link>
                                            </li>
                                            {subcategorias.map((sub) => (
                                                <li key={sub}>
                                                    <Link
                                                        href={`/categorias/${encodeURIComponent(categoria)}/${encodeURIComponent(sub)}`}
                                                        onClick={fecharMenu}
                                                        className="block text-sm text-gray-700 hover:underline"
                                                    >
                                                        {sub}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>
            )}
        </>
    );
}
