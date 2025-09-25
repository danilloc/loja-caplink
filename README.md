🛒 Caplink Store – Desafio Técnico
Caplink Store é uma aplicação fullstack de e-commerce simplificado, desenvolvida com Next.js, Prisma e NextAuth.js. O projeto implementa autenticação, gestão de produtos por vendedores e funcionalidades de compra para clientes.
📌 Funcionalidades
🔑 Autenticação e Usuários

Cadastro e login com NextAuth.js.
Dois tipos de usuário:
Cliente: pesquisa produtos, adiciona aos favoritos, gerencia carrinho e finaliza pedidos.
Vendedor: cadastra, edita, exclui e importa produtos.


Gestão de conta:
Clientes podem excluir suas contas, mantendo o histórico de compras.
Vendedores podem desativar contas, ocultando seus produtos.



🛍️ Vendedor

Cadastro de produtos via formulário.
Importação de produtos via CSV/Excel.
Dashboard para listar, editar e excluir produtos.
Paginação para gerenciar grandes volumes de dados.

👤 Cliente

Pesquisa de produtos com filtros no backend.
Listagem de produtos com paginação.
Adição de produtos aos favoritos.
Carrinho de compras persistente.
Finalização de pedidos com histórico de compras.

⚙️ Tecnologias

Next.js 15 (App Router).
Prisma ORM com SQLite (desenvolvimento) e PostgreSQL (produção).
NextAuth.js para autenticação.
TailwindCSS para estilização.
APIs implementadas nas rotas do Next.js (/api/...).

🚀 Como Executar Localmente

Clone o repositório e acesse a pasta do projeto.
Instale as dependências com npm install ou yarn install.
Configure as variáveis de ambiente em um arquivo .env:
DATABASE_URL: URL do banco de dados (SQLite para desenvolvimento ou PostgreSQL para produção).
NEXTAUTH_SECRET: Chave secreta para autenticação.
NEXTAUTH_URL: URL da aplicação (ex.: http://localhost:3000 para desenvolvimento).


Execute as migrações do Prisma com npx prisma migrate dev --name init e gere o client com npx prisma generate.
Inicie o servidor com npm run dev e acesse em http://localhost:3000.

📂 Estrutura do Projeto

src/app/api/: Rotas de API do Next.js.
src/app/auth/: Páginas de login e registro.
src/app/vendor/: Painel de gestão do vendedor.
src/app/store/: Loja pública para clientes.
src/lib/: Configurações (Prisma, NextAuth).
src/components/: Componentes reutilizáveis.
src/prisma/: Schema do banco de dados.

📊 Modelo do Banco (Prisma)

User: Usuários (clientes e vendedores).
Product: Produtos cadastrados.
Favorite: Produtos favoritados.
CartItem: Itens no carrinho.
Order & OrderItem: Pedidos e histórico de compras.

🧭 Fluxo de Uso
Autenticação

/register: Criação de conta (Cliente ou Vendedor).
/login: Autenticação de usuários.

Vendedor

/vendor/products: Dashboard para gestão de produtos.
Cadastro, edição e exclusão de produtos.
Importação de produtos via CSV/Excel.
Listagem com paginação.

Cliente

/store/products: Listagem de produtos com busca e paginação.
Favoritar produtos.
Gerenciar carrinho.
Finalizar compras e consultar histórico de pedidos.

📦 Deploy

Plataforma: Vercel.
URL: https://loja-caplink.vercel.app/login.
Variáveis de ambiente configuradas no painel da Vercel.

🧑‍💻 Autor
Desenvolvido por Danillo Coelho Brito como desafio técnico, com foco em Next.js, Prisma e NextAuth.js.