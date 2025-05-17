'use client';

import { useState } from 'react';
import HeaderTop from './HeaderTop';
import HeaderCategorias from './HeaderCategorias';


export default function Header() {
    const [menuAberto, setMenuAberto] = useState(false);

    return (
        <header className="w-full bg-white shadow-md z-50 relative">
            <HeaderTop menuAberto={menuAberto} setMenuAberto={setMenuAberto} />
            {!menuAberto && <HeaderCategorias />}
        </header>
    );
}
