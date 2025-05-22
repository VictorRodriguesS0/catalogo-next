import Papa from 'papaparse';
import { loja } from '@/app/config/lojaConfig';

export interface Taxa {
    parcelas: string;
    taxa: number; // ex: 3.08
}

export async function fetchTaxas(): Promise<Taxa[]> {
    const response = await fetch(loja.csvTaxasUrl);
    const csvText = await response.text();

    return new Promise((resolve, reject) => {
        Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const data = results.data as { parcelas: string; taxas: string }[];

                const parsed = data.map((item) => ({
                    parcelas: item.parcelas,
                    taxa: parseFloat(item.taxas.replace('%', '').replace(',', '.')),
                }));

                resolve(parsed);
            },
            error: (error: unknown) => reject(error),
        });
    });
}
