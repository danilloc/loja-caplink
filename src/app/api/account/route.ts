import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

// GET: pega info da conta + produtos desativados
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      role: true,
      active: true,
      products: {
        where: { active: false }, // só desativados
      },
    },
  });

  return NextResponse.json(user);
}

// POST: desativar conta (VENDEDOR)
export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  if (session.user.role !== "VENDEDOR")
    return NextResponse.json({ error: "Somente vendedores podem desativar a conta" }, { status: 403 });

  // desativa conta
  await prisma.user.update({
    where: { id: session.user.id },
    data: { active: false },
  });

  // desativa todos os produtos do vendedor
  await prisma.product.updateMany({
    where: { sellerId: session.user.id },
    data: { active: false },
  });

  return NextResponse.json({ success: true });
}

// DELETE: excluir conta (CLIENTE)
export async function DELETE() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const userId = session.user.id;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });

  if (user.role !== "CLIENTE") {
    return NextResponse.json({ error: "Somente clientes podem excluir a conta" }, { status: 403 });
  }

  // transação: remove favoritos + carrinho, e exclui o user
  await prisma.$transaction(async (tx) => {
    await tx.favorite.deleteMany({ where: { userId } });
    await tx.cartItem.deleteMany({ where: { userId } });

    // orders continuam, só desvinculamos o userId (precisa de onDelete: SetNull no schema)
    await tx.user.delete({ where: { id: userId } });
  });

  return NextResponse.json({ success: true, message: "Conta excluída com sucesso" });
}
