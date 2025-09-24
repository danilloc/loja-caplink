🛒 Caplink Store – Desafio Técnico

Este projeto foi desenvolvido com o objetivo de construir uma aplicação fullstack de e-commerce simplificado utilizando Next.js, Node.js e Prisma.

📌 Funcionalidades Implementadas
🔑 Autenticação & Usuários

Cadastro e login com NextAuth.js.

Dois papéis de usuário:

Cliente → pode pesquisar, favoritar produtos, adicionar ao carrinho e finalizar compras.

Vendedor → pode cadastrar, editar, excluir e importar produtos.

Clientes podem excluir a própria conta (mantendo histórico de compras).

Vendedores podem desativar a conta (produtos ficam ocultos).

🛍️ Funcionalidades do Vendedor

Cadastro de produtos via formulário.

Importação de produtos via CSV/Excel.

Dashboard com listagem de produtos.

Edição e exclusão de produtos.

Paginação para lidar com grandes volumes de dados.

👤 Funcionalidades do Cliente

Pesquisa de produtos com filtro no backend.

Paginação da listagem de produtos.

Favoritar produtos.

Carrinho persistente.

Finalizar compras com histórico armazenado.

⚙️ Infraestrutura

Next.js 15 (App Router)

Prisma ORM com SQLite (pode ser adaptado para PostgreSQL/MySQL).

NextAuth.js para autenticação.

TailwindCSS para estilização.

Estrutura de APIs em rotas do Next.js (/api/...).

🚀 Como rodar localmente

Clone o repositório:

git clone https://github.com/seu-usuario/loja-caplink.git
cd loja-caplink


Instale as dependências:

npm install
# ou yarn install


Configure as variáveis de ambiente (.env):

DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="uma_chave_secreta"
NEXTAUTH_URL="http://localhost:3000"


Rode as migrações e gere o client do Prisma:

npx prisma migrate dev --name init
npx prisma generate


Inicie o servidor de desenvolvimento:

npm run dev


Acesse http://localhost:3000

📂 Estrutura do Projeto
src/
 ├─ app/
 │   ├─ api/            # Rotas de API (Next.js)
 │   ├─ auth/           # Login e registro
 │   ├─ vendor/         # Painel do vendedor
 │   └─ store/          # Loja (público/cliente)
 ├─ lib/                # Configurações de Prisma e Auth
 ├─ components/         # Componentes reutilizáveis
 └─ prisma/             # Schema do banco de dados

📊 Modelo do Banco (Prisma)

User → usuários (clientes e vendedores).

Product → produtos cadastrados.

Favorite → produtos favoritados.

CartItem → itens do carrinho.

Order & OrderItem → histórico de pedidos.

🧭 Roteiro de Uso
🔑 Cadastro e Login

Acesse /register para criar uma conta.

Escolha entre Cliente ou Vendedor.

Faça login em /login.

🛍️ Vendedor

Após login como vendedor, acesse /vendor/products.

Cadastre novos produtos via:

Formulário manual → preencha nome, preço, descrição e imagem.

Upload de CSV/Excel → importe vários produtos de uma vez.

Visualize a lista de produtos com paginação.

Edite ou exclua produtos diretamente no painel.

👤 Cliente

Após login como cliente, acesse /store/products.

Pesquise produtos pela barra de busca (filtro feito no backend).

Use a paginação para navegar entre os resultados.

Favoritar produtos para salvar na lista de favoritos.

Adicione itens ao carrinho.

Finalize a compra → gera um pedido no histórico.

Consulte suas compras anteriores no histórico de pedidos.

📦 Deploy

O deploy pode ser feito facilmente na Vercel
.
Basta conectar o repositório e configurar as variáveis de ambiente no painel da Vercel.

🧑‍💻 Autor

Desenvolvido por Danillo Coelho Brito.