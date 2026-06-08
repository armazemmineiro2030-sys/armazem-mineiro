import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const usuario = await prisma.usuarioEquipe.findUnique({
          where: { email: credentials.email },
        });

        if (!usuario) return null;

        const senhaValida = await bcrypt.compare(
          credentials.password,
          usuario.senhaHash
        );

        if (!senhaValida) return null;

        return {
          id: usuario.id,
          email: usuario.email,
          name: usuario.nome,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/equipe/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    },
  },
};
