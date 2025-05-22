// app/components/Footer.tsx
import {
    SiGooglemaps,
    SiGoogle,
    SiInstagram,
    SiWhatsapp
} from 'react-icons/si';
import { loja } from '@/app/config/lojaConfig';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-8 mt-12">
            <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Sobre a loja */}
                <div className="space-y-3">
                    <h2 className="text-xl font-semibold">{loja.nome}</h2>
                    <p className="text-sm">
                        {loja.pagamento.map((linha, i) => (
                            <span key={i}>
                                {linha}
                                <br />
                            </span>
                        ))}
                    </p>
                    <div className="text-sm">
                        <p className="font-medium">Horário de funcionamento:</p>
                        {loja.horarioFuncionamento.map((linha, i) => (
                            <p key={i} className="text-xs text-gray-300">{linha}</p>
                        ))}
                    </div>
                    <p className="text-xs text-gray-400">{loja.avisoLegal}</p>
                </div>

                {/* Links e redes sociais */}
                <div className="space-y-3 text-center md:text-right">
                    <p className="text-sm font-medium">Siga a gente nas redes sociais:</p>
                    <div className="flex justify-center md:justify-end gap-4 text-lg">
                        <a
                            href={loja.redes.google}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:opacity-80 transition flex items-center gap-1"
                        >
                            <SiGoogle /> <span className="text-sm">Google</span>
                        </a>
                        <a
                            href={loja.redes.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:opacity-80 transition flex items-center gap-1"
                        >
                            <SiInstagram /> <span className="text-sm">Instagram</span>
                        </a>
                        <a
                            href={loja.redes.whatsapp}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:opacity-80 transition flex items-center gap-1"
                        >
                            <SiWhatsapp /> <span className="text-sm">WhatsApp</span>
                        </a>
                        <a
                            href={loja.redes.maps}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:opacity-80 transition flex items-center gap-1"
                        >
                            <SiGooglemaps /> <span className="text-sm">Google Maps</span>
                        </a>
                    </div>
                    <p className="text-xs text-gray-500 mt-4">{loja.copyright()}</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
