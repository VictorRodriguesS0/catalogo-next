import Papa from 'papaparse';

export interface Product {
    titulo: string;
    valor: string;
    promocao?: string;
    emPromocao: boolean;
    destaque: boolean;
    cor?: string;
    marca?: string;
    categoria: string;
    imagemPrincipal?: string;
    imagem2?: string;
    imagem3?: string;
    imagem4?: string;
    descricao?: string;
    inativo?: string;
    ram?: string;
    armazenamento?: string;
    slug: string;
}

interface RawProduct {
    titulo: string;
    valor: string;
    promocao?: string;
    destaque?: string;
    cor?: string;
    marca?: string;
    categoria: string;
    imagemPrincipal?: string;
    imagem2?: string;
    imagem3?: string;
    imagem4?: string;
    descricao?: string;
    inativo?: string;
    ram?: string;
    armazenamento?: string;
}

const CSV_URL =
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vTZo0cz1xfr9W9_FKCtUOPdHkySf0CwbjRIMmKLPuiAm5UKADrl9fDy8MnCDiDBmURS1qibVjiSbGu3/pub?output=csv';

function slugify(text: string): string {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
}

export async function fetchProducts(): Promise<Product[]> {
    const response = await fetch(CSV_URL);
    const csvText = await response.text();

    return new Promise((resolve, reject) => {
        Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const data = results.data as RawProduct[];

                const validProducts: Product[] = data
                    .filter(
                        (p) =>
                            p.titulo &&
                            p.valor &&
                            p.categoria &&
                            String(p.inativo).toLowerCase() !== 'true'
                    )
                    .map((p) => {
                        const promocao = p.promocao?.trim() || undefined;
                        const destaque = String(p.destaque || '').toLowerCase() === 'true';

                        return {
                            ...p,
                            titulo: p.titulo.trim(),
                            valor: p.valor.trim(),
                            promocao,
                            emPromocao: !!promocao,
                            destaque,
                            cor: p.cor?.trim() || undefined,
                            marca: p.marca?.trim() || undefined,
                            categoria: p.categoria.trim(),
                            imagemPrincipal: p.imagemPrincipal?.trim(),
                            imagem2: p.imagem2?.trim(),
                            imagem3: p.imagem3?.trim(),
                            imagem4: p.imagem4?.trim(),
                            descricao: p.descricao?.trim(),
                            ram: p.ram?.trim(),
                            armazenamento: p.armazenamento?.trim(),
                            slug: slugify(p.titulo),
                        };
                    });

                resolve(validProducts);
            },
            error: (error: unknown) => reject(error),
        });
    });
}
