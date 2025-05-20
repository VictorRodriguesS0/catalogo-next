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

    const gerarImagem = async () => {
        if (!printRef.current) return;
        try {
            const blob = await htmlToImage.toBlob(printRef.current, {
                backgroundColor: '#ffffff',
                pixelRatio: 2,
            });
            if (blob) {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'simulador-parcelamento.png';
                link.click();
            } else {
                alert('Erro ao gerar imagem');
            }
        } catch (err) {
            alert('Erro ao gerar imagem');
            console.log("Erro ao gerar print:", err)
        }
    };

    const copiarTexto = async (texto: string) => {
        try {
            await navigator.clipboard.writeText(texto);
            const toast = document.getElementById('toast');
            if (toast) {
                toast.classList.remove('hidden');
                setTimeout(() => toast.classList.add('hidden'), 2000);
            }
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
        <main className="max-w-3xl mx-auto p-6 font-sans text-black">
            <div ref={printRef} className="p-2 bg-white rounded">
                <h1 className="text-3xl font-bold mb-6 text-center">Simulador de Parcelamento</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label htmlFor="valor" className="block mb-2 font-medium text-lg">Valor total desejado</label>
                        <input
                            id="valor"
                            type="text"
                            inputMode="numeric"
                            value={valorFormatado}
                            onChange={(e) => handleInput(e, 'valor')}
                            placeholder="R$ 0,00"
                            className="w-full p-3 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div>
                        <label htmlFor="entrada" className="block mb-2 font-medium text-lg">Entrada (R$)</label>
                        <input
                            id="entrada"
                            type="text"
                            inputMode="numeric"
                            value={entradaFormatada}
                            onChange={(e) => handleInput(e, 'entrada')}
                            placeholder="R$ 0,00"
                            className="w-full p-3 border border-gray-300 rounded-lg"
                        />
                    </div>
                </div>

                {valorNumerico > 0 && restante > 0 && (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full border border-gray-200 text-sm rounded-lg overflow-hidden text-center">
                                <thead className="bg-blue-100 text-gray-800">
                                    <tr>
                                        <th className="border px-4 py-2">Parcelas</th>
                                        {mostrarTaxa && <th className="border px-4 py-2">Taxa de Juros</th>}
                                        <th className="border px-4 py-2">Valor da Parcela</th>
                                        <th className="border px-4 py-2">{temEntrada ? 'Total no cartão' : 'Total'}</th>
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
                                            <tr
                                                key={parcelas}
                                                onClick={() => copiarTexto(texto)}
                                                className="hover:bg-blue-50 transition-colors cursor-pointer"
                                            >
                                                <td className="border px-4 py-2">{parcelas}</td>
                                                {mostrarTaxa && <td className="border px-4 py-2">{jurosMes}</td>}
                                                <td className="border px-4 py-2">{formatarMoeda(valorParcela)}</td>
                                                <td className="border px-4 py-2 font-semibold">{formatarMoeda(totalComTaxa)}</td>
                                            </tr>
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
                <>
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
                            className="underline text-gray-600 hover:text-gray-800"
                        >
                            Tirar print da tabela
                        </button>
                    </div>

                    <div
                        id="toast"
                        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded shadow-md hidden transition"
                    >
                        Copiado para a área de transferência!
                    </div>
                </>
            )}
        </main>
    );
}
