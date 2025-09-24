import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import * as XLSX from "xlsx";
import Papa from "papaparse";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "VENDEDOR") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  let products: any[] = [];

  // 🔹 CSV
  if (file.name.endsWith(".csv")) {
    const csvData = buffer.toString("utf-8");
    const parsed = Papa.parse(csvData, { header: true });
    products = parsed.data as any[];
  }
  // 🔹 Excel
  else if (file.name.endsWith(".xlsx")) {
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    products = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
  } else {
    return NextResponse.json({ error: "Formato não suportado. Use CSV ou XLSX." }, { status: 400 });
  }

  // 🔎 Validação básica
  const validProducts = products.filter(
    (p) => p.name && p.price && p.description && p.imageUrl
  );

  if (validProducts.length === 0) {
    return NextResponse.json({ error: "Nenhum produto válido encontrado" }, { status: 400 });
  }

  // 💾 Inserir no banco
  await prisma.product.createMany({
    data: validProducts.map((p) => ({
      name: String(p.name),
      price: Number(p.price),
      description: String(p.description),
      imageUrl: String(p.imageUrl),
      sellerId: session.user.id,
    })),
  });

  return NextResponse.json({ success: true, imported: validProducts.length });
}
