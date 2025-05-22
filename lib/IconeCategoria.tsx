import { type ReactNode } from 'react';
import {
  Smartphone,
  TabletSmartphone,
  Watch,
  Headphones,
  Music,
  BatteryCharging,
  Mouse,
  Cable,
  Speaker,
  Tag,
} from 'lucide-react';

const getIconesCategoria: Record<string, ReactNode> = {
  smartphones: <Smartphone size={16} />,
  tablets: <TabletSmartphone size={16} />,
  smartwatches: <Watch size={16} />,
  'caixas de som': <Speaker size={16} />,
  audio: <Music size={16} />,
  'fones de ouvido': <Headphones size={16} />,
  carregadores: <BatteryCharging size={16} />,
  informatica: <Mouse size={16} />,
  cabos: <Cable size={16} />,
};

const aliases: Record<string, string> = {
  celular: 'smartphones',
  celulares: 'smartphones',
  'fone de ouvido': 'fones de ouvido',
  som: 'caixas de som',
  áudio: 'audio',
  computador: 'informatica',
  pc: 'informatica',
  relógio: 'smartwatches',
  relógios: 'smartwatches',
};

function normalizar(nome: string): string {
  return nome
    .toLowerCase()
    .normalize('NFD')
    .replace(/[^a-z0-9 ]/g, '')
    .trim();
}

export default function getIconeCategoria(nome: string): ReactNode {
  const chaveNormalizada = normalizar(nome);
  const chaveFinal = aliases[chaveNormalizada] || chaveNormalizada;
  return getIconesCategoria[chaveFinal] || <Tag size={16} />;
}
