import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

export async function GET() {
  // 🔹 Dados de exemplo no modelo
  const sampleData = [
    {
      name: "Camiseta Azul",
      price: 49.9,
      description: "Camiseta básica azul",
      imageUrl: "http://exemplo.com/camisa-azul.jpg",
    },
    {
      name: "Calça Jeans",
      price: 129.9,
      description: "Calça jeans slim",
      imageUrl: "http://exemplo.com/calca-jeans.jpg",
    },
  ];

  // 🔹 Cria a planilha
  const worksheet = XLSX.utils.json_to_sheet(sampleData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Produtos");

  // 🔹 Converte para buffer
  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Disposition": 'attachment; filename="modelo-produtos.xlsx"',
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
  });
}
