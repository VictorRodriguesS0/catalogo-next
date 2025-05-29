// lib/fetchEstoqueTiny.ts

export async function fetchEstoqueTiny(idTiny: string) {
    const isServer = typeof window === 'undefined';
    const baseUrl = isServer
        ? process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
        : '';

    const response = await fetch(`${baseUrl}/api/tiny/estoque`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idTiny }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Erro ao buscar estoque');
    }

    return { saldo: data.saldo };
}
