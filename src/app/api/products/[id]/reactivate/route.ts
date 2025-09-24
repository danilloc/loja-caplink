import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "VENDEDOR") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const product = await prisma.product.findFirst({
    where: { id, sellerId: session.user.id },
  });

  if (!product) {
    return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
  }

  await prisma.product.update({
    where: { id: product.id },
    data: { active: true },
  });

  return NextResponse.json({ success: true });
}
