'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCatalogo } from '@/app/context/CatalogoContext';
import * as htmlToImage from 'html-to-image';
import { Camera, Link2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TabelaParcelamento from '../components/TabelaParcelamento';

export default function CalculadoraPage() {
    const searchParams = useSearchParams();
    const { todasTaxas } = useCatalogo();

    const [entradaFormatada, setEntradaFormatada] = useState('');
    const [valorNumerico, setValorNumerico] = useState(0);
    const [entradaNumerica, setEntradaNumerica] = useState(0);
    const [mostrarTaxa, setMostrarTaxa] = useState(false);
    const [verMais, setVerMais] = useState(false);
    const [copiado, setCopiado] = useState(false);
    const printRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const valorParam = searchParams.get('valor');
        const entradaParam = searchParams.get('entrada');

        if (valorParam) setValorNumerico(parseFloat(valorParam));
        if (entradaParam) {
            const entrada = parseFloat(entradaParam);
            setEntradaNumerica(entrada);
            setEntradaFormatada(formatarMoeda(entrada));
        }
    }, [searchParams]);

    const isMobile = () =>
        typeof navigator !== 'undefined' &&
        /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    const suportaClipboard =
        typeof navigator !== 'undefined' &&
        !!navigator.clipboard &&
        !!window.ClipboardItem;

    const taxasVisiveis = verMais ? todasTaxas : todasTaxas.slice(0, 12);
    const restante = Math.max(0, valorNumerico - entradaNumerica);
    const temEntrada = entradaNumerica > 0;

    const formatarMoeda = (valor: number): string =>
        new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(valor);

    const gerarImagem = async () => {
        if (!printRef.current) return;
        const node = printRef.current;
        const { width, height } = node.getBoundingClientRect();
        const originalStyle = {
            overflow: node.style.overflow,
            height: node.style.height,
        };

        try {
            node.style.overflow = 'visible';
            node.style.height = 'auto';

            const blob = await htmlToImage.toBlob(node, {
                backgroundColor: '#ffffff',
                pixelRatio: 2,
                width,
                height,
            });

            if (!blob) {
                alert('Erro ao gerar imagem');
                console.error('Erro ao gerar blob da imagem');
                return;
            }

            if (!suportaClipboard || isMobile()) {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'simulador-parcelamento.png';
                link.click();
            } else {
                await navigator.clipboard.write([
                    new ClipboardItem({ 'image/png': blob }),
                ]);
                setCopiado(true);
                setTimeout(() => setCopiado(false), 2000);
            }
        } catch (err) {
            console.error('Erro ao gerar print:', err);
        } finally {
            node.style.overflow = originalStyle.overflow;
            node.style.height = originalStyle.height;
        }
    };

    const copiarTexto = async (texto: string) => {
        try {
            await navigator.clipboard.writeText(texto);
            setCopiado(true);
            setTimeout(() => setCopiado(false), 2000);
        } catch (err) {
            console.error('Erro ao copiar texto:', err);
        }
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>, tipo: 'valor' | 'entrada') => {
        const apenasNumeros = e.target.value.replace(/\D/g, '');
        const valor = parseFloat((parseInt(apenasNumeros || '0') / 100).toFixed(2));
        if (tipo === 'valor') {
            setValorNumerico(valor);
        } else {
            setEntradaNumerica(valor);
            setEntradaFormatada(formatarMoeda(valor));
        }
    };

    return (
        <main className="max-w-3xl mx-auto p-4 sm:p-6 font-sans text-black">
            <div ref={printRef} className="p-4 bg-white rounded-xl shadow-md">
                <h1 className="text-3xl font-bold mb-6 text-center">Simulador de Parcelamento</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label htmlFor="valor" className="block mb-2 font-medium text-lg">Valor total desejado</label>
                        <div className="relative">
                            <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500">R$</span>
                            <input
                                id="valor"
                                type="text"
                                inputMode="numeric"
                                value={valorNumerico.toLocaleString('pt-BR', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                                onChange={(e) => handleInput(e, 'valor')}
                                placeholder="0,00"
                                className="w-full p-3 pl-10 border border-gray-300 rounded-lg transition placeholder:text-gray-400"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="entrada" className="block mb-2 font-medium text-lg">Entrada (R$)</label>
                        <div className="relative">
                            <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500">R$</span>
                            <input
                                id="entrada"
                                type="text"
                                inputMode="numeric"
                                value={entradaFormatada}
                                onChange={(e) => handleInput(e, 'entrada')}
                                placeholder="0,00"
                                className="w-full p-3 pl-10 border border-gray-300 rounded-lg transition placeholder:text-gray-400"
                            />
                        </div>
                    </div>
                </div>

                {valorNumerico > 0 && restante > 0 && (
                    <>
                        <div className="overflow-x-auto">
                            <TabelaParcelamento
                                preco={restante}
                                taxas={taxasVisiveis}
                                mostrarTaxa={mostrarTaxa}
                                textoTotal={temEntrada ? 'Total no Cartão' : 'Total'}
                                onCopiarTexto={copiarTexto}
                            />
                        </div>

                        <div className="py-4 flex justify-center border-t">
                            <img src="/logo.png" alt="Logo" className="h-10" />
                        </div>
                    </>
                )}
            </div>

            {valorNumerico > 0 && restante > 0 && (
                <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm">
                    <button
                        onClick={() => {
                            setVerMais(!verMais);
                            if (!verMais) setMostrarTaxa(false);
                        }}
                        className="underline text-blue-600 hover:text-blue-800"
                    >
                        {verMais ? 'Mostrar menos parcelas' : 'Ver mais parcelas'}
                    </button>

                    {verMais && (
                        <button
                            onClick={() => setMostrarTaxa(!mostrarTaxa)}
                            className="underline text-gray-600 hover:text-gray-800"
                        >
                            {mostrarTaxa ? 'Ocultar taxas' : 'Mostrar taxas'}
                        </button>
                    )}

                    <button
                        onClick={gerarImagem}
                        className="flex items-center gap-1 underline text-gray-600 hover:text-gray-800"
                    >
                        <Camera size={14} /> {isMobile() ? 'Baixar imagem' : 'Copiar print'}
                    </button>

                    <button
                        onClick={() => {
                            const url = new URL(window.location.href);
                            url.searchParams.set('valor', valorNumerico.toString());
                            url.searchParams.set('entrada', entradaNumerica.toString());
                            navigator.clipboard.writeText(url.toString());
                            setCopiado(true);
                            setTimeout(() => setCopiado(false), 2000);
                        }}
                        className="flex items-center gap-1 underline text-gray-600 hover:text-gray-800"
                    >
                        <Link2 size={14} /> Compartilhar cálculo
                    </button>
                </div>
            )}

            <AnimatePresence>
                {copiado && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-md z-50"
                    >
                        Copiado para a área de transferência!
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
