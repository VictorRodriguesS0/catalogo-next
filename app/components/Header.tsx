'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Header() {
    const [categorias, setCategorias] = useState<string[]>([]);
    const [busca, setBusca] = useState('');
    const router = useRouter();
    const searchParams = useSearchParams();

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

    useEffect(() => {
        const timeout = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());
            if (busca) {
                params.set('busca', busca);
            } else {
                params.delete('busca');
            }
            router.push(`/?${params.toString()}`);
        }, 500);

        return () => clearTimeout(timeout);
    }, [busca]);

    return (
        <>
            <header className="bg-white shadow-md py-4 px-6 flex flex-col md:flex-row md:items-center md:justify-between z-50 relative">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <Link href="/">
                        <img src="/logo.png" alt="Lojinha Eletrônicos" className="h-10" />
                    </Link>
                    <input
                        type="text"
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        placeholder="Buscar produtos..."
                        className="border rounded px-4 py-2 w-full max-w-md"
                    />
                </div>
            </header>

            {/* Menu de categorias fora do header para não ser cortado */}
            <nav className="bg-white shadow-sm px-6 py-2 overflow-x-auto whitespace-nowrap">
                <ul className="flex gap-4 text-sm">
                    {categorias.map((categoria) => (
                        <li key={categoria}>
                            <Link
                                href={`/?categoria=${encodeURIComponent(categoria)}`}
                                className="text-gray-600 hover:text-black"
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
