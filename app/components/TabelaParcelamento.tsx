// app/components/TabelaParcelamento.tsx
'use client';

import { motion } from 'framer-motion';

interface TabelaParcelamentoProps {
    preco: number;
    taxas: { parcelas: string; taxa: number }[];
    mostrarTaxa?: boolean;
    textoTotal?: string;
    onCopiarTexto?: (texto: string) => void;
}

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

export default function TabelaParcelamento({
    preco,
    taxas,
    mostrarTaxa = false,
    textoTotal = 'Total',
    onCopiarTexto,
}: TabelaParcelamentoProps) {
    return (
        <table className="min-w-full rounded-lg overflow-hidden text-sm shadow-md text-[#2e1065]">
            <thead className="bg-[#5e17eb] text-white uppercase text-[13px] tracking-wide">
                <tr>
                    <th className="px-4 py-2 text-[#ffde59] text-center">Parcelas</th>
                    {mostrarTaxa && (
                        <th className="px-4 py-2 text-white text-center">Juros</th>
                    )}
                    <th className="px-4 py-2 text-[#ffde59] text-center">Valor da Parcela</th>
                    <th className="px-4 py-2 text-[#ffde59] text-center">{textoTotal}</th>
                </tr>
            </thead>
            <tbody>
                {taxas.map(({ parcelas, taxa }, index) => {
                    const taxaDecimal = taxa / 100;
                    const qtdParcelas = parseInt(parcelas.replace('x', '')) || 1;
                    const totalComTaxa = preco * (1 + taxaDecimal);
                    const valorParcela = totalComTaxa / qtdParcelas;
                    const jurosMes = calcularJurosAoMes(taxa, qtdParcelas);
                    const texto = `${parcelas} de ${formatarMoeda(valorParcela)} - Total: ${formatarMoeda(totalComTaxa)}`;

                    const bgColor = index % 2 === 0 ? 'bg-[#f7f5ff]' : 'bg-[#ebe7fd]';

                    return (
                        <motion.tr
                            key={parcelas}
                            onClick={() => onCopiarTexto?.(texto)}
                            className={`cursor-pointer transition-colors ${bgColor} hover:bg-[#e9e4ff]`}
                            whileTap={{ scale: 0.98 }}
                        >
                            <td className="px-4 py-2 font-semibold text-center text-[#2e1065]">{parcelas}</td>
                            {mostrarTaxa && (
                                <td className="px-4 py-2 text-center text-[#2e1065]">{jurosMes}</td>
                            )}
                            <td className="px-4 py-2 font-bold text-center text-[#2e1065]">
                                {formatarMoeda(valorParcela)}
                            </td>
                            <td className="px-4 py-2 font-bold text-center text-[#2e1065]">
                                {formatarMoeda(totalComTaxa)}
                            </td>
                        </motion.tr>
                    );
                })}
            </tbody>
        </table>
    );
}
