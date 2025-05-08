'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCatalogo } from '@/app/context/CatalogoContext';

export default function CalculadoraPage() {
    const searchParams = useSearchParams();
    const { todasTaxas } = useCatalogo();

    const [valorFormatado, setValorFormatado] = useState('');
    const [entradaFormatada, setEntradaFormatada] = useState('');
    const [valorNumerico, setValorNumerico] = useState(0);
    const [entradaNumerica, setEntradaNumerica] = useState(0);
    const [mostrarTaxa, setMostrarTaxa] = useState(false);
    const [verMais, setVerMais] = useState(false);

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

    function formatarMoeda(valor: number): string {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(valor);
    }

    function calcularJurosAoMes(taxaTotal: number, parcelas: number): string {
        const txDecimal = taxaTotal / 100;
        const mensal = Math.pow(1 + txDecimal, 1 / parcelas) - 1;
        return (mensal * 100).toFixed(2) + '% ao mês';
    }

    function handleInput(e: React.ChangeEvent<HTMLInputElement>, tipo: 'valor' | 'entrada') {
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
    }

    async function copiarTexto(texto: string) {
        await navigator.clipboard.writeText(texto);
        const toast = document.getElementById('toast');
        if (toast) {
            toast.classList.remove('hidden');
            setTimeout(() => toast.classList.add('hidden'), 2000);
        }
    }

    const taxasVisiveis = verMais ? todasTaxas : todasTaxas.slice(0, 12);
    const restante = Math.max(0, valorNumerico - entradaNumerica);

    return (
        <main className="max-w-3xl mx-auto p-6 font-sans text-black">
            <h1 className="text-3xl font-bold mb-6 text-center">Calculadora de Parcelamento</h1>

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
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {valorNumerico > 0 && restante > 0 && (
                <>
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-200 text-sm rounded-lg overflow-hidden">
                            <thead className="bg-blue-100 text-gray-800">
                                <tr>
                                    <th className="border px-4 py-2 text-left">Parcelas</th>
                                    {mostrarTaxa && <th className="border px-4 py-2 text-left">Juros compostos</th>}
                                    <th className="border px-4 py-2 text-left">Valor da Parcela</th>
                                    <th className="border px-4 py-2 text-left">Total no Cartão</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {taxasVisiveis.map(({ parcelas, taxa }) => {
                                    const taxaDecimal = taxa / 100;
                                    const totalComTaxa = restante * (1 + taxaDecimal);
                                    const qtdParcelas = parseInt(parcelas.replace('x', '')) || 1;
                                    const valorParcela = totalComTaxa / qtdParcelas;
                                    const jurosMes = calcularJurosAoMes(taxa, qtdParcelas);
                                    const texto = `${parcelas} de ${formatarMoeda(valorParcela)} - Total no cartão: ${formatarMoeda(totalComTaxa)}`;

                                    return (
                                        <tr
                                            key={parcelas}
                                            className="cursor-pointer hover:bg-blue-50"
                                            onClick={() => copiarTexto(texto)}
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

                    <div className="mt-4 flex flex-col md:flex-row items-center justify-center gap-4">
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

                    <button
                        onClick={() => {
                            const url = `${window.location.origin}/calculadora?valor=${valorNumerico}&entrada=${entradaNumerica}`;
                            navigator.clipboard.writeText(url);
                            const toast = document.getElementById('toast');
                            if (toast) {
                                toast.classList.remove('hidden');
                                setTimeout(() => toast.classList.add('hidden'), 2000);
                            }
                        }}
                        className="mt-6 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium py-2 px-4 rounded transition"
                    >
                        Compartilhar link com valores
                    </button>

                    <div
                        id="toast"
                        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded shadow-md hidden transition duration-300"
                    >
                        Copiado para a área de transferência!
                    </div>
                </>
            )}
        </main>
    );
}