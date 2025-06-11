// lib/getCatalogoData.ts

const CATEGORIA_INDESEJADA = "uncategorized";

// Tipo final usado na aplicação
interface CategoriaComFilhos {
  id: number;
  nome: string;
  slug: string;
  parent: number;
  imagem: string | null;
  filhos: CategoriaComFilhos[];
}

// Tipo da resposta da API WooCommerce
interface WooCategoria {
  id: number;
  name: string;
  slug: string;
  parent: number;
  image: {
    id: number;
    src: string;
    name: string;
    alt: string;
  } | null;
}

export async function getCatalogoData(): Promise<CategoriaComFilhos[]> {
  const url = `${process.env.WOOCOMMERCE_API_BASE}/wp-json/wc/v3/products/categories?per_page=100`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Basic ${btoa(
        `${process.env.WC_KEY}:${process.env.WC_SECRET}`
      )}`,
    },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    console.error("Erro ao buscar categorias:", res.statusText);
    return [];
  }

  const categoriasRaw: WooCategoria[] = await res.json();

  const categoriasFiltradas = categoriasRaw.filter(
    (cat) => cat.slug !== CATEGORIA_INDESEJADA
  );

  const categoriasFormatadas: CategoriaComFilhos[] = categoriasFiltradas.map(
    (cat) => ({
      id: cat.id,
      nome: cat.name,
      slug: cat.slug,
      parent: cat.parent,
      imagem: cat.image?.src || null,
      filhos: [],
    })
  );

  const mapaCategorias: Record<number, CategoriaComFilhos> = {};
  categoriasFormatadas.forEach((cat) => {
    mapaCategorias[cat.id] = cat;
  });

  const categoriasRaiz: CategoriaComFilhos[] = [];
  categoriasFormatadas.forEach((cat) => {
    if (cat.parent === 0) {
      categoriasRaiz.push(cat);
    } else {
      const pai = mapaCategorias[cat.parent];
      if (pai) {
        pai.filhos.push(cat);
      }
    }
  });

  return categoriasRaiz;
}
