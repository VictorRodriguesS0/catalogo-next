'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useCatalogo } from '@/app/context/CatalogoContext';
import { useComparar } from '@/app/context/CompararContext';
import { AnimatePresence, motion } from 'framer-motion';

export default function FilterBar() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const { marcas, cores } = useCatalogo();
    const { modoComparar, setModoComparar } = useComparar();

    const [mostrarFiltros, setMostrarFiltros] = useState(false);
    const [marcasSelecionadas, setMarcasSelecionadas] = useState<string[]>([]);
    const [coresSelecionadas, setCoresSelecionadas] = useState<string[]>([]);
    const [ordenar, setOrdenar] = useState('');
    const [destaque, setDestaque] = useState(false);
    const [promocao, setPromocao] = useState(false);

    // Recarregar filtros da URL ao abrir
    useEffect(() => {
        const marcas = searchParams.getAll('marca');
        const cores = searchParams.getAll('cor');
        const ordenar = searchParams.get('ordenar') || '';
        const destaque = searchParams.get('destaque') === 'true';
        const promocao = searchParams.get('promocao') === 'true';

        setMarcasSelecionadas(marcas);
        setCoresSelecionadas(cores);
        setOrdenar(ordenar);
        setDestaque(destaque);
        setPromocao(promocao);
    }, [searchParams]);

    // Atualizar URL ao mudar ordenação
    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        if (ordenar) {
            params.set('ordenar', ordenar);
        } else {
            params.delete('ordenar');
        }

        router.replace(`${pathname}?${params.toString()}`);
    }, [ordenar]);

    const toggle = (value: string, list: string[], setList: (v: string[]) => void) => {
        setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
    };

    const aplicarFiltros = () => {
        const params = new URLSearchParams(searchParams.toString());

        params.delete('marca');
        marcasSelecionadas.forEach((m) => params.append('marca', m));

        params.delete('cor');
        coresSelecionadas.forEach((c) => params.append('cor', c));

        if (destaque) {
            params.set('destaque', 'true');
        } else {
            params.delete('destaque');
        }

        if (promocao) {
            params.set('promocao', 'true');
        } else {
            params.delete('promocao');
        }

        router.replace(`${pathname}?${params.toString()}`);
        setMostrarFiltros(false);
    };

    const limparFiltros = () => {
        router.replace(pathname);
        setMostrarFiltros(false);
    };

    return (
        <div className="mb-6">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
                <button
                    onClick={() => setMostrarFiltros((v) => !v)}
                    className="bg-gray-100 hover:bg-gray-200 text-sm px-4 py-2 rounded transition"
                >
                    {mostrarFiltros ? 'Fechar filtros' : 'Filtrar'}
                </button>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                    <div className="flex items-center gap-2">
                        <label htmlFor="ordenar" className="text-sm font-medium">
                            Ordenar por
                        </label>
                        <select
                            id="ordenar"
                            value={ordenar}
                            onChange={(e) => setOrdenar(e.target.value)}
                            className="border border-gray-300 rounded px-3 py-1 text-sm w-44"
                        >
                            <option value="">Padrão</option>
                            <option value="menor-preco">Menor preço</option>
                            <option value="maior-preco">Maior preço</option>
                            <option value="a-z">Nome A-Z</option>
                            <option value="z-a">Nome Z-A</option>
                        </select>
                    </div>

                    <button
                        onClick={() => setModoComparar(!modoComparar)}
                        className={`text-sm font-medium px-4 py-2 rounded border transition ${modoComparar
                                ? 'text-red-600 border-red-300 hover:bg-red-100'
                                : 'text-blue-600 border-blue-300 hover:bg-blue-100'
                            }`}
                    >
                        {modoComparar ? 'Sair do modo comparação' : 'Ativar comparação'}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {mostrarFiltros && (
                    <motion.div
                        key="filtros"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden bg-white shadow-sm p-4 rounded-md space-y-6"
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {marcas.length > 0 && (
                                <div>
                                    <p className="text-sm font-medium mb-2">Marca</p>
                                    <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                                        {marcas.map((marca) => (
                                            <label key={marca} className="text-sm flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={marcasSelecionadas.includes(marca)}
                                                    onChange={() => toggle(marca, marcasSelecionadas, setMarcasSelecionadas)}
                                                />
                                                {marca}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {cores.length > 0 && (
                                <div>
                                    <p className="text-sm font-medium mb-2">Cor</p>
                                    <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                                        {cores.map((cor) => (
                                            <label key={cor} className="text-sm flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={coresSelecionadas.includes(cor)}
                                                    onChange={() => toggle(cor, coresSelecionadas, setCoresSelecionadas)}
                                                />
                                                {cor}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col justify-center gap-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={destaque}
                                        onChange={(e) => setDestaque(e.target.checked)}
                                    />
                                    Mostrar apenas produtos em destaque
                                </label>
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={promocao}
                                        onChange={(e) => setPromocao(e.target.checked)}
                                    />
                                    Mostrar apenas produtos em promoção
                                </label>
                            </div>
                        </div>

                        <div className="flex items-center justify-between flex-wrap gap-2">
                            <button
                                onClick={limparFiltros}
                                className="text-sm text-red-500 hover:underline"
                            >
                                Limpar filtros
                            </button>
                            <button
                                onClick={aplicarFiltros}
                                className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded hover:bg-blue-700 transition"
                            >
                                Aplicar filtros
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
