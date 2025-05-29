'use client';

import { useEffect, useState, useRef } from 'react';
import GaleriaProduto from '@/app/components/GaleriaProduto';
import { formatPreco } from '@/lib/formatPrice';
import { Product } from '@/lib/fetchProducts';
import ProdutosRelacionados from '@/app/components/ProdutosRelacionados';
import { Share2 } from 'lucide-react';
import { MdOutlineImageNotSupported } from 'react-icons/md';
import { useCatalogo } from '@/app/context/CatalogoContext';

interface Props {
    product: Product;
    imagens: string[];
    todosProdutos: Product[];
}

export default function ProductPageClient({ product, imagens, todosProdutos }: Props) {
    const [showModal, setShowModal] = useState(false);
    const [mostrarTaxa, setMostrarTaxa] = useState(false);
    const [verMais, setVerMais] = useState(false);
    const [copiado, setCopiado] = useState(false);
    const modalRef = useRef<HTMLDivElement | null>(null);

    const { todasTaxas } = useCatalogo();

    useEffect(() => {
        document.body.style.overflow = showModal ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [showModal]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setShowModal(false);
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, []);

    const preco = product.promocao ?? product.valor ?? 0;
    const taxa12x = todasTaxas.find((t) => t.parcelas.replace('x', '') === '12')?.taxa || 0;
    const total12x = preco * (1 + taxa12x / 100);
    const parcela12x = total12x / 12;
    const taxasVisiveis = verMais ? todasTaxas : todasTaxas.slice(0, 12);

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

    const compartilhar = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2000);
    };

    return (
        <main className="p-4 md:p-6 max-w-6xl mx-auto font-sans space-y-12">
            <div className="flex flex-col md:flex-row gap-10">
                <div className="flex-1 max-w-full md:max-w-md">
                    {imagens.length > 0 ? (
                        <GaleriaProduto imagens={imagens} titulo={product.titulo} />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64 bg-gray-100 text-gray-500 rounded-lg">
                            <span className="text-sm mb-2">Sem imagem disponível</span>
                            <MdOutlineImageNotSupported size={32} />
                        </div>
                    )}
                </div>

                <div className="flex-1">
                    {!product.disponivel && (
                        <div className="text-red-600 bg-red-100 border border-red-300 px-4 py-3 rounded mb-4 font-semibold">
                            Produto indisponível no momento
                        </div>
                    )}

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

                    <button
                        onClick={compartilhar}
                        className="flex items-center gap-2 text-sm text-blue-600 hover:underline mb-4"
                    >
                        <Share2 size={16} /> Compartilhar link do produto
                    </button>

                    {copiado && (
                        <p className="text-xs text-green-600 mb-2">Link copiado para a área de transferência!</p>
                    )}

                    {(product.tem5g || product.temNFC) && (
                        <div className="flex flex-wrap gap-2 text-sm mt-1 mb-4">
                            {product.tem5g && (
                                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded font-semibold text-xs uppercase">
                                    📶 5G
                                </span>
                            )}
                            {product.temNFC && (
                                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded font-semibold text-xs uppercase">
                                    📡 NFC
                                </span>
                            )}
                        </div>
                    )}

                    <div className="text-sm text-gray-700 mb-4 space-y-1">
                        <h3 className="font-semibold text-base mb-1">📋 Especificações:</h3>
                        {product.marca && <p><strong>Marca:</strong> {product.marca}</p>}
                        {product.cor && <p><strong>Cor:</strong> {product.cor}</p>}
                        {product.armazenamento && <p className="text-base font-semibold"><strong>Armazenamento:</strong> {product.armazenamento}</p>}
                        {product.ram && <p className="text-base font-semibold"><strong>Memória RAM:</strong> {product.ram}</p>}
                        {product.categoria && <p><strong>Categoria:</strong> {product.categoria}</p>}
                        {product.subcategoria && <p><strong>Subcategoria:</strong> {product.subcategoria}</p>}
                    </div>

                    {product.estoqueSaldo !== undefined && product.estoqueSaldo <= 3 && product.estoqueSaldo > 0 && (
                        <p className="text-sm text-red-600 font-semibold mb-2">
                            Últimas unidades
                        </p>
                    )}

                    {!product.disponivel ? null : product.promocao ? (
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

                    {!product.disponivel ? null : preco > 50 && (
                        <p className="text-sm text-gray-800 mb-3 flex items-center gap-1">
                            <span>💳</span>
                            12x de <strong>{formatarMoeda(parcela12x)}</strong>
                        </p>
                    )}

                    {!product.disponivel ? null : (
                        <>
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
                        </>
                    )}

                    {product.descricao && (
                        <div className="mt-10">
                            <h3 className="text-xl font-semibold mb-3 text-gray-800">📝 Descrição do produto</h3>
                            <div
                                className="prose prose-sm md:prose lg:prose-lg max-w-none leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: product.descricao }}
                            />
                        </div>
                    )}
                </div>
            </div>

            {showModal && product.disponivel && (
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

            <ProdutosRelacionados produtoAtual={product} todosProdutos={todosProdutos} />
        </main>
    );
}
