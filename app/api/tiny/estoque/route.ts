// app/api/tiny/estoque/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const { idTiny }: { idTiny: string } = await req.json();
    const token = process.env.TINY_API_TOKEN;

    if (!token) {
        return NextResponse.json({ error: 'Token não definido' }, { status: 500 });
    }

    if (!idTiny) {
        return NextResponse.json({ error: 'idTiny ausente' }, { status: 400 });
    }

    try {
        const params = new URLSearchParams({
            token,
            id: idTiny,
            formato: 'json',
        });

        const res = await fetch(`https://api.tiny.com.br/api2/produto.obter.estoque.php?${params}`);
        const data = await res.json();

        if (data?.retorno?.status !== 'OK') {
            throw new Error(data?.retorno?.erros?.[0]?.erro || 'Erro desconhecido');
        }

        return NextResponse.json({
            saldo: parseFloat(data.retorno.produto.saldo || '0'),
        });
    } catch (error) {
        const typedError = error as Error;
        return NextResponse.json({ error: typedError.message || 'Erro inesperado' }, { status: 500 });
    }
}
