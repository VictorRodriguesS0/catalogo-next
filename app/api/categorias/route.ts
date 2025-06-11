import { NextResponse } from 'next/server';
import { fetchCategories } from '@/lib/fetchCategoriesWoo';

interface CategoryNode {
    id: number;
    name: string;
    parent: number;
    children: CategoryNode[];
}

export async function GET() {
    const categorias = await fetchCategories();

    const map = new Map<number, CategoryNode>();
    const roots: CategoryNode[] = [];

    for (const c of categorias) {
        map.set(c.id, { ...c, children: [] });
    }

    for (const c of categorias) {
        const node = map.get(c.id)!;
        if (c.parent && map.has(c.parent)) {
            map.get(c.parent)!.children.push(node);
        } else {
            roots.push(node);
        }
    }

    return NextResponse.json(roots);
}
