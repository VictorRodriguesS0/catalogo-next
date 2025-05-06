const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-8 mt-12">
            <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-center md:text-left">
                    <h2 className="text-xl font-semibold">Lojinha Eletrônicos</h2>
                    <p className="text-sm mt-1">
                        Todos os produtos possuem nota fiscal e garantia.
                        <br />
                        Valores para pagamento à vista: dinheiro, débito ou transferência.
                        <br />
                        Parcelamos em até 12x nos cartões com juros.
                    </p>
                    <p className="text-xs mt-2 text-gray-400">
                        Os valores e produtos disponíveis são válidos somente para a loja física
                        e poderão ser alterados a qualquer momento sem aviso prévio.
                    </p>
                </div>

                <div className="text-center md:text-right">
                    <p className="text-sm">Siga a gente:</p>
                    <div className="flex justify-center md:justify-end gap-4 mt-2">
                        <a
                            href="https://g.co/kgs/5wHXnr2"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-green-400 transition"
                        >
                            Google
                        </a>
                        <a
                            href="https://www.instagram.com/lojinhaimportadosdf/?hl=pt"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-pink-400 transition"
                        >
                            Instagram
                        </a>
                        <a
                            href="https://wa.me/5561983453409"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-green-500 transition"
                        >
                            WhatsApp
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
