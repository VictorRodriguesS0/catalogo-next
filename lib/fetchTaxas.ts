import Papa from 'papaparse';

export interface Taxa {
    parcelas: string;
    taxa: number; // ex: 3.08
}

const TAXAS_CSV_URL =
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vTZo0cz1xfr9W9_FKCtUOPdHkySf0CwbjRIMmKLPuiAm5UKADrl9fDy8MnCDiDBmURS1qibVjiSbGu3/pub?gid=17280060&single=true&output=csv';

export async function fetchTaxas(): Promise<Taxa[]> {
    const response = await fetch(TAXAS_CSV_URL);
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
