'use client';

import { useEffect, useState, useRef } from 'react';
import GaleriaProduto from '@/app/components/GaleriaProduto';
import { formatPreco } from '@/lib/formatPrice';
import { fetchTaxas, Taxa } from '@/lib/fetchTaxas';
import { Product } from '@/lib/fetchProducts';

interface Props {
    product: Product;
    imagens: string[];
}

export default function ProductPageClient({ product, imagens }: Props) {
    const [showModal, setShowModal] = useState(false);
    const [taxas, setTaxas] = useState<Taxa[]>([]);
    const [mostrarTaxa, setMostrarTaxa] = useState(false);
    const [verMais, setVerMais] = useState(false);
    const modalRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        fetchTaxas().then(setTaxas);
    }, []);

    useEffect(() => {
        document.body.style.overflow = showModal ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [showModal]);

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === 'Escape') setShowModal(false);
        }
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Corrigido: uso de number seguro
    const preco = product.promocao ?? product.valor ?? 0;
    const taxa12x = taxas.find((t) => t.parcelas.replace('x', '') === '12')?.taxa || 0;
    const total12x = preco * (1 + taxa12x / 100);
    const parcela12x = total12x / 12;

    const taxasVisiveis = verMais ? taxas : taxas.slice(0, 12);

    const formatarMoeda = (valor: number): string =>
        new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(valor);

    const calcularJurosAoMes = (taxaTotal: number, parcelas: number): string => {
        const txDecimal = taxaTotal / 100;
        const mensal = Math.pow(1 + txDecimal, 1 / parcelas) - 1;
        return (mensal * 100).toFixed(2) + '% ao mês';
    };

    const fecharModalExterno = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === modalRef.current) {
            setShowModal(false);
        }
    };

    return (
        <main className="p-4 md:p-6 max-w-6xl mx-auto font-sans">
            <div className="flex flex-col md:flex-row gap-10">
                <div className="flex-1 max-w-full md:max-w-md">
                    <GaleriaProduto imagens={imagens} titulo={product.titulo} />
                </div>

                <div className="flex-1">
                    {(product.promocao || product.destaque) && (
                        <div className="mb-2 flex flex-wrap gap-2">
                            {product.destaque && (
                                <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded shadow-md">
                                    ⭐ Destaque
                                </span>
                            )}
                            {product.promocao && (
                                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-md">
                                    🏷️ Promoção
                                </span>
                            )}
                        </div>
                    )}

                    <h1 className="text-3xl md:text-4xl font-extrabold mb-2 text-gray-900 leading-tight">
                        {product.titulo}
                    </h1>

                    <div className="text-sm text-gray-600 mb-3 space-y-1">
                        {product.marca && <p><strong>Marca:</strong> {product.marca}</p>}
                        {product.cor && <p><strong>Cor:</strong> {product.cor}</p>}
                        {product.armazenamento && <p><strong>Armazenamento:</strong> {product.armazenamento}</p>}
                        {product.ram && <p><strong>Memória RAM:</strong> {product.ram}</p>}
                        <p><strong>Categoria:</strong> {product.categoria}</p>
                    </div>

                    {product.promocao ? (
                        <>
                            <p className="text-2xl font-bold text-red-600 mb-1">
                                {formatPreco(product.promocao)} <span className="text-base">no pix</span>
                            </p>
                            <p className="text-sm line-through text-gray-500 mb-2">
                                De: {formatPreco(product.valor)}
                            </p>
                        </>
                    ) : (
                        <p className="text-2xl font-bold text-green-600 mb-3">
                            {formatPreco(product.valor)} <span className="text-base">no pix</span>
                        </p>
                    )}

                    {preco > 50 && (
                        <p className="text-sm text-gray-800 mb-3 flex items-center gap-1">
                            <span>💳</span>
                            12x de <strong>{formatarMoeda(parcela12x)}</strong>
                        </p>
                    )}

                    <div className="text-sm text-blue-700 bg-blue-50 rounded-md px-3 py-2 mb-4">
                        Entregamos no mesmo dia para <strong>Brasília e entorno</strong> via motoboy 🚚 <br />
                        <span className="text-gray-600">(Consulte o valor do frete pelo WhatsApp)</span>
                    </div>

                    <button
                        onClick={() => setShowModal(true)}
                        className="mb-3 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition"
                    >
                        Ver parcelamento
                    </button>

                    <a
                        href={`https://wa.me/5561983453409?text=Tenho interesse no produto ${encodeURIComponent(product.titulo)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mb-6 w-full block bg-green-600 hover:bg-green-700 text-white text-center font-semibold py-3 px-4 rounded-xl transition"
                    >
                        Comprar no WhatsApp
                    </a>

                    {product.descricao && (
                        <div
                            className="prose prose-sm md:prose lg:prose-lg max-w-none leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: product.descricao }}
                        />
                    )}
                </div>
            </div>

            {/* Modal de parcelamento */}
            {showModal && (
                <div
                    ref={modalRef}
                    onClick={fecharModalExterno}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                >
                    <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 relative shadow-lg">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl"
                            aria-label="Fechar"
                        >
                            ✕
                        </button>
                        <h2 className="text-2xl font-bold mb-4">Parcelamento</h2>

                        <div className="w-full overflow-x-auto">
                            <table className="min-w-full border border-gray-200 text-sm rounded-lg overflow-hidden">
                                <thead className="bg-blue-100 text-gray-800">
                                    <tr>
                                        <th className="border px-4 py-2 text-left">Parcelas</th>
                                        {mostrarTaxa && (
                                            <th className="border px-4 py-2 text-left">Juros compostos</th>
                                        )}
                                        <th className="border px-4 py-2 text-left">Valor da Parcela</th>
                                        <th className="border px-4 py-2 text-left">Total no Cartão</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    {taxasVisiveis.map(({ parcelas, taxa }) => {
                                        const taxaDecimal = taxa / 100;
                                        const totalComTaxa = preco * (1 + taxaDecimal);
                                        const qtdParcelas = parseInt(parcelas.replace('x', '')) || 1;
                                        const valorParcela = totalComTaxa / qtdParcelas;
                                        const jurosMes = calcularJurosAoMes(taxa, qtdParcelas);

                                        return (
                                            <tr key={parcelas}>
                                                <td className="border px-4 py-2">{parcelas}</td>
                                                {mostrarTaxa && (
                                                    <td className="border px-4 py-2">{jurosMes}</td>
                                                )}
                                                <td className="border px-4 py-2">{formatarMoeda(valorParcela)}</td>
                                                <td className="border px-4 py-2 font-semibold">{formatarMoeda(totalComTaxa)}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-4 text-center space-x-4">
                            <button
                                onClick={() => {
                                    setVerMais(!verMais);
                                    if (!verMais) setMostrarTaxa(false);
                                }}
                                className="text-xs text-blue-600 underline hover:text-blue-800"
                            >
                                {verMais ? 'Mostrar menos parcelas' : 'Ver mais parcelas'}
                            </button>
                            {verMais && (
                                <button
                                    onClick={() => setMostrarTaxa(!mostrarTaxa)}
                                    className="text-xs text-gray-500 underline hover:text-gray-800"
                                >
                                    {mostrarTaxa ? 'Ocultar taxas' : 'Mostrar taxas'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
