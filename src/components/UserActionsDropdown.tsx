"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function UserActionsDropdown() {
    const { data: session } = useSession();
    const [open, setOpen] = useState(false);

    if (!session?.user) return null;

    const role = (session.user as any).role; // CLIENTE ou VENDEDOR

    const toggle = () => setOpen(!open);

    return (
        <div className="relative">
            <button
                onClick={toggle}
                className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
            >
                ⚙️ Ações
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
                    <ul className="flex flex-col">
                        {role === "CLIENTE" && (
                            <>
                                <li>
                                    <Link
                                        href="/store/favorites"
                                        className="block px-4 py-2 hover:bg-gray-100"
                                    >
                                        ❤️ Meus Favoritos
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/account"
                                        className="block px-4 py-2 hover:bg-gray-100"
                                    >
                                        👤 Minha Conta
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/store/products"
                                        className="block px-4 py-2 hover:bg-gray-100"
                                    >
                                        🛍️ Produtos
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/store/cart" className="block px-4 py-2 hover:bg-gray-100">
                                        🛒 Meu Carrinho
                                    </Link>
                                </li>
                            </>
                        )}

                        {role === "VENDEDOR" && (
                            <>
                                <li>
                                    <Link
                                        href="/vendor/dashboard"
                                        className="block px-4 py-2 hover:bg-gray-100"
                                    >
                                        📊 Dashboard
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/account"
                                        className="block px-4 py-2 hover:bg-gray-100"
                                    >
                                        👤 Minha Conta
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/vendor/products"
                                        className="block px-4 py-2 hover:bg-gray-100"
                                    >
                                        📦 Meus Produtos
                                    </Link>
                                </li>
                            </>
                        )}

                        <li>
                            <button
                                onClick={() => signOut({ callbackUrl: "/login" })}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                            >
                                🚪 Sair
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
}
