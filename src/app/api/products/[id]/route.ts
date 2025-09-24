import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

// GET (opcional) — pegar 1 produto do próprio vendedor
export async function GET(
    _req: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const product = await prisma.product.findFirst({
        where: { id: params.id, sellerId: session.user.id },
    });

    if (!product) {
        return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
    }

    return NextResponse.json(product);
}

// PUT — atualizar produto do próprio vendedor
export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "VENDEDOR") {
        return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    }

    const body = await req.json();
    const { name, price, description, imageUrl } = body;

    if (!name || !price || !description || !imageUrl) {
        return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 });
    }

    // Garante que o produto é do vendedor logado
    const exists = await prisma.product.findFirst({
        where: { id: params.id, sellerId: session.user.id },
    });
    if (!exists) {
        return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
    }

    const updated = await prisma.product.update({
        where: { id: params.id },
        data: { name, price: Number(price), description, imageUrl },
    });

    return NextResponse.json(updated);
}

// DELETE — exclusão lógica
export async function DELETE(
    _req: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "VENDEDOR") {
        return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    }

    const exists = await prisma.product.findFirst({
        where: { id: params.id, sellerId: session.user.id },
    });
    if (!exists) {
        return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
    }

    // Soft delete → marca active=false
    await prisma.product.update({
        where: { id: params.id },
        data: { active: false },
    });

    return NextResponse.json({ success: true });
}
