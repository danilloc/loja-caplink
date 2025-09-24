import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "VENDEDOR") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const sellerId = session.user.id;

  // total de produtos cadastrados (ativos e inativos)
  const totalProducts = await prisma.product.count({
    where: { sellerId },
  });

  // pegar todos os itens de pedidos relacionados ao vendedor
  const sales = await prisma.orderItem.findMany({
    where: { product: { sellerId } },
    select: { productId: true, quantity: true, price: true },
  });

  // calcular vendidos e faturamento
  const totalSold = sales.reduce((acc, s) => acc + s.quantity, 0);
  const totalRevenue = sales.reduce(
    (acc, s) => acc + Number(s.price) * s.quantity,
    0
  );

  // encontrar o produto mais vendido
  const productSales: Record<string, number> = {};
  for (const s of sales) {
    productSales[s.productId] = (productSales[s.productId] || 0) + s.quantity;
  }

  let topProduct: any = null;
  if (Object.keys(productSales).length > 0) {
    const bestId = Object.entries(productSales).sort((a, b) => b[1] - a[1])[0][0];
    topProduct = await prisma.product.findUnique({
      where: { id: bestId },
      select: { id: true, name: true, imageUrl: true },
    });
  }

  return NextResponse.json({
    totalProducts,
    totalSold,
    totalRevenue,
    topProduct,
  });
}
