'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Produto {
    slug: string;
    titulo: string;
}

export default function SearchBox() {
    const [busca, setBusca] = useState('');
    const [sugestoes, setSugestoes] = useState<Produto[]>([]);
    const [mostrarSugestoes, setMostrarSugestoes] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();
    const boxRef = useRef<HTMLDivElement>(null);

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

    // Fecha sugestões ao clicar fora
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

    function handleSelecao(slug: string) {
        setBusca('');
        setMostrarSugestoes(false);
        router.push(`/produto/${slug}`);
    }

    return (
        <div ref={boxRef} className="relative w-full max-w-md">
            <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar produtos..."
                className="border rounded px-4 py-2 w-full text-black"
                onFocus={() => {
                    if (sugestoes.length > 0) setMostrarSugestoes(true);
                }}
            />
            {mostrarSugestoes && sugestoes.length > 0 && (
                <ul className="absolute z-50 bg-white border border-gray-300 w-full mt-1 rounded shadow-md max-h-60 overflow-y-auto">
                    {sugestoes.map((produto) => (
                        <li
                            key={produto.slug}
                            onClick={() => handleSelecao(produto.slug)}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black"
                        >
                            {produto.titulo}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
