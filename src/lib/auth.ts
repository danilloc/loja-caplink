import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      // Valida as credenciais do usuário
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null; // se faltar algo, rejeita login
        }

        // Busca usuário no banco
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // Se encontrou e a senha bate, retorna dados que ficarão no JWT
        if (user && (await bcrypt.compare(credentials.password, user.passwordHash))) {
          return {
            id: user.id,
            email: user.email,
            role: user.role, // CLIENTE ou VENDEDOR
          };
        }

        return null; // login falhou
      },
    }),
  ],
  callbacks: {
    // Armazena dados extras no token JWT
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    // Adiciona dados extras à session (usada no front)
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
    // Define para onde o usuário será redirecionado após login/logout
    async redirect({ url, baseUrl }) {
      // permite caminhos relativos: /login, /store/products etc.
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // permite URLs da mesma origem
      try {
        const u = new URL(url);
        if (u.origin === baseUrl) return url;
      } catch { }
      // fallback
      return baseUrl;
    },
  },
  session: {
    strategy: "jwt", // usa JWT em vez de armazenar sessão no banco
  },
  secret: process.env.NEXTAUTH_SECRET,

};
