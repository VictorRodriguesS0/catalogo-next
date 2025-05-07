'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

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
        async function buscarSugestoes() {
            if (busca.length < 2) {
                setSugestoes([]);
                return;
            }

            const res = await fetch(`/api/sugestoes?busca=${encodeURIComponent(busca)}`);
            const data = await res.json();
            setSugestoes(data);
            setMostrarSugestoes(true);
        }

        buscarSugestoes();
    }, [busca]);

    useEffect(() => {
        function handleClickFora(event: MouseEvent) {
            if (boxRef.current && !boxRef.current.contains(event.target as Node)) {
                setMostrarSugestoes(false);
            }
        }

        document.addEventListener('click', handleClickFora);
        return () => {
            document.removeEventListener('click', handleClickFora);
        };
    }, []);

    function handleSubmit() {
        if (!busca.trim()) return;
        router.push(`/?busca=${encodeURIComponent(busca.trim())}`);
        setMostrarSugestoes(false);
    }

    function handleSelecao(slug: string) {
        setBusca('');
        setMostrarSugestoes(false);
        router.push(`/produto/${slug}`);
    }

    return (
        <div ref={boxRef} className="relative w-full max-w-xl">
            <div className="relative">
                <input
                    type="text"
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    placeholder="Buscar produtos..."
                    className="border border-gray-300 rounded-full pl-4 pr-10 py-2 w-full text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    onFocus={() => {
                        if (sugestoes.length > 0) setMostrarSugestoes(true);
                    }}
                />
                <button
                    onClick={handleSubmit}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition"
                >
                    <Search size={20} />
                </button>
            </div>

            {mostrarSugestoes && sugestoes.length > 0 && (
                <ul className="absolute z-50 bg-white border border-gray-300 w-full mt-1 rounded shadow-md max-h-60 overflow-y-auto">
                    {sugestoes.map((produto) => (
                        <li
                            key={produto.slug}
                            onClick={() => handleSelecao(produto.slug)}
                            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer text-black"
                        >
                            {produto.imagemPrincipal && (
                                <img
                                    src={produto.imagemPrincipal}
                                    alt={produto.titulo}
                                    className="w-[60px] h-[60px] object-cover border border-gray-300 rounded"
                                />
                            )}
                            <span className="line-clamp-2">{produto.titulo}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
