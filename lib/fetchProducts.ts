import Papa from 'papaparse';
import { loja } from '@/app/config/lojaConfig';

export interface Product {
    titulo: string;
    valor: number;
    promocao?: number;
    emPromocao: boolean;
    destaque: boolean;
    cor?: string;
    marca?: string;
    categoria: string;
    subcategoria?: string;
    imagemPrincipal?: string;
    imagem2?: string;
    imagem3?: string;
    imagem4?: string;
    descricao?: string;
    inativo?: string;
    ram?: string;
    armazenamento?: string;
    slug: string;
    tem5g?: boolean;
    temNFC?: boolean;
    disponivel?: boolean;
}

interface RawProduct {
    titulo: string;
    valor: string;
    promocao?: string;
    destaque?: string;
    cor?: string;
    marca?: string;
    categoria: string;
    subcategoria?: string;
    imagemPrincipal?: string;
    imagem2?: string;
    imagem3?: string;
    imagem4?: string;
    descricao?: string;
    inativo?: string;
    ram?: string;
    armazenamento?: string;
    NFC?: string;
}

function slugify(text: string): string {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
}

function parseValor(raw: string | undefined): number | undefined {
    if (!raw) return undefined;

    const cleaned = raw
        .replace(/[^\d.,]/g, '')
        .replace(/\.(?=\d{3})/g, '')
        .replace(',', '.');

    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? undefined : parsed;
}

export async function fetchProducts(): Promise<Product[]> {
    const response = await fetch(loja.csvCatalogoUrl);
    const csvText = await response.text();

    return new Promise((resolve, reject) => {
        Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                const data = results.data as RawProduct[];

                const validProducts: Product[] = await Promise.all(
                    data
                        .filter(
                            (p) =>
                                p.titulo &&
                                p.valor &&
                                p.categoria
                        )
                        .map(async (p) => {
                            const promocaoNum = parseValor(p.promocao);
                            const valorNum = parseValor(p.valor) ?? 0;

                            const tem5g = p.titulo.includes(' 5G ');
                            const nfcBruto = (p.NFC || '').trim().toLowerCase();
                            const temNFC = ['sim', 'nfc', 'true'].includes(nfcBruto);

                            const planilhaInativo = String(p.inativo || '').trim().toLowerCase() === 'true';
                            const disponivel = !planilhaInativo;

                            return {
                                ...p,
                                titulo: p.titulo.trim(),
                                valor: valorNum,
                                promocao: promocaoNum,
                                emPromocao: !!promocaoNum,
                                destaque: String(p.destaque || '').toLowerCase() === 'true',
                                cor: p.cor?.trim() || undefined,
                                marca: p.marca?.trim() || undefined,
                                categoria: p.categoria.trim(),
                                subcategoria: p.subcategoria?.trim() || undefined,
                                imagemPrincipal: p.imagemPrincipal?.trim(),
                                imagem2: p.imagem2?.trim(),
                                imagem3: p.imagem3?.trim(),
                                imagem4: p.imagem4?.trim(),
                                descricao: p.descricao?.trim(),
                                ram: p.ram?.trim(),
                                armazenamento: p.armazenamento?.trim(),
                                slug: slugify(p.titulo),
                                tem5g,
                                temNFC,

                                disponivel,
                                inativo: planilhaInativo ? 'true' : 'false',
                            };
                        })
                );

                resolve(validProducts);
            },
            error: (error: unknown) => reject(error),
        });
    });
}
