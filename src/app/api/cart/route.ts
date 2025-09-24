import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET → listar itens do carrinho
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const items = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: { product: true },
  });

  return NextResponse.json(items);
}

// POST → adicionar ao carrinho
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const { productId, quantity } = await req.json();

  if (!productId) return NextResponse.json({ error: "Produto inválido" }, { status: 400 });

  const item = await prisma.cartItem.upsert({
    where: {
      userId_productId: { userId: session.user.id, productId },
    },
    update: {
      quantity: { increment: quantity || 1 },
    },
    create: {
      userId: session.user.id,
      productId,
      quantity: quantity || 1,
    },
  });

  return NextResponse.json(item);
}
