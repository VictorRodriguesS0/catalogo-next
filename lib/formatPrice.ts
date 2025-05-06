export function formatPreco(valor: string | number): string {
    if (typeof valor === "string") {
        valor = valor
            .replace("R$", "")
            .replace(/\./g, "") // remove pontos de milhar
            .replace(",", ".") // troca vírgula decimal por ponto
            .trim();
    }

    const numero = Number(valor);
    if (isNaN(numero)) return "Preço inválido";

    return numero.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}
