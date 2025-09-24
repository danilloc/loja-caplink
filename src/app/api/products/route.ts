import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Prisma } from "@prisma/client";

/* =========================================================
   GET /api/products
   - Lista produtos com paginação
   - Suporta busca case-insensitive universal
   - Cliente vê todos os produtos ativos
   - Vendedor vê apenas os próprios produtos
========================================================= */
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(req.url);

  // Paginação
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "6");

  // Texto de busca normalizado
  const search = (searchParams.get("search") || "").toLowerCase();

  const baseWhere: Prisma.ProductWhereInput = {
    active: true,
    ...(search
      ? {
          OR: [
            { name: { contains: search } },
            { description: { contains: search } },
          ],
        }
      : {}),
  };

  // Se for vendedor → só produtos dele
  let where = baseWhere;
  if (session?.user?.role === "VENDEDOR") {
    where = { ...baseWhere, sellerId: session.user.id };
  }

  // Buscar no banco
  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.count({ where }),
  ]);

  return NextResponse.json({
    products,
    total,
    page,
    totalPages: Math.ceil(total / pageSize),
  });
}

/* =========================================================
   POST /api/products
   - Criação de produto (somente VENDEDOR)
========================================================= */
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "VENDEDOR") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    }

    const { name, price, description, imageUrl } = await req.json();

    // Validação básica
    if (!name || !price || !description || !imageUrl) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        price: new Prisma.Decimal(price),
        description: description.trim(),
        imageUrl: imageUrl.trim(),
        sellerId: session.user.id,
      },
    });

    return NextResponse.json(
      { message: "✅ Produto criado com sucesso", product },
      { status: 201 }
    );
  } catch (err) {
    console.error("❌ Erro ao criar produto:", err);
    return NextResponse.json(
      { error: "Erro inesperado ao criar produto" },
      { status: 500 }
    );
  }
}
