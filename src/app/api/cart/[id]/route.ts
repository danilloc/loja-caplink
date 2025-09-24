import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // agora é Promise
  const body = await req.json().catch(() => ({}));
  const action = body.action || "decrement"; // padrão = diminuir

  const item = await prisma.cartItem.findUnique({ where: { id } });
  if (!item) {
    return NextResponse.json({ error: "Item não encontrado" }, { status: 404 });
  }

  if (action === "increment") {
    const updated = await prisma.cartItem.update({
      where: { id },
      data: { quantity: { increment: 1 } },
    });
    return NextResponse.json(updated);
  }

  if (item.quantity > 1) {
    const updated = await prisma.cartItem.update({
      where: { id },
      data: { quantity: { decrement: 1 } },
    });
    return NextResponse.json(updated);
  } else {
    await prisma.cartItem.delete({ where: { id } });
    return NextResponse.json({ message: "Item removido" });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // também Promise
  await prisma.cartItem.delete({ where: { id } });
  return NextResponse.json({ message: "Item excluído" });
}
