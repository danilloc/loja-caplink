import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod"; // Validação opcional com Zod

//  Esquema de validação dos dados recebidos
const registerSchema = z.object({
  name: z.string().min(2, "Nome muito curto"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  role: z.enum(["CLIENTE", "VENDEDOR"]),
});

export async function POST(req: Request) {
  try {
    // Pega o JSON do body
    const body = await req.json();

    // Valida com Zod (se der erro, já responde 400)
    const { name, email, password, role } = registerSchema.parse(body);

    // Normaliza o e-mail (evita duplicados com maiúsculas/espaços)
    const normalizedEmail = email.toLowerCase().trim();

    // Verifica se já existe usuário com o mesmo e-mail
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return NextResponse.json(
        { error: "E-mail já cadastrado" },
        { status: 400 }
      );
    }

    // Criptografa a senha antes de salvar
    const passwordHash = await bcrypt.hash(password, 10);

    // Cria o usuário no banco
    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        passwordHash,
        role,
      },
    });

    // Retorno limpo e claro
    return NextResponse.json(
      {
        message: "Usuário criado com sucesso",
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    // Caso o erro venha do Zod → retorna 400 com mensagens de validação
    if (err.name === "ZodError") {
      return NextResponse.json(
        { error: err.errors.map((e: any) => e.message).join(", ") },
        { status: 400 }
      );
    }

    console.error("❌ Erro no register:", err);
    return NextResponse.json(
      { error: "Erro no servidor, tente novamente mais tarde" },
      { status: 500 }
    );
  }
}
