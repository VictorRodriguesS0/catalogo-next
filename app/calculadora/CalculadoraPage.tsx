'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCatalogo } from '@/app/context/CatalogoContext';
import * as htmlToImage from 'html-to-image';

export default function CalculadoraPage() {
    const searchParams = useSearchParams();
    const { todasTaxas } = useCatalogo();

    const [valorFormatado, setValorFormatado] = useState('');
    const [entradaFormatada, setEntradaFormatada] = useState('');
    const [valorNumerico, setValorNumerico] = useState(0);
    const [entradaNumerica, setEntradaNumerica] = useState(0);
    const [mostrarTaxa, setMostrarTaxa] = useState(false);
    const [verMais, setVerMais] = useState(false);
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
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

    const gerarImagem = async (download = false) => {
        if (!printRef.current) return;

        try {
            const blob = await htmlToImage.toBlob(printRef.current, {
                backgroundColor: '#ffffff',
                pixelRatio: 2,
            });

            if (blob) {
                if (download) {
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'simulador-parcelamento.png';
                    link.click();
                } else {
                    const item = new ClipboardItem({ 'image/png': blob });
                    await navigator.clipboard.write([item]);
                    alert('Imagem copiada para a área de transferência!');
                }
            } else {
                alert('Erro ao gerar imagem');
            }
        } catch (err) {
            alert('Erro ao gerar imagem');
        }
    };

    return (
        <main className="max-w-3xl mx-auto p-6 font-sans text-gray-800">
            <div ref={printRef} className='p-1 bg-white rounded-md'>
                <h1 className="text-3xl font-bold mb-6 text-center">Simulador de Parcelamento</h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label htmlFor="valor" className="block mb-2 font-medium">Valor total desejado</label>
                        <input
                            id="valor"
                            type="text"
                            inputMode="numeric"
                            value={valorFormatado}
                            onChange={(e) => {
                                const raw = e.target.value.replace(/\D/g, '');
                                const num = parseFloat((parseInt(raw || '0') / 100).toFixed(2));
                                setValorNumerico(num);
                                setValorFormatado(formatarMoeda(num));
                            }}
                            className="w-full p-3 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div>
                        <label htmlFor="entrada" className="block mb-2 font-medium">Entrada</label>
                        <input
                            id="entrada"
                            type="text"
                            inputMode="numeric"
                            value={entradaFormatada}
                            onChange={(e) => {
                                const raw = e.target.value.replace(/\D/g, '');
                                const num = parseFloat((parseInt(raw || '0') / 100).toFixed(2));
                                setEntradaNumerica(num);
                                setEntradaFormatada(formatarMoeda(num));
                            }}
                            className="w-full p-3 border border-gray-300 rounded-lg"
                        />
                    </div>
                </div>

                {valorNumerico > 0 && restante > 0 && (
                    <div className="bg-white border rounded-lg shadow-sm mt-4">
                        <div className="flex flex-col divide-y divide-gray-200">
                            {taxasVisiveis.map(({ parcelas, taxa }) => {
                                const taxaDecimal = taxa / 100;
                                const total = restante * (1 + taxaDecimal);
                                const qtd = parseInt(parcelas.replace('x', '')) || 1;
                                const valorParcela = total / qtd;
                                const jurosMes = calcularJurosAoMes(taxa, qtd);

                                return (
                                    <div
                                        key={parcelas}
                                        className="p-3 sm:p-4"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4">
                                            <p className="text-sm sm:text-base font-medium text-gray-800 whitespace-nowrap">
                                                {parcelas} de {formatarMoeda(valorParcela)}
                                            </p>
                                            <p className="text-sm text-gray-600 whitespace-nowrap">
                                                {temEntrada ? 'Total no cartão' : 'Total'}: <strong>{formatarMoeda(total)}</strong>
                                            </p>
                                            {mostrarTaxa && (
                                                <p className="text-xs text-gray-400 whitespace-nowrap">
                                                    Juros: {jurosMes}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                            <div className="py-4 flex justify-center border-t">
                                <img src="/logo.png" alt="Logo" className="h-10" />
                            </div>
                        </div>
                    </div>
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
                        onClick={() => gerarImagem(isMobile)}
                        className="underline text-gray-600 hover:text-gray-800"
                    >
                        {isMobile ? 'Download da tabela' : 'Tirar print da tabela'}
                    </button>
                </div>
            )}
        </main>
    );
}
