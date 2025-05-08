'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import Image from 'next/image';

interface Produto {
    slug: string;
    titulo: string;
    imagemPrincipal?: string;
}

export default function SearchBox() {
    const [busca, setBusca] = useState('');
    const [sugestoes, setSugestoes] = useState<Produto[]>([]);
    const [mostrarSugestoes, setMostrarSugestoes] = useState(false);

    const router = useRouter();
    const boxRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timeout = setTimeout(async () => {
            const textoBusca = String(busca).trim().toLowerCase();

            if (textoBusca.length < 2) {
                setSugestoes([]);
                return;
            }

            try {
                const res = await fetch(`/api/sugestoes?busca=${encodeURIComponent(textoBusca)}`);
                const data: Produto[] = await res.json();
                setSugestoes(data);
                setMostrarSugestoes(true);
            } catch (error) {
                console.error('Erro ao buscar sugestões:', error);
                setSugestoes([]);
            }
        }, 300);

        return () => clearTimeout(timeout);
    }, [busca]);

    useEffect(() => {
        function handleClickFora(event: MouseEvent) {
            if (boxRef.current && !boxRef.current.contains(event.target as Node)) {
                setMostrarSugestoes(false);
            }
        }

        document.addEventListener('click', handleClickFora);
        return () => document.removeEventListener('click', handleClickFora);
    }, []);

    function handleSubmit(e?: React.FormEvent) {
        if (e) e.preventDefault();
        const textoBusca = busca.trim();
        if (!textoBusca) return;

        router.push(`/?busca=${encodeURIComponent(textoBusca)}`);
        setMostrarSugestoes(false);
    }

    function handleSelecao(slug: string) {
        setBusca('');
        setMostrarSugestoes(false);
        router.push(`/produto/${slug}`);
    }

    return (
        <div ref={boxRef} className="relative w-full max-w-xl">
            <form onSubmit={handleSubmit} role="search" aria-label="Buscar produtos">
                <div className="relative">
                    <input
                        type="text"
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        placeholder="Buscar produtos..."
                        className="border border-gray-300 rounded-full pl-4 pr-10 py-2 w-full text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        onFocus={() => {
                            if (sugestoes.length > 0) setMostrarSugestoes(true);
                        }}
                        aria-autocomplete="list"
                        aria-controls="sugestoes-list"
                        aria-haspopup="listbox"
                        aria-expanded={mostrarSugestoes}
                    />
                    <button
                        type="submit"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition"
                        aria-label="Buscar"
                    >
                        <Search size={20} />
                    </button>
                </div>
            </form>

            {mostrarSugestoes && sugestoes.length > 0 && (
                <ul
                    id="sugestoes-list"
                    role="listbox"
                    className="absolute z-50 bg-white border border-gray-300 w-full mt-1 rounded shadow-md max-h-60 overflow-y-auto"
                >
                    {sugestoes.map((produto) => (
                        <li
                            key={produto.slug}
                            role="option"
                            onClick={() => handleSelecao(produto.slug)}
                            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer text-black"
                            aria-selected="false"
                        >
                            {produto.imagemPrincipal && (
                                <div className="w-[60px] h-[60px] relative flex-shrink-0">
                                    <Image
                                        src={produto.imagemPrincipal}
                                        alt={produto.titulo}
                                        fill
                                        sizes="60px"
                                        className="object-cover border border-gray-300 rounded"
                                    />
                                </div>
                            )}
                            <span className="line-clamp-2">{produto.titulo}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
