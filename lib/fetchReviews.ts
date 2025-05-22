// lib/fetchReviews.ts
import Papa from 'papaparse';
import { loja } from '@/app/config/lojaConfig';

export interface Review {
    nome: string;
    texto: string;
}


export async function fetchReviews(): Promise<Review[]> {
    try {
        const response = await fetch(loja.csvReviewsUrl);
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
