# 🛒 Caplink Store  

**Caplink Store** é uma aplicação fullstack de e-commerce simplificado, desenvolvida com **Next.js**, **Prisma** e **NextAuth.js**.  
O projeto implementa autenticação, gestão de produtos por vendedores e funcionalidades de compra para clientes.

---

## 📌 Funcionalidades  

### 🔑 Autenticação e Usuários  
- Cadastro e login com **NextAuth.js**.  
- Dois tipos de usuário:  
  - **Cliente**: pesquisa produtos, adiciona aos favoritos, gerencia carrinho e finaliza pedidos.  
  - **Vendedor**: cadastra, edita, exclui e importa produtos.  
- **Gestão de conta**:  
  - Clientes podem excluir suas contas (mantendo o histórico de compras).  
  - Vendedores podem desativar contas (ocultando seus produtos).  

---

### 🛍️ Funcionalidades do Vendedor  
- Cadastro de produtos via formulário.  
- Importação de produtos via CSV/Excel.  
- Dashboard para listar, editar e excluir produtos.  
- Paginação para grandes volumes de dados.  

---

### 👤 Funcionalidades do Cliente  
- Pesquisa de produtos com filtros no backend.  
- Listagem de produtos com paginação.  
- Adição de produtos aos favoritos.  
- Carrinho de compras persistente.  
- Finalização de pedidos com histórico de compras.  

---

## ⚙️ Tecnologias Utilizadas  
- **Next.js 15 (App Router)**  
- **Prisma ORM** com SQLite (desenvolvimento) e PostgreSQL (produção)  
- **NextAuth.js** para autenticação  
- **TailwindCSS** para estilização  
- **APIs** implementadas nas rotas do Next.js (`/api/...`)  

---

## 🚀 Como Executar Localmente  

1. Instale as dependências:
  ```bash
- git clone <git@github.com:danilloc/loja-caplink.git>
- cd loja-caplink
 ```
---   
2. Instale as dependências:
  ```bash
- npm install
    ou
- yarn install
 ```
---   
3. Configure as variáveis de ambiente em um arquivo .env:
```bash
- DATABASE_URL="file:./dev.db" # SQLite para desenvolvimento
- NEXTAUTH_SECRET="sua_chave_secreta"
- NEXTAUTH_URL="http://localhost:3000"
```
---   
4. Execute as migrações do Prisma:
```bash
- npx prisma migrate dev --name init
- npx prisma generate
```
---   
5. Inicie o servidor de desenvolvimento:
```bash
- npm run dev
```
---   
6. Acesse no navegador:
👉 http://localhost:3000

--- 

## 📂 Estrutura do Projeto
```bash
src/
 ├── app/
 │   ├── api/        # Rotas de API
 │   ├── auth/       # Páginas de login e registro
 │   ├── vendor/     # Painel do vendedor
 │   ├── store/      # Loja pública
 │   └── account/    # Conta do usuário
 ├── lib/            # Configurações (Prisma, NextAuth, etc.)
 ├── components/     # Componentes reutilizáveis
 └── prisma/         # Schema e seeds do banco
```
--- 
## 📊 Modelo do Banco (Prisma)

- User: Usuários (clientes e vendedores)

- Product: Produtos cadastrados

- Favorite: Produtos favoritados

- CartItem: Itens no carrinho

- Order & OrderItem: Pedidos e histórico de compras

--- 
## 🧭 Fluxo de Uso
## 🔐 Autenticação

- /register → Criação de conta (Cliente ou Vendedor)

- /login → Autenticação de usuários

--- 
## 🛍️ Vendedor

- /vendor/products → Dashboard de gestão

- Cadastro, edição e exclusão de produtos

- Importação via CSV/Excel

- Paginação de listagem

--- 
## 👤 Cliente

- /store/products → Listagem de produtos com busca e filtros

- Favoritar produtos

- Gerenciar carrinho

- Finalizar compras e consultar histórico de pedidos

--- 
## 📦 Deploy

Plataforma: Vercel

URL: https://loja-caplink.vercel.app/login

Variáveis de ambiente configuradas no painel da Vercel

--- 
## 🧑‍💻 Autor

Desenvolvido por Danillo Coelho Brito como desafio técnico, com foco em Next.js, Prisma e NextAuth.js.

