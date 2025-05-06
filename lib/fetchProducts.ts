import Papa from 'papaparse';

export interface Product {
    titulo: string;
    valor: string;
    promocao?: string;
    cor?: string;
    categoria: string;
    imagemPrincipal?: string;
    imagem2?: string;
    imagem3?: string;
    imagem4?: string;
    descricao?: string;
    inativo?: string;
    slug: string;
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
                const data = results.data as Omit<Product, 'slug'>[];

                const validProducts = data
                    .filter(
                        (p) =>
                            p.titulo &&
                            p.valor &&
                            p.categoria &&
                            String(p.inativo).toLowerCase() !== 'true'
                    )
                    .map((p) => ({
                        ...p,
                        slug: slugify(p.titulo),
                    }));

                resolve(validProducts);
            },
            error: (error) => reject(error),
        });
    });
}
