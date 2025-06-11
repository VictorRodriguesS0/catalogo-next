import { Buffer } from 'buffer';

export interface Product {
    titulo: string;
    valor: number;
    promocao?: number;
    emPromocao: boolean;
    destaque: boolean;
    cor?: string;
    marca?: string;
    categoria: string;
    subcategoria?: string;
    imagemPrincipal?: string;
    imagem2?: string;
    imagem3?: string;
    imagem4?: string;
    descricao?: string;
    inativo?: string;
    ram?: string;
    armazenamento?: string;
    slug: string;
    tem5g?: boolean;
    temNFC?: boolean;
    idTiny?: string;
    estoqueSaldo?: number;
    disponivel?: boolean;
}

interface WooCategory { id: number; name: string; }
interface WooAttribute { name: string; options: string[]; }
interface WooImage { src: string; }
interface WooMeta { key: string; value: string; }
interface WooProduct {
    name: string;
    price: string;
    regular_price: string;
    sale_price: string;
    slug: string;
    categories: WooCategory[];
    attributes: WooAttribute[];
    images: WooImage[];
    stock_quantity: number | null;
    stock_status: string;
    description?: string;
    short_description?: string;
    featured?: boolean;
    meta_data: WooMeta[];
}

function parseNumber(value: string | number | undefined | null): number | undefined {
    if (value === undefined || value === null) return undefined;
    const num = typeof value === 'number' ? value : parseFloat(value);
    return isNaN(num) ? undefined : num;
}

export async function fetchProducts(): Promise<Product[]> {
    const base = process.env.WOOCOMMERCE_API_BASE;
    const key = process.env.WC_KEY;
    const secret = process.env.WC_SECRET;

    if (!base || !key || !secret) {
        console.warn('WooCommerce credentials are missing');
        return [];
    }

    const auth = Buffer.from(`${key}:${secret}`).toString('base64');
    const url = `${base.replace(/\/$/, '')}/wp-json/wc/v3/products?per_page=100`;

    const res = await fetch(url, {
        headers: {
            Authorization: `Basic ${auth}`,
        },
        next: { revalidate: 60 },
    });

    if (!res.ok) {
        console.error('Erro ao buscar produtos WooCommerce:', await res.text());
        throw new Error('Falha ao buscar produtos');
    }

    const data: WooProduct[] = await res.json();

    return data.map((p) => {
        const regular = parseNumber(p.regular_price) ?? parseNumber(p.price) ?? 0;
        const sale = parseNumber(p.sale_price);
        const marcaAttr = p.attributes.find((a) => /marca|brand/i.test(a.name));
        const corAttr = p.attributes.find((a) => /cor|color/i.test(a.name));
        const nfcAttr = p.attributes.find((a) => /nfc/i.test(a.name));
        const g5Attr = p.attributes.find((a) => /5g/i.test(a.name));
        const idTinyMeta = p.meta_data?.find((m) => m.key.toLowerCase() === 'idtiny');

        return {
            titulo: p.name,
            valor: regular,
            promocao: sale,
            emPromocao: typeof sale === 'number' && sale > 0 && sale < regular,
            destaque: !!p.featured,
            cor: corAttr?.options[0],
            marca: marcaAttr?.options[0],
            categoria: p.categories[0]?.name || '',
            subcategoria: p.categories[1]?.name,
            imagemPrincipal: p.images[0]?.src,
            imagem2: p.images[1]?.src,
            imagem3: p.images[2]?.src,
            imagem4: p.images[3]?.src,
            descricao: p.description || p.short_description,
            inativo: p.stock_status === 'instock' ? 'false' : 'true',
            slug: p.slug,
            tem5g: !!g5Attr,
            temNFC: !!nfcAttr,
            idTiny: idTinyMeta?.value,
            estoqueSaldo: parseNumber(p.stock_quantity),
            disponivel: p.stock_status === 'instock',
        } as Product;
    });
}
