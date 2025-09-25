import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ Rotas públicas (não exigem login)
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  // 🔑 Pega o token do NextAuth (JWT)
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // ❌ Sem token → vai pro login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 🔒 Restrições de acordo com o papel do usuário

  // Rotas de vendedor (páginas + APIs)
  if (
    (pathname.startsWith("/vendor") || pathname.startsWith("/api/vendor")) &&
    token.role !== "VENDEDOR"
  ) {
    return NextResponse.redirect(new URL("/store/products", req.url));
  }

  // Rotas de cliente (páginas + APIs)
  if (
    (pathname.startsWith("/store") || pathname.startsWith("/api/store")) &&
    token.role !== "CLIENTE"
  ) {
    return NextResponse.redirect(new URL("/vendor/products", req.url));
  }

  // Rotas de produtos (ex: /api/products → só vendedor pode POST/PUT/DELETE)
  if (pathname.startsWith("/api/products")) {
    const method = req.method.toUpperCase();
    if (["POST", "PUT", "DELETE"].includes(method) && token.role !== "VENDEDOR") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    }
  }

  // ✅ Autorizado
  return NextResponse.next();
}

// Intercepta páginas e APIs sensíveis
export const config = {
  matcher: [
    "/vendor/:path*",
    "/store/:path*",
    "/api/products/:path*",
    "/api/orders/:path*",
    "/api/vendor/:path*",
    "/api/store/:path*",
  ],
};
