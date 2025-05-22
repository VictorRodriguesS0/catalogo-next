// lib/fetchReviews.ts
import Papa from 'papaparse';

export interface Review {
    nome: string;
    texto: string;
}

const REVIEWS_CSV_URL =
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vTZo0cz1xfr9W9_FKCtUOPdHkySf0CwbjRIMmKLPuiAm5UKADrl9fDy8MnCDiDBmURS1qibVjiSbGu3/pub?gid=20680863&single=true&output=csv';

export async function fetchReviews(): Promise<Review[]> {
    try {
        const response = await fetch(REVIEWS_CSV_URL);
        const csvText = await response.text();

        return new Promise((resolve, reject) => {
            Papa.parse<Review>(csvText, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => resolve(results.data),
                error: (error: unknown) => reject(error),
            });
        });
    } catch (error) {
        console.error('Erro ao buscar avaliações:', error);
        return [];
    }
}
