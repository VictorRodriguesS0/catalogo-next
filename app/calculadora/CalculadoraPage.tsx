
'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCatalogo } from '@/app/context/CatalogoContext';
import * as htmlToImage from 'html-to-image';
import { Camera, Link2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CalculadoraPage() {
    const searchParams = useSearchParams();
    const { todasTaxas } = useCatalogo();

    const [valorFormatado, setValorFormatado] = useState('');
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

        if (valorParam) {
            const valor = parseFloat(valorParam);
            setValorNumerico(valor);
            setValorFormatado(formatarMoeda(valor));
        }

        if (entradaParam) {
            const entrada = parseFloat(entradaParam);
            setEntradaNumerica(entrada);
            setEntradaFormatada(formatarMoeda(entrada));
        }
    }, [searchParams]);

    const isMobile = () =>
        typeof navigator !== 'undefined' &&
        /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    const taxasVisiveis = verMais ? todasTaxas : todasTaxas.slice(0, 12);
    const restante = Math.max(0, valorNumerico - entradaNumerica);
    const temEntrada = entradaNumerica > 0;

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

    const gerarImagem = async () => {
        if (!printRef.current) return;

        const originalStyle = {
            overflow: printRef.current.style.overflow,
            height: printRef.current.style.height,
        };

        try {
            printRef.current.style.overflow = 'visible';
            printRef.current.style.height = 'auto';

            const blob = await htmlToImage.toBlob(printRef.current, {
                backgroundColor: '#ffffff',
                pixelRatio: 2,
            });

            if (!blob) {
                alert('Erro ao gerar imagem');
                return;
            }

            if (isMobile()) {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'simulador-parcelamento.png';
                link.click();
            } else {
                // @ts-ignore
                await navigator.clipboard.write([
                    new ClipboardItem({ 'image/png': blob })
                ]);
                setCopiado(true);
                setTimeout(() => setCopiado(false), 2000);
            }
        } catch (err) {
            alert('Erro ao gerar imagem');
            console.error('Erro ao gerar print:', err);
        } finally {
            printRef.current.style.overflow = originalStyle.overflow;
            printRef.current.style.height = originalStyle.height;
        }
    };

    const copiarTexto = async (texto: string) => {
        try {
            await navigator.clipboard.writeText(texto);
            setCopiado(true);
            setTimeout(() => setCopiado(false), 2000);
        } catch {
            alert('Erro ao copiar');
        }
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>, tipo: 'valor' | 'entrada') => {
        const input = e.target.value;
        const apenasNumeros = input.replace(/\D/g, '');
        const valor = parseFloat((parseInt(apenasNumeros || '0') / 100).toFixed(2));

        if (tipo === 'valor') {
            setValorNumerico(valor);
            setValorFormatado(formatarMoeda(valor));
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
                            <table className="min-w-full border border-gray-200 text-sm rounded-lg overflow-hidden text-center">
                                <thead className="bg-blue-100 text-gray-800 sticky top-0 z-10">
                                    <tr>
                                        <th className="border px-4 py-2">Parcelas</th>
                                        {mostrarTaxa && <th className="border px-4 py-2">Taxa de Juros</th>}
                                        <th className="border px-4 py-2">Valor da Parcela</th>
                                        <th className="border px-4 py-2 font-semibold">{temEntrada ? 'Total no cartão' : 'Total'}</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    {taxasVisiveis.map(({ parcelas, taxa }) => {
                                        const taxaDecimal = taxa / 100;
                                        const totalComTaxa = restante * (1 + taxaDecimal);
                                        const qtdParcelas = parseInt(parcelas.replace('x', '')) || 1;
                                        const valorParcela = totalComTaxa / qtdParcelas;
                                        const jurosMes = calcularJurosAoMes(taxa, qtdParcelas);
                                        const texto = `${parcelas} de ${formatarMoeda(valorParcela)} - Total: ${formatarMoeda(totalComTaxa)}`;

                                        return (
                                            <motion.tr
                                                key={parcelas}
                                                onClick={() => copiarTexto(texto)}
                                                className="hover:bg-blue-50 transition-colors cursor-pointer even:bg-gray-50"
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <td className="border px-4 py-2">{parcelas}</td>
                                                {mostrarTaxa && <td className="border px-4 py-2">{jurosMes}</td>}
                                                <td className="border px-4 py-2">{formatarMoeda(valorParcela)}</td>
                                                <td className="border px-4 py-2 font-semibold">{formatarMoeda(totalComTaxa)}</td>
                                            </motion.tr>
                                        );
                                    })}
                                </tbody>
                            </table>
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
