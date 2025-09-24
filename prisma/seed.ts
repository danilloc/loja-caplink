const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Vendedores
  await prisma.user.createMany({
    data: [
      {
        name: "Vendedor 1",
        email: "vendedor1@caplink.com",
        passwordHash: "123456",
        role: "VENDEDOR",
      },
      {
        name: "Vendedor 2",
        email: "vendedor2@caplink.com",
        passwordHash: "123456",
        role: "VENDEDOR",
      },
    ],
  });

  // Clientes
  await prisma.user.createMany({
    data: [
      {
        name: "Cliente 1",
        email: "cliente1@caplink.com",
        passwordHash: "123456",
        role: "CLIENTE",
      },
      {
        name: "Cliente 2",
        email: "cliente2@caplink.com",
        passwordHash: "123456",
        role: "CLIENTE",
      },
    ],
  });
}

main()
  .then(() => console.log("✅ Usuários cadastrados com sucesso"))
  .catch((e) => console.error(e))
  .finally(async () => prisma.$disconnect());
