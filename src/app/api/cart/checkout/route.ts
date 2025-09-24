import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const userId = session.user.id;

  // Busca itens do carrinho
  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
  });

  if (cartItems.length === 0) {
    return NextResponse.json(
      { error: "Carrinho vazio" },
      { status: 400 }
    );
  }

  // Cria o pedido
  const order = await prisma.order.create({
    data: {
      userId,  
      items: {
        create: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price, // salva preço no momento da compra
        })),
      },
    },
    include: { items: true },
  });

  // Limpa o carrinho do usuário
  await prisma.cartItem.deleteMany({
    where: { userId },
  });

  return NextResponse.json(order);
}
