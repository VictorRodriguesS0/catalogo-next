import { fetchProducts } from "@/lib/fetchProducts";
import { notFound } from "next/navigation";
import ProductPageClient from "./ProductPageClient";
import type { Metadata } from "next";
import { formatPrecoToNumber } from "@/lib/formatPrice";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = params;

  const produtos = await fetchProducts();
  const produto = produtos.find((p) => p.slug === slug);

  if (!produto) {
    return { title: "Produto não encontrado" };
  }

  const preco = produto.promocao || produto.valor; // usa promocao se existir
  const precoNumerico = formatPrecoToNumber(preco);

  const stripHTML = (html: string) => html.replace(/<[^>]*>?/gm, "").trim();

  const tituloLimpo = stripHTML(produto.titulo);
  const descricaoLimpa = stripHTML(produto.descricao || "");
  const imagemPrincipal = produto.imagens?.[0] || "/fallback.png";

  return {
    metadataBase: new URL("https://lojinhaeletronicos.com"),
    title: `${tituloLimpo} | Lojinha Eletrônicos`,
    description:
      descricaoLimpa || "Confira este produto incrível com envio para o DF.",
    openGraph: {
      title: tituloLimpo,
      description: descricaoLimpa,
      images: [
        {
          url: imagemPrincipal,
          width: 800,
          height: 600,
          alt: tituloLimpo,
        },
      ],
      url: `https://lojinhaeletronicos.com/produtos/${produto.slug}`,
      type: "website",
    },
    other: {
      "product:availability": produto.estoqueDisponivel
        ? "in stock"
        : "out of stock",
      "product:price:amount": precoNumerico.toFixed(2),
      "product:price:currency": "BRL",
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  const produtos = await fetchProducts();
  const produto = produtos.find((p) => p.slug === slug);

  if (!produto) return notFound();

  const imagens = produto.imagens;

  return (
    <main className="max-w-6xl mx-auto px-4 py-6 space-y-12">
      <ProductPageClient
        product={produto}
        imagens={imagens}
        todosProdutos={produtos}
      />
    </main>
  );
}
