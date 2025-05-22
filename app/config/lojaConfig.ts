// app/config/lojaConfig.ts
export const loja = {
    nome: 'Lojinha Eletrônicos',
    razaoSocial: 'Lj Informatica e Acessorios LTDA',
    cnpj: '59.159.610/0001-85',
    descricao: 'A melhor loja de eletrônicos do DF. Melhor preço, entrega no mesmo dia e parcelamento em até 18x.',
    pagamento: [
        '💳 Aceitamos dinheiro, débito e transferência à vista.',
        '📆 Parcelamento em até 18x no cartão de crédito (com juros).',
        '✔️ Facilidade e segurança para você comprar com tranquilidade.'
    ],
    avisoLegal: 'Os valores e produtos disponíveis são válidos somente para a loja  ou entregas via motoboy e poderão ser alterados a qualquer momento sem aviso prévio.',
    horarioFuncionamento: [
        'Segunda a sexta das 9h às 17h30',
        'Sábados das 9h às 13h'
    ],
    endereco: 'SMAS Tr. 3 Conj. 2 Bl. B Loja 6 Pátio Ed. The Union, Brasília - DF, 71215-300',
    redes: {
        google: 'https://g.co/kgs/5wHXnr2',
        instagram: 'https://www.instagram.com/lojinhaimportadosdf/?hl=pt',
        whatsapp: 'https://wa.me/5561983453409',
        maps: 'https://maps.app.goo.gl/7c9QKWk1zBBczp9u9'
    },
    csvCatalogoUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTZo0cz1xfr9W9_FKCtUOPdHkySf0CwbjRIMmKLPuiAm5UKADrl9fDy8MnCDiDBmURS1qibVjiSbGu3/pub?output=csv',
    csvReviewsUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTZo0cz1xfr9W9_FKCtUOPdHkySf0CwbjRIMmKLPuiAm5UKADrl9fDy8MnCDiDBmURS1qibVjiSbGu3/pub?gid=20680863&single=true&output=csv',
    csvTaxasUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTZo0cz1xfr9W9_FKCtUOPdHkySf0CwbjRIMmKLPuiAm5UKADrl9fDy8MnCDiDBmURS1qibVjiSbGu3/pub?gid=17280060&single=true&output=csv',
    copyright: () => `© ${new Date().getFullYear()} Lojinha Eletrônicos — Todos os direitos reservados.`
};
