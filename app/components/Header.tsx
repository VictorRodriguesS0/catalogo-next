'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

export default function Header() {
    const [categorias, setCategorias] = useState<string[]>([]);
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

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

        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="bg-white shadow-md py-4 px-6 flex items-center justify-between relative z-50">
            <Link href="/">
                <img src="/logo.png" alt="Lojinha Eletrônicos" className="h-10" />
            </Link>

            <input
                type="text"
                placeholder="Buscar produtos..."
                className="border rounded px-4 py-2 w-1/2 max-w-md"
            />

            <div className="relative" ref={menuRef}>
                <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="text-gray-700 border px-4 py-2 rounded hover:bg-gray-100"
                >
                    Categorias
                </button>
                {showMenu && (
                    <ul className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md z-50">
                        {categorias.map((categoria) => (
                            <li key={categoria}>
                                <Link
                                    href={`/?categoria=${encodeURIComponent(categoria)}`}
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() => setShowMenu(false)}
                                >
                                    {categoria}
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </header>
    );
}
