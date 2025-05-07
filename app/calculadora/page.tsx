import { fetchTaxas } from '@/lib/fetchTaxas';

export const dynamic = 'force-dynamic';

export default async function CalculadoraPage() {
    const taxas = await fetchTaxas();

    return (
        <main className="max-w-3xl mx-auto p-6 font-sans text-black">
            <h1 className="text-3xl font-bold mb-6 text-center">Calculadora de Parcelamento</h1>

            <form className="mb-8">
                <label htmlFor="valor" className="block mb-2 font-medium text-lg">
                    Valor líquido desejado (R$)
                </label>
                <input
                    id="valor"
                    name="valor"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Digite o valor que deseja receber"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </form>

            <div id="resultado">
                <p className="mb-3 text-gray-600">Clique em uma linha para copiar os dados:</p>
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200 text-sm rounded-lg overflow-hidden">
                        <thead className="bg-blue-100 text-gray-800">
                            <tr>
                                <th className="border px-4 py-2 text-left">Parcelas</th>
                                <th className="border px-4 py-2 text-left">Taxa</th>
                                <th className="border px-4 py-2 text-left">Valor da Parcela</th>
                                <th className="border px-4 py-2 text-left">Total no Cartão</th>
                                <th className="border px-4 py-2 text-left w-20">Ação</th>
                            </tr>
                        </thead>
                        <tbody id="tabela-resultados" className="bg-white" />
                    </table>
                </div>
            </div>

            <script
                dangerouslySetInnerHTML={{
                    __html: `
            const input = document.getElementById('valor');
            const tbody = document.getElementById('tabela-resultados');
            const taxas = ${JSON.stringify(taxas)};
            const formatar = (valor) => new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(valor);

            input.addEventListener('input', () => {
              const valorLiquido = parseFloat(input.value);
              tbody.innerHTML = '';

              if (!valorLiquido || valorLiquido <= 0) return;

              taxas.forEach(({ parcelas, taxa }, index) => {
                const taxaDecimal = taxa / 100;
                const valorTotal = valorLiquido / (1 - taxaDecimal);
                const qtdParcelas = parseInt(parcelas.replace('x', '')) || 1;
                const valorParcela = valorTotal / qtdParcelas;

                const texto = \`\${parcelas} de \${formatar(valorParcela)} - Total: \${formatar(valorTotal)}\`;

                const row = document.createElement('tr');
                row.innerHTML = \`
                  <td class="border px-4 py-2">\${parcelas}</td>
                  <td class="border px-4 py-2">\${taxa.toFixed(2)}%</td>
                  <td class="border px-4 py-2">\${formatar(valorParcela)}</td>
                  <td class="border px-4 py-2 font-semibold">\${formatar(valorTotal)}</td>
                  <td class="border px-4 py-2 text-blue-600 hover:underline cursor-pointer" id="copy-\${index}">Copiar</td>
                \`;
                tbody.appendChild(row);

                const copyBtn = row.querySelector('#copy-' + index);
                copyBtn.addEventListener('click', async () => {
                  await navigator.clipboard.writeText(texto);
                  copyBtn.innerHTML = '✔ Copiado!';
                  setTimeout(() => copyBtn.innerHTML = 'Copiar', 2000);
                });
              });
            });
          `,
                }}
            />
        </main>
    );
}
