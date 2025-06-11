import { Buffer } from 'buffer';

export interface WooCategory {
  id: number;
  name: string;
  parent: number;
}

export async function fetchCategories(): Promise<WooCategory[]> {
  const base = process.env.WOOCOMMERCE_API_BASE;
  const key = process.env.WC_KEY;
  const secret = process.env.WC_SECRET;

  if (!base || !key || !secret) {
    console.warn('WooCommerce credentials are missing');
    return [];
  }

  const auth = Buffer.from(`${key}:${secret}`).toString('base64');
  const url = `${base.replace(/\/$/, '')}/wp-json/wc/v3/products/categories?per_page=100`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Basic ${auth}`,
    },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    console.error('Erro ao buscar categorias WooCommerce:', await res.text());
    throw new Error('Falha ao buscar categorias');
  }

  const data: WooCategory[] = await res.json();
  return data.map(({ id, name, parent }) => ({ id, name, parent }));
}
