// lib/fetchProducts.ts

export interface Product {
  id: number;
  slug: string;
  titulo: string;
  valor: number;
  promocao: number | null;
  imagemPrincipal: string;
  imagens: string[];
  descricao: string;
  inativo?: boolean;

  marca?: string;
  cor?: string;
  ram?: string;
  armazenamento?: string;
  nfc?: boolean;
  cincoG?: boolean;
  destaque?: boolean;

  categoriaMae?: string;
  categoria?: string;
}

interface CategoriaProduto {
  id: number;
  name: string;
  slug: string;
  parent: number;
}

interface ProdutoAPI {
  id: number;
  slug: string;
  name: string;
  price: string;
  sale_price: string | null;
  description: string;
  images: { src: string }[];
  categories: CategoriaProduto[];

  attributes?: { name: string; options: string[] }[];

  meta_data?: { key: string; value: string }[];
  status?: string;
}

function parsePromocao(sale_price: string | null): number | null {
  if (!sale_price) return null;
  const valor = parseFloat(sale_price.replace("R$", "").replace(",", "."));
  return isNaN(valor) ? null : valor;
}

export async function fetchProducts(): Promise<Product[]> {
  const url = `${process.env.WOOCOMMERCE_API_BASE}/wp-json/wc/v3/products?consumer_key=${process.env.WC_KEY}&consumer_secret=${process.env.WC_SECRET}&per_page=100`;

  const res = await fetch(url);

  if (!res.ok) {
    console.error("Erro ao buscar produtos:", res.statusText);
    return [];
  }

  const data: ProdutoAPI[] = await res.json();

  return data
    .filter((item) => item && item.id && item.status !== "draft")
    .map((item): Product => {
      const imagens = item.images?.map((img) => img.src) || [];
      const valor = parseFloat(item.price.replace("R$", "").replace(",", "."));

      const categorias = item.categories || [];
      const categoriaMae = categorias[0]?.slug || undefined;
      const categoria = categorias[1]?.slug || undefined;

      const getAttr = (nome: string): string | undefined => {
        const attr = item.attributes?.find(
          (a) => a.name.toLowerCase() === nome.toLowerCase()
        );
        return attr?.options?.[0];
      };

      const getMeta = (chave: string): string | boolean | undefined => {
        return item.meta_data?.find((m) => m.key === chave)?.value;
      };

      const rawPromo = getMeta("promocao");

      const promocaoAtiva =
        rawPromo === true ||
        rawPromo === "true" ||
        rawPromo === "sim" ||
        rawPromo === "1";

      return {
        id: item.id,
        slug: item.slug,
        titulo: item.name,
        valor,
        promocao: promocaoAtiva ? parsePromocao(item.sale_price) : null,
        imagemPrincipal: imagens[0] || "/fallback.png",
        imagens,
        descricao: item.description || "",
        inativo: getMeta("inativo") === true || getMeta("inativo") === "true",

        marca: getAttr("Marca"),
        cor: getAttr("Cor"),
        ram: getAttr("RAM"),
        armazenamento: getAttr("Armazenamento"),
        nfc:
          getAttr("NFC")?.toLowerCase() === "sim" ||
          getAttr("NFC")?.toLowerCase() === "nfc",
        cincoG:
          getAttr("5G")?.toLowerCase() === "sim" || getAttr("5G") === "5G",
        destaque:
          getMeta("destaque") === true ||
          getMeta("destaque") === "true" ||
          getMeta("destaque") === "sim" ||
          getMeta("destaque") === "1",

        categoriaMae,
        categoria,
      };
    });
}
