// Versão final atualizada com tratamento completo de atributos, preços e exibição de promoção
"use client";

import { useEffect, useState, useRef } from "react";
import GaleriaProduto from "@/app/components/GaleriaProduto";
import ProdutosRelacionados from "@/app/components/ProdutosRelacionados";
import { formatPreco, formatPrecoToNumber } from "@/lib/formatPrice";
import { Product } from "@/lib/fetchProducts";
import { useCatalogo } from "@/app/context/CatalogoContext";
import { isProdutoAtivo } from "@/lib/isProdutoAtivo";
import TabelaParcelamentoProduto from "@/app/components/TabelaParcelamentoProduto";
import { AnimatePresence, motion } from "framer-motion";
import { Share2 } from "lucide-react";
import { MdOutlineImageNotSupported } from "react-icons/md";

interface Props {
  product: Product;
  imagens: string[];
  todosProdutos: Product[];
}

export default function ProductPageClient({
  product,
  imagens,
  todosProdutos,
}: Props) {
  const [showModal, setShowModal] = useState(false);
  const [mostrarTaxa, setMostrarTaxa] = useState(false);
  const [verMais, setVerMais] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const { todasTaxas } = useCatalogo();

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
      window.history.pushState({ modal: true }, "");
    } else {
      document.body.style.overflow = "";
    }

    const onPopState = () => {
      if (showModal) {
        setShowModal(false);
        window.history.pushState(null, "");
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowModal(false);
    };

    window.addEventListener("popstate", onPopState);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [showModal]);

  const precoPixRaw = typeof product.valor === "string" ? product.valor : "0";
  const precoPromoRaw =
    typeof product.promocao === "string" ? product.promocao : "";
  const precoPix = formatPrecoToNumber(precoPixRaw);
  const precoPromo = precoPromoRaw ? formatPrecoToNumber(precoPromoRaw) : 0;
  const precoFinal = precoPromo > 0 ? precoPromo : precoPix;

  const taxa12x =
    todasTaxas.find((t) => t.parcelas.replace("x", "") === "12")?.taxa || 0;
  const total12x = precoFinal * (1 + taxa12x / 100);
  const parcela12x = total12x / 12;

  const compartilhar = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const fecharModalExterno = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === modalRef.current) setShowModal(false);
  };

  const getAtributo = (nome: string) =>
    product.atributos?.find((a) => a.nome.toLowerCase() === nome.toLowerCase())
      ?.valor;

  return (
    <main className="p-4 md:p-6 max-w-6xl mx-auto font-sans space-y-12">
      <div className="flex flex-col md:flex-row gap-10">
        <div className="flex-1 max-w-full md:max-w-md">
          {imagens.length > 0 ? (
            <GaleriaProduto imagens={imagens} titulo={product.titulo} />
          ) : (
            <div className="flex flex-col items-center justify-center h-64 bg-gray-100 text-gray-500 rounded-lg">
              <span className="text-sm mb-2">Sem imagem disponível</span>
              <MdOutlineImageNotSupported size={32} />
            </div>
          )}
        </div>

        <div className="flex-1">
          {(product.destaque || product.promocao) && (
            <div className="mb-2 flex flex-wrap gap-2">
              {product.destaque && (
                <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded shadow-md">
                  ⭐ Destaque
                </span>
              )}
              {product.promocao && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-md">
                  🏷️ Promoção
                </span>
              )}
            </div>
          )}

          <h1 className="text-3xl md:text-4xl font-extrabold mb-2 text-gray-900 leading-tight">
            {product.titulo}
          </h1>

          <button
            onClick={compartilhar}
            className="flex items-center gap-2 text-sm text-blue-600 hover:underline mb-4"
          >
            <Share2 size={16} /> Compartilhar link do produto
          </button>

          {copiado && (
            <p className="text-xs text-green-600 mb-2">
              Link copiado para a área de transferência!
            </p>
          )}

          <div className="text-sm text-gray-700 mb-4 space-y-1">
            <h3 className="font-semibold text-base mb-1">📋 Especificações:</h3>
            {product.marca && (
              <p>
                <strong>Marca:</strong> {product.marca}
              </p>
            )}
            {product.cor && (
              <p>
                <strong>Cor:</strong> {product.cor}
              </p>
            )}
            {getAtributo("armazenamento") && (
              <p>
                <strong>Armazenamento:</strong> {getAtributo("armazenamento")}
              </p>
            )}
            {getAtributo("ram") && (
              <p>
                <strong>Memória RAM:</strong> {getAtributo("ram")}
              </p>
            )}
            {product.categoriaPrincipal && (
              <p>
                <strong>Categoria:</strong> {product.categoriaPrincipal}
              </p>
            )}
            {product.categorias?.[1] && (
              <p>
                <strong>Subcategoria:</strong> {product.categorias[1]}
              </p>
            )}
          </div>

          {typeof product.estoque === "number" &&
            product.estoque > 0 &&
            product.estoque <= 3 && (
              <p className="text-sm text-red-600 font-semibold mb-2">
                Últimas unidades
              </p>
            )}

          <p
            className={`text-2xl font-bold ${
              precoPromo ? "text-red-600" : "text-green-600"
            } mb-1`}
          >
            {formatPreco(precoFinal)} <span className="text-base">no pix</span>
          </p>

          {precoPromo > 0 && (
            <p className="text-sm line-through text-gray-500 mb-2">
              De: {formatPreco(precoPix)}
            </p>
          )}

          {precoFinal > 50 && (
            <p className="text-sm text-gray-800 mb-3 flex items-center gap-1">
              <span>💳</span> 12x de <strong>{formatPreco(parcela12x)}</strong>
            </p>
          )}

          <div className="text-sm text-blue-700 bg-blue-50 rounded-md px-3 py-2 mb-4">
            Entregamos no mesmo dia para <strong>Brasília e entorno</strong> via
            motoboy 🚚 <br />
            <span className="text-gray-600">
              (Consulte o valor do frete pelo WhatsApp)
            </span>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="mb-3 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition"
          >
            Ver parcelamento
          </button>

          <a
            href={`https://wa.me/5561983453409?text=Tenho interesse no produto ${encodeURIComponent(
              product.titulo
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-6 w-full block bg-green-600 hover:bg-green-700 text-white text-center font-semibold py-3 px-4 rounded-xl transition"
          >
            Comprar no WhatsApp
          </a>

          {product.descricao && (
            <div className="mt-10">
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                📝 Descrição do produto
              </h3>
              <div
                className="prose prose-sm md:prose lg:prose-lg max-w-none leading-relaxed"
                dangerouslySetInnerHTML={{ __html: product.descricao }}
              />
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            ref={modalRef}
            onClick={fecharModalExterno}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative bg-white w-full max-w-3xl mx-2 sm:mx-auto sm:rounded-xl shadow-lg overflow-y-auto max-h-[90vh]"
            >
              <div className="relative p-4 sm:p-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl z-10"
                  aria-label="Fechar"
                >
                  ✕
                </button>

                <h2 className="text-2xl font-bold mb-4 pt-4 pr-10">
                  Parcelamento
                </h2>

                <TabelaParcelamentoProduto
                  product={product}
                  preco={precoFinal}
                  mostrarTaxa={mostrarTaxa}
                  verMais={verMais}
                  onToggleVerMais={() => setVerMais(!verMais)}
                  onToggleMostrarTaxa={() => setMostrarTaxa(!mostrarTaxa)}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ProdutosRelacionados
        produtoAtual={product}
        todosProdutos={todosProdutos.filter(isProdutoAtivo)}
      />
    </main>
  );
}
