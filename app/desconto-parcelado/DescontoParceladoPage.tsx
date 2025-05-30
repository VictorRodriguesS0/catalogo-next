'use client';

import { useEffect, useRef, useState } from 'react';
import * as htmlToImage from 'html-to-image';
import { Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TabelaParcelamento from '../components/TabelaParcelamento';
import Papa from 'papaparse'; // certifique-se de importar

export default function DescontoParceladoPage() {
    const [valorNumerico, setValorNumerico] = useState(0);
    const [mostrarTaxa, setMostrarTaxa] = useState(false);
    const [verMais, setVerMais] = useState(false);
    const [copiado, setCopiado] = useState(false);
    const printRef = useRef<HTMLDivElement>(null);

    const [taxas, setTaxas] = useState<{ parcelas: string; taxa: number }[]>([]);


    useEffect(() => {
        fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vTZo0cz1xfr9W9_FKCtUOPdHkySf0CwbjRIMmKLPuiAm5UKADrl9fDy8MnCDiDBmURS1qibVjiSbGu3/pub?gid=1304300267&single=true&output=csv')
            .then(res => res.text())
            .then(csvText => {
                const parsed = Papa.parse(csvText, {
                    header: true,
                    skipEmptyLines: true
                });

                const taxasCSV = (parsed.data as any[]).map((linha) => {
                    const parcelas = linha.parcelas?.trim();
                    const taxaStr = linha.taxas?.trim();

                    const taxa = parseFloat(
                        taxaStr.replace('%', '').replace(',', '.')
                    );

                    return { parcelas, taxa };
                });

                setTaxas(taxasCSV);
                console.log('Taxas lidas com casas decimais:', taxasCSV);
            });
    }, []);


    const isMobile = () =>
        typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    const suportaClipboard =
        typeof navigator !== 'undefined' &&
        !!navigator.clipboard &&
        !!window.ClipboardItem;

    const taxasVisiveis = verMais ? taxas : taxas.slice(0, 12);

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

            if (!blob) return alert('Erro ao gerar imagem');

            if (!suportaClipboard || isMobile()) {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'parcelado.png';
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

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const apenasNumeros = e.target.value.replace(/\D/g, '');
        const valor = parseFloat((parseInt(apenasNumeros || '0') / 100).toFixed(2));
        setValorNumerico(valor);
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

    return (
        <main className="max-w-3xl mx-auto p-4 sm:p-6 font-sans text-black">
            <div ref={printRef} className="p-4 bg-white rounded-xl shadow-md">
                <h1 className="text-3xl font-bold mb-6 text-center">Simulador de Parcelamento</h1>

                <div className="mb-6">
                    <label className="block mb-2 font-medium text-lg">Valor total desejado</label>
                    <div className="relative">
                        <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500">R$</span>
                        <input
                            type="text"
                            inputMode="numeric"
                            value={valorNumerico.toLocaleString('pt-BR', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                            onChange={handleInput}
                            placeholder="0,00"
                            className="w-full p-3 pl-10 border border-gray-300 rounded-lg transition placeholder:text-gray-400"
                        />
                    </div>
                </div>

                {valorNumerico > 0 && taxas.length > 0 && (
                    <>
                        <div className="overflow-x-auto">
                            <TabelaParcelamento
                                preco={valorNumerico}
                                taxas={taxasVisiveis}
                                mostrarTaxa={mostrarTaxa}
                                textoTotal="Total"
                                onCopiarTexto={copiarTexto}
                            />
                        </div>

                        <div className="py-4 flex justify-center border-t">
                            <img src="/logo.png" alt="Logo" className="h-10" />
                        </div>
                    </>
                )}
            </div>

            {valorNumerico > 0 && (
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
