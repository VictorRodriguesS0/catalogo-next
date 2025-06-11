// app/api/produtos/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const baseURL = process.env.WOOCOMMERCE_API_BASE;
  const wcKey = process.env.WC_KEY;
  const wcSecret = process.env.WC_SECRET;

  if (!baseURL || !wcKey || !wcSecret) {
    return NextResponse.json(
      { error: 'Faltando variáveis de ambiente WOOCOMMERCE_API_BASE, WC_KEY ou WC_SECRET' },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(`${baseURL}/wp-json/wc/v3/products?per_page=100`, {
      headers: {
        Authorization:
          'Basic ' + Buffer.from(`${wcKey}:${wcSecret}`).toString('base64'),
      },
    });

    if (!response.ok) {
      const msg = await response.text();
      return NextResponse.json({ error: `WooCommerce API error: ${msg}` }, { status: response.status });
    }

    const produtos = await response.json();
    return NextResponse.json(produtos);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar produtos do WooCommerce', detalhe: (error as Error).message },
      { status: 500 }
    );
  }
}
