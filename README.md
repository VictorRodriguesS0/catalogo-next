# 📱 Catálogo de Produtos - Lojinha Eletrônicos

Catálogo moderno feito com **Next.js 14**, **TypeScript**, **Tailwind CSS** e **Framer Motion**, alimentado por **Google Sheets** (CSV público).

---

## ✅ Funcionalidades

- Filtros dinâmicos: categoria, marca, cor, promoção, destaque, 5G, NFC
- Busca inteligente com sugestões e destaque do termo
- Visualização em grade ou lista com persistência no `localStorage`
- Página de produto com galeria, simulação de parcelamento e botão WhatsApp
- Alerta de "últimas unidades" para estoque ≤ 3
- Ocultação automática de produtos sem estoque
- Suporte ao valor especial "infinito" para estoque ilimitado
- Produtos inativos são removidos da aplicação
- Simulador de parcelamento com botão para gerar print com logo
- Skeleton loaders para melhor UX
- SEO com Open Graph Metadata
- Deploy estático no Netlify com CI via GitHub

---

## 📁 Estrutura

```
app/
├─ components/           # Componentes reutilizáveis
├─ produtos/             # Listagem e página de produto
├─ comparar/             # Página de comparação de produtos
├─ calculadora/          # Simulador de parcelamento
├─ context/              # Contextos globais (produtos, comparação)
├─ api/                  # Endpoints internos
lib/                     # Funções auxiliares (fetch, format, filtros, etc.)
public/                  # Imagens, favicon
```

---

## ⚙️ Variáveis de Ambiente

Crie um arquivo `.env.local` com:

```
NEXT_PUBLIC_SITE_URL=https://catalogo-next.netlify.app
WC_KEY=sua-chave-woocommerce
WC_SECRET=sua-senha-woocommerce
WOOCOMMERCE_API_BASE=https://sualoja.com
```

---

## ▶️ Rodando o Projeto

```bash
npm install
npm run dev
```

---

## 🌐 Deploy

Projeto hospedado via **Netlify**:  
🔗 https://catalogo-next.netlify.app

---

## 👨‍💻 Autor

Desenvolvido por [Victor Rodrigues](https://github.com/VictorRodriguesS0) e ChatGPT