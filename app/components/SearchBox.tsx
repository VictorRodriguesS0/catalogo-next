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
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [buscou, setBuscou] = useState(false);

    const router = useRouter();
    const boxRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Buscar sugestões
    useEffect(() => {
        const timeout = setTimeout(async () => {
            const textoBusca = busca.trim().toLowerCase();

            if (textoBusca.length < 2) {
                setSugestoes([]);
                setMostrarSugestoes(false);
                setHighlightedIndex(-1);
                setBuscou(false);
                return;
            }

            try {
                const res = await fetch(`/api/sugestoes?busca=${encodeURIComponent(textoBusca)}`);
                const data: Produto[] = await res.json();
                setSugestoes(data);
                setMostrarSugestoes(true);
                setHighlightedIndex(-1);
                setBuscou(true);
            } catch (error) {
                console.error('Erro ao buscar sugestões:', error);
                setSugestoes([]);
            }
        }, 300);

        return () => clearTimeout(timeout);
    }, [busca]);

    // Fechar sugestões ao clicar fora
    useEffect(() => {
        function handleClickFora(event: MouseEvent) {
            if (boxRef.current && !boxRef.current.contains(event.target as Node)) {
                setMostrarSugestoes(false);
            }
        }

        document.addEventListener('mousedown', handleClickFora);
        return () => document.removeEventListener('mousedown', handleClickFora);
    }, []);

    // Enviar com Enter
    function handleSubmit(e?: React.FormEvent) {
        if (e) e.preventDefault();
        const textoBusca = busca.trim();
        if (!textoBusca) return;

        if (highlightedIndex >= 0 && highlightedIndex < sugestoes.length) {
            handleSelecao(sugestoes[highlightedIndex].slug);
        } else {
            const url = `/produtos?busca=${encodeURIComponent(textoBusca)}`;
            router.push(url);
            setMostrarSugestoes(false);
            setSugestoes([]);
            setBusca('');
            setBuscou(false);
        }
    }

    function handleSelecao(slug: string) {
        setBusca('');
        setMostrarSugestoes(false);
        setHighlightedIndex(-1);
        setSugestoes([]);
        setBuscou(false);
        router.push(`/produtos/${slug}`);
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (!mostrarSugestoes || sugestoes.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setHighlightedIndex((prev) => (prev + 1) % sugestoes.length);
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlightedIndex((prev) => (prev - 1 + sugestoes.length) % sugestoes.length);
                break;
            case 'Escape':
                setMostrarSugestoes(false);
                break;
            case 'Tab':
                if (highlightedIndex >= 0) {
                    setBusca(sugestoes[highlightedIndex].titulo);
                } else if (sugestoes.length > 0) {
                    setBusca(sugestoes[0].titulo);
                }
                e.preventDefault();
                break;
        }
    }

    return (
        <div ref={boxRef} className="relative w-full max-w-xl">
            <form onSubmit={handleSubmit} role="search" aria-label="Buscar produtos">
                <div className="relative">
                    <input
                        ref={inputRef}
                        type="text"
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        onFocus={() => {
                            if (sugestoes.length > 0 && busca.length >= 2) setMostrarSugestoes(true);
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder="Buscar produtos..."
                        className="border border-gray-300 rounded-full pl-4 pr-10 py-2 w-full text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        aria-autocomplete="list"
                        aria-controls="sugestoes-list"
                        aria-haspopup="listbox"
                        aria-expanded={mostrarSugestoes}
                        aria-activedescendant={
                            highlightedIndex >= 0 && sugestoes[highlightedIndex]
                                ? `suggestion-${sugestoes[highlightedIndex].slug}`
                                : undefined
                        }
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

            {mostrarSugestoes && (
                <ul
                    id="sugestoes-list"
                    role="listbox"
                    className="absolute z-50 bg-white border border-gray-300 w-full mt-1 rounded shadow-md max-h-60 overflow-y-auto"
                >
                    {sugestoes.length > 0 ? (
                        sugestoes.map((produto, index) => (
                            <li
                                key={produto.slug}
                                id={`suggestion-${produto.slug}`}
                                role="option"
                                aria-selected={highlightedIndex === index}
                                onClick={() => handleSelecao(produto.slug)}
                                className={`flex items-center gap-3 px-4 py-2 cursor-pointer text-black ${highlightedIndex === index ? 'bg-gray-100' : 'hover:bg-gray-50'
                                    }`}
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
                                <span
                                    className="line-clamp-2"
                                    dangerouslySetInnerHTML={{
                                        __html: produto.titulo.replace(
                                            new RegExp(`(${busca})`, 'gi'),
                                            '<mark class="bg-yellow-200 font-semibold">$1</mark>'
                                        ),
                                    }}
                                />

                            </li>
                        ))
                    ) : buscou ? (
                        <li className="px-4 py-3 text-gray-500 text-sm">Nenhum resultado encontrado.</li>
                    ) : null}
                </ul>
            )}
        </div>
    );
}
