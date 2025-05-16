'use client';

import { useCatalogo } from '@/app/context/CatalogoContext';
import ProductCarousel from './ProductCarousel';
import { useEffect, useState } from 'react';

export default function CarrosseisHome() {
    const { produtos } = useCatalogo();
    const [visualizacao, setVisualizacao] = useState<'grade' | 'lista'>('grade');

    useEffect(() => {
        const stored = localStorage.getItem('visualizacao');
        if (stored === 'lista' || stored === 'grade') {
            setVisualizacao(stored);
        }
    }, []);

    function alterarVisualizacao(tipo: 'grade' | 'lista') {
        setVisualizacao(tipo);
        localStorage.setItem('visualizacao', tipo);
    }

    const produtosDestaque = produtos.filter((p) => p.destaque);
    const produtosPromocao = produtos.filter((p) => p.emPromocao);

    return (
        <section className="space-y-8">
            {/* Toggle visualização */}
            <div className="flex justify-end items-center gap-2 text-sm text-gray-700 mb-2 pr-2">
                <button
                    onClick={() => alterarVisualizacao('grade')}
                    className={`px-2 py-1 rounded border ${visualizacao === 'grade'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border-gray-300'
                        }`}
                    title="Visualização em grade"
                >
                    🔳
                </button>
                <button
                    onClick={() => alterarVisualizacao('lista')}
                    className={`px-2 py-1 rounded border ${visualizacao === 'lista'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border-gray-300'
                        }`}
                    title="Visualização em lista"
                >
                    📄
                </button>
            </div>

            <ProductCarousel
                titulo="🌟 Destaques da loja"
                produtos={produtosDestaque}
                visualizacao={visualizacao}
            />
            <ProductCarousel
                titulo="🔥 Promoções especiais"
                produtos={produtosPromocao}
                visualizacao={visualizacao}
            />
        </section>
    );
}
